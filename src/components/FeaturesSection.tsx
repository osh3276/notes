import { Card, CardContent } from "./ui/card";
import { Star, MessageCircle, TrendingUp, Users } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Star,
      title: "Expert Reviews",
      description: "Read in-depth reviews from music critics and industry professionals"
    },
    {
      icon: MessageCircle,
      title: "Community Reactions",
      description: "Share your thoughts and engage with fellow music enthusiasts"
    },
    {
      icon: TrendingUp,
      title: "Trending Music",
      description: "Discover what's hot and what's next in the music world"
    },
    {
      icon: Users,
      title: "Connect with Artists",
      description: "Follow your favorite artists and get exclusive insights"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Why MusicCritic?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience music like never before with our comprehensive platform designed for critics, fans, and artists alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gray-800/50 border-gray-700">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}