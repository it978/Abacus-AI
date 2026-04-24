import { useState } from 'react';
import { AbacusBoard } from '@/components/AbacusBoard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Brain, Star, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const [demoValue, setDemoValue] = useState(12345);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-2xl text-primary tracking-tight">AbacusAI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-bold shadow-lg shadow-primary/20 rounded-full px-6">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
              <Star className="w-4 h-4" />
              <span>The #1 AI-powered abacus app</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight text-foreground">
              Master mental math with <span className="text-primary">AbacusAI</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A beautifully designed learning game for kids and adults. Learn the ancient art of the abacus with modern AI guidance, smart hints, and adaptive difficulty.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-full px-8 text-lg font-bold shadow-xl shadow-primary/30 h-14">
                  Start learning for free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl -z-10 rounded-[3rem]" />
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-bold text-xl">Interactive Demo</h3>
                  <p className="text-sm text-muted-foreground">Try moving the beads!</p>
                </div>
                <div className="text-3xl font-mono font-bold text-primary tracking-wider bg-primary/10 px-4 py-2 rounded-xl">
                  {demoValue.toLocaleString()}
                </div>
              </div>
              <AbacusBoard 
                mode="interactive" 
                value={demoValue} 
                onValueChange={setDemoValue}
                theme="kids"
              />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
