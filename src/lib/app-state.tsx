import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  books as seedBooks,
  conversationSeed,
  habits as seedHabits,
  milestones as seedMilestones,
  notes as seedNotes,
  profile as seedProfile,
  tasks as seedTasks,
  type Book,
  type ChatMessage,
  type Conversation,
  type Habit,
  type Milestone,
  type Note,
  type Task,
} from "./mock-data";

const STORAGE_KEY = "alter-ego-os:v1";

export interface Reflection {
  id: string;
  date: string;
  compounded: string;
  leaked: string;
  tomorrow: string;
  rating: number;
}

interface PersistedState {
  onboarded: boolean;
  onboardingAnswers: Record<string, string>;
  tasks: Task[];
  habits: Habit[];
  books: Book[];
  notes: Note[];
  milestones: Milestone[];
  conversations: Conversation[];
  reflections: Reflection[];
  deepWorkMinutes: number;
  settings: {
    displayName: string;
    alterEgo: string;
    identityStatement: string;
    calendarConnected: boolean;
    mentorNudges: boolean;
    analyticsOptIn: boolean;
    weeklyDigest: boolean;
  };
}

const initialState: PersistedState = {
  onboarded: false,
  onboardingAnswers: {},
  tasks: seedTasks,
  habits: seedHabits,
  books: seedBooks,
  notes: seedNotes,
  milestones: seedMilestones,
  conversations: conversationSeed,
  reflections: [],
  deepWorkMinutes: 148,
  settings: {
    displayName: seedProfile.fullName,
    alterEgo: seedProfile.alterEgo,
    identityStatement: seedProfile.identityStatement,
    calendarConnected: false,
    mentorNudges: true,
    analyticsOptIn: true,
    weeklyDigest: true,
  },
};

