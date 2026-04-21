import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Heart, Target, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-background to-background pt-20 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Play. Give. Win.
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Your game,<br />their hope.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your golf scores, support causes you care about, and win monthly prize draws.
              Every round becomes an act of kindness.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start your journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/charities">Explore charities</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps to start making a difference</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Enter your scores", desc: "Log your last 5 golf rounds. We keep only your most recent scores.", step: "01" },
            { icon: Heart, title: "Pick your cause", desc: "Choose a charity that matters. At least 10% of your subscription goes there.", step: "02" },
            { icon: Trophy, title: "Win monthly draws", desc: "Match numbers with your scores. 5-match jackpots roll over if unclaimed.", step: "03" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-muted/30">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pool Distribution */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-sm font-medium mb-4">
                <Zap className="h-3.5 w-3.5" />
                Prize Pool Distribution
              </div>
              <h2 className="text-4xl font-bold">Transparent. Automatic. Fair.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold">40%</div>
                  <div className="mt-2 font-semibold">5-Number Match</div>
                  <div className="text-sm opacity-90 mt-1">Jackpot · Rolls over</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary to-emerald-600 text-white border-0">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold">35%</div>
                  <div className="mt-2 font-semibold">4-Number Match</div>
                  <div className="text-sm opacity-90 mt-1">Split among winners</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold">25%</div>
                  <div className="mt-2 font-semibold">3-Number Match</div>
                  <div className="text-sm opacity-90 mt-1">Split among winners</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 container">
        <Card className="bg-gradient-to-br from-primary to-emerald-700 text-white border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),transparent)]" />
          <CardContent className="p-12 md:p-20 text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to make every round count?</h2>
            <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto">
              Join the movement. Play better. Give more. Win together.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link to="/signup">
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}