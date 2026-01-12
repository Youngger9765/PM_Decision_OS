"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { mockLearningPatterns, getLearningInsights } from "@/lib/mock-data";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LearningRepositoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('learning');
  const tCommon = useTranslations('common');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push(`/${locale}/auth/login`);
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router, locale]);

  if (!user) return null;

  const insights = getLearningInsights();

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case "HYPOTHESIS_TOO_OPTIMISTIC":
        return "🎯";
      case "UNDERESTIMATED_EFFORT":
        return "⏱️";
      case "WRONG_SUCCESS_METRIC":
        return "📊";
      case "IGNORED_USER_FEEDBACK":
        return "👂";
      case "SCOPE_CREEP":
        return "📈";
      case "INSUFFICIENT_EVIDENCE":
        return "🔍";
      default:
        return "💡";
    }
  };

  const getPatternColor = (occurrences: number) => {
    if (occurrences >= 7) return { bg: "bg-error/10", border: "border-error/30", text: "text-error" };
    if (occurrences >= 5) return { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning" };
    return { bg: "bg-info/10", border: "border-info/30", text: "text-info" };
  };

  return (
    <div className="min-h-screen bg-gradient-editorial">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}/app`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <h1 className="text-xl font-bold">{tCommon('appName')}</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/app`} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {tCommon('dashboard')}
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
        {/* Page Title */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧠</span>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
          </div>
          <p className="text-neutral-600">
            {t('description')}
          </p>
        </div>

        {/* Overview Stats */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-accent/10 via-primary/10 to-accent/10 border-2 border-primary/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Total Failures Learned From */}
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{insights.totalFailures}</div>
                <div className="text-sm text-neutral-600 font-medium">{t('stats.failuresAnalyzed')}</div>
                <div className="text-xs text-neutral-500 mt-1">{t('stats.failuresAnalyzedSub')}</div>
              </div>

              {/* Patterns Identified */}
              <div>
                <div className="text-5xl font-bold text-accent mb-2">{insights.patternsIdentified}</div>
                <div className="text-sm text-neutral-600 font-medium">{t('stats.patternsIdentified')}</div>
                <div className="text-xs text-neutral-500 mt-1">{t('stats.patternsIdentifiedSub')}</div>
              </div>

              {/* Improvement Rate */}
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-success">{insights.improvementRate}%</span>
                  <span className="text-2xl text-success">↓</span>
                </div>
                <div className="text-sm text-neutral-600 font-medium">{t('stats.improvementRate')}</div>
                <div className="text-xs text-neutral-500 mt-1">{t('stats.improvementRateSub')}</div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="mt-6 pt-6 border-t border-primary/20">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div className="text-sm text-neutral-700">
                  <strong>{t('stats.whyMatters.title')}</strong> {t('stats.whyMatters.description')}
                  <strong className="text-primary">{t('stats.whyMatters.githubCant')}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Failure Patterns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('patterns.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockLearningPatterns.map((pattern) => {
              const colors = getPatternColor(pattern.occurrences);
              return (
                <div
                  key={pattern.id}
                  className={`bg-white border-2 ${colors.border} rounded-xl p-6 hover-lift transition-smooth`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getPatternIcon(pattern.pattern)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{pattern.label}</h3>
                        <p className="text-xs text-neutral-500">{pattern.description}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-bold`}>
                      {pattern.occurrences}x
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                      {t('patterns.realExamples')}
                    </div>
                    <div className="space-y-2">
                      {pattern.examples.map((example, idx) => (
                        <div key={idx} className="bg-neutral-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-neutral-900 mb-1">
                            "{example.cycleTitle}"
                          </div>
                          <div className="text-xs text-neutral-600 italic">
                            {t('patterns.lesson')}: {example.lesson}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1">
                          {t('patterns.recommendation')}
                        </div>
                        <div className="text-sm text-neutral-700">{pattern.recommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Lessons Learned */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('lessons.title')}</h2>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
            <div className="space-y-4">
              {insights.topLessons.map((lesson, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-900 font-medium">{lesson}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Most Common Pattern Highlight */}
        <section>
          <div className="bg-gradient-to-r from-warning/10 to-error/10 border-2 border-warning/30 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{getPatternIcon(insights.mostCommonPattern.pattern)}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('mostCommon.title')}: {insights.mostCommonPattern.label}
                </h3>
                <p className="text-neutral-700 mb-4">{insights.mostCommonPattern.description}</p>
                <div className="bg-white/50 rounded-lg p-4 border border-warning/20">
                  <div className="text-sm font-semibold text-neutral-900 mb-2">{t('mostCommon.whatToDoNext')}:</div>
                  <p className="text-sm text-neutral-700">{insights.mostCommonPattern.recommendation}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-error">{insights.mostCommonPattern.occurrences}</div>
                <div className="text-xs text-neutral-600">{t('mostCommon.occurrences')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
