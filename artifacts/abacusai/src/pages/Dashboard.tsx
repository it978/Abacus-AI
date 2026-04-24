import { useGetStudentDashboard, useGetSubscriptionStatus } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, Play, Trophy, Medal, Star, Shield, Lock, Award, History } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const BADGE_ICONS: Record<string, any> = {
  "First Step": Trophy,
  "Speed Demon": Flame,
  "Zero Error": Shield,
  "7-Day Streak": Star,
  "Level Master": Medal,
  "Hint-Free Hero": Award
};

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetStudentDashboard();
  const { data: subscription } = useGetSubscriptionStatus();

  if (isLoading || !dashboard) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const { student, todaySessions, maxSessionsToday, level, streak, badges, recentSessions, canStartSession } = dashboard;
  
  const xpForNextLevel = level * 1000;
  const xpProgress = (student.xp / xpForNextLevel) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Welcome back, {student.name}!
          </h1>
          <p className="text-muted-foreground text-lg mt-1">Ready to master the abacus?</p>
        </div>
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-2">
            <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
            <span className="font-bold text-xl">{streak}</span>
            <span className="text-muted-foreground text-sm font-medium">Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 shadow-md shadow-primary/5 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Medal className="text-primary w-6 h-6" />
              Level {level} Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-primary">{student.xp} XP</span>
                <span className="text-muted-foreground">{xpForNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-4 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <div>
                <h4 className="font-bold text-lg">Daily Goal</h4>
                <p className="text-muted-foreground text-sm">{todaySessions} / {maxSessionsToday} sessions completed</p>
              </div>
              <Link href={`/learn/${level}`}>
                <Button size="lg" className="font-bold rounded-full shadow-lg gap-2" disabled={!canStartSession}>
                  <Play className="w-4 h-4 fill-current" />
                  {canStartSession ? "Start Practice" : "Daily Limit Reached"}
                </Button>
              </Link>
            </div>
            {!canStartSession && subscription?.plan === 'FREE' && (
              <p className="text-sm text-center text-muted-foreground">
                You've reached your daily limit. <Link href="/upgrade" className="text-primary font-bold hover:underline">Upgrade</Link> for unlimited practice.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="text-secondary w-5 h-5" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(BADGE_ICONS).slice(0, 4).map((badgeName) => {
                const Icon = BADGE_ICONS[badgeName] || Star;
                const earned = badges.includes(badgeName);
                return (
                  <div key={badgeName} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${earned ? 'bg-primary/5 border-primary/20 text-foreground' : 'bg-muted/30 border-dashed border-muted text-muted-foreground opacity-50'}`}>
                    <div className={`p-2 rounded-full mb-2 ${earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {earned ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-bold leading-tight">{badgeName}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No practice sessions yet. Start learning today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      L{session.level}
                    </div>
                    <div>
                      <p className="font-bold">Score: {session.score}</p>
                      <p className="text-sm text-muted-foreground">{new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">{session.accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
