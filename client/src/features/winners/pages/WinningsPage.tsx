import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { winnersApi } from "../api/winners.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Upload, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { toast } from "sonner";
import type { Winner } from "@/types";

const statusConfig = {
  pending: { icon: Clock, label: "Awaiting proof", variant: "warning" as const },
  proof_uploaded: { icon: Clock, label: "Under review", variant: "default" as const },
  approved: { icon: CheckCircle2, label: "Approved", variant: "success" as const },
  rejected: { icon: XCircle, label: "Rejected", variant: "destructive" as const },
};

export function WinningsPage() {
  const { data: winnings, isLoading } = useQuery({
    queryKey: ["winnings"],
    queryFn: winnersApi.getMy,
  });

  const [selected, setSelected] = useState<Winner | null>(null);

  if (isLoading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Winnings</h1>
        <p className="text-muted-foreground mt-1">Track your prizes and verification status</p>
      </div>

      {!winnings?.length ? (
        <EmptyState
          icon={Trophy}
          title="No winnings yet"
          description="Keep entering draws — your win is coming!"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {winnings.map((w) => {
            const config = statusConfig[w.verification_status];
            const StatusIcon = config.icon;
            return (
              <Card key={w.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{w.match_type.toUpperCase()}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {w.draws?.draw_month && formatMonth(w.draws.draw_month)}
                    </p>
                  </div>
                  <Badge variant={"destructive"}>
                    <StatusIcon className="h-3 w-3 mr-1" /> {config.label}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Amount</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(w.prize_amount)}</p>
                  </div>

                  {w.payment_status === "paid" && (
                    <Badge variant="default">💰 Payment Completed</Badge>
                  )}

                  {w.verification_status === "pending" && (
                    <Button className="w-full" onClick={() => setSelected(w)}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Proof
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <UploadProofDialog
        winner={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function UploadProofDialog({ winner, onClose }: { winner: Winner | null; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => winnersApi.uploadProof(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["winnings"] });
      toast.success("Proof uploaded! Admin will review it soon.");
      onClose();
      setFile(null);
    },
    onError: () => toast.error("Upload failed"),
  });

  if (!winner) return null;

  return (
    <Dialog open={!!winner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Winning Proof</DialogTitle>
          <DialogDescription>
            Upload a screenshot of your scores from the golf platform for verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof">Screenshot (JPEG, PNG, WebP · max 5MB)</Label>
            <Input
              id="proof"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {file && (
            <div className="p-3 rounded-lg bg-muted text-sm">
              📎 {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </div>
          )}

          <Button
            className="w-full"
            disabled={!file || isPending}
            onClick={() => file && mutate({ id: winner.id, file })}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Proof
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}