-- Create movie_reviews table
CREATE TABLE public.movie_reviews (
  id SERIAL PRIMARY KEY,
  movie_title TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_movie_title ON public.movie_reviews(movie_title);
CREATE INDEX idx_rating ON public.movie_reviews(rating);
CREATE INDEX idx_created_at ON public.movie_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read reviews
CREATE POLICY "Anyone can view movie reviews" 
ON public.movie_reviews 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to submit reviews
CREATE POLICY "Anyone can submit movie reviews" 
ON public.movie_reviews 
FOR INSERT 
WITH CHECK (true);