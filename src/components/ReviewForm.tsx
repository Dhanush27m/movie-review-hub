import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Film } from "lucide-react";

const reviewSchema = z.object({
  movie_title: z.string().min(1, "Movie title is required").max(200, "Title too long"),
  reviewer_name: z.string().min(1, "Name is required").max(100, "Name too long"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review_text: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review too long"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onReviewSubmitted: () => void;
}

export function ReviewForm({ onReviewSubmitted }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      movie_title: "",
      reviewer_name: "",
      rating: 3,
      review_text: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("movie_reviews")
        .insert([{
          movie_title: data.movie_title,
          reviewer_name: data.reviewer_name,
          rating: data.rating,
          review_text: data.review_text,
        }]);

      if (error) throw error;

      toast.success("Review submitted successfully!");
      form.reset();
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Film className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Submit a Review</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="movie_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Movie Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter movie title" 
                    {...field}
                    className="bg-input border-border text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Your Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field}
                    className="bg-input border-border text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Rating</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border z-50">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {"⭐".repeat(rating)} ({rating}/5)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Review</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your thoughts about the movie..."
                    className="min-h-[150px] bg-input border-border text-foreground resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
