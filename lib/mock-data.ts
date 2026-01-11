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
