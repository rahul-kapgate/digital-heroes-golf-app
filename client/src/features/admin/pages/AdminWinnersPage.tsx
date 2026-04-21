import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { winnersApi } from "@/features/winners/api/winners.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Eye, Coins } from "lucide-react";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { toast } from "sonner";

export function AdminWinnersPage() {
  const qc = useQueryClient();
  const { data: winners, isLoading } = useQuery({
    queryKey: ["admin", "winners"],
    queryFn: () => winnersApi.listAll(),
  });

  const verify = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      winnersApi.verify(id, action),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: ["admin", "winners"] });
      toast.success(`Winner ${action}d`);
    },
  });

  const markPaid = useMutation({
    mutationFn: (id: string) => winnersApi.markPaid(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "winners"] });
      toast.success("Marked as paid");
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Winners Management</h1>
        <p className="text-muted-foreground mt-1">Verify proofs and process payouts</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="space-y-3">
          {winners?.map((w) => (
            <Card key={w.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <p className="font-semibold">{w.users?.full_name}</p>
                      <Badge>{w.match_type}</Badge>
                      <Badge variant="secondary">{formatMonth(w.draws?.draw_month || "")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{w.users?.email}</p>
                    <p className="text-2xl font-bold text-primary mt-2">
                      {formatCurrency(w.prize_amount)}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <Badge variant={w.verification_status === "approved" ? "default" : "secondary"}>
                        Verification: {w.verification_status}
                      </Badge>
                      <Badge variant={w.payment_status === "paid" ? "default" : "destructive"}>
                        Payment: {w.payment_status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {w.proof_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`http://localhost:5000${w.proof_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Proof
                        </a>
                      </Button>
                    )}

                    {w.verification_status === "proof_uploaded" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => verify.mutate({ id: w.id, action: "approve" })}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => verify.mutate({ id: w.id, action: "reject" })}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}

                    {w.verification_status === "approved" && w.payment_status === "pending" && (
                      <Button size="sm" onClick={() => markPaid.mutate(w.id)}>
                        <Coins className="mr-2 h-4 w-4" /> Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}