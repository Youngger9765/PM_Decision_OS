"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getMockCycle } from "@/lib/mock-data";

export default function CycleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router]);

  if (!user) return null;

  const cycle = getMockCycle(params.id as string);
  if (!cycle) return <div>Cycle not found</div>;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFTING":
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "💡", label: "Drafting" };
      case "EXECUTING":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "🔬", label: "Executing" };
      case "REVIEW":
        return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", icon: "📊", label: "Review" };
      case "OUTCOME":
        return { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-800", icon: "🎯", label: "Outcome" };
      case "CLOSED":
        return { bg: "bg-neutral-50", border: "border-neutral-200", text: "text-neutral-600", icon: "✅", label: "Closed" };
      default:
        return { bg: "bg-neutral-50", border: "border-neutral-200", text: "text-neutral-600", icon: "📄", label: status };
    }
  };

  const statusConfig = getStatusConfig(cycle.status);

  // Determine phase completion states
  const phases = {
    hypothesis: cycle.hypothesis.lockedAt !== null,
    evidence: ["EXECUTING", "REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status),
    review: cycle.review !== null,
    outcome: cycle.outcome !== null,
  };

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
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link href="/app" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors">
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>

        {/* Decision Header */}
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{cycle.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-neutral-600">
                  <span>📁</span>
                  <span>{cycle.projectName}</span>
                </span>
                <span className="flex items-center gap-2 text-neutral-600">
                  <span>👤</span>
                  <span>{cycle.ownerName}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-full text-sm font-semibold`}>
                <span className="text-lg">{statusConfig.icon}</span>
                {statusConfig.label}
              </span>
              <span className="text-xs text-neutral-500">
                Updated {cycle.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Story */}
        <div className="relative">
          {/* Timeline Connector Line */}
          <div className="absolute left-[31px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-amber-400 via-blue-400 via-purple-400 to-teal-400"></div>

          {/* Phase 1: Hypothesis Definition */}
          <div className="relative mb-12">
            <div className="flex gap-6">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  phases.hypothesis
                    ? "bg-amber-100 border-2 border-amber-400"
                    : "bg-neutral-100 border-2 border-neutral-300"
                }`}>
                  💡
                </div>
                {phases.hypothesis && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white border-2 border-neutral-200 rounded-xl p-6 hover-lift transition-smooth">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Hypothesis Definition</h2>
                  {cycle.hypothesis.lockedAt && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
                      🔒 Locked {cycle.hypothesis.lockedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Hypothesis</h3>
                    <p className="text-neutral-900 leading-relaxed">{cycle.hypothesis.hypothesis}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Success Criteria</h3>
                    <pre className="whitespace-pre-wrap text-neutral-800 font-sans text-sm leading-relaxed">{cycle.hypothesis.successCriteria}</pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Out of Scope</h3>
                    <pre className="whitespace-pre-wrap text-neutral-600 font-sans text-sm leading-relaxed">{cycle.hypothesis.outOfScope}</pre>
                  </div>

                  {!cycle.hypothesis.lockedAt && (
                    <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                      Lock Hypothesis & Start Execution
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Execution & Evidence */}
          <div className="relative mb-12">
            <div className="flex gap-6">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  phases.evidence
                    ? "bg-blue-100 border-2 border-blue-400"
                    : "bg-neutral-100 border-2 border-neutral-300 opacity-50"
                }`}>
                  🔬
                </div>
                {phases.evidence && cycle.status !== "EXECUTING" && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                {cycle.status === "EXECUTING" && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    ⏳
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-white border-2 rounded-xl p-6 transition-smooth ${
                phases.evidence
                  ? "border-neutral-200 hover-lift"
                  : "border-neutral-200 opacity-50"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Execution & Evidence</h2>
                  {cycle.evidence.length > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      📎 {cycle.evidence.length} evidence collected
                    </span>
                  )}
                </div>

                {!phases.evidence ? (
                  <p className="text-neutral-500 text-sm">
                    Evidence collection starts after locking hypothesis. GitHub workflows will auto-collect CI runs, deployments, and preview URLs.
                  </p>
                ) : cycle.evidence.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No evidence collected yet. Evidence will appear here automatically from GitHub workflows.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cycle.evidence.map((ev) => (
                      <div key={ev.id} className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              ev.type === "CI_RUN" ? "bg-blue-100 text-blue-800" :
                              ev.type === "PREVIEW_URL" ? "bg-purple-100 text-purple-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {ev.type}
                            </span>
                            {ev.status && (
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                ev.conclusion === "success" ? "bg-green-100 text-green-800" :
                                ev.conclusion === "failure" ? "bg-red-100 text-red-800" :
                                "bg-amber-100 text-amber-800"
                              }`}>
                                {ev.conclusion || ev.status}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-500">{ev.createdAt.toLocaleString()}</span>
                        </div>
                        <a
                          href={ev.referenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-mono text-xs break-all"
                        >
                          {ev.referenceUrl}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3: Decision Review */}
          <div className="relative mb-12">
            <div className="flex gap-6">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  phases.review
                    ? "bg-purple-100 border-2 border-purple-400"
                    : "bg-neutral-100 border-2 border-neutral-300 opacity-50"
                }`}>
                  📊
                </div>
                {phases.review && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                {cycle.status === "REVIEW" && !phases.review && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    ⏳
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-white border-2 rounded-xl p-6 transition-smooth ${
                ["REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status)
                  ? "border-neutral-200 hover-lift"
                  : "border-neutral-200 opacity-50"
              }`}>
                <h2 className="text-xl font-bold mb-4">Decision Review</h2>

                {!["REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status) ? (
                  <p className="text-neutral-500 text-sm">
                    Review phase begins after collecting evidence. Compare evidence against success criteria to validate hypothesis.
                  </p>
                ) : cycle.review ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Verdict</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        cycle.review.verdict === "VALIDATED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {cycle.review.verdict}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Analysis</h3>
                      <p className="text-neutral-800 leading-relaxed">{cycle.review.comment}</p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Reviewed {cycle.review.createdAt.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-neutral-600 text-sm mb-4">Compare evidence against success criteria. Was the hypothesis validated?</p>
                    <div>
                      <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-3">Verdict</label>
                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                          ✓ VALIDATED
                        </button>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                          ✗ NOT VALIDATED
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Analysis</label>
                      <textarea
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                        placeholder="Explain your verdict based on the evidence collected..."
                      />
                    </div>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 4: Decision Outcome */}
          <div className="relative">
            <div className="flex gap-6">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  phases.outcome
                    ? "bg-teal-100 border-2 border-teal-400"
                    : "bg-neutral-100 border-2 border-neutral-300 opacity-50"
                }`}>
                  🎯
                </div>
                {phases.outcome && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                {cycle.status === "OUTCOME" && !phases.outcome && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    ⏳
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-white border-2 rounded-xl p-6 transition-smooth ${
                ["OUTCOME", "CLOSED"].includes(cycle.status)
                  ? "border-neutral-200 hover-lift"
                  : "border-neutral-200 opacity-50"
              }`}>
                <h2 className="text-xl font-bold mb-4">Decision Outcome</h2>

                {!["OUTCOME", "CLOSED"].includes(cycle.status) ? (
                  <p className="text-neutral-500 text-sm">
                    Final decision stage. Based on review, decide whether to proceed, iterate, or stop.
                  </p>
                ) : cycle.outcome ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Decision</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        cycle.outcome.outcome === "PROCEED" ? "bg-teal-100 text-teal-800" :
                        cycle.outcome.outcome === "ITERATE" ? "bg-amber-100 text-amber-800" :
                        "bg-neutral-100 text-neutral-800"
                      }`}>
                        {cycle.outcome.outcome}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Notes</h3>
                      <p className="text-neutral-800 leading-relaxed">{cycle.outcome.notes}</p>
                    </div>
                    {cycle.outcome.githubIssueUrl && (
                      <div>
                        <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Related Issue</h3>
                        <a
                          href={cycle.outcome.githubIssueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-mono text-sm"
                        >
                          <span>🔗</span>
                          <span className="break-all">{cycle.outcome.githubIssueUrl}</span>
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-neutral-500">
                      Decided {cycle.outcome.createdAt.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-neutral-600 text-sm mb-4">Based on the review, what should happen next?</p>
                    <div>
                      <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-3">Decision</label>
                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                          → PROCEED
                        </button>
                        <button className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                          ↻ ITERATE
                        </button>
                        <button className="px-6 py-2 bg-neutral-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                          ■ STOP
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">Notes</label>
                      <textarea
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={4}
                        placeholder="Document your decision, next steps, and lessons learned..."
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">GitHub Issue URL (optional)</label>
                      <input
                        type="url"
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://github.com/org/repo/issues/123"
                      />
                    </div>
                    <button className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                      Submit Outcome & Close Cycle
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decision Closed Banner */}
        {cycle.status === "CLOSED" && (
          <div className="mt-12 bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-xl font-bold text-teal-900 mb-2">Decision Cycle Closed</h3>
            <p className="text-teal-700 text-sm">
              This decision has been completed and archived. All evidence and learnings are preserved for future reference.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
