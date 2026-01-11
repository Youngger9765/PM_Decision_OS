"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getMockCycle } from "@/lib/mock-data";

type Tab = "hypothesis" | "evidence" | "review" | "outcome" | "history";

export default function CycleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("hypothesis");

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFTING": return "bg-amber-100 text-amber-800";
      case "EXECUTING": return "bg-blue-100 text-blue-800";
      case "REVIEW": return "bg-purple-100 text-purple-800";
      case "OUTCOME": return "bg-teal-100 text-teal-800";
      case "CLOSED": return "bg-neutral-100 text-neutral-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  const tabs = [
    { id: "hypothesis" as Tab, label: "Hypothesis", enabled: true },
    { id: "evidence" as Tab, label: "Evidence", enabled: ["EXECUTING", "REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status) },
    { id: "review" as Tab, label: "Review", enabled: ["REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status) },
    { id: "outcome" as Tab, label: "Outcome", enabled: ["OUTCOME", "CLOSED"].includes(cycle.status) },
    { id: "history" as Tab, label: "History", enabled: true },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-3 hover:opacity-80">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-md"></div>
              <h1 className="text-xl font-semibold">Decision OS</h1>
            </Link>
            <span className="text-sm text-neutral-600">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/app" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{cycle.title}</h1>
              <div className="flex items-center gap-3">
                <span className="text-neutral-600">{cycle.projectName}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cycle.status)}`}>
                  {cycle.status}
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-neutral-600">
              <div>Owner: {cycle.ownerName}</div>
              <div>Updated: {cycle.updatedAt.toLocaleDateString()}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.enabled && setActiveTab(tab.id)}
                  disabled={!tab.enabled}
                  className={`
                    pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? "border-teal-600 text-teal-600"
                      : tab.enabled
                        ? "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                        : "border-transparent text-neutral-400 cursor-not-allowed"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8">
          {activeTab === "hypothesis" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Hypothesis Definition</h2>
                {cycle.hypothesis.lockedAt && (
                  <div className="mb-4 px-4 py-2 bg-teal-50 border border-teal-200 rounded-md flex items-center gap-2">
                    <span className="text-teal-800 font-medium">🔒 Locked</span>
                    <span className="text-sm text-teal-700">
                      This hypothesis is locked and cannot be edited. Locked at {cycle.hypothesis.lockedAt.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Hypothesis</h3>
                <p className="text-neutral-700 leading-relaxed">{cycle.hypothesis.hypothesis}</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Success Criteria</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-neutral-700 font-sans">{cycle.hypothesis.successCriteria}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Out of Scope</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-neutral-700 font-sans">{cycle.hypothesis.outOfScope}</pre>
                </div>
              </div>

              {!cycle.hypothesis.lockedAt && (
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 text-sm font-medium">
                  Lock Hypothesis & Start Execution
                </button>
              )}
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Execution Evidence</h2>
              {cycle.evidence.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  No evidence collected yet. Evidence will appear here automatically from GitHub workflows.
                </div>
              ) : (
                <div className="space-y-4">
                  {cycle.evidence.map((ev) => (
                    <div key={ev.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            ev.type === "CI_RUN" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {ev.type}
                          </span>
                          {ev.status && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              ev.conclusion === "success" ? "bg-green-100 text-green-800" :
                              ev.conclusion === "failure" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {ev.conclusion || ev.status}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-neutral-500">{ev.createdAt.toLocaleString()}</span>
                      </div>
                      <a
                        href={ev.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-mono text-sm break-all"
                      >
                        {ev.referenceUrl}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "review" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Decision Review</h2>
              {cycle.review ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Verdict</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      cycle.review.verdict === "VALIDATED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {cycle.review.verdict}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Review Comment</h3>
                    <p className="text-neutral-700 leading-relaxed">{cycle.review.comment}</p>
                  </div>
                  <div className="text-sm text-neutral-500">
                    Reviewed at {cycle.review.createdAt.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-neutral-600">Review the evidence and determine if the hypothesis was validated.</p>
                  <div>
                    <label className="block font-semibold text-neutral-900 mb-2">Verdict</label>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                        VALIDATED
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium">
                        NOT VALIDATED
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-900 mb-2">Review Comment</label>
                    <textarea
                      className="w-full border border-neutral-300 rounded-md p-3 text-sm"
                      rows={4}
                      placeholder="Explain your verdict based on the evidence..."
                    />
                  </div>
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 text-sm font-medium">
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "outcome" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Decision Outcome</h2>
              {cycle.outcome ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Outcome</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      cycle.outcome.outcome === "PROCEED" ? "bg-teal-100 text-teal-800" :
                      cycle.outcome.outcome === "ITERATE" ? "bg-amber-100 text-amber-800" :
                      "bg-neutral-100 text-neutral-800"
                    }`}>
                      {cycle.outcome.outcome}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Notes</h3>
                    <p className="text-neutral-700 leading-relaxed">{cycle.outcome.notes}</p>
                  </div>
                  {cycle.outcome.githubIssueUrl && (
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">GitHub Issue</h3>
                      <a
                        href={cycle.outcome.githubIssueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-mono text-sm"
                      >
                        {cycle.outcome.githubIssueUrl}
                      </a>
                    </div>
                  )}
                  <div className="text-sm text-neutral-500">
                    Decided at {cycle.outcome.createdAt.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-neutral-600">Based on the review, decide the next action.</p>
                  <div>
                    <label className="block font-semibold text-neutral-900 mb-2">Outcome</label>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium">
                        PROCEED
                      </button>
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm font-medium">
                        ITERATE
                      </button>
                      <button className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 text-sm font-medium">
                        STOP
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-900 mb-2">Notes</label>
                    <textarea
                      className="w-full border border-neutral-300 rounded-md p-3 text-sm"
                      rows={4}
                      placeholder="Document your decision and next steps..."
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-900 mb-2">GitHub Issue URL (optional)</label>
                    <input
                      type="url"
                      className="w-full border border-neutral-300 rounded-md p-3 text-sm"
                      placeholder="https://github.com/org/repo/issues/123"
                    />
                  </div>
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 text-sm font-medium">
                    Submit Outcome
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Audit History</h2>
              <div className="text-center py-12 text-neutral-500">
                Audit events will be tracked here as the cycle progresses through different stages.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
