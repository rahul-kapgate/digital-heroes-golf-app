import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScoreForm } from "../components/ScoreForm";
import { ScoresList } from "../components/ScoresList";

export function ScoresPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Scores</h1>
        <p className="text-muted-foreground mt-1">
          Only your 5 most recent scores are kept. New scores replace the oldest.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Score</CardTitle>
              <CardDescription>Stableford format · 1 per date</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreForm />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <ScoresList />
        </div>
      </div>
    </div>
  );
}