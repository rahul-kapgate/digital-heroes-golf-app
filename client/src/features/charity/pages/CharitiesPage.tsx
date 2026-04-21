import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { charityApi } from "../api/charity.api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

export function CharitiesPage() {
  const [search, setSearch] = useState("");
  const { data: charities, isLoading } = useQuery({
    queryKey: ["charities", search],
    queryFn: () => charityApi.list({ search }),
  });

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Heart className="h-3.5 w-3.5" />
          Charities we support
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Choose your cause</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every subscription powers real impact. Pick a charity that matters to you.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : !charities?.length ? (
        <EmptyState icon={Heart} title="No charities found" description="Try a different search term." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((c) => (
            <Link key={c.id} to={`/charities/${c.id}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                {c.image_url && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={c.image_url}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1">{c.name}</h3>
                    {c.is_featured && (
                      <Badge variant="destructive" className="shrink-0 ml-2">
                        <Sparkles className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  {c.total_contributions !== undefined && (
                    <p className="text-xs text-primary font-medium mt-4">
                      {formatCurrency(c.total_contributions)} raised
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}