import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { drawsApi } from "@/features/draws/api/draws.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Play, CheckCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export function AdminDrawsPage() {
  const qc = useQueryClient();
  const [drawMonth, setDrawMonth] = useState(format(new Date(), "yyyy-MM"));
  const [drawType, setDrawType] = useState<"random" | "algorithmic">("random");

  const { data: draws, isLoading } = useQuery({
    queryKey: ["admin", "draws"],
    queryFn: () => drawsApi.listAll(),
  });

  const runDraw = useMutation({
    mutationFn: (simulateOnly: boolean) =>
      drawsApi.run({ drawMonth, drawType, simulateOnly }),
    onSuccess: (data, simulateOnly) => {
      qc.invalidateQueries({ queryKey: ["admin", "draws"] });
      toast.success(simulateOnly ? "Simulation complete!" : "Draw saved — ready to publish");
      console.log("Draw summary:", data.summary);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Draw failed");
    },
  });

  const publishDraw = useMutation({
    mutationFn: (id: string) => drawsApi.publish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "draws"] });
      toast.success("Draw published!");
    },
    onError: () => toast.error("Publish failed"),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Draw Management</h1>
        <p className="text-muted-foreground mt-1">Simulate, run, and publish draws</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run New Draw</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Draw Month</Label>
              <Input
                type="month"
                value={drawMonth}
                onChange={(e) => setDrawMonth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Draw Type</Label>
              <Select value={drawType} onValueChange={(v: any) => setDrawType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="algorithmic">Algorithmic (weighted)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => runDraw.mutate(true)}
              disabled={runDraw.isPending}
            >
              <Zap className="mr-2 h-4 w-4" /> Simulate
            </Button>
            <Button
              onClick={() => runDraw.mutate(false)}
              disabled={runDraw.isPending}
            >
              {runDraw.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Play className="mr-2 h-4 w-4" /> Run & Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Draws</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : !draws?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No draws yet</p>
          ) : (
            <div className="space-y-3">
              {draws.map((draw) => (
                <div
                  key={draw.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{formatMonth(draw.draw_month)}</p>
                      <Badge variant={draw.status === "published" ? "default" : "secondary"}>
                        {draw.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Numbers: {draw.draw_numbers.join(" · ")} · Pool: {formatCurrency(draw.total_pool)}
                    </p>
                  </div>
                  {draw.status === "simulated" && (
                    <Button
                      size="sm"
                      onClick={() => publishDraw.mutate(draw.id)}
                      disabled={publishDraw.isPending}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Publish
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}