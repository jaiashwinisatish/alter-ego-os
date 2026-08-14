import { createFileRoute } from "@tanstack/react-router";
import { Check, Pause, Play, RotateCcw, Sparkles, Sunrise, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";
import { morningBrief, sprint } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daily")({
  head: () => ({
    meta: [
      { title: "Daily OS — Alter Ego OS" },
      {
        name: "description",
        content:
          "Morning brief, today's tasks, a deep work timer, practice completion and the end-of-day reflection loop.",
      },
      { property: "og:title", content: "Daily OS — Alter Ego OS" },
      {
        property: "og:description",
        content: "Run the day: brief, deep work, practices and reflection.",
      },
    ],
  }),
  component: DailyOS,
});

const blocks = [
  { id: "morning", label: "Morning" },
  { id: "deep-work", label: "Deep work" },
  { id: "evening", label: "Evening" },
] as const;

function DeepWorkTimer() {
  const { addDeepWorkMinutes, deepWorkMinutes } = useAppState();
  const [seconds, setSeconds] = useState(90 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            addDeepWorkMinutes(90);
            toast.success("Block complete — 90 minutes logged.");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, addDeepWorkMinutes]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = 100 - (seconds / (90 * 60)) * 100;

  return (
    <section className="card-surface p-6">
      <p className="label-eyebrow">Deep work</p>
      <p className="mt-4 font-mono text-5xl tabular-nums tracking-tight">
        {mm}:{ss}
      </p>
      <Progress value={pct} className="mt-4 h-1" />
      <div className="mt-5 flex gap-2">
        <Button onClick={() => setRunning((r) => !r)} className="flex-1">
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? "Pause" : "Start block"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Reset timer"
          onClick={() => {
            setRunning(false);
            setSeconds(90 * 60);
          }}
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {Math.floor(deepWorkMinutes / 60)}h {deepWorkMinutes % 60}m logged this week · target 20h
      </p>
    </section>
  );
}

function DailyOS() {
  const { tasks, habits, toggleTask, toggleHabit, addTask, saveReflection, reflections } =
    useAppState();
  const [newTask, setNewTask] = useState("");
  const [form, setForm] = useState({ compounded: "", leaked: "", tomorrow: "" });
  const [saving, setSaving] = useState(false);
  const done = tasks.filter((t) => t.done).length;

  async function submitReflection() {
    if (!form.compounded.trim()) {
      toast.error("Write at least one line on what compounded today.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    saveReflection({ ...form, rating: 4 });
    setForm({ compounded: "", leaked: "", tomorrow: "" });
    setSaving(false);
    toast.success("Reflection saved. The mentor will use it in Sunday's review.");
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Day ${sprint.day} of ${sprint.total}`}
        title="Daily Operating System"
        description="Run the protocol one day at a time. Brief, blocks, practices, reflection."
      />

      <div className="card-surface rise-in mb-5 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Sunrise className="size-5" />
        </span>
        <div>
          <p className="label-eyebrow">Morning brief</p>
          <p className="mt-1.5 font-display text-xl leading-snug">{morningBrief.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{morningBrief.body}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="card-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-eyebrow">Today</p>
                <h2 className="mt-1 text-xl">
                  {done} of {tasks.length} complete
                </h2>
              </div>
              <Progress value={(done / tasks.length) * 100} className="h-1.5 w-28" />
            </div>

            <Tabs defaultValue="morning" className="mt-6">
              <TabsList>
                {blocks.map((b) => (
                  <TabsTrigger key={b.id} value={b.id}>
                    {b.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {blocks.map((b) => {
                const list = tasks.filter((t) => t.block === b.id);
                return (
                  <TabsContent key={b.id} value={b.id} className="mt-4 space-y-2">
                    {list.length === 0 && (
                      <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                        Nothing scheduled in this block. Protect the space or add one task.
                      </div>
                    )}
                    {list.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-all duration-200 hover:border-border-strong hover:shadow-soft",
                          t.done ? "bg-surface opacity-70" : "bg-card",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                            t.done
                              ? "border-success bg-success text-success-foreground"
                              : "border-border-strong",
                          )}
                        >
                          {t.done && <Check className="size-3" />}
                        </span>
                        <span className="flex-1">
                          <span
                            className={cn(
                              "block text-sm font-medium",
                              t.done && "line-through decoration-muted-foreground",
                            )}
                          >
                            {t.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {t.detail}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          {t.minutes}m
                        </span>
                      </button>
                    ))}
                  </TabsContent>
                );
              })}
            </Tabs>

            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTask.trim()) return;
                addTask(newTask.trim(), 30);
                setNewTask("");
                toast.success("Task added to your deep work block.");
              }}
            >
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task to today's protocol"
              />
              <Button type="submit" variant="outline">
                Add
              </Button>
            </form>
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-eyebrow">Practices</p>
                <h2 className="mt-1 text-xl">Character in motion</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {habits.filter((h) => h.completedToday).length}/{habits.length} today
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    toggleHabit(h.id);
                    if (!h.completedToday) toast.success(`${h.name} — streak ${h.streak + 1}`);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-soft",
                    h.completedToday
                      ? "border-success/40 bg-success/5"
                      : "border-border bg-card hover:border-border-strong",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border",
                      h.completedToday
                        ? "border-success bg-success text-success-foreground"
                        : "border-border-strong",
                    )}
                  >
                    {h.completedToday && <Check className="size-3" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{h.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {h.trait} · {h.streak} day streak
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <DeepWorkTimer />

          <section className="card-surface p-6">
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-accent" />
              <p className="label-eyebrow">End of day reflection</p>
            </div>
            <div className="mt-4 space-y-3">
              <Textarea
                rows={2}
                placeholder="What compounded today?"
                value={form.compounded}
                onChange={(e) => setForm({ ...form, compounded: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="What leaked?"
                value={form.leaked}
                onChange={(e) => setForm({ ...form, leaked: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Tomorrow's one thing"
                value={form.tomorrow}
                onChange={(e) => setForm({ ...form, tomorrow: e.target.value })}
              />
              <Button className="w-full" onClick={() => void submitReflection()} disabled={saving}>
                {saving ? "Saving…" : "Close the day"}
              </Button>
            </div>
            {reflections.length > 0 ? (
              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <p className="label-eyebrow">Recent</p>
                {reflections.slice(0, 2).map((r) => (
                  <div key={r.id} className="rounded-xl bg-surface p-3">
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                    <p className="mt-1 text-sm">{r.compounded}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                No reflections logged yet. Three lines is enough.
              </p>
            )}
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <p className="label-eyebrow">Weekly review</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sunday, 18:00. Your mentor will recompile the sprint against this week's adherence
              and rewrite next week's blocks.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => toast.success("Weekly review scheduled for Sunday 18:00.")}
            >
              Schedule review
            </Button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
