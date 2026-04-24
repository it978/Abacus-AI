import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Lock, Star, ArrowRight } from 'lucide-react';

export default function Upgrade() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 pointer-events-none" />
        <CardContent className="p-10 text-center relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 border-4 border-background shadow-sm">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold mb-4">Daily Limit Reached</h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            You've completed all your free sessions for today! Great job practicing. 
            Want to keep going? Upgrade to AbacusAI Star for unlimited practice.
          </p>

          <div className="bg-card w-full rounded-2xl p-6 border shadow-sm mb-8 text-left">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-primary">
              <Star className="w-5 h-5 fill-primary" /> Star Plan Benefits
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">✅ <span className="font-medium">Unlimited</span> daily practice sessions</li>
              <li className="flex items-center gap-2">✅ Access to <span className="font-medium">Levels 3, 4, and 5</span></li>
              <li className="flex items-center gap-2">✅ Advanced <span className="font-medium">AI Tutoring & Hints</span></li>
              <li className="flex items-center gap-2">✅ Weekly <span className="font-medium">Leaderboard</span> access</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full h-12 font-bold">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/subscription" className="flex-1">
              <Button className="w-full h-12 font-bold shadow-lg shadow-primary/20 gap-2">
                See Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
