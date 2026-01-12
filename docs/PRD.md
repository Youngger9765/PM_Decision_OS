# PRD: Decision OS - Product Decision Management System

**Date**: 2026-01-11 | **Last Updated**: 2026-01-12 | **Status**: Planning → Implementation

---

## Executive Summary

**Decision OS** is a SaaS platform that enables Product Managers to execute complete decision cycles (Hypothesis → Execution → Review → Outcome → Closure) without leaving the platform. The system integrates with GitHub to trigger workflows, collect evidence, and write back outcomes - all without reading, writing, or storing customer code.

**Target Users**: Product Managers, Engineering Leads, Product Teams
**Business Model**: Freemium SaaS with Stripe subscription (Starter/Pro)
**MVP Timeline**: V0 - Production-ready, demo-ready, revenue-ready

---

## Problem Statement

Product Managers currently need to:
- Manually track hypothesis → execution → review cycles across multiple tools
- Switch between GitHub, JIRA, Notion, Slack to manage product decisions
- Lack a unified view of decision outcomes and their impact
- Struggle to maintain decision audit trails

**Solution**: A single platform that orchestrates the entire decision lifecycle using GitHub as the execution engine.

---

## Product Vision

### Core Concept
Replace PDCA cycle terminology with product-native language:

| Decision OS | Traditional |
|-------------|-------------|
| Hypothesis Definition | Plan |
| Execution / Experiment | Do |
| Decision Review | Check |
| Decision Outcome | Action |
| Closure | Archive |

### Decision Outcomes
- **PROCEED**: Hypothesis validated, move forward
- **ITERATE**: Needs refinement, run another cycle
- **STOP**: Hypothesis invalidated, abandon

### Review Verdicts
- **VALIDATED**: Success criteria met
- **NOT_VALIDATED**: Success criteria not met

---

## User Stories

### Primary User Story
**As a** Product Manager
**I want** to define hypothesis, trigger execution, review evidence, and record outcomes in one place
**So that** I can maintain clear decision audit trails without context-switching across tools

### Supporting User Stories

1. **GitHub Integration**
   - **As a** PM, **I want** to connect my GitHub repo, **so that** I can trigger workflows from Decision OS

2. **Execution Tracking**
   - **As a** PM, **I want** to start execution and receive CI results automatically, **so that** I don't need to monitor GitHub

3. **Outcome Recording**
   - **As a** PM, **I want** to record outcomes and have them written back to GitHub, **so that** engineering teams see the decision context

4. **Billing**
   - **As a** startup founder, **I want** a free tier to try the product, **so that** I can validate value before paying

---

## Functional Requirements

### A. Workspace & Project Management

#### Workspace
- [ ] User can create/manage multiple workspaces (V0: default to 1 workspace, schema extensible)
- [ ] Workspace has OWNER and MEMBER roles
- [ ] Only workspace members can view projects

#### Project
- [ ] Project binds to exactly one GitHub repository
- [ ] Project stores: repo owner, repo name, installation metadata
- [ ] Project displays connection status (connected/disconnected)
- [ ] User can list all decision cycles within a project

---

### B. Decision Cycle Management

#### Core Entity: DecisionCycle
**Fields**: `id`, `title`, `owner_user_id`, `status`, `project_id`, `created_at`, `updated_at`

**Status Flow**:
```
DRAFTING → EXECUTING → REVIEW → OUTCOME → CLOSED
```

#### Hypothesis Definition
- [ ] User can define: hypothesis, success_criteria, out_of_scope
- [ ] Hypothesis is locked (`locked_at`) when execution starts
- [ ] User cannot edit hypothesis after execution begins

#### Execution Phase
- [ ] User clicks "Lock & Start Execution"
- [ ] System triggers GitHub workflow via `workflow_dispatch` API
- [ ] System passes inputs: `decision_cycle_id`, `branch` (default: `decisionos/{cycleId}`)
- [ ] System creates `ExecutionEvidence` record (type: CI_RUN, reference_url)

#### Evidence Collection
- [ ] System receives GitHub webhooks (`workflow_run.completed`)
- [ ] System validates webhook signature
- [ ] System updates ExecutionEvidence with: status, conclusion, html_url, run_id
- [ ] System transitions DecisionCycle status to REVIEW when workflow completes
- [ ] (Optional) System parses workflow outputs for preview_url

#### Review Phase
- [ ] User selects verdict: VALIDATED / NOT_VALIDATED
- [ ] User adds review comment
- [ ] System records `DecisionReview` with timestamp

#### Outcome Phase
- [ ] User selects outcome: PROCEED / ITERATE / STOP
- [ ] User adds outcome notes
- [ ] System writes back to GitHub:
   - If PR exists: comment on PR
   - Else: create Issue with title containing cycleId
- [ ] System records `DecisionOutcome`
- [ ] System transitions status to CLOSED

#### Audit Trail
- [ ] System records all state changes in `AuditEvent`
- [ ] User can view history tab with event timeline

---

### C. GitHub Integration

#### Authentication
- [ ] NextAuth with GitHub OAuth provider
- [ ] Request minimum required scopes: `repo`, `workflow`
- [ ] Store access token securely (server-side only, encrypted)

#### Workflow Trigger
- [ ] API wrapper: `triggerWorkflow(owner, repo, workflow_id, inputs)`
- [ ] Error handling: 404 (workflow not found), 403 (permission denied), rate limits
- [ ] Return: `run_id`, `run_url`

#### Webhook Endpoint
- [ ] Route: `POST /api/webhooks/github`
- [ ] Verify signature using `GITHUB_WEBHOOK_SECRET`
- [ ] Handle events:
   - `workflow_run.completed`: update ExecutionEvidence, transition status
   - (Optional) `check_suite.completed`
- [ ] Rate limiting: basic memory/upstash limiter
- [ ] Respond 200 OK even if event ignored

#### GitHub Write-back
- [ ] API wrapper: `createIssue(owner, repo, title, body)`
- [ ] API wrapper: `createComment(owner, repo, issue_number, body)`
- [ ] Find PR from webhook payload (if exists)
- [ ] Fallback to creating Issue if no PR

---

### D. Security & RBAC

#### Token Security
- [ ] GitHub tokens stored server-side only
- [ ] Tokens encrypted at rest (use encryption library or database feature)
- [ ] Tokens never exposed to client-side code
- [ ] Token refresh handling (if using GitHub App)

#### Access Control
- [ ] Workspace-level: OWNER can invite/remove members
- [ ] Project-level: only workspace members can view
- [ ] DecisionCycle: `owner_user_id` is responsible party (no complex permissions in V0)

#### Code Isolation
- [ ] System NEVER reads repository file contents
- [ ] System NEVER writes code to repositories
- [ ] System NEVER stores customer code
- [ ] System only calls: workflow APIs, issue APIs, comment APIs

#### Webhook Hardening
- [ ] Signature verification (HMAC-SHA256)
- [ ] Rate limiting (per IP or per repo)
- [ ] Validate payload schema before processing
- [ ] Log suspicious requests

---

### E. Billing & Subscription

#### Stripe Integration
- [ ] Test mode enabled via env var
- [ ] Two plans: Starter, Pro
- [ ] Stripe Checkout for subscription
- [ ] Stripe Customer Portal for management

#### Feature Gating
**Free Tier (no subscription)**:
- Max 1 Project
- Max 3 Decision Cycles
- Show upgrade prompt when limits reached

**Starter Plan**:
- Max 5 Projects
- Unlimited Decision Cycles

**Pro Plan**:
- Unlimited Projects
- Unlimited Decision Cycles

#### Webhook Handling
- [ ] Route: `POST /api/webhooks/stripe`
- [ ] Verify signature using `STRIPE_WEBHOOK_SECRET`
- [ ] Handle events:
   - `checkout.session.completed`: activate subscription
   - `customer.subscription.updated`: update status
   - `customer.subscription.deleted`: downgrade to free

#### Database
- [ ] `Subscription` table: user_id, stripe_customer_id, stripe_subscription_id, status, plan, current_period_end

---

## Non-Functional Requirements

### Performance
- [ ] Webhook response time < 500ms
- [ ] UI page load < 2s (first contentful paint)
- [ ] Database queries optimized (indexes on foreign keys)

### Security
- [ ] All API routes require authentication
- [ ] CSRF protection on forms
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (React default escaping + CSP headers)
- [ ] Rate limiting on public endpoints

### Reliability
- [ ] Webhook retry handling (GitHub retries failed webhooks)
- [ ] Database transaction for state changes
- [ ] Error logging (Sentry if `SENTRY_DSN` provided)

