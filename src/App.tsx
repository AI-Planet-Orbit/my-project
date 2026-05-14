import { useMemo, useState } from "react";
import { GripVertical, Plus, CheckCircle2, CircleDashed, ListTodo, Briefcase, Archive } from "lucide-react";

type Status = "backlog" | "todo" | "in-progress" | "done";

type Todo = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

const columns: {
  id: Status;
  title: string;
  icon: typeof ListTodo;
  accent: string;
  description: string;
}[] = [
  {
    id: "backlog",
    title: "Backlog",
    icon: Archive,
    accent: "from-slate-500/30 to-slate-700/20",
    description: "Ideas and unplanned work",
  },
  {
    id: "todo",
    title: "Todo",
    icon: ListTodo,
    accent: "from-violet-500/30 to-fuchsia-500/20",
    description: "Ready to be picked up",
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: Briefcase,
    accent: "from-sky-500/30 to-cyan-500/20",
    description: "Currently being worked on",
  },
  {
    id: "done",
    title: "Done",
    icon: CheckCircle2,
    accent: "from-emerald-500/30 to-teal-500/20",
    description: "Completed and delivered",
  },
];

const initialTodos: Todo[] = [
  { id: "1", title: "Design dashboard layout", description: "Create the main board structure", status: "backlog" },
  { id: "2", title: "Write task editor", description: "Add quick-create form", status: "todo" },
  { id: "3", title: "Implement drag and drop", description: "Allow moving cards between columns", status: "in-progress" },
  { id: "4", title: "Polish empty states", description: "Make the board feel complete", status: "done" },
  { id: "5", title: "Add keyboard shortcuts", description: "Improve power-user flow", status: "backlog" },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTitle, setNewTitle] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const groupedTodos = useMemo(() => {
    return columns.reduce<Record<Status, Todo[]>>(
      (acc, column) => {
        acc[column.id] = todos.filter((todo) => todo.status === column.id);
        return acc;
      },
      { backlog: [], todo: [], "in-progress": [], done: [] }
    );
  }, [todos]);

  const addTodo = () => {
    const title = newTitle.trim();
    if (!title) return;

    setTodos((current) => [
      {
        id: crypto.randomUUID(),
        title,
        status: "backlog",
      },
      ...current,
    ]);
    setNewTitle("");
  };

  const updateStatus = (id: string, status: Status) => {
    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, status } : todo)));
  };

  const handleDrop = (status: Status) => {
    if (!draggingId) return;
    updateStatus(draggingId, status);
    setDraggingId(null);
  };

  return (
    <div className="min-h-screen bg-[#171717] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#262626] via-[#202020] to-[#171717] p-6 shadow-2xl shadow-black/30">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-[#A3A3A3]">
                Task Flow Board
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Drag, reorder, and ship your work.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#A3A3A3]">
                Move todos between backlog, todo, in progress, and done with a smooth drag-and-drop workflow.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="inline-flex h-3 w-3 rounded-full bg-[#9E7FFF] shadow-[0_0_18px_rgba(158,127,255,0.8)]" />
              <p className="text-sm text-[#A3A3A3]">
                {todos.length} active task{todos.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new todo..."
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-[#262626] px-4 text-base text-white outline-none transition placeholder:text-[#737373] focus:border-[#9E7FFF] focus:ring-2 focus:ring-[#9E7FFF]/30"
            />
            <button
              onClick={addTodo}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#9E7FFF] px-5 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-[#8b6df3] focus:outline-none focus:ring-2 focus:ring-[#9E7FFF]/40"
            >
              <Plus className="h-4 w-4" />
              Add Todo
            </button>
          </div>
        </header>

        <main className="grid gap-4 lg:grid-cols-4">
          {columns.map((column) => {
            const Icon = column.icon;
            const items = groupedTodos[column.id];

            return (
              <section
                key={column.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(column.id)}
                className={`rounded-3xl border border-white/10 bg-gradient-to-b ${column.accent} p-4 shadow-xl shadow-black/20 transition-colors`}
                aria-label={column.title}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-white" />
                      <h2 className="text-lg font-semibold">{column.title}</h2>
                    </div>
                    <p className="mt-1 text-sm text-[#A3A3A3]">{column.description}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-[#A3A3A3]">
                      Drop tasks here
                    </div>
                  ) : (
                    items.map((todo) => (
                      <article
                        key={todo.id}
                        draggable
                        onDragStart={() => setDraggingId(todo.id)}
                        onDragEnd={() => setDraggingId(null)}
                        className={`group cursor-grab rounded-2xl border border-white/10 bg-[#262626]/90 p-4 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#2b2b2b] ${
                          draggingId === todo.id ? "scale-[0.98] opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            className="mt-0.5 cursor-grab rounded-xl p-1 text-[#737373] transition hover:bg-white/5 hover:text-white"
                            aria-label="Drag todo"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-white">{todo.title}</h3>
                            {todo.description ? (
                              <p className="mt-1 text-sm leading-6 text-[#A3A3A3]">{todo.description}</p>
                            ) : null}

                            <div className="mt-3 flex flex-wrap gap-2">
                              {columns.map((status) => (
                                <button
                                  key={status.id}
                                  onClick={() => updateStatus(todo.id, status.id)}
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                                    todo.status === status.id
                                      ? "border-[#9E7FFF]/50 bg-[#9E7FFF]/20 text-white"
                                      : "border-white/10 bg-white/5 text-[#A3A3A3] hover:border-white/20 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  {status.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </main>

        <footer className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-[#A3A3A3]">
          Tip: drag a card by the handle or use the status buttons for quick moves.
        </footer>
      </div>
    </div>
  );
}
