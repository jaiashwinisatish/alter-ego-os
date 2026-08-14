import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Fingerprint,
  Flag,
  MessageSquare,
  Sparkles,
  Sun,
  Target,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { layers } from "@/lib/mock-data";
import heroImage from "@/assets/hero-protocol.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alter Ego OS — Become the person you were meant to become" },
      {
        name: "description",
        content:
          "An AI-powered personal operating system that turns your ambition into a seven-layer protocol, a daily practice and a mentor that holds you to it.",
      },
      { property: "og:title", content: "Alter Ego OS — Your personal transformation protocol" },
      {
        property: "og:description",
        content:
          "Design your alter ego, build the character stack behind it, and run the daily system with an AI mentor.",
      },
    ],
  }),
  component: Landing,
});

const layerIcons = [Fingerprint, UserCog, BookOpen, Target, Sun, Sparkles, Flag];

const steps = [
  {
    n: "01",
    title: "The interview",
    body: "A 10-minute conversation about your ambition, your position, your fears and your horizon. No forms, no personality quiz.",
  },
  {
    n: "02",
    title: "Your protocol is generated",
    body: "Seven layers, from identity architecture down to the exact practices you run tomorrow morning.",
  },
  {
    n: "03",
    title: "You run the system",
    body: "Daily brief, deep work, practices, reflection. Your mentor recalibrates the protocol every week.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Alter Ego OS</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#system" className="transition-colors hover:text-foreground">
              The system
            </a>
            <a href="#mentor" className="transition-colors hover:text-foreground">
              AI mentor
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/dashboard">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/onboarding">Build My Alter Ego</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="hairline-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <div className="rise-in mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="size-1.5 rounded-full bg-accent" />
              Personal transformation, engineered
            </span>
            <h1 className="text-display mt-7 text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-7xl">
              Become the person you
              <br className="hidden sm:block" /> were meant to become.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Alter Ego OS turns who you want to be into an operating system: a seven-layer
              protocol, a daily practice, and an AI mentor that recalibrates it as you change.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/onboarding">
                  Build My Alter Ego
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/dashboard">See a live protocol</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              10-minute interview · Protocol generated instantly
            </p>
          </div>

          <div className="rise-in mt-16 overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <img
              src={heroImage}
              alt="The Alter Ego OS seven-layer transformation protocol visualised as concentric architectural rings"
              className="h-[280px] w-full object-cover sm:h-[440px]"
              loading="eager"
            />
            <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
              {[
                ["7 layers", "From identity down to daily practice"],
                ["90-day sprints", "Long horizons, short feedback loops"],
                ["Always-on mentor", "Context-aware, never generic"],
              ].map(([k, v]) => (
                <div key={k} className="bg-card px-6 py-5">
                  <p className="font-display text-xl">{k}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="system" className="border-t border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="label-eyebrow">The seven layers</p>
            <h2 className="text-display mt-3 text-3xl sm:text-4xl">
              A person is a system. Most people never design theirs.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each layer inherits from the one above it. Change your identity architecture and the
              daily practices follow — not the other way around.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer, i) => {
              const Icon = layerIcons[i] ?? Sparkles;
              return (
                <div
                  key={layer.id}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{layer.index}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl">{layer.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {layer.tagline}
                  </p>
                </div>
              );
            })}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-primary p-6 text-primary-foreground shadow-soft">
              <p className="font-display text-2xl leading-tight">
                Seven layers, one coherent person.
              </p>
              <Button variant="secondary" asChild className="mt-6 w-fit">
                <Link to="/onboarding">
                  Start the interview <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="mentor" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="label-eyebrow">AI mentor</p>
            <h2 className="text-display mt-3 text-3xl sm:text-4xl">
              Coaching that already knows your protocol.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Your mentor sees every layer, every streak and every missed block. It doesn't
              motivate you — it tells you precisely which constraint is binding and what to do in
              the next ninety minutes.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                ["Context-aware", "Answers reference your sprint, traits and streaks."],
                ["Accountability", "Weekly challenges calibrated to your weakest layer."],
                ["Recalibration", "Your protocol is rewritten as you change, not annually."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Compass className="size-3" />
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{t}.</span>{" "}
                    <span className="text-muted-foreground">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <MessageSquare className="size-4 text-accent" />
              <span className="text-sm font-semibold">Mentor</span>
              <span className="ml-auto text-xs text-muted-foreground">Day 34 of 90</span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-sm">
                I keep pushing the launch essay. Third week now.
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 text-sm leading-relaxed">
                It isn't a writing problem. Your Sovereignty trait sits at 46 — you open inputs
                before you produce output, so the essay never gets your sharpest hours. Move it to
                the 9am block tomorrow and cap it at 90 minutes.
              </div>
            </div>
            <Button variant="outline" className="mt-6 w-full" asChild>
              <Link to="/mentor">Talk to the mentor</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="label-eyebrow">How it works</p>
          <h2 className="text-display mt-3 max-w-xl text-3xl sm:text-4xl">
            From an honest conversation to a running system.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="bg-card p-8">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-display text-4xl sm:text-5xl">
            The version of you that you keep postponing already has a protocol.
          </h2>
          <Button size="lg" asChild className="mt-9">
            <Link to="/onboarding">
              Build My Alter Ego <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© 2026 Alter Ego OS</span>
          <span>Built for people engineering themselves.</span>
        </div>
      </footer>
    </div>
  );
}
