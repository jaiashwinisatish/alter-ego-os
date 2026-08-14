import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge System — Alter Ego OS" },
      {
        name: "description",
        content:
          "A personalised reading roadmap, notes and a collision notebook, recompiled weekly by your AI mentor.",
      },
      { property: "og:title", content: "Knowledge System — Alter Ego OS" },
      {
        property: "og:description",
        content: "A reading and thinking pipeline, not a to-read pile.",
      },
    ],
  }),
  component: Knowledge,
});

function Knowledge() {
  const { books, notes, updateBookProgress, addNote } = useAppState();
  const [draft, setDraft] = useState({ title: "", source: "", body: "" });

  const roadmap = [
    { phase: "Now", focus: "Systems & leverage", books: 3 },
    { phase: "Next 90 days", focus: "Presence & communication", books: 2 },
    { phase: "This year", focus: "Epistemics & long horizons", books: 4 },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Layer 03"
        title="Knowledge System"
        description="What you read shapes what you can build. This pipeline is curated against your protocol."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Tabs defaultValue="reading">
            <TabsList>
              <TabsTrigger value="reading">Reading list</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="collision">Collision notebook</TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="mt-4 space-y-3">
              {books.map((b) => (
                <div key={b.id} className="card-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg">{b.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {b.author} · {b.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.why}</p>
                  <Progress value={b.progress} className="mt-4 h-1" />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{b.progress}% read</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateBookProgress(b.id, Math.min(100, b.progress + 10));
                          toast.success("Progress logged.");
                        }}
                      >
                        +10%
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateBookProgress(b.id, 100)}
                      >
                        Finish
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-3">
              {notes.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
                  No notes yet. Capture one idea per reading session.
                </div>
              )}
              {notes.map((n) => (
                <div key={n.id} className="card-surface p-5">
                  <h3 className="text-lg leading-snug">{n.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.source} · {n.createdAt}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="collision" className="mt-4">
              <div className="card-surface p-5">
                <p className="label-eyebrow">New collision</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Where two ideas from different books crash into each other.
                </p>
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                  <Input
                    placeholder="Sources (e.g. Impro × Thinking in Systems)"
                    value={draft.source}
                    onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                  />
                  <Textarea
                    rows={4}
                    placeholder="What does the collision produce?"
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  />
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!draft.title.trim() || !draft.body.trim()) {
                        toast.error("A collision needs a title and a thought.");
                        return;
                      }
                      addNote({ ...draft, tags: ["collision"] });
                      setDraft({ title: "", source: "", body: "" });
                      toast.success("Collision captured.");
                    }}
                  >
                    <Plus className="size-4" /> Save collision
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-5">
          <section className="card-surface p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <p className="label-eyebrow">Weekly recommendation</p>
            </div>
            <p className="mt-3 font-display text-xl leading-snug">Finish Impro before adding anything new.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Presence is your weakest layer at 43%. Impro maps directly onto the speaking reps you
              committed to this sprint.
            </p>
          </section>

          <section className="card-surface p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-accent" />
              <p className="label-eyebrow">Learning roadmap</p>
            </div>
            <div className="mt-4 space-y-3">
              {roadmap.map((r) => (
                <div key={r.phase} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold">{r.phase}</p>
                  <p className="text-xs text-muted-foreground">{r.focus}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {r.books} titles
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
