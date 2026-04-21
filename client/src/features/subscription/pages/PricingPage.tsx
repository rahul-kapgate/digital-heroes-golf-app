import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useCreateCheckout } from "../hooks/useSubscription";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import type { PlanType } from "@/types";
import { formatCurrency } from "@/lib/utils";

const plans = [
  {
    type: "monthly" as PlanType,
    name: "Monthly",
    price: 500,
    interval: "month",
    features: [
      "Participate in monthly draws",
      "5-score rolling tracker",
      "Support your chosen charity",
      "Win jackpots up to ₹10,000+",
      "Cancel anytime",
    ],
  },
  {
    type: "yearly" as PlanType,
    name: "Yearly",
    price: 5000,
    interval: "year",
    featured: true,
    saveLabel: "Save ₹1,000",
    features: [
      "Everything in Monthly",
      "2 months FREE",
      "Priority winner verification",
      "Early access to draw simulations",
      "Exclusive yearly bonuses",
    ],
  },
];

export function PricingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: checkout, isPending } = useCreateCheckout();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const handleSubscribe = (planType: PlanType) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/pricing" } } });
      return;
    }
    setSelectedPlan(planType);
    checkout(planType);
  };

  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Simple, transparent pricing
        </div>
        <h1 className="text-5xl font-bold">Pick the plan that fits</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          No hidden fees. Cancel anytime. Part of every payment goes to your chosen charity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card
              className={`h-full relative ${
                plan.featured
                  ? "border-primary border-2 shadow-xl scale-105"
                  : "border"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">{plan.saveLabel}</Badge>
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-muted-foreground">/ {plan.interval}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-8"
                  size="lg"
                  variant={plan.featured ? "default" : "outline"}
                  disabled={isPending && selectedPlan === plan.type}
                  onClick={() => handleSubscribe(plan.type)}
                >
                  {isPending && selectedPlan === plan.type && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-12">
        🔒 Secure payments powered by Stripe · Test mode enabled
      </p>
    </div>
  );
}