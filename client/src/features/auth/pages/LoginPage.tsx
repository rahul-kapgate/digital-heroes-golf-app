import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useAuth";
import { Loader2, Trophy } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Digital Heroes</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to continue your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}