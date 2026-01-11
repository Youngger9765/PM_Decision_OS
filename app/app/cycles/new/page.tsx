"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockProjects } from "@/lib/mock-data";

type Step = "project" | "title" | "hypothesis" | "criteria" | "scope" | "confirm";

interface FormData {
  projectId: string;
  title: string;
  hypothesis: string;
  successCriteria: string;
  outOfScope: string;
}

export default function NewDecisionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<Step>("project");
  const [formData, setFormData] = useState<FormData>({
    projectId: "",
    title: "",
    hypothesis: "",
    successCriteria: "",
    outOfScope: "",
  });
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    setInputValue("");

    switch (currentStep) {
      case "project":
        // Handle project selection (user can type project name or number)
        const projectIndex = parseInt(value) - 1;
        const selectedProject =
          projectIndex >= 0 && projectIndex < mockProjects.length
            ? mockProjects[projectIndex]
            : mockProjects.find((p) => p.name.toLowerCase().includes(value.toLowerCase()));

        if (selectedProject) {
          setFormData({ ...formData, projectId: selectedProject.id });
          setCurrentStep("title");
        }
        break;

      case "title":
        setFormData({ ...formData, title: value });
        setCurrentStep("hypothesis");
        break;

      case "hypothesis":
        setFormData({ ...formData, hypothesis: value });
        setCurrentStep("criteria");
        break;

      case "criteria":
        setFormData({ ...formData, successCriteria: value });
        setCurrentStep("scope");
        break;

      case "scope":
        setFormData({ ...formData, outOfScope: value });
        setCurrentStep("confirm");
        break;
    }
  };

  const handleQuickTemplate = (template: "ab_test" | "feature" | "perf") => {
    const templates = {
      ab_test: {
        title: "A/B test new checkout flow",
        hypothesis: "Simplifying checkout from 5 steps to 3 will increase conversion by 15%",
        successCriteria: "- Checkout conversion ≥ 45% (baseline: 30%)\n- Cart abandonment < 20%\n- No increase in support tickets",
        outOfScope: "- Payment method changes (separate experiment)\n- Mobile app (web only)",
      },
      feature: {
        title: "Add dark mode toggle",
        hypothesis: "Users prefer dark mode for extended sessions, especially night usage",
        successCriteria: "- 40%+ adoption within 2 weeks\n- Session duration increases 10%+\n- User feedback score ≥ 4.5/5",
        outOfScope: "- Custom theme colors (Phase 2)\n- Automatic time-based switching",
      },
      perf: {
        title: "Optimize API response time",
        hypothesis: "Reducing API latency below 200ms will improve user satisfaction scores",
        successCriteria: "- P95 latency < 200ms (current: 450ms)\n- User satisfaction score +0.5 points\n- No increase in error rate",
        outOfScope: "- Database migration (too risky)\n- Caching infrastructure changes",
      },
    };

    const selected = templates[template];
    setFormData({
      ...formData,
      title: selected.title,
      hypothesis: selected.hypothesis,
      successCriteria: selected.successCriteria,
      outOfScope: selected.outOfScope,
    });
    setCurrentStep("confirm");
  };

  const handleCreateDecision = () => {
    // In real app: POST to API
    console.log("Creating decision:", formData);
    router.push("/app");
  };

  const selectedProject = mockProjects.find((p) => p.id === formData.projectId);

  const messages = [
    {
      role: "assistant",
      content: "👋 Hi! Let's create a new decision cycle. Which project is this for?",
      visible: true,
    },
    {
      role: "assistant",
      content: (
        <div className="space-y-2">
          <p className="mb-3">Choose a project:</p>
          {mockProjects.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => {
                setFormData({ ...formData, projectId: project.id });
                setCurrentStep("title");
              }}
              className="block w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-primary hover-lift transition-smooth"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{idx + 1}. {project.name}</div>
                  <div className="text-xs text-neutral-500">{project.cycleCount} decisions</div>
                </div>
                {project.githubConnection && (
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                    Connected
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      ),
      visible: currentStep === "project",
    },
    {
      role: "user",
      content: selectedProject?.name || "",
      visible: formData.projectId !== "" && currentStep !== "project",
    },
    {
      role: "assistant",
      content: "Perfect! What decision are you trying to make? Give it a short title.",
      visible: currentStep !== "project" && (currentStep !== "title" || formData.title === ""),
    },
    {
      role: "assistant",
      content: (
        <div className="space-y-2">
          <p className="mb-3">Or use a quick template:</p>
          <button
            onClick={() => handleQuickTemplate("ab_test")}
            className="block w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-primary hover-lift transition-smooth"
          >
            <div className="font-semibold">🧪 A/B Test Template</div>
            <div className="text-xs text-neutral-500">Compare two variations, measure conversion</div>
          </button>
          <button
            onClick={() => handleQuickTemplate("feature")}
            className="block w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-primary hover-lift transition-smooth"
          >
            <div className="font-semibold">✨ New Feature Template</div>
            <div className="text-xs text-neutral-500">Launch new functionality, validate adoption</div>
          </button>
          <button
            onClick={() => handleQuickTemplate("perf")}
            className="block w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-primary hover-lift transition-smooth"
          >
            <div className="font-semibold">⚡ Performance Improvement Template</div>
            <div className="text-xs text-neutral-500">Optimize speed, measure impact</div>
          </button>
        </div>
      ),
      visible: currentStep === "title" && formData.title === "",
    },
    {
      role: "user",
      content: formData.title,
      visible: formData.title !== "" && currentStep !== "title",
    },
    {
      role: "assistant",
      content: "Great! Now describe your hypothesis. What do you believe will happen?",
      visible: currentStep === "hypothesis" && formData.hypothesis === "",
    },
    {
      role: "assistant",
      content: (
        <div className="text-xs text-neutral-500 italic mt-2">
          Example: "Simplifying signup from 5 steps to 2 will increase completion from 45% to 65%"
        </div>
      ),
      visible: currentStep === "hypothesis" && formData.hypothesis === "",
    },
    {
      role: "user",
      content: formData.hypothesis,
      visible: formData.hypothesis !== "" && currentStep !== "hypothesis",
    },
    {
      role: "assistant",
      content: "Excellent! How will you know if you're right? What are your success criteria?",
      visible: currentStep === "criteria" && formData.successCriteria === "",
    },
    {
      role: "assistant",
      content: (
        <div className="text-xs text-neutral-500 italic mt-2">
          Example: "- Signup completion ≥ 65%\n- Time to complete reduces by 50%\n- No increase in support tickets"
        </div>
      ),
      visible: currentStep === "criteria" && formData.successCriteria === "",
    },
    {
      role: "user",
      content: formData.successCriteria,
      visible: formData.successCriteria !== "" && currentStep !== "criteria",
    },
    {
      role: "assistant",
      content: "Almost done! What's explicitly out of scope for this experiment?",
      visible: currentStep === "scope" && formData.outOfScope === "",
    },
    {
      role: "assistant",
      content: (
        <div className="text-xs text-neutral-500 italic mt-2">
          Example: "- Social login (separate experiment)\n- Mobile app (web only for now)"
        </div>
      ),
      visible: currentStep === "scope" && formData.outOfScope === "",
    },
    {
      role: "user",
      content: formData.outOfScope,
      visible: formData.outOfScope !== "" && currentStep !== "scope",
    },
    {
      role: "assistant",
      content: (
        <div className="space-y-4">
          <p className="font-semibold">Perfect! Here's your decision cycle:</p>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Project</h3>
              <p className="text-neutral-900">{selectedProject?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Decision Title</h3>
              <p className="text-neutral-900">{formData.title}</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Hypothesis</h3>
              <p className="text-neutral-900">{formData.hypothesis}</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Success Criteria</h3>
              <pre className="whitespace-pre-wrap text-neutral-800 font-sans text-sm">{formData.successCriteria}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Out of Scope</h3>
              <pre className="whitespace-pre-wrap text-neutral-600 font-sans text-sm">{formData.outOfScope}</pre>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateDecision}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift transition-smooth shadow-sm"
            >
              ✓ Create Decision Cycle
            </button>
            <button
              onClick={() => {
                setCurrentStep("title");
                setFormData({
                  projectId: formData.projectId,
                  title: "",
                  hypothesis: "",
                  successCriteria: "",
                  outOfScope: "",
                });
              }}
              className="px-6 py-3 bg-white border-2 border-neutral-300 rounded-lg font-semibold hover:border-primary transition-smooth"
            >
              ← Start Over
            </button>
          </div>
        </div>
      ),
      visible: currentStep === "confirm",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-editorial">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <h1 className="text-xl font-bold">Decision OS</h1>
            </Link>
            <span className="text-sm text-neutral-600">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Decision Cycle</h1>
          <p className="text-neutral-600">
            Let's structure your hypothesis and success criteria before you start building.
          </p>
        </div>

        {/* Conversational Messages */}
        <div className="space-y-6 mb-24">
          {messages
            .filter((msg) => msg.visible)
            .map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-6 py-3"
                      : "bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-6 py-4"
                  }`}
                >
                  {typeof msg.content === "string" ? (
                    <p className={msg.role === "user" ? "text-sm" : ""}>{msg.content}</p>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed Bottom */}
        {currentStep !== "confirm" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-neutral-200 p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    currentStep === "project"
                      ? "Type project name or number..."
                      : currentStep === "title"
                      ? "e.g., Test new onboarding flow..."
                      : currentStep === "hypothesis"
                      ? "e.g., Simplifying signup will increase..."
                      : currentStep === "criteria"
                      ? "e.g., - Conversion ≥ 65%..."
                      : "e.g., - Social login (Phase 2)..."
                  }
                  className="flex-1 px-6 py-4 border-2 border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover-lift transition-smooth shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <div className="mt-2 text-xs text-neutral-500 text-center">
                Press Enter to send • Type naturally, we'll guide you through
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