interface AppStateValue extends PersistedState {
  hydrated: boolean;
  toggleTask: (id: string) => void;
  addTask: (title: string, minutes: number) => void;
  toggleHabit: (id: string) => void;
  addNote: (note: { title: string; source: string; body: string; tags: string[] }) => void;
  updateBookProgress: (id: string, progress: number) => void;
  toggleMilestone: (id: string) => void;
  addMilestone: (m: Omit<Milestone, "id" | "done" | "progress">) => void;
  sendMentorMessage: (conversationId: string | null, content: string) => Promise<string>;
  startConversation: () => string;
  addDeepWorkMinutes: (minutes: number) => void;
  saveReflection: (r: Omit<Reflection, "id" | "date">) => void;
  setOnboardingAnswer: (id: string, value: string) => void;
  completeOnboarding: () => void;
  resetProtocol: () => void;
  updateSettings: (patch: Partial<PersistedState["settings"]>) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

function mentorReply(input: string): string {
  const text = input.toLowerCase();
  if (/today|first|start|priority/.test(text)) {
    return "Start with the launch essay block at 9:00 — 90 minutes, no inputs first. Everything else on today's list is recoverable; that one isn't. I've pinned it as your priority.";
  }
  if (/tired|stuck|unmotivated|failed|behind|slip/.test(text)) {
    return "You're not behind on effort — deep work is at 61 of 90 hours, ahead of pace. You're behind on distribution. Motivation isn't the missing input here; a smaller first action is. Do fifteen minutes on the essay and stop.";
  }
  if (/read|book|learn|knowledge/.test(text)) {
    return "Finish Impro before adding anything new. Presence is your weakest layer at 43%, and Impro maps directly onto the speaking reps you committed to. Queue The Beginning of Infinity for the next sprint.";
  }
  if (/sprint|goal|okr|plan|recalibrat/.test(text)) {
    return "Sprint 02 is at day 34 of 90. Activated users are the lagging KR at 17 of 25. Reallocate one deep work block a week to direct outreach and hold the essay cadence — that closes the gap by day 60.";
  }
  if (/challenge|push|hard/.test(text)) {
    return "Here's the challenge: one three-hour block with zero context switches before Friday. Your current average block is 47 minutes. Log it in the Daily OS timer so I can verify it.";
  }
  if (/identity|who|purpose|meaning|drift/.test(text)) {
    return "Your identity statement is: \"I build systems that outlive the mood I was in when I built them.\" The drift is small but real — three days this week you optimised for feeling productive rather than for durability. Re-read it before the first block tomorrow.";
  }
  if (/habit|streak|discipline/.test(text)) {
    return "Discipline is your strongest trait at 81 with a 34-day training streak. Sovereignty is the leak — 46, broken four times in fourteen days. Fix the first thirty minutes of the day and the trait follows.";
  }
  return "Understood. Given where you are in Sprint 02, the highest-leverage move is to protect your morning block and publish before Friday. Tell me which part you want to work through and I'll build the sequence.";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const patch = useCallback(
    (fn: (s: PersistedState) => PersistedState) => setState((s) => fn(s)),
    [],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      ...state,
      hydrated,
      toggleTask: (id) =>
        patch((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      addTask: (title, minutes) =>
        patch((s) => ({
          ...s,
          tasks: [
            ...s.tasks,
            {
              id: uid(),
              title,
              detail: "Added manually",
              layer: "daily-os",
              block: "deep-work",
              minutes,
              done: false,
              priority: false,
            },
          ],
        })),
      toggleHabit: (id) =>
        patch((s) => ({
          ...s,
          habits: s.habits.map((hb) =>
            hb.id === id
              ? {
                  ...hb,
                  completedToday: !hb.completedToday,
                  streak: hb.completedToday ? Math.max(0, hb.streak - 1) : hb.streak + 1,
                }
              : hb,
          ),
        })),
      addNote: (note) =>
        patch((s) => ({
          ...s,
          notes: [{ id: uid(), createdAt: "Just now", ...note }, ...s.notes],
        })),
      updateBookProgress: (id, progress) =>
        patch((s) => ({
          ...s,
          books: s.books.map((b) =>
            b.id === id
              ? {
                  ...b,
                  progress,
                  status: progress >= 100 ? "finished" : progress > 0 ? "reading" : "queued",
                }
              : b,
          ),
        })),
      toggleMilestone: (id) =>
        patch((s) => ({
          ...s,
          milestones: s.milestones.map((m) =>
            m.id === id ? { ...m, done: !m.done, progress: m.done ? 50 : 100 } : m,
          ),
        })),
      addMilestone: (m) =>
        patch((s) => ({
          ...s,
          milestones: [...s.milestones, { ...m, id: uid(), done: false, progress: 0 }],
        })),
      startConversation: () => {
        const id = uid();
        patch((s) => ({
          ...s,
          conversations: [
            { id, title: "New conversation", updatedAt: "Just now", messages: [] },
            ...s.conversations,
          ],
        }));
        return id;
      },
      sendMentorMessage: async (conversationId, content) => {
        const targetId = conversationId ?? uid();
        const userMsg: ChatMessage = {
          id: uid(),
          role: "user",
          content,
          at: "Just now",
        };
        patch((s) => {
          const exists = s.conversations.some((c) => c.id === targetId);
          const conversations = exists
            ? s.conversations.map((c) =>
                c.id === targetId
                  ? {
                      ...c,
                      title: c.messages.length === 0 ? content.slice(0, 48) : c.title,
                      updatedAt: "Just now",
                      messages: [...c.messages, userMsg],
                    }
                  : c,
              )
            : [
                {
                  id: targetId,
                  title: content.slice(0, 48),
                  updatedAt: "Just now",
                  messages: [userMsg],
                },
                ...s.conversations,
              ];
          return { ...s, conversations };
        });

        await new Promise((r) => setTimeout(r, 900));
        const reply = mentorReply(content);
        patch((s) => ({
          ...s,
          conversations: s.conversations.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  updatedAt: "Just now",
                  messages: [
                    ...c.messages,
                    { id: uid(), role: "mentor", content: reply, at: "Just now" },
                  ],
                }
              : c,
          ),
        }));
        return reply;
      },
      addDeepWorkMinutes: (minutes) =>
        patch((s) => ({ ...s, deepWorkMinutes: s.deepWorkMinutes + minutes })),
      saveReflection: (r) =>
        patch((s) => ({
          ...s,
          reflections: [{ ...r, id: uid(), date: new Date().toDateString() }, ...s.reflections],
        })),
      setOnboardingAnswer: (id, val) =>
        patch((s) => ({ ...s, onboardingAnswers: { ...s.onboardingAnswers, [id]: val } })),
      completeOnboarding: () => patch((s) => ({ ...s, onboarded: true })),
      resetProtocol: () => setState({ ...initialState }),
      updateSettings: (p) => patch((s) => ({ ...s, settings: { ...s.settings, ...p } })),
    }),
    [state, hydrated, patch],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
