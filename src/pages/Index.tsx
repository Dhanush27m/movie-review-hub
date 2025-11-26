import { useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { Clapperboard } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clapperboard className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Movie Review App</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts on the latest films and discover what others think
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          </div>
          <div className="lg:col-span-2">
            <ReviewsList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