### Scalability (V0 targets)
- [ ] Support 100 concurrent users
- [ ] Support 1000 decision cycles
- [ ] Horizontal scaling via Vercel serverless

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Next.js 14+ (App Router) | SSR, API routes, modern DX |
| Language | TypeScript 5+ | Type safety, IDE support |
| Styling | TailwindCSS + shadcn/ui | Rapid UI, B2B design system |
| Auth | NextAuth.js (Auth.js) | GitHub OAuth, session management |
| Database | PostgreSQL (Supabase) | ACID, relational integrity, free tier |
| ORM | Prisma | Type-safe queries, migrations |
| Payments | Stripe | Industry standard, test mode |
| Hosting | Vercel | Zero-config, edge functions |
| Monitoring | Sentry (optional) | Error tracking |
| Email | Resend (optional) | Transactional emails |

### Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  workspaceMembers WorkspaceMember[]
  ownedCycles      DecisionCycle[]
  auditEvents      AuditEvent[]
  subscription     Subscription?
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members  WorkspaceMember[]
  projects Project[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  role        Role     @default(MEMBER)
  workspaceId String
  userId      String
  createdAt   DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

enum Role {
  OWNER
  MEMBER
}

model Project {
  id          String   @id @default(cuid())
  name        String
  workspaceId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace        Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  githubConnection GitHubConnection?
  decisionCycles   DecisionCycle[]
}

model GitHubConnection {
  id                String   @id @default(cuid())
  projectId         String   @unique
  repoOwner         String
  repoName          String
  installationId    String?
  accessToken       String   // encrypted
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model DecisionCycle {
  id          String              @id @default(cuid())
  title       String
  status      DecisionCycleStatus @default(DRAFTING)
  projectId   String
  ownerUserId String
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  project              Project               @relation(fields: [projectId], references: [id], onDelete: Cascade)
  owner                User                  @relation(fields: [ownerUserId], references: [id])
  hypothesisDefinition HypothesisDefinition?
  executionEvidences   ExecutionEvidence[]
  decisionReview       DecisionReview?
  decisionOutcome      DecisionOutcome?
  auditEvents          AuditEvent[]
}

enum DecisionCycleStatus {
  DRAFTING
  EXECUTING
  REVIEW
  OUTCOME
  CLOSED
}

model HypothesisDefinition {
  id              String   @id @default(cuid())
  decisionCycleId String   @unique
  hypothesis      String   @db.Text
  successCriteria String   @db.Text
  outOfScope      String?  @db.Text
  lockedAt        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  decisionCycle DecisionCycle @relation(fields: [decisionCycleId], references: [id], onDelete: Cascade)
}

model ExecutionEvidence {
  id              String        @id @default(cuid())
  decisionCycleId String
  type            EvidenceType
  referenceUrl    String?
  status          String?
  conclusion      String?
  metadata        Json?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  decisionCycle DecisionCycle @relation(fields: [decisionCycleId], references: [id], onDelete: Cascade)
}

enum EvidenceType {
  CI_RUN
  PREVIEW_URL
  ARTIFACT
}

model DecisionReview {
  id              String        @id @default(cuid())
  decisionCycleId String        @unique
  verdict         ReviewVerdict
  comment         String?       @db.Text
  createdAt       DateTime      @default(now())

  decisionCycle DecisionCycle @relation(fields: [decisionCycleId], references: [id], onDelete: Cascade)
}

enum ReviewVerdict {
  VALIDATED
  NOT_VALIDATED
}

model DecisionOutcome {
  id              String          @id @default(cuid())
  decisionCycleId String          @unique
  outcome         OutcomeType
  notes           String?         @db.Text
  githubIssueUrl  String?
  githubPrUrl     String?
  createdAt       DateTime        @default(now())

  decisionCycle DecisionCycle @relation(fields: [decisionCycleId], references: [id], onDelete: Cascade)
}

enum OutcomeType {
  PROCEED
  ITERATE
  STOP
}

model AuditEvent {
  id              String   @id @default(cuid())
  decisionCycleId String
  userId          String
  action          String
  metadata        Json?
  createdAt       DateTime @default(now())

  decisionCycle DecisionCycle @relation(fields: [decisionCycleId], references: [id], onDelete: Cascade)
  user          User          @relation(fields: [userId], references: [id])
}

model Subscription {
  id                   String            @id @default(cuid())
  userId               String            @unique
  stripeCustomerId     String            @unique
  stripeSubscriptionId String?           @unique
  status               SubscriptionStatus @default(INACTIVE)
  plan                 SubscriptionPlan?
  currentPeriodEnd     DateTime?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  INACTIVE
}

enum SubscriptionPlan {
  STARTER
  PRO
}
```

### API Structure

```
/app
  /(marketing)
    /page.tsx                 # Landing page
    /pricing/page.tsx         # Pricing page
  /(auth)
    /login/page.tsx           # Login page
  /app
    /page.tsx                 # Dashboard
    /projects/[id]/page.tsx   # Project detail
    /cycles/[id]/page.tsx     # Decision cycle detail

/app/api
  /auth/[...nextauth]/route.ts  # NextAuth
  /webhooks
    /github/route.ts            # GitHub webhook
    /stripe/route.ts            # Stripe webhook
  /projects/route.ts            # Project CRUD
  /cycles/route.ts              # Cycle CRUD
  /github
    /trigger/route.ts           # Trigger workflow
    /repos/route.ts             # List user repos

/lib
  /db/client.ts               # Prisma client
  /auth/config.ts             # NextAuth config
  /github
    /client.ts                # GitHub API wrapper
    /webhooks.ts              # Webhook handlers
  /stripe
    /client.ts                # Stripe SDK wrapper
    /webhooks.ts              # Webhook handlers
  /security
    /verify.ts                # Signature verification
    /ratelimit.ts             # Rate limiter
  /config/constants.ts        # App constants

/components
  /ui/*                       # shadcn/ui components
  /cycle/*                    # Cycle-specific components
  /project/*                  # Project-specific components
```

---

## UI/UX Requirements

### Internationalization (i18n)

**Status**: ✅ Implemented (2026-01-12)

#### Overview
Decision OS supports full bilingual functionality with Traditional Chinese (zh-TW) as the default locale and English (en) as an alternative.

#### Implementation Details
- **Library**: next-intl v4.7.0 (optimized for Next.js 14 App Router)
- **Routing Strategy**: Locale-aware URLs with `[locale]` dynamic segments
  - Traditional Chinese: `/zh-TW/...`
  - English: `/en/...`
  - Root URL automatically redirects to default locale `/zh-TW`
- **Locale Switching**: LanguageSwitcher component available in all page headers
- **Translation Coverage**: 300+ translation keys covering all UI text

#### Supported Pages (All Translated)
- [x] Landing page (`/[locale]/page.tsx`)
- [x] Auth login page (`/[locale]/auth/login/page.tsx`)
- [x] Dashboard (`/[locale]/app/page.tsx`)
- [x] Learning Repository (`/[locale]/app/learning/page.tsx`)
- [x] New Cycle form (`/[locale]/app/cycles/new/page.tsx`)
- [x] Cycle detail page (`/[locale]/app/cycles/[id]/page.tsx`)

#### Translation Key Structure
```typescript
{
  common: {
    appName, dashboard, logout, loading, save, cancel, delete, edit, back
  },
  landing: {
    hero: { title, subtitle, cta },
    howItWorks: { title, subtitle, phases },
    github: { title, description, features },
    jtbd: { title, subtitle, tasks },
    pricing: { title, starter, pro },
    footer: { builtFor, github }
  },
  auth: {
    login: { title, email, password, submit, errors }
  },
  dashboard: {
    title, northStar, projects, cycles
  },
  learning: {
    title, subtitle, stats, patterns, lessons
  },
  cycle: {
    backToDashboard, status, project, owner, updated,
    hypothesis, execution, review, outcome, agent
  },
  newCycle: {
    title, form: { project, cycleTitle, hypothesis, successCriteria, outOfScope }
  }
}
```

#### Technical Configuration
**i18n.ts**:
```typescript
export const locales = ['en', 'zh-TW'] as const;
export const defaultLocale = 'zh-TW' as const;

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
```

**Middleware** (`middleware.ts`):
- Automatic locale detection based on Accept-Language header
- Explicit locale prefix mode (`localePrefix: 'always'`)
- Cookie-based locale persistence (`NEXT_LOCALE`)

#### Adding New Translations
1. Add translation key to `messages/zh-TW.json` and `messages/en.json`
2. Use in component: `const t = useTranslations('section'); t('key')`
3. Update navigation links to include locale: `/${locale}/path`

#### Future Locales (Out of Scope for V0)
- Japanese (ja)
- Korean (ko)
- Simplified Chinese (zh-CN)

---

### Page Specifications

#### 1. Dashboard (`/app`)
**Elements**:
- Header with workspace switcher (V1 feature, V0 can omit)
- "New Project" button
- Project cards (3-column grid):
  - Project name
  - Repo connection status badge
  - Active cycles count
  - Last updated timestamp
- Recent Decision Cycles section:
  - Table: Title | Project | Status | Updated
  - Max 10 recent items

#### 2. Project Detail (`/app/projects/[id]`)
**Elements**:
- Breadcrumb: Dashboard > Project Name
- GitHub connection status:
  - If connected: repo link, disconnect button
  - If not: "Connect GitHub" button
- "New Decision Cycle" button
- Decision Cycles table:
  - Columns: Title | Owner | Status | Updated | Actions
  - Click row to open cycle detail

#### 3. Decision Cycle Detail (`/app/cycles/[id]`)
**Tabs**:

**Hypothesis Tab**:
- Form fields:
  - Title (text input)
  - Hypothesis (textarea)
  - Success Criteria (textarea)
  - Out of Scope (textarea, optional)
- Lock status indicator
- "Lock & Start Execution" button (disabled if already locked)

**Evidence Tab**:
- CI Run cards:
  - Status badge (success/failure/pending)
  - Run URL (link to GitHub)
  - Conclusion
  - Timestamp
- Preview URL cards (if available)
- Empty state if no evidence

**Review Tab**:
- Verdict selector: VALIDATED / NOT_VALIDATED
- Comment textarea
- "Submit Review" button
- Show existing review if submitted

**Outcome Tab**:
- Outcome selector: PROCEED / ITERATE / STOP
- Notes textarea
- "Record Outcome & Close" button
- Show GitHub links after submission

**History Tab**:
- Timeline of AuditEvents:
  - Icon | Action | User | Timestamp
  - Expandable metadata

### Design System
- **Colors**: Neutral palette (B2B SaaS aesthetic)
- **Typography**: Inter or similar sans-serif
- **Components**: shadcn/ui default styling
- **Status badges**: Green (success), Red (failure), Yellow (pending), Gray (closed)

---

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # Production: https://yourdomain.com
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth App
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# GitHub Webhooks
GITHUB_WEBHOOK_SECRET="your_webhook_secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."  # Use sk_live_... in production
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_STARTER="price_..."  # Stripe Price ID for Starter
STRIPE_PRICE_PRO="price_..."      # Stripe Price ID for Pro

# Optional
SENTRY_DSN="https://...@sentry.io/..."  # Error tracking
RESEND_API_KEY="re_..."                 # Transactional emails
```

---

## Acceptance Criteria

### Phase 1: Core Infrastructure (Week 1)
- [ ] Next.js project initialized with TypeScript, Tailwind, shadcn/ui
- [ ] Prisma schema defined and migrations created
- [ ] NextAuth GitHub login functional
- [ ] Database seed script (optional) creates sample data
- [ ] Landing page and login page deployed to Vercel

### Phase 2: GitHub Integration (Week 2)
- [ ] User can connect GitHub repo to project
- [ ] System can trigger workflow via `workflow_dispatch`
- [ ] Webhook endpoint receives `workflow_run.completed` events
- [ ] Webhook signature verification passes
- [ ] Evidence is created and displayed in UI

### Phase 3: Decision Cycle UI (Week 2)
- [ ] User can create Decision Cycle with hypothesis
- [ ] User can lock hypothesis and start execution
- [ ] User can view evidence in Evidence tab
- [ ] User can submit review verdict
- [ ] User can record outcome (PROCEED/ITERATE/STOP)
- [ ] System writes outcome to GitHub (Issue or PR comment)

### Phase 4: Billing (Week 3)
- [ ] Stripe Checkout creates subscription
- [ ] Stripe webhook updates subscription status
- [ ] Free tier limits enforced (1 project, 3 cycles)
- [ ] Upgrade prompt shown when limits reached
- [ ] Stripe Customer Portal accessible from settings

### Phase 5: Polish & Deploy (Week 3)
- [ ] README with complete setup instructions
- [ ] Error handling on all API routes
- [ ] Loading states on all async operations
- [ ] Mobile responsive (basic, not pixel-perfect)
- [ ] Production deploy to Vercel with custom domain

---

## Success Metrics

### MVP Success (V0)
- [ ] 10 beta users onboarded
- [ ] 50 decision cycles created
- [ ] 5 paid conversions (Starter or Pro)
- [ ] < 5% error rate on webhook processing
- [ ] Average cycle completion time < 24 hours

### Technical Metrics
- [ ] 95% uptime (Vercel SLA)
- [ ] < 2s page load time (Lighthouse score > 80)
- [ ] Zero data breaches
- [ ] Zero customer code leaks

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| GitHub API rate limits | High | Medium | Cache repo metadata, use conditional requests, implement retry backoff |
| Webhook delivery failures | Medium | Low | GitHub retries webhooks; log failures for manual review |
| Token security breach | Critical | Low | Encrypt tokens, server-side only, rotate on suspicion |
| Stripe webhook replay attacks | Medium | Low | Verify signature, idempotency keys, timestamp checks |
| Scope creep (over-engineering) | High | High | Strict MVP scope, defer V1 features, no microservices |

---

## Out of Scope (V0)

### Deferred to V1
- Multiple workspaces per user (schema ready, UI not built)
- Team collaboration features (comments, @mentions)
- Slack/Discord notifications
- Custom workflow templates
- Analytics dashboard (cycle success rates, time metrics)
- Email notifications (invite, receipt, reminders)
- Mobile app

### Never in Scope
- Reading customer code from repositories
- Writing code to customer repositories
- Storing customer code in Decision OS database
- Direct infrastructure access (servers, databases)
- AI/ML features (code analysis, suggestions)

---

## Implementation Plan

### Phase 1: Project Setup (Day 1-2)
- [ ] Initialize Next.js 14+ with TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configure Prisma with PostgreSQL (Neon/Supabase)
- [ ] Create Prisma schema
- [ ] Run initial migration
- [ ] Setup NextAuth with GitHub provider
- [ ] Create project structure (/app, /lib, /components)

### Phase 2: Core Models & Auth (Day 3-4)
- [ ] Implement User, Workspace, Project models
- [ ] Seed database with test data
- [ ] Build login page
- [ ] Build dashboard (projects list)
- [ ] Build project detail page
- [ ] Implement "Connect GitHub" flow (save repo)

### Phase 3: Decision Cycle CRUD (Day 5-6)
- [ ] Implement DecisionCycle model
- [ ] Build cycle creation form
- [ ] Build cycle detail page with tabs
- [ ] Implement HypothesisDefinition form
- [ ] Implement "Lock & Start" button

### Phase 4: GitHub Integration (Day 7-9)
- [ ] Create GitHub API client wrapper
- [ ] Implement `triggerWorkflow()` function
- [ ] Build webhook endpoint (`/api/webhooks/github`)
- [ ] Implement signature verification
- [ ] Handle `workflow_run.completed` event
- [ ] Create ExecutionEvidence on trigger
- [ ] Update evidence on webhook receive
- [ ] Transition cycle status to REVIEW

### Phase 5: Review & Outcome (Day 10-11)
- [ ] Implement DecisionReview model & UI
- [ ] Implement DecisionOutcome model & UI
- [ ] Implement GitHub write-back:
   - Create Issue function
   - Create PR comment function
   - Find PR from webhook payload
- [ ] Build History tab (AuditEvent display)

### Phase 6: Billing (Day 12-13)
- [ ] Setup Stripe products (Starter, Pro)
- [ ] Implement Stripe Checkout flow
- [ ] Build webhook endpoint (`/api/webhooks/stripe`)
- [ ] Implement subscription status updates
- [ ] Enforce feature gates (project/cycle limits)
- [ ] Build upgrade prompts

### Phase 7: Polish & Deploy (Day 14-15)
- [ ] Write comprehensive README
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Mobile responsive pass
- [ ] Setup Sentry (optional)
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test GitHub webhooks with ngrok/Vercel URL
- [ ] Test Stripe webhooks with CLI
- [ ] Final QA pass

---

## Testing Strategy

### Manual Testing Checklist
- [ ] GitHub OAuth login works
- [ ] Can connect GitHub repo
- [ ] Can create decision cycle
- [ ] Can lock hypothesis
- [ ] Workflow triggers successfully (check GitHub Actions)
- [ ] Webhook is received and processed
- [ ] Evidence appears in UI
- [ ] Can submit review
- [ ] Can record outcome
- [ ] Outcome written to GitHub (verify on GitHub)
- [ ] Stripe Checkout creates subscription
- [ ] Stripe webhook updates status
- [ ] Free tier limits enforced

### Automated Testing (Optional for V0)
- [ ] Unit tests for API wrappers (GitHub, Stripe)
- [ ] Integration test for webhook flow (mock GitHub)
- [ ] E2E test for happy path (Playwright)

---

## Documentation Requirements

### README.md Sections
1. **Project Overview**: What is Decision OS
2. **Features**: Bullet list of capabilities
3. **Tech Stack**: Table of technologies
4. **Prerequisites**: Node.js 18+, PostgreSQL, GitHub account, Stripe account
5. **Local Setup**:
   - Clone repo
   - Install dependencies (`npm install`)
   - Copy `.env.example` to `.env`
   - Fill environment variables
   - Run migrations (`npx prisma migrate dev`)
   - Start dev server (`npm run dev`)
6. **GitHub Setup**:
   - Create OAuth App
   - Configure webhook (URL, secret, events)
7. **Stripe Setup**:
   - Create products
   - Get API keys
   - Configure webhook
8. **Vercel Deployment**:
   - Connect repo
   - Configure environment variables
   - Deploy
9. **Troubleshooting**: Common issues
10. **Contributing**: How to contribute (if open source)

### Additional Docs
- `/docs/API.md`: API endpoint reference (optional)
- `/docs/SCHEMA.md`: Database schema explanation (optional)
- `/docs/WEBHOOKS.md`: Webhook payload examples (optional)

---

## Completion Criteria

### Definition of Done
- [ ] All acceptance criteria met
- [ ] README complete with setup instructions
- [ ] Deployed to Vercel with custom domain (or vercel.app)
- [ ] GitHub OAuth functional
- [ ] GitHub webhooks functional
- [ ] Stripe subscriptions functional
- [ ] Zero TypeScript errors (`npm run type-check`)
- [ ] Zero ESLint errors (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Manual QA checklist 100% passed

### Launch Readiness
- [ ] Privacy policy page (basic template)
- [ ] Terms of service page (basic template)
- [ ] Support email configured
- [ ] Sentry error tracking active (if configured)
- [ ] Analytics configured (optional: Vercel Analytics or PostHog)

---

## Appendix

### Reference Implementations
- NextAuth GitHub OAuth: https://next-auth.js.org/providers/github
- GitHub workflow_dispatch API: https://docs.github.com/en/rest/actions/workflows
- GitHub webhooks: https://docs.github.com/en/webhooks
- Stripe Subscriptions: https://stripe.com/docs/billing/subscriptions/overview
- Prisma migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate

### Sample Workflow File (Customer Repo)
```yaml
# .github/workflows/decision-experiment.yml
name: Decision Experiment

on:
  workflow_dispatch:
    inputs:
      decision_cycle_id:
        description: 'Decision Cycle ID from Decision OS'
        required: true
      branch:
        description: 'Branch to run experiment on'
        required: false
        default: 'main'

jobs:
  experiment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.inputs.branch }}

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy preview
        run: echo "Preview URL: https://preview-${{ github.event.inputs.decision_cycle_id }}.vercel.app"
```

### Sample Webhook Payload (workflow_run.completed)
```json
{
  "action": "completed",
  "workflow_run": {
    "id": 123456789,
    "name": "Decision Experiment",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/owner/repo/actions/runs/123456789",
    "head_branch": "decisionos/abc123"
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

---

**Document Version**: 1.1
**Last Updated**: 2026-01-12
**Status**: In Implementation - i18n Completed ✅
**Next Step**: Continue with core features (GitHub integration, Decision Cycle management)

---

## Recent Updates

### 2026-01-12: Internationalization (i18n) Implementation ✅
- Implemented full bilingual support (Traditional Chinese, English)
- 300+ translation keys across all 6 pages
- Locale-aware routing with next-intl v4.7.0
- Language switcher component
- All pages fully translated and tested
