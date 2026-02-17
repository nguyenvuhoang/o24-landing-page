import {
    CreditCard,
    Check,
    Zap,
    Shield,
    Star,
    Download,
    Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for exploring and side projects.",
        features: ["1,000 monthly executions", "3 active workflows", "7-day log retention", "Community support"],
        current: false,
    },
    {
        name: "Pro",
        price: "49",
        description: "For professionals and growing teams.",
        features: ["50,000 monthly executions", "Unlimited workflows", "30-day log retention", "Priority email support", "Custom domains"],
        current: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Advanced controls and security for scale.",
        features: ["Unlimited executions", "Dedicated support", "VPC Deployment", "SLA guarantees", "Audit logs"],
        current: false,
    },
];

export default function BillingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
                <p className="text-muted-foreground">Manage your subscription and view your usage statistics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Badge className="bg-primary text-primary-foreground font-semibold">CURRENT PLAN</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle>Pro Plan</CardTitle>
                        <CardDescription>You are currently on the Pro tier billed monthly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Executions this month</span>
                                <span className="font-medium">12,450 / 50,000</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[25%] transition-all"></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Resetting in 12 days (March 1st)</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 border-t pt-4">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" /> Usage Report
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Default method for your subscription renewals.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-12 border rounded bg-background flex items-center justify-center font-bold italic tracking-tighter text-blue-800">
                                VISA
                            </div>
                            <div>
                                <p className="text-sm font-medium">Visa ending in 4242</p>
                                <p className="text-xs text-muted-foreground">Expires 12/26</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="link" className="p-0 text-xs h-auto gap-1">
                            <Receipt className="h-3 w-3" /> Billing History
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 pt-4">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`flex flex-col ${plan.current ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {plan.name}
                                {plan.name === "Pro" && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
                            </CardTitle>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold tracking-tight">${plan.price}</span>
                                {plan.price !== "Custom" && <span className="text-sm text-balance text-muted-foreground">/month</span>}
                            </div>
                            <CardDescription className="mt-2">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={plan.current ? "outline" : (plan.name === "Pro" ? "default" : "outline")}
                                className="w-full"
                                disabled={plan.current}
                            >
                                {plan.current ? "Current Plan" : (plan.price === "0" ? "Downgrade" : "Upgrade")}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
