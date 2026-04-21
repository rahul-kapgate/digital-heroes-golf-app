import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { charityApi } from "../api/charity.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Globe, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function CharityDetailPage() {
  const { id } = useParams();
  const { data: charity, isLoading } = useQuery({
    queryKey: ["charity", id],
    queryFn: () => charityApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-12"><Skeleton className="h-96" /></div>;
  if (!charity) return <div className="container py-12">Not found</div>;

  return (
    <div className="container py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/charities"><ArrowLeft className="mr-2 h-4 w-4" /> All charities</Link>
      </Button>

      {charity.image_url && (
        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <h1 className="text-4xl font-bold">{charity.name}</h1>
        {charity.is_featured && (
          <Badge variant="destructive"><Sparkles className="h-3 w-3 mr-1" /> Featured</Badge>
        )}
      </div>

      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{charity.description}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Heart className="h-4 w-4 text-primary" /> Total raised
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(charity.total_contributions || 0)}
            </div>
          </CardContent>
        </Card>

        {charity.website_url && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" /> Website
              </div>
              <a
                href={charity.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium break-all"
              >
                {charity.website_url}
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-gradient-to-br from-primary to-emerald-700 text-white border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Support this cause</h3>
          <p className="opacity-90 mb-6">Sign up and choose {charity.name} as your charity.</p>
          <Button variant="secondary" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}