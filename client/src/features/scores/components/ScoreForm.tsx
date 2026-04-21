import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateScore } from "../hooks/useScores";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  score: z.coerce.number().int().min(1).max(45),
  playDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export function ScoreForm({ onSuccess }: Props) {
  const { mutate, isPending } = useCreateScore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { playDate: format(new Date(), "yyyy-MM-dd") },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="score">Score (1-45)</Label>
        <Input id="score" type="number" min="1" max="45" placeholder="e.g. 36" {...register("score")} />
        {errors.score && <p className="text-xs text-destructive">{errors.score.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="playDate">Date Played</Label>
        <Input id="playDate" type="date" max={format(new Date(), "yyyy-MM-dd")} {...register("playDate")} />
        {errors.playDate && <p className="text-xs text-destructive">{errors.playDate.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Add Score
      </Button>
    </form>
  );
}