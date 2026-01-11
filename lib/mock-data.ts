// Mock data for MVP demo

// Type definitions (match Prisma schema)
export type DecisionCycleStatus = "DRAFTING" | "EXECUTING" | "REVIEW" | "OUTCOME" | "CLOSED";
export type ReviewVerdict = "VALIDATED" | "NOT_VALIDATED";
export type OutcomeDecision = "PROCEED" | "ITERATE" | "STOP";

export const mockProjects = [
  {
    id: "proj_1",
    name: "Mobile App Redesign",
    workspaceId: "ws_1",
    githubConnection: {
      repoOwner: "acme-corp",
      repoName: "mobile-app",
      connected: true
    },
    cycleCount: 3,
    updatedAt: new Date("2026-01-10")
  },
  {
    id: "proj_2",
    name: "Payment Integration",
    workspaceId: "ws_1",
    githubConnection: {
      repoOwner: "acme-corp",
      repoName: "payment-service",
      connected: true
    },
    cycleCount: 5,
    updatedAt: new Date("2026-01-09")
  },
  {
    id: "proj_3",
    name: "Analytics Dashboard",
    workspaceId: "ws_1",
    githubConnection: null,
    cycleCount: 0,
    updatedAt: new Date("2026-01-08")
  }
];

export const mockCycles = [
  {
    id: "cycle_1",
    title: "Test new onboarding flow with simplified signup",
    projectId: "proj_1",
    projectName: "Mobile App Redesign",
    status: "CLOSED" as const,
    ownerUserId: "user_1",
    ownerName: "Demo User",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-10"),
    hypothesis: {
      hypothesis: "Simplifying the signup flow from 5 steps to 2 steps will increase signup completion rate from 45% to 65%.",
      successCriteria: "- Signup completion rate reaches 65% or higher\n- Time to complete signup reduces by 50%\n- User feedback score > 4.0/5.0",
      outOfScope: "- Social login integration (deferred to Phase 2)\n- Email verification improvements",
      lockedAt: new Date("2026-01-06")
    },
    evidence: [
      {
        id: "ev_1",
        type: "CI_RUN",
        referenceUrl: "https://github.com/acme-corp/mobile-app/actions/runs/123456",
        status: "completed",
        conclusion: "success",
        createdAt: new Date("2026-01-07")
      },
      {
        id: "ev_2",
        type: "PREVIEW_URL",
        referenceUrl: "https://preview-cycle-1.vercel.app",
        createdAt: new Date("2026-01-07")
      }
    ],
    review: {
      verdict: "VALIDATED" as const,
      comment: "A/B test results showed 68% completion rate (vs 45% baseline). User feedback averaged 4.3/5.0. Clear win.",
      createdAt: new Date("2026-01-09")
    },
    outcome: {
      outcome: "PROCEED" as const,
      notes: "Validated hypothesis. Rolling out to 100% of users. Next: implement social login in Phase 2.",
      githubIssueUrl: "https://github.com/acme-corp/mobile-app/issues/456",
      createdAt: new Date("2026-01-10")
    }
  },
  {
    id: "cycle_2",
    title: "Add Express Checkout option for returning customers",
    projectId: "proj_2",
    projectName: "Payment Integration",
    status: "REVIEW" as const,
    ownerUserId: "user_1",
    ownerName: "Demo User",
    createdAt: new Date("2026-01-08"),
    updatedAt: new Date("2026-01-10"),
    hypothesis: {
      hypothesis: "Adding 1-click Express Checkout for returning customers will increase checkout conversion by 20%.",
      successCriteria: "- Express Checkout used by 40%+ of returning customers\n- Checkout conversion increases from 72% to 86%\n- No increase in payment errors",
      outOfScope: "- Guest checkout improvements\n- Apple Pay / Google Pay integration",
      lockedAt: new Date("2026-01-09")
    },
    evidence: [
      {
        id: "ev_3",
        type: "CI_RUN",
        referenceUrl: "https://github.com/acme-corp/payment-service/actions/runs/789012",
        status: "completed",
        conclusion: "success",
        createdAt: new Date("2026-01-10")
      }
    ],
    review: null,
    outcome: null
  },
  {
    id: "cycle_3",
    title: "Migrate analytics from GA3 to GA4",
    projectId: "proj_3",
    projectName: "Analytics Dashboard",
    status: "EXECUTING" as const,
    ownerUserId: "user_1",
    ownerName: "Demo User",
    createdAt: new Date("2026-01-09"),
    updatedAt: new Date("2026-01-10"),
    hypothesis: {
      hypothesis: "Migrating to GA4 will maintain current analytics accuracy while adding enhanced event tracking.",
      successCriteria: "- All existing GA3 reports replicated in GA4\n- < 5% variance in key metrics\n- New custom events tracked successfully",
      outOfScope: "- BigQuery integration (Phase 2)\n- Custom dashboard redesign",
      lockedAt: new Date("2026-01-10")
    },
    evidence: [
      {
        id: "ev_4",
        type: "CI_RUN",
        referenceUrl: "https://github.com/acme-corp/analytics/actions/runs/345678",
        status: "in_progress",
        conclusion: null,
        createdAt: new Date("2026-01-10")
      }
    ],
    review: null,
    outcome: null
  },
  {
    id: "cycle_4",
    title: "Implement dark mode across dashboard",
    projectId: "proj_3",
    projectName: "Analytics Dashboard",
    status: "DRAFTING" as const,
    ownerUserId: "user_1",
    ownerName: "Demo User",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
    hypothesis: {
      hypothesis: "Adding dark mode will increase user session duration for power users by 15%.",
      successCriteria: "- 30%+ adoption rate within first week\n- Session duration increases for dark mode users\n- No accessibility regressions",
      outOfScope: "- Scheduled dark mode (auto-switch at sunset)\n- Custom color themes",
      lockedAt: null
    },
    evidence: [],
    review: null,
    outcome: null
  }
];

export function getMockCycle(id: string) {
  return mockCycles.find(c => c.id === id);
}

export function getMockProject(id: string) {
  return mockProjects.find(p => p.id === id);
}

export function getMockCyclesForProject(projectId: string) {
  return mockCycles.filter(c => c.projectId === projectId);
}

// North Star Metric Calculation
export interface NorthStarMetrics {
  validatedDecisionRate: number;  // Current rate
  trend: number;                  // Change vs last period
  breakdown: {
    validated: number;
    notValidated: number;
    pending: number;
    total: number;
  };
  history: {
    month: string;
    rate: number;
  }[];
}

export function calculateNorthStarMetrics(): NorthStarMetrics {
  const closedCycles = mockCycles.filter(c => c.status === "CLOSED");
  const validated = closedCycles.filter(c => c.review?.verdict === "VALIDATED").length;
  const notValidated = closedCycles.filter(c => c.review?.verdict === "NOT_VALIDATED").length;
  const pending = mockCycles.filter(c => c.status !== "CLOSED").length;
  const total = mockCycles.length;

  const currentRate = closedCycles.length > 0
    ? Math.round((validated / closedCycles.length) * 100)
    : 0;

  // Mock historical data (showing improvement trend)
  const history = [
    { month: "Oct 2025", rate: 45 },
    { month: "Nov 2025", rate: 58 },
    { month: "Dec 2025", rate: 67 },
    { month: "Jan 2026", rate: currentRate },
  ];

  // Calculate trend (vs previous month)
  const previousRate = history[history.length - 2].rate;
  const trend = currentRate - previousRate;

  return {
    validatedDecisionRate: currentRate,
    trend,
    breakdown: {
      validated,
      notValidated,
      pending,
      total,
    },
    history,
  };
}

// Learning Repository - Pattern Recognition
export type FailurePattern =
  | "HYPOTHESIS_TOO_OPTIMISTIC"
  | "UNDERESTIMATED_EFFORT"
  | "WRONG_SUCCESS_METRIC"
  | "IGNORED_USER_FEEDBACK"
  | "SCOPE_CREEP"
  | "INSUFFICIENT_EVIDENCE";

