"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { mockProjects, mockCycles, calculateNorthStarMetrics } from "@/lib/mock-data";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"cards" | "list">("cards");

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push(`/${locale}/auth/login`);
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router, locale]);

  if (!user) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFTING":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: "💡",
          label: t('cycles.status.DRAFTING')
        };
      case "EXECUTING":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "🔬",
          label: t('cycles.status.EXECUTING')
        };
      case "REVIEW":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-800",
          icon: "📊",
          label: t('cycles.status.REVIEW')
        };
      case "OUTCOME":
        return {
          bg: "bg-teal-50",
          border: "border-teal-200",
          text: "text-teal-800",
          icon: "🎯",
          label: t('cycles.status.OUTCOME')
        };
      case "CLOSED":
        return {
          bg: "bg-neutral-50",
          border: "border-neutral-200",
          text: "text-neutral-600",
          icon: "✅",
          label: t('cycles.status.CLOSED')
        };
      default:
        return {
          bg: "bg-neutral-50",
          border: "border-neutral-200",
          text: "text-neutral-600",
          icon: "📄",
          label: status
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-editorial">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <h1 className="text-xl font-bold">{tCommon('appName')}</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/app/learning`} className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent-dark rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors">
                <span>🧠</span>
                <span>{tCommon('learning')}</span>
              </Link>
              <LanguageSwitcher />
              <span className="text-sm text-neutral-600">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("mockUser");
                  router.push(`/${locale}`);
                }}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {tCommon('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* North Star Metric */}
        <section className="mb-12">
          {(() => {
            const northStar = calculateNorthStarMetrics();
            const trendColor = northStar.trend >= 0 ? "text-success" : "text-error";
            const trendIcon = northStar.trend >= 0 ? "↑" : "↓";

            return (
              <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/20 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h2 className="text-xl font-bold text-neutral-900">{t('northStar.title')}</h2>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {t('northStar.description')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Current Rate */}
                  <div>
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                        {t('northStar.validatedDecisionRate')}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-bold text-primary">
                          {northStar.validatedDecisionRate}%
                        </span>
                        <span className={`text-2xl font-bold ${trendColor}`}>
                          {trendIcon} {Math.abs(northStar.trend)}%
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600 mt-2">
                        {t('northStar.validatedOf', { validated: northStar.breakdown.validated, total: northStar.breakdown.total })}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-neutral-200">
                        <div className="text-2xl font-bold text-success">{northStar.breakdown.validated}</div>
                        <div className="text-xs text-neutral-600">{t('northStar.breakdown.validated')}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-neutral-200">
                        <div className="text-2xl font-bold text-error">{northStar.breakdown.notValidated}</div>
                        <div className="text-xs text-neutral-600">{t('northStar.breakdown.notValidated')}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-neutral-200">
                        <div className="text-2xl font-bold text-info">{northStar.breakdown.pending}</div>
                        <div className="text-xs text-neutral-600">{t('northStar.breakdown.pending')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div>
                    <div className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
                      {t('northStar.learningCurve')}
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-neutral-200">
                      {/* Simple bar chart */}
                      <div className="space-y-3">
                        {northStar.history.map((item, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-neutral-600 font-medium">{item.month}</span>
                              <span className="text-neutral-900 font-bold">{item.rate}%</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                                style={{ width: `${item.rate}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-3 italic">
                      📈 {t('northStar.teamLearning', { from: northStar.history[0].rate, to: northStar.validatedDecisionRate })}
                    </div>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="mt-6 pt-6 border-t border-primary/20">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">💡</span>
                    <div className="text-sm text-neutral-700">
                      <strong>{t('northStar.whyMatters.title')}</strong> {t('northStar.whyMatters.description')}
                      <strong className="text-primary">{t('northStar.whyMatters.githubCant')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
            <div className="text-3xl font-bold text-neutral-900 mb-1">{mockProjects.length}</div>
            <div className="text-sm text-neutral-600">{t('stats.activeProjects')}</div>
          </div>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
            <div className="text-3xl font-bold text-neutral-900 mb-1">{mockCycles.length}</div>
            <div className="text-sm text-neutral-600">{t('stats.totalDecisions')}</div>
          </div>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
            <div className="text-3xl font-bold text-success mb-1">
              {mockCycles.filter(c => c.status === "CLOSED").length}
            </div>
            <div className="text-sm text-neutral-600">{t('stats.completed')}</div>
          </div>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
            <div className="text-3xl font-bold text-info mb-1">
              {mockCycles.filter(c => c.status === "EXECUTING").length}
            </div>
            <div className="text-sm text-neutral-600">{t('stats.inProgress')}</div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('projects.title')}</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover-lift transition-smooth shadow-sm">
              {t('projects.newProject')}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/app/projects/${project.id}`}
                className="group block bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary hover-lift transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                  {project.githubConnection ? (
                    <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full font-medium">
                      {t('projects.connected')}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                      {t('projects.notConnected')}
                    </span>
                  )}
                </div>
                {project.githubConnection && (
                  <p className="text-sm text-neutral-500 mb-3 font-mono">
                    {project.githubConnection.repoOwner}/{project.githubConnection.repoName}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 font-medium">{project.cycleCount} {t('projects.cycles')}</span>
                  <span className="text-neutral-400">{project.updatedAt.toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Decision Cycles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('cycles.title')}</h2>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1">
                <button
                  onClick={() => setView("cards")}
                  className={`px-3 py-1 text-sm font-medium rounded transition-smooth ${
                    view === "cards"
                      ? "bg-primary text-primary-foreground"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {t('cycles.views.cards')}
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1 text-sm font-medium rounded transition-smooth ${
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {t('cycles.views.list')}
                </button>
              </div>

              <button
                onClick={() => router.push(`/${locale}/app/cycles/new`)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover-lift transition-smooth shadow-sm"
              >
                {t('cycles.newCycle')}
              </button>
            </div>
          </div>

          {/* Card View */}
          {view === "cards" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCycles.map((cycle) => {
                const statusConfig = getStatusConfig(cycle.status);
                return (
                  <div
                    key={cycle.id}
                    onClick={() => router.push(`/${locale}/app/cycles/${cycle.id}`)}
                    className={`cursor-pointer bg-white border-2 ${statusConfig.border} rounded-xl p-6 hover-lift transition-smooth group`}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-full text-xs font-semibold`}>
                        <span>{statusConfig.icon}</span>
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {cycle.updatedAt.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {cycle.title}
                    </h3>

                    {/* Project */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-neutral-600">
                      <span>📁</span>
                      <span>{cycle.projectName}</span>
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{cycle.ownerName}</span>
                      </div>
                      {cycle.evidence && cycle.evidence.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span>📎</span>
                          <span>{cycle.evidence.length} {t('cycles.evidence')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      {t('cycles.columns.cycle')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      {t('cycles.columns.project')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      {t('cycles.columns.status')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      {t('cycles.columns.updated')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {mockCycles.map((cycle) => {
                    const statusConfig = getStatusConfig(cycle.status);
                    return (
                      <tr
                        key={cycle.id}
                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/${locale}/app/cycles/${cycle.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900">{cycle.title}</div>
                          <div className="text-xs text-neutral-500 mt-1">{cycle.ownerName}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{cycle.projectName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <span>{statusConfig.icon}</span>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {cycle.updatedAt.toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
