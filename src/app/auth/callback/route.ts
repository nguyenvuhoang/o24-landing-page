import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // Get provider from query param passed from client
    const providerParam = searchParams.get("p");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    console.log("Auth callback received code:", code ? "Yes" : "No");
    console.log("Origin:", origin);

    if (code) {
        const supabase = await createClient();
        console.log("Exchanging code for session...");
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Auth error during code exchange:", error.message);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
        }

        if (session?.user) {
            const { user } = session;
            console.log("Session user received. Metadata:", JSON.stringify(user.user_metadata, null, 2));
            console.log("App Metadata:", JSON.stringify(user.app_metadata, null, 2));

            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "User";
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

            // Priority: URL parameter 'p' > app_metadata > identity
            const provider = providerParam ||
                user.app_metadata?.provider ||
                (user.identities && user.identities.length > 0 ? user.identities[0].provider : "unknown");

            console.log("Syncing profile via Admin Client. Explicit Provider:", provider, "Full Name:", fullName);

            try {
                const supabaseAdmin = createSupabaseClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );

                // Use a more careful upsert. We use (email, provider) as the conflict target.
                const { data: upsertData, error: upsertError } = await supabaseAdmin.from("profiles").upsert({
                    id: user.id,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    email: user.email,
                    provider: provider,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'email,provider' }).select();

                if (upsertError) {
                    console.error("Error syncing profile to database:", upsertError.message);
                    console.error("Full error details:", JSON.stringify(upsertError, null, 2));
                } else {
                    console.log("Profile sync successful!");
                    console.log("Upserted data:", JSON.stringify(upsertData, null, 2));
                }
            } catch (err: any) {
                console.error("Unexpected error during profile sync:", err.message);
            }

            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.warn("No user found in session after code exchange.");
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
