import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AppLayout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import Progress from "@/pages/Progress";
import ParentDashboard from "@/pages/ParentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Subscription from "@/pages/Subscription";
import Upgrade from "@/pages/Upgrade";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Switch>
              <Route path="/" component={Landing} />
              
              <Route>
                <AppLayout>
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    
                    {/* Student Routes */}
                    <Route path="/dashboard">
                      <ProtectedRoute requireRole={['STUDENT']}>
                        <Dashboard />
                      </ProtectedRoute>
                    </Route>
                    <Route path="/learn/:level">
                      <ProtectedRoute requireRole={['STUDENT']}>
                        <Learn />
                      </ProtectedRoute>
                    </Route>
                    <Route path="/progress">
                      <ProtectedRoute requireRole={['STUDENT', 'PARENT', 'TEACHER']}>
                        <Progress />
                      </ProtectedRoute>
                    </Route>
                    <Route path="/leaderboard">
                      <ProtectedRoute requireRole={['STUDENT']}>
                        <Leaderboard />
                      </ProtectedRoute>
                    </Route>

                    {/* Parent Routes */}
                    <Route path="/parent">
                      <ProtectedRoute requireRole={['PARENT']}>
                        <ParentDashboard />
                      </ProtectedRoute>
                    </Route>
                    <Route path="/subscription">
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    </Route>
                    <Route path="/upgrade">
                      <ProtectedRoute>
                        <Upgrade />
                      </ProtectedRoute>
                    </Route>

                    {/* Teacher Routes */}
                    <Route path="/teacher">
                      <ProtectedRoute requireRole={['TEACHER']}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin">
                      <ProtectedRoute requireRole={['ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    </Route>

                    <Route component={NotFound} />
                  </Switch>
                </AppLayout>
              </Route>
            </Switch>
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
