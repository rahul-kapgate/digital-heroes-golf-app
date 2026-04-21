import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useScores, useDeleteScore, useUpdateScore } from "../hooks/useScores";
import { formatDate } from "@/lib/utils";
import { Target, Trash2, Pencil, Loader2 } from "lucide-react";
import type { Score } from "@/types";

export function ScoresList() {
  const { data: scores, isLoading } = useScores();
  const { mutate: deleteScore } = useDeleteScore();
  const { mutate: updateScore, isPending: isUpdating } = useUpdateScore();
  const [editing, setEditing] = useState<Score | null>(null);
  const [editValue, setEditValue] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!scores?.length) {
    return (
      <EmptyState
        icon={Target}
        title="No scores yet"
        description="Add your first golf score to start participating in draws."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {scores.map((s, idx) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <span className="text-xl font-bold text-primary">{s.score}</span>
                </div>
                <div>
                  <p className="font-semibold">Score of {s.score}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(s.play_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {idx === 0 && <Badge variant="default">Latest</Badge>}
                <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setEditValue(s.score); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this score?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Removing your score from {formatDate(s.play_date)} cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteScore(s.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Score</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Updating score for {editing && formatDate(editing.play_date)}
            </p>
            <Input type="number" min="1" max="45" value={editValue} onChange={(e) => setEditValue(Number(e.target.value))} />
            <Button
              className="w-full"
              disabled={isUpdating}
              onClick={() => {
                if (editing) {
                  updateScore(
                    { id: editing.id, score: editValue },
                    { onSuccess: () => setEditing(null) }
                  );
                }
              }}
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}