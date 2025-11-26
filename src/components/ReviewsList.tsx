import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: number;
  movie_title: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewsListProps {
  refreshTrigger: number;
}

export function ReviewsList({ refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("movie_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <p className="text-xl text-muted-foreground">No reviews yet. Be the first to submit one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Movie Reviews</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-4">
                <span className="text-xl text-foreground">{review.movie_title}</span>
                <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20">
                  {review.rating}/5
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 pt-2">
                {renderStars(review.rating)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{review.review_text}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{review.reviewer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