export interface LearningPattern {
  id: string;
  pattern: FailurePattern;
  label: string;
  description: string;
  occurrences: number;
  lastSeen: Date;
  examples: {
    cycleId: string;
    cycleTitle: string;
    lesson: string;
  }[];
  recommendation: string;
}

export interface LearningInsight {
  totalFailures: number;
  patternsIdentified: number;
  mostCommonPattern: LearningPattern;
  improvementRate: number; // % reduction in pattern occurrence
  topLessons: string[];
}

// Mock Learning Patterns
export const mockLearningPatterns: LearningPattern[] = [
  {
    id: "pattern_1",
    pattern: "HYPOTHESIS_TOO_OPTIMISTIC",
    label: "Overly Optimistic Hypotheses",
    description: "Setting unrealistic success criteria that couldn't be achieved",
    occurrences: 8,
    lastSeen: new Date("2025-12-15"),
    examples: [
      {
        cycleId: "cycle_historical_1",
        cycleTitle: "Redesign entire checkout flow",
        lesson: "Predicted 50% conversion increase, achieved only 12%. Reality check: incremental improvements work better."
      },
      {
        cycleId: "cycle_historical_2",
        cycleTitle: "New AI-powered search",
        lesson: "Expected 80% user adoption, got 23%. Users prefer familiar patterns over fancy features."
      }
    ],
    recommendation: "Use historical data to set realistic baselines. Add 20% buffer to effort estimates."
  },
  {
    id: "pattern_2",
    pattern: "UNDERESTIMATED_EFFORT",
    label: "Underestimated Engineering Effort",
    description: "Scope was larger than anticipated, causing missed deadlines",
    occurrences: 6,
    lastSeen: new Date("2025-11-28"),
    examples: [
      {
        cycleId: "cycle_historical_3",
        cycleTitle: "Real-time collaboration feature",
        lesson: "Estimated 2 weeks, took 8 weeks. WebSocket complexity underestimated."
      }
    ],
    recommendation: "Break large features into smaller decision cycles. Get engineering estimates before committing."
  },
  {
    id: "pattern_3",
    pattern: "WRONG_SUCCESS_METRIC",
    label: "Measuring the Wrong Thing",
    description: "Optimized for metrics that didn't reflect actual user value",
    occurrences: 5,
    lastSeen: new Date("2025-10-20"),
    examples: [
      {
        cycleId: "cycle_historical_4",
        cycleTitle: "Gamification badges",
        lesson: "Tracked badge collection rate (high), ignored actual user engagement (dropped 15%)."
      }
    ],
    recommendation: "Define both leading indicators AND lagging business outcomes. Watch for Goodhart's Law."
  },
  {
    id: "pattern_4",
    pattern: "IGNORED_USER_FEEDBACK",
    label: "Ignored Early User Signals",
    description: "Proceeded despite negative user feedback during beta",
    occurrences: 4,
    lastSeen: new Date("2025-09-10"),
    examples: [
      {
        cycleId: "cycle_historical_5",
        cycleTitle: "New navigation menu",
        lesson: "Beta users complained it was confusing. We shipped anyway. Had to rollback after 1 week."
      }
    ],
    recommendation: "Set clear thresholds: if >30% of beta users report confusion, iterate before full launch."
  },
];

export function getLearningInsights(): LearningInsight {
  const totalFailures = mockLearningPatterns.reduce((sum, p) => sum + p.occurrences, 0);
  const patternsIdentified = mockLearningPatterns.length;
  const mostCommonPattern = mockLearningPatterns.reduce((prev, current) =>
    current.occurrences > prev.occurrences ? current : prev
  );

  // Mock improvement rate (showing learning over time)
  const improvementRate = 34; // 34% reduction in pattern occurrences over 6 months

  const topLessons = [
    "Start with smaller scope, validate, then expand",
    "Get engineering estimates BEFORE writing hypothesis",
    "Define success metrics with finance/analytics team",
    "Set clear beta feedback thresholds (>30% negative = stop)",
    "Use historical data to reality-check optimistic predictions"
  ];

  return {
    totalFailures,
    patternsIdentified,
    mostCommonPattern,
    improvementRate,
    topLessons,
  };
}
