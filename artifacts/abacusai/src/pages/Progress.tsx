import { useGetStudentProgress } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';

export default function Progress() {
  const { data: progress, isLoading } = useGetStudentProgress();

  if (isLoading || !progress) {
    return <div className="p-8 flex justify-center text-muted-foreground">Loading progress data...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground mt-1 text-lg">See how far you've come!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Target className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground font-bold">Avg Accuracy</p>
            <p className="text-3xl font-bold text-primary">{progress.avgAccuracy}%</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-8 h-8 text-secondary mb-2" />
            <p className="text-sm text-muted-foreground font-bold">Total Sessions</p>
            <p className="text-3xl font-bold text-secondary">{progress.totalSessions}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm text-muted-foreground font-bold">Avg Time/Session</p>
            <p className="text-3xl font-bold text-accent">{Math.round(progress.avgDuration / 60)}m</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Brain className="w-8 h-8 text-destructive mb-2" />
            <p className="text-sm text-muted-foreground font-bold">Hints Used</p>
            <p className="text-3xl font-bold text-destructive">{progress.hintsUsedTotal}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daily Accuracy</CardTitle>
            <CardDescription>Your accuracy over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress.dailyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'short' })} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  formatter={(val: number) => [`${val}%`, 'Accuracy']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
            <CardDescription>Sessions completed per level</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress.levelProgress}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="level" tickFormatter={(val) => `Lvl ${val}`} />
                <YAxis />
                <Tooltip 
                  formatter={(val: number) => [val, 'Sessions']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sessionsCompleted" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-500">Strong Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
              {progress.strongAreas.length > 0 ? progress.strongAreas.map((area, i) => <li key={i}>{area}</li>) : <li>Keep practicing to discover strong areas!</li>}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-amber-500">Focus Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
              {progress.weakAreas.length > 0 ? progress.weakAreas.map((area, i) => <li key={i}>{area}</li>) : <li>You're doing great across the board!</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
