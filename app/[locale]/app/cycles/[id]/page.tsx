"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { getMockCycle } from "@/lib/mock-data";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface KeyResult {
  metric: string;
  target: string;
  baseline?: string;
  achieved?: number;
}

export default function CycleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('cycle');
  const tCommon = useTranslations('common');
  const [user, setUser] = useState<any>(null);
  const [krAchieved, setKrAchieved] = useState<{ [key: number]: number }>({});
  const [autoVerdict, setAutoVerdict] = useState<"VALIDATED" | "NOT_VALIDATED" | null>(null);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [isDraftExpanded, setIsDraftExpanded] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push(`/${locale}/auth/login`);
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router, locale]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  if (!user) return null;

  const cycle = getMockCycle(params.id as string);
  if (!cycle) return <div>Cycle not found</div>;

  const parseSuccessCriteriaToOKR = (criteriaText: string): KeyResult[] => {
    const lines = criteriaText.split('\n').filter(line => line.trim().startsWith('-'));
    return lines.map(line => {
      const cleaned = line.replace(/^-\s*/, '').trim();
      let metric = cleaned;
      let target = '';
      let baseline = undefined;

      const operators = ['≥', '>=', '≤', '<=', '>', '<', '='];
      for (const op of operators) {
        if (cleaned.includes(op)) {
          const parts = cleaned.split(op);
          metric = parts[0].trim();
          target = op + ' ' + parts[1].split('(')[0].trim();
          const baselineMatch = cleaned.match(/\(.*?baseline.*?(\d+\.?\d*%?)\)/i);
          if (baselineMatch) baseline = baselineMatch[1];
          break;
        }
      }

      if (!target) {
        const increaseMatch = cleaned.match(/(increases?|improves?|grows?)\s+(?:by\s+)?(\d+\.?\d*%?)/i);
        const decreaseMatch = cleaned.match(/(reduces?|decreases?|drops?)\s+(?:by\s+)?(\d+\.?\d*%?)/i);
        if (increaseMatch) target = '+' + increaseMatch[2];
        else if (decreaseMatch) target = '-' + decreaseMatch[2];
      }

      return { metric, target, baseline, achieved: undefined };
    });
  };

  const calculateKRAchievement = (keyResults: KeyResult[]): number => {
    const totalKRs = keyResults.length;
    if (totalKRs === 0) return 0;
    const achievedCount = Object.values(krAchieved).filter(val => val === 100).length;
    return Math.round((achievedCount / totalKRs) * 100);
  };

  const getAutoVerdict = (achievementRate: number): "VALIDATED" | "NOT_VALIDATED" => {
    return achievementRate >= 70 ? "VALIDATED" : "NOT_VALIDATED";
  };

  // Mock analytics data (simulates data from Analytics API)
  const getMockAnalyticsData = (cycleId: string) => {
    if (cycleId === "cycle_1") {
      return {
        keyResultsAnalysis: [
          {
            metric: "Signup completion rate reaches 65% or higher",
            target: "≥ 65%",
            actual: "68%",
            baseline: "45%",
            achieved: 100,
            status: "achieved" as const,
            reason: "Exceeded target: 68% vs 65% target (baseline was 45%)"
          },
          {
            metric: "Time to complete signup reduces by 50%",
            target: "-50%",
            actual: "-55%",
            baseline: "180s",
            achieved: 100,
            status: "achieved" as const,
            reason: "Reduced from 180s to 81s (-55%), exceeding -50% target"
          },
          {
            metric: "User feedback score > 4.0/5.0",
            target: "> 4.0",
            actual: "4.3/5.0",
            achieved: 100,
            status: "achieved" as const,
            reason: "User feedback averaged 4.3/5.0, above 4.0 threshold"
          }
        ],
        overallAchievement: 100,
        suggestedVerdict: "VALIDATED" as const,
        confidence: 95,
        draftAnalysis: `A/B test results exceeded all targets. Clear product-market fit validated.

**Key Findings:**
• Signup completion: 68% (target: 65%, baseline: 45%). Strong improvement of +23pp.
• Time to complete: Reduced from 180s to 81s (-55%), beating the -50% target.
• User feedback: Averaged 4.3/5.0, well above the 4.0 threshold.

**Overall:** 3/3 Key Results achieved (100%). The simplified 2-step flow resonates with users.

**Recommended Next Steps:**
1. Roll out to 100% of users immediately
2. Document learnings in onboarding best practices
3. Consider applying similar simplification to other flows
4. Plan Phase 2: Social login integration`,
        nextExperiment: {
          title: "Test social login integration (Google + Apple)",
          hypothesis: "Adding social login will further reduce signup time to under 30s",
          expectedImpact: "+15pp completion rate improvement"
        },
        risks: []
      };
    }

    if (cycleId === "cycle_2") {
      return {
        keyResultsAnalysis: [
          {
            metric: "Express Checkout used by 40%+ of returning customers",
            target: "40%+",
            actual: "23%",
            achieved: 0,
            status: "miss" as const,
            reason: "Adoption rate only 23% vs target 40%+"
          },
          {
            metric: "Checkout conversion increases from 72% to 86%",
            target: "86%",
            actual: "75%",
            baseline: "72%",
            achieved: 50,
            status: "partial" as const,
            reason: "Improved from 72% to 75%, but target was 86%"
          },
          {
            metric: "No increase in payment errors",
            target: "No increase",
            actual: "+0.2%",
            achieved: 100,
            status: "achieved" as const,
            reason: "Payment error rate increased slightly (+0.2%), technically a miss but minimal impact"
          }
        ],
        overallAchievement: 50,
        suggestedVerdict: "NOT_VALIDATED" as const,
        confidence: 85,
        draftAnalysis: `CI tests passed successfully, but business metrics fell short of targets.

**Key Findings:**
• Express Checkout adoption: Only 23% of returning customers used it (target: 40%+). This is a significant miss.
• Conversion rate: Improved from 72% to 75% (+3pp), but fell short of the 86% target.
• Payment errors: Minimal increase (+0.2%), acceptable.

**Overall:** 1.5/3 Key Results achieved (50%). The feature works technically but lacks product-market fit.

**Recommended Next Steps:**
1. Conduct user interviews to understand why Express Checkout adoption is low
2. Review UX/UI - is the feature visible enough?
3. Consider A/B testing different placements or messaging
4. Re-evaluate if 40% adoption target was realistic`,
        nextExperiment: {
          title: "A/B test prominent banner placement vs current subtle link",
          hypothesis: "Making Express Checkout more visible will increase adoption from 23% to 35%+",
          expectedImpact: "+12pp adoption improvement"
        },
        risks: [
          {
            level: "high" as const,
            issue: "Low adoption indicates users don't understand the value proposition",
            mitigation: "Add explainer tooltip or short demo video"
          },
          {
            level: "medium" as const,
            issue: "Target may have been too optimistic (40%+ is aggressive for new feature)",
            mitigation: "Review industry benchmarks for similar features"
          }
        ]
      };
    }

    if (cycleId === "cycle_3") {
      return {
        keyResultsAnalysis: [
          {
            metric: "All existing GA3 reports replicated in GA4",
            target: "100%",
            actual: "90%",
            achieved: 50,
            status: "partial" as const,
            reason: "27/30 reports migrated. 3 complex custom reports pending."
          },
          {
            metric: "< 5% variance in key metrics",
            target: "< 5%",
            actual: "3.2%",
            achieved: 100,
            status: "achieved" as const,
            reason: "Average variance across all metrics is 3.2%, within acceptable range"
          },
          {
            metric: "New custom events tracked successfully",
            target: "All events",
            actual: "8/10",
            achieved: 80,
            status: "partial" as const,
            reason: "8 out of 10 custom events tracking correctly. 2 need debugging."
          }
        ],
        overallAchievement: 77,
        suggestedVerdict: "VALIDATED" as const,
        confidence: 80,
        draftAnalysis: `Migration 77% complete with acceptable data accuracy. Minor cleanup needed.

**Key Findings:**
• Report migration: 90% done (27/30 reports). The 3 pending reports are complex custom dashboards.
• Data accuracy: 3.2% average variance across metrics, well within the < 5% target.
• Custom events: 8/10 working correctly. 2 events have tracking issues in production.

**Overall:** 2.3/3 Key Results achieved (77%). Core migration successful, minor polish remains.

**Recommended Next Steps:**
1. Complete remaining 3 custom report migrations (est. 2 days)
2. Debug the 2 failing custom events (checkout_completed, add_to_wishlist)
3. Run parallel GA3/GA4 tracking for 1 week to verify consistency
4. Plan Phase 2: BigQuery integration`,
        nextExperiment: {
          title: "Enable BigQuery integration for advanced analysis",
          hypothesis: "Direct BigQuery access will enable data science team to build predictive models",
          expectedImpact: "Unlock ML-driven personalization"
        },
        risks: [
          {
            level: "low" as const,
            issue: "3 custom reports still pending may have data discrepancies",
            mitigation: "Manual validation before marking as complete"
          }
        ]
      };
    }

    return null;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFTING":
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "💡", label: t('status.drafting') };
      case "EXECUTING":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "🔬", label: t('status.executing') };
      case "REVIEW":
        return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", icon: "📊", label: t('status.review') };
      case "OUTCOME":
        return { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-800", icon: "🎯", label: t('status.outcome') };
      case "CLOSED":
        return { bg: "bg-neutral-50", border: "border-neutral-200", text: "text-neutral-600", icon: "✅", label: t('status.closed') };
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
            <Link href={`/${locale}/app`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <h1 className="text-xl font-bold">{tCommon('appName')}</h1>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-sm text-neutral-600">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link href={`/${locale}/app`} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors">
          <span>←</span>
          <span>{tCommon('backToDashboard')}</span>
        </Link>

        {/* Two-column layout (main content + agent panel) */}
        <div className="flex gap-8 items-start">
          {/* Left Column: Main Content */}
          <div className="flex-1 min-w-0">

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
                {t('updated')} {cycle.updatedAt.toLocaleDateString()}
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
                  <h2 className="text-xl font-bold">{t('phase1.title')}</h2>
                  {cycle.hypothesis.lockedAt && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
                      🔒 {t('phase1.locked')} {cycle.hypothesis.lockedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">{t('phase1.hypothesis')}</h3>
                    <p className="text-neutral-900 leading-relaxed">{cycle.hypothesis.hypothesis}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">{t('phase1.successCriteria')}</h3>
                    <pre className="whitespace-pre-wrap text-neutral-800 font-sans text-sm leading-relaxed">{cycle.hypothesis.successCriteria}</pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">{t('phase1.outOfScope')}</h3>
                    <pre className="whitespace-pre-wrap text-neutral-600 font-sans text-sm leading-relaxed">{cycle.hypothesis.outOfScope}</pre>
                  </div>

                  {!cycle.hypothesis.lockedAt && (
                    <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                      {t('phase1.lockButton')}
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
                  <h2 className="text-xl font-bold">{t('phase2.title')}</h2>
                  {cycle.evidence.length > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      📎 {cycle.evidence.length} {t('phase2.evidenceCollected')}
                    </span>
                  )}
                </div>

                {!phases.evidence ? (
                  <p className="text-neutral-500 text-sm">
                    {t('phase2.notStarted')}
                  </p>
                ) : cycle.evidence.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    {t('phase2.noEvidence')}
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
                <h2 className="text-xl font-bold mb-4">{t('phase3.title')}</h2>

                {!["REVIEW", "OUTCOME", "CLOSED"].includes(cycle.status) ? (
                  <p className="text-neutral-500 text-sm">
                    {t('phase3.notStarted')}
                  </p>
                ) : cycle.review ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">{t('phase3.verdict')}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        cycle.review.verdict === "VALIDATED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {cycle.review.verdict === "VALIDATED" ? t('phase3.validated') : t('phase3.notValidated')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-2">{t('phase3.analysis')}</h3>
                      <p className="text-neutral-800 leading-relaxed">{cycle.review.comment}</p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {t('phase3.reviewed')} {cycle.review.createdAt.toLocaleString()}
                    </div>
                  </div>
                ) : (() => {
                  const keyResults = parseSuccessCriteriaToOKR(cycle.hypothesis.successCriteria);
                  const achievementRate = calculateKRAchievement(keyResults);
                  const suggestedVerdict = getAutoVerdict(achievementRate);

                  return (
                    <div className="space-y-6">
                      <p className="text-neutral-600 text-sm mb-4">Compare evidence against success criteria. Track Key Results achievement to auto-validate.</p>

                      {/* KR Tracking */}
                      {keyResults.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-neutral-700 text-sm uppercase tracking-wide">Key Results Tracking</h3>
                          <div className="space-y-3">
                            {keyResults.map((kr, idx) => (
                              <div key={idx} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex-1">
                                    <div className="font-medium text-neutral-900 mb-1">{kr.metric}</div>
                                    <div className="flex items-center gap-3 text-sm">
                                      <span className="text-neutral-500">Target: <span className="font-semibold text-success">{kr.target}</span></span>
                                      {kr.baseline && (
                                        <span className="text-neutral-500">Baseline: <span className="font-semibold">{kr.baseline}</span></span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs text-neutral-600 font-medium">Achieved:</label>
                                    <select
                                      value={krAchieved[idx] || 0}
                                      onChange={(e) => {
                                        const newKrAchieved = { ...krAchieved, [idx]: parseInt(e.target.value) };
                                        setKrAchieved(newKrAchieved);
                                      }}
                                      className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                      <option value={0}>0% ✗</option>
                                      <option value={100}>100% ✓</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Achievement Summary */}
                          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-1">Overall Achievement</div>
                                <div className="text-4xl font-bold text-primary">{achievementRate}%</div>
                                <div className="text-xs text-neutral-600 mt-1">
                                  {Object.values(krAchieved).filter(v => v === 100).length} of {keyResults.length} KRs achieved
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${suggestedVerdict === "VALIDATED" ? "text-success" : "text-error"}`}>
                                  {suggestedVerdict === "VALIDATED" ? "✓ VALIDATED" : "✗ NOT VALIDATED"}
                                </div>
                                <div className="text-xs text-neutral-600 mt-1">Auto-suggested (≥70% = validated)</div>
                              </div>
                            </div>

                            {achievementRate < 70 && achievementRate > 0 && (
                              <div className="pt-4 border-t border-primary/20 flex items-start gap-2 text-sm text-neutral-700">
                                <span>💡</span>
                                <span>Need {Math.ceil((70 - achievementRate) / (100 / keyResults.length))} more KR(s) to reach 70% threshold for validation.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Manual Verdict Override */}
                      <div>
                        <label className="block font-semibold text-neutral-700 text-sm uppercase tracking-wide mb-3">
                          Final Verdict {keyResults.length > 0 && <span className="text-neutral-500 font-normal">(or override auto-suggestion)</span>}
                        </label>
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
                          value={analysisText}
                          onChange={(e) => setAnalysisText(e.target.value)}
                          className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={8}
                          placeholder={keyResults.length > 0
                            ? `Based on ${achievementRate}% achievement rate, explain your verdict...`
                            : "Explain your verdict based on the evidence collected..."
                          }
                        />
                      </div>

                      <button className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold hover-lift transition-smooth shadow-sm">
                        Submit Review
                      </button>
                    </div>
                  );
                })()}
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

          </div>
          {/* End of Left Column */}

          {/* Right Column: AI Review Assistant (only show in REVIEW status) */}
          {cycle.status === "REVIEW" && !cycle.review && (() => {
            const agentData = getMockAnalyticsData(params.id as string);
            if (!agentData) return null;

            const handleAutoFillAll = () => {
              const newKrAchieved: { [key: number]: number } = {};
              agentData.keyResultsAnalysis.forEach((kr, idx) => {
                newKrAchieved[idx] = kr.achieved;
              });
              setKrAchieved(newKrAchieved);
              setShowSuccessToast("✓ All Key Results filled!");
            };

            const handleUseDraftAnalysis = () => {
              setAnalysisText(agentData.draftAnalysis);
              setShowSuccessToast("✓ Draft analysis inserted!");
            };

            return (
              <div className="w-96 flex-shrink-0">
                <div className="sticky top-24 bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg">
                  {/* Success Toast */}
                  {showSuccessToast && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2 text-sm text-green-800 font-semibold">
                        <span>{showSuccessToast}</span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-purple-200">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold text-lg">Review Assistant</h3>
                      <p className="text-xs text-neutral-500">AI-powered decision analysis</p>
                    </div>
                  </div>

                  {/* Analyzing Status */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                      <div className="relative">
                        <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></div>
                        <div className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></div>
                      </div>
                      <span className="font-medium">Analyzing evidence...</span>
                    </div>
                  </div>

                  {/* Key Results Analysis */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">Data Extracted</h4>
                    <div className="space-y-3">
                      {agentData.keyResultsAnalysis.map((kr, idx) => (
                        <div key={idx} className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
                          <div className="text-xs font-semibold text-neutral-600 mb-1">KR {idx + 1}</div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-neutral-900 mb-1 leading-tight">
                                {kr.metric.split(' ').slice(0, 6).join(' ')}...
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-neutral-500">📈 Actual: <span className="font-bold text-blue-700">{kr.actual}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-neutral-500">🎯 Target: <span className="font-bold text-success">{kr.target}</span></span>
                              </div>
                            </div>
                            <div className={`text-xl ${
                              kr.status === "achieved" ? "text-success" :
                              kr.status === "partial" ? "text-warning" :
                              "text-error"
                            }`}>
                              {kr.status === "achieved" ? "✓" : kr.status === "partial" ? "~" : "✗"}
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            kr.status === "achieved" ? "bg-success/10 text-success" :
                            kr.status === "partial" ? "bg-warning/10 text-warning" :
                            "bg-error/10 text-error"
                          }`}>
                            Achievement: {kr.achieved}% {kr.status === "achieved" ? "(met)" : kr.status === "partial" ? "(partial)" : "(miss)"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall Summary */}
                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Overall</div>
                        <div className="text-2xl font-bold text-purple-700">{agentData.overallAchievement}%</div>
                        <div className="text-xs text-neutral-600">
                          {agentData.keyResultsAnalysis.filter(kr => kr.achieved === 100).length}/{agentData.keyResultsAnalysis.length} KRs achieved
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${agentData.suggestedVerdict === "VALIDATED" ? "text-success" : "text-error"}`}>
                          {agentData.suggestedVerdict === "VALIDATED" ? "✓ VALID" : "✗ NOT VALID"}
                        </div>
                        <div className="text-xs text-neutral-600">
                          Confidence: {agentData.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Draft Analysis Preview */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">💡 Draft Analysis</h4>
                      <button
                        onClick={() => setIsDraftExpanded(!isDraftExpanded)}
                        className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                      >
                        {isDraftExpanded ? "Collapse ▲" : "Expand ▼"}
                      </button>
                    </div>
                    <div className={`${isDraftExpanded ? "max-h-96" : "max-h-40"} overflow-y-auto bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-700 leading-relaxed transition-all duration-300`}>
                      {agentData.draftAnalysis.split('\n').map((line, idx) => (
                        <p key={idx} className="mb-1">{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Risk Warnings */}
                  {agentData.risks && agentData.risks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2">⚠️ Risk Warnings</h4>
                      <div className="space-y-2">
                        {agentData.risks.map((risk, idx) => (
                          <div key={idx} className={`border rounded-lg p-3 ${
                            risk.level === "high" ? "bg-red-50 border-red-200" :
                            risk.level === "medium" ? "bg-orange-50 border-orange-200" :
                            "bg-yellow-50 border-yellow-200"
                          }`}>
                            <div className="flex items-start gap-2 mb-1">
                              <span className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
                                risk.level === "high" ? "bg-red-200 text-red-800" :
                                risk.level === "medium" ? "bg-orange-200 text-orange-800" :
                                "bg-yellow-200 text-yellow-800"
                              }`}>
                                {risk.level}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-700 font-medium mb-1">{risk.issue}</p>
                            <p className="text-xs text-neutral-600">
                              <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Experiment Suggestion */}
                  {agentData.nextExperiment && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2">🔬 Suggested Next Experiment</h4>
                      <div className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-3">
                        <div className="text-sm font-bold text-teal-900 mb-1">
                          {agentData.nextExperiment.title}
                        </div>
                        <div className="text-xs text-neutral-700 mb-2">
                          <span className="font-semibold">Hypothesis:</span> {agentData.nextExperiment.hypothesis}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-neutral-600">Expected Impact:</span>
                          <span className="font-bold text-teal-700">{agentData.nextExperiment.expectedImpact}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAutoFillAll}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      ✨ Auto-fill All KRs
                    </button>
                    <button
                      onClick={handleUseDraftAnalysis}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      📝 Use Draft Analysis
                    </button>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 text-center">
                      AI-suggested. Please review and adjust before submitting.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        {/* End of Two-column layout */}

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
