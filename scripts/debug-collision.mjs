import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Manually parse .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
    envContent.split("\n")
        .filter(line => line.includes("="))
        .map(line => line.split("=").map(part => part.trim().replace(/^"(.*)"$/, '$1')))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugCollision() {
    const targetEmail = "nguyenvuhoangz@gmail.com";
    console.log(`Searching for existing profile for ${targetEmail}...`);

    const { data: profiles, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", targetEmail);

    if (fetchError) {
        console.error("Fetch error:", fetchError.message);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log("No profile found to test with.");
        return;
    }

    const profile = profiles[0];
    console.log("Found profile with ID:", profile.id, "Provider:", profile.provider);

    const otherProvider = profile.provider === "google" ? "github" : "google";
    console.log(`Attempting to insert a SECOND row with SAME ID (${profile.id}) but DIFFERENT PROVIDER (${otherProvider})...`);

    const { error: insertError } = await supabase.from("profiles").insert({
        id: profile.id,
        email: profile.email,
        provider: otherProvider,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString()
    });

    if (insertError) {
        console.log("COLLISION DETECTED!");
        console.log("Error details:", insertError.message);
        console.log("Constraint:", insertError.details || insertError.hint || "Check indexes in Supabase UI");
    } else {
        console.log("SUCCESS! Second row inserted.");
        // Cleanup the test row
        await supabase.from("profiles").delete().eq("id", profile.id).eq("provider", otherProvider);
    }
}

debugCollision();
