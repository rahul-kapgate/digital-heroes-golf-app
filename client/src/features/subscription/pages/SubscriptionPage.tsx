import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useMySubscription, useCancelSubscription } from "../hooks/useSubscription";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant = {
  active: "success",
  cancelled: "warning",
  lapsed: "destructive",
  past_due: "destructive",
  trialing: "default",
} as const;

export function SubscriptionPage() {
  const { data: sub, isLoading } = useMySubscription();
  const { mutate: cancel, isPending: isCancelling } = useCancelSubscription();

  if (isLoading) return <Skeleton className="h-80" />;

  if (!sub) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Subscription</h1>
        <EmptyState
          icon={CreditCard}
          title="No active subscription"
          description="Choose a plan to start participating in draws and supporting charities."
          action={<Button asChild><Link to="/pricing">View plans</Link></Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Subscription</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="capitalize">{sub.plan_type} Plan</CardTitle>
            <CardDescription>{formatCurrency(sub.amount)} per {sub.plan_type === "monthly" ? "month" : "year"}</CardDescription>
          </div>
          <Badge variant={statusVariant[sub.status] as any}>{sub.status.toUpperCase()}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" /> Current Period Started
              </div>
              <p className="font-semibold">{formatDate(sub.current_period_start)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" /> Next Billing
              </div>
              <p className="font-semibold">{formatDate(sub.current_period_end)}</p>
            </div>
          </div>

          {sub.status === "active" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">Cancel Subscription</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will stay active until {formatDate(sub.current_period_end)}.
                    After that, you'll lose access to draws and score tracking.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancel()} disabled={isCancelling}>
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}