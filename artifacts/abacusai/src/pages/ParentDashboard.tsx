import { useGetChildren, useGetParentReports } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { Users, Activity, FileText, ArrowRight } from 'lucide-react';

export default function ParentDashboard() {
  const { data: children, isLoading: childrenLoading } = useGetChildren();
  const { data: reports, isLoading: reportsLoading } = useGetParentReports();

  if (childrenLoading || reportsLoading || !children || !reports) {
    return <div className="p-8 flex justify-center">Loading parent dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-lg">Monitor your children's learning journey.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> Children
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => (
            <Card key={child.id} className="shadow-sm hover:shadow-md transition-shadow border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{child.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl">{child.name}</h3>
                    <p className="text-muted-foreground text-sm">Level {child.level} • {child.xp} XP</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                    <p className="text-xs text-muted-foreground font-bold">Accuracy</p>
                    <p className="text-xl font-bold text-secondary">{child.weeklyAccuracy}%</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
                    <p className="text-xs text-muted-foreground font-bold">Streak</p>
                    <p className="text-xl font-bold text-accent">{child.streak} Days</p>
                  </div>
                </div>
                
                <Link href={`/progress?childId=${child.id}`}>
                  <Button variant="outline" className="w-full gap-2 font-bold">
                    View Detailed Progress <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          
          <Card className="shadow-sm border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center p-6 text-center min-h-[250px] hover:bg-muted/40 transition-colors cursor-pointer">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold">Add Another Child</h3>
            <p className="text-sm text-muted-foreground mt-1">Connect another student account</p>
          </Card>
        </div>
      </div>

      <div className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-secondary" /> Weekly Reports
        </h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No reports available yet. Check back at the end of the week!
              </div>
            ) : (
              <div className="divide-y">
                {reports.map((report) => (
                  <div key={report.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <h4 className="font-bold text-lg">{report.studentName}'s Weekly Summary</h4>
                      <p className="text-sm text-muted-foreground">Week of {new Date(report.weekOf).toLocaleDateString()}</p>
                    </div>
                    <Button variant="secondary" className="font-bold shadow-sm shrink-0">
                      View Full Report
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
