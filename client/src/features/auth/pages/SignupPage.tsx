import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignup } from "../hooks/useAuth";
import { charityApi } from "@/features/charity/api/charity.api";
import { Loader2, Trophy, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
  fullName: z.string().min(2, "Name too short"),
  selectedCharityId: z.string().uuid("Please select a charity"),
  charityPercentage: z.number().min(10).max(100),
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [step, setStep] = useState(1);
  const { mutate: signup, isPending } = useSignup();
  const { data: charities, isLoading: charitiesLoading } = useQuery({
    queryKey: ["charities"],
    queryFn: () => charityApi.list(),
  });

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { charityPercentage: 10 },
  });

  const selectedCharityId = watch("selectedCharityId");
  const charityPercentage = watch("charityPercentage");

  const nextStep = async () => {
    const valid = await trigger(["email", "password", "fullName"]);
    if (valid) setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-background p-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Digital Heroes</span>
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 2 && <div className={cn("h-0.5 w-12 transition-colors", step > s ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === 1 ? "Create your account" : "Pick your charity"}</CardTitle>
            <CardDescription>
              {step === 1
                ? "Start your journey in under a minute"
                : "Choose a cause to support with every subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => signup(data))} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Min 8 chars, incl. A-Z, 0-9" {...register("password")} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>

                  <Button type="button" className="w-full" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  {charitiesLoading ? (
                    <Spinner />
                  ) : (
                    <div className="grid gap-2 max-h-64 overflow-y-auto pr-2">
                      {charities?.map((charity) => (
                        <button
                          key={charity.id}
                          type="button"
                          onClick={() => setValue("selectedCharityId", charity.id, { shouldValidate: true })}
                          className={cn(
                            "text-left p-4 rounded-lg border-2 transition-all",
                            selectedCharityId === charity.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{charity.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{charity.description}</p>
                            </div>
                            {selectedCharityId === charity.id && <Check className="h-5 w-5 text-primary shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.selectedCharityId && (
                    <p className="text-xs text-destructive">{errors.selectedCharityId.message}</p>
                  )}

                  <div className="space-y-2">
                    <Label>Charity contribution: {charityPercentage}%</Label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={charityPercentage}
                      onChange={(e) => setValue("charityPercentage", Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <p className="text-xs text-muted-foreground">Minimum 10% of your subscription goes to charity.</p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isPending}>
                      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </div>
                </>
              )}
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}