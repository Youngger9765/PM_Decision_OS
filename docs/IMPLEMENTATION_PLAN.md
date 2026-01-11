# Implementation Plan: Decision OS

**Project**: Decision OS - Product Decision Management SaaS
**Timeline**: 15 days (120 hours)
**Status**: Ready for execution
**Database**: Supabase Postgres
**GitHub Scope**: Personal repos only
**Testing**: Critical path (webhook + billing)

---

## Project Configuration

### Tech Stack Decisions
- ✅ Database: **Supabase** (free tier, PostgreSQL)
- ✅ GitHub: **Personal repos only** (simplified OAuth)
- ✅ Landing: **Simple & Clean** (minimal marketing)
- ✅ Testing: **Critical path** (webhook, billing flows)

### Tools & Dependencies
```json
{
  "framework": "Next.js 14.1+",
  "language": "TypeScript 5.3+",
  "styling": "TailwindCSS + shadcn/ui",
  "auth": "NextAuth.js v5",
  "database": "Supabase PostgreSQL",
  "orm": "Prisma 5+",
  "payments": "Stripe SDK",
  "deployment": "Vercel"
}
```

---

## Phase 1: Foundation (Days 1-2)

### Day 1: Project Initialization

#### Task 1.1: Create Next.js Project
```bash
npx create-next-app@latest decision-os \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd decision-os
```

**Deliverables**:
- [ ] Next.js 14+ with App Router
- [ ] TypeScript configured (strict mode)
- [ ] Tailwind CSS configured
- [ ] Project structure created

#### Task 1.2: Install Core Dependencies
```bash
npm install @prisma/client
npm install -D prisma
npm install next-auth@beta
npm install @auth/prisma-adapter
npm install stripe
npm install @octokit/rest
npm install zod
npm install date-fns
npm install @supabase/supabase-js
```

**Deliverables**:
- [ ] All dependencies installed
- [ ] package.json updated

#### Task 1.3: Setup shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
```

**Deliverables**:
- [ ] shadcn/ui configured
- [ ] Essential components installed

---

### Day 2: Database Setup

#### Task 2.1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project: `decision-os`
3. Copy connection string
4. Copy anon/service keys (for future use)

**Deliverables**:
- [ ] Supabase project created
- [ ] Connection string obtained

#### Task 2.2: Initialize Prisma
```bash
npx prisma init
```

Create `.env`:
```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Deliverables**:
- [ ] `prisma/schema.prisma` created
- [ ] `.env` configured

#### Task 2.3: Define Prisma Schema
Copy complete schema from PRD (pages 272-349).

**Models to create**:
- [ ] User
- [ ] Workspace
- [ ] WorkspaceMember
- [ ] Project
- [ ] GitHubConnection
- [ ] DecisionCycle
- [ ] HypothesisDefinition
- [ ] ExecutionEvidence
- [ ] DecisionReview
- [ ] DecisionOutcome
- [ ] AuditEvent
- [ ] Subscription

**Deliverables**:
- [ ] Schema defined
- [ ] Enums defined (Role, DecisionCycleStatus, etc.)

#### Task 2.4: Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Deliverables**:
- [ ] Initial migration created
- [ ] Prisma Client generated
- [ ] Database tables created in Supabase

#### Task 2.5: Create Prisma Client Wrapper
Create `/lib/db/client.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Deliverables**:
- [ ] Prisma client singleton created
- [ ] Import path: `@/lib/db/client`

---

## Phase 2: Authentication (Days 3-4)

### Day 3: NextAuth Setup

#### Task 3.1: Create GitHub OAuth App
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new app:
   - Name: Decision OS (Dev)
   - Homepage: http://localhost:3000
   - Callback: http://localhost:3000/api/auth/callback/github
3. Copy Client ID and Client Secret

**Deliverables**:
- [ ] GitHub OAuth App created
- [ ] Client ID obtained
- [ ] Client Secret obtained

#### Task 3.2: Configure NextAuth
Create `/lib/auth/config.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "repo workflow", // Personal repos only
        },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}
```

**Deliverables**:
- [ ] Auth config created
- [ ] GitHub provider configured
- [ ] Prisma adapter configured

#### Task 3.3: Create API Route
Create `/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/config"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**Deliverables**:
- [ ] NextAuth API route created

#### Task 3.4: Update Environment Variables
Add to `.env`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

Generate secret:
```bash
openssl rand -base64 32
```

**Deliverables**:
- [ ] Environment variables configured

---

### Day 4: Auth UI

#### Task 4.1: Create Login Page
Create `/app/(auth)/login/page.tsx`:
```typescript
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Decision OS</h1>
          <p className="mt-2 text-gray-600">
            Product decision management for modern teams
          </p>
        </div>
        <Button
          onClick={() => signIn("github", { callbackUrl: "/app" })}
          className="w-full"
          size="lg"
        >
          <GitHubLogoIcon className="mr-2 h-5 w-5" />
          Continue with GitHub
        </Button>
      </div>
    </div>
  )
}
```

**Deliverables**:
- [ ] Login page created
- [ ] GitHub sign-in button functional

#### Task 4.2: Create Auth Middleware
Create `/middleware.ts`:
```typescript
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/app/:path*", "/api/((?!auth|webhooks).*)"],
}
```

**Deliverables**:
- [ ] Protected routes configured
- [ ] Redirect to login if unauthenticated

#### Task 4.3: Test Authentication
```bash
npm run dev
# Visit http://localhost:3000/auth/login
# Click GitHub button
# Authorize app
# Should redirect to /app
```

**Deliverables**:
- [ ] Login flow tested
- [ ] User record created in database
- [ ] Session persists on refresh

---

## Phase 3: Core Models & UI (Days 5-6)

### Day 5: Workspace & Project Setup

#### Task 5.1: Create Default Workspace on Signup
Create `/lib/auth/hooks.ts`:
```typescript
import { prisma } from "@/lib/db/client"

export async function createDefaultWorkspace(userId: string) {
  const workspace = await prisma.workspace.create({
    data: {
      name: "My Workspace",
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  })
  return workspace
}
```

Update NextAuth callback in `/lib/auth/config.ts`:
```typescript
events: {
  async signIn({ user, isNewUser }) {
    if (isNewUser) {
      await createDefaultWorkspace(user.id)
    }
  },
}
```

**Deliverables**:
- [ ] Auto-create workspace on first login
- [ ] User becomes workspace owner

#### Task 5.2: Build Dashboard
Create `/app/app/page.tsx`:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"
import { ProjectCard } from "@/components/project/ProjectCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const projects = await prisma.project.findMany({
    where: {
      workspace: {
        members: {
          some: {
            userId: session!.user.id,
          },
        },
      },
    },
    include: {
      githubConnection: true,
      _count: {
        select: { decisionCycles: true },
      },
    },
  })

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/app/projects/new">New Project</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
```

**Deliverables**:
- [ ] Dashboard displays projects
- [ ] "New Project" button

#### Task 5.3: Create Project Card Component
Create `/components/project/ProjectCard.tsx`:
```typescript
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function ProjectCard({ project }) {
  const isConnected = !!project.githubConnection

  return (
    <Link href={`/app/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          <CardDescription>
            {project._count.decisionCycles} decision cycles
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
```

**Deliverables**:
- [ ] Project card component
- [ ] Connection status badge

---

### Day 6: Project Detail & GitHub Connection

#### Task 6.1: Create Project Detail Page
Create `/app/app/projects/[id]/page.tsx`:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"
import { ConnectGitHubButton } from "@/components/project/ConnectGitHubButton"
import { DecisionCycleTable } from "@/components/cycle/DecisionCycleTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProjectDetailPage({ params }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      githubConnection: true,
      decisionCycles: {
        include: {
          owner: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  })

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.githubConnection && (
            <p className="text-gray-600 mt-1">
              {project.githubConnection.repoOwner}/{project.githubConnection.repoName}
            </p>
          )}
        </div>
        {!project.githubConnection && (
          <ConnectGitHubButton projectId={project.id} />
        )}
      </div>

      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href={`/app/cycles/new?projectId=${project.id}`}>
            New Decision Cycle
          </Link>
        </Button>
      </div>

      <DecisionCycleTable cycles={project.decisionCycles} />
    </div>
  )
}
```

**Deliverables**:
- [ ] Project detail page
- [ ] GitHub connection status
- [ ] Decision cycles table

#### Task 6.2: Build GitHub Connection Flow
Create `/lib/github/client.ts`:
```typescript
import { Octokit } from "@octokit/rest"

export async function getUserRepos(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken })
  const { data } = await octokit.repos.listForAuthenticatedUser({
    visibility: "all",
    sort: "updated",
    per_page: 100,
  })
  return data
}

export async function saveGitHubConnection(
  projectId: string,
  repoOwner: string,
  repoName: string,
  accessToken: string
) {
  const { prisma } = await import("@/lib/db/client")

  // TODO: Encrypt token before storing
  await prisma.gitHubConnection.create({
    data: {
      projectId,
      repoOwner,
      repoName,
      accessToken, // Should be encrypted
    },
  })
}
```

**Deliverables**:
- [ ] Fetch user repos
- [ ] Save connection (token encryption TODO)

#### Task 6.3: Create Connect GitHub Dialog
Create `/components/project/ConnectGitHubButton.tsx`:
```typescript
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export function ConnectGitHubButton({ projectId }) {
  const [open, setOpen] = useState(false)
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)

  async function loadRepos() {
    const res = await fetch("/api/github/repos")
    const data = await res.json()
    setRepos(data)
    setOpen(true)
  }

  async function handleConnect() {
    await fetch("/api/projects/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        repoOwner: selectedRepo.owner.login,
        repoName: selectedRepo.name,
      }),
    })
    window.location.reload()
  }

  return (
    <>
      <Button onClick={loadRepos}>Connect GitHub</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Repository</DialogTitle>
          </DialogHeader>
          {/* Repo selector UI */}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

**Deliverables**:
- [ ] Connect GitHub button
- [ ] Repo selector dialog

---

## Phase 4: Decision Cycle (Days 7-8)

### Day 7: Decision Cycle Creation

#### Task 7.1: Create Cycle Form
Create `/app/app/cycles/new/page.tsx`:
```typescript
import { CycleForm } from "@/components/cycle/CycleForm"

export default function NewCyclePage({ searchParams }) {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">New Decision Cycle</h1>
      <CycleForm projectId={searchParams.projectId} />
    </div>
  )
}
```

Create `/components/cycle/CycleForm.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function CycleForm({ projectId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        title: formData.get("title"),
        hypothesis: formData.get("hypothesis"),
        successCriteria: formData.get("successCriteria"),
        outOfScope: formData.get("outOfScope"),
      }),
    })

    const data = await res.json()
    router.push(`/app/cycles/${data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="hypothesis">Hypothesis</Label>
        <Textarea id="hypothesis" name="hypothesis" rows={4} required />
      </div>

      <div>
        <Label htmlFor="successCriteria">Success Criteria</Label>
        <Textarea id="successCriteria" name="successCriteria" rows={4} required />
      </div>

      <div>
        <Label htmlFor="outOfScope">Out of Scope (Optional)</Label>
        <Textarea id="outOfScope" name="outOfScope" rows={3} />
      </div>

      <Button type="submit" disabled={loading}>
        Create Decision Cycle
      </Button>
    </form>
  )
}
```

**Deliverables**:
- [ ] Cycle creation form
- [ ] Form validation

#### Task 7.2: Create Cycle API
Create `/app/api/cycles/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { projectId, title, hypothesis, successCriteria, outOfScope } = body

  // TODO: Check billing limits here

  const cycle = await prisma.decisionCycle.create({
    data: {
      title,
      projectId,
      ownerUserId: session.user.id,
      status: "DRAFTING",
      hypothesisDefinition: {
        create: {
          hypothesis,
          successCriteria,
          outOfScope,
        },
      },
    },
    include: {
      hypothesisDefinition: true,
    },
  })

  return NextResponse.json(cycle)
}
```

**Deliverables**:
- [ ] POST /api/cycles endpoint
- [ ] Create cycle + hypothesis

---

### Day 8: Cycle Detail Page

#### Task 8.1: Create Cycle Detail Page
Create `/app/app/cycles/[id]/page.tsx`:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HypothesisTab } from "@/components/cycle/HypothesisTab"
import { EvidenceTab } from "@/components/cycle/EvidenceTab"
import { ReviewTab } from "@/components/cycle/ReviewTab"
import { OutcomeTab } from "@/components/cycle/OutcomeTab"
import { HistoryTab } from "@/components/cycle/HistoryTab"

export default async function CycleDetailPage({ params }) {
  const cycle = await prisma.decisionCycle.findUnique({
    where: { id: params.id },
    include: {
      project: {
        include: {
          githubConnection: true,
        },
      },
      owner: true,
      hypothesisDefinition: true,
      executionEvidences: true,
      decisionReview: true,
      decisionOutcome: true,
      auditEvents: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{cycle.title}</h1>
        <p className="text-gray-600 mt-1">
          Status: {cycle.status} • Owner: {cycle.owner.name}
        </p>
      </div>

      <Tabs defaultValue="hypothesis">
        <TabsList>
          <TabsTrigger value="hypothesis">Hypothesis</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="outcome">Outcome</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="hypothesis">
          <HypothesisTab cycle={cycle} />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceTab cycle={cycle} />
        </TabsContent>

        <TabsContent value="review">
          <ReviewTab cycle={cycle} />
        </TabsContent>

        <TabsContent value="outcome">
          <OutcomeTab cycle={cycle} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab cycle={cycle} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Deliverables**:
- [ ] Cycle detail page with tabs
- [ ] Tab navigation

#### Task 8.2: Build Hypothesis Tab
Create `/components/cycle/HypothesisTab.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockExecutionButton } from "./LockExecutionButton"

export function HypothesisTab({ cycle }) {
  const hypothesis = cycle.hypothesisDefinition
  const isLocked = !!hypothesis?.lockedAt

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hypothesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{hypothesis.hypothesis}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{hypothesis.successCriteria}</p>
        </CardContent>
      </Card>

      {hypothesis.outOfScope && (
        <Card>
          <CardHeader>
            <CardTitle>Out of Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{hypothesis.outOfScope}</p>
          </CardContent>
        </Card>
      )}

      {!isLocked && (
        <LockExecutionButton cycleId={cycle.id} />
      )}

      {isLocked && (
        <p className="text-sm text-gray-600">
          Hypothesis locked at {new Date(hypothesis.lockedAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}
```

**Deliverables**:
- [ ] Display hypothesis
- [ ] Lock & Start button

---

## Phase 5: GitHub Integration (Days 9-11)

### Day 9: Workflow Trigger

#### Task 9.1: Create Workflow Trigger API
Create `/app/api/github/trigger/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { triggerWorkflow } from "@/lib/github/workflows"
import { prisma } from "@/lib/db/client"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cycleId, workflowId } = await req.json()

  const cycle = await prisma.decisionCycle.findUnique({
    where: { id: cycleId },
    include: {
      project: {
        include: {
          githubConnection: true,
        },
      },
      hypothesisDefinition: true,
    },
  })

  if (!cycle) {
    return NextResponse.json({ error: "Cycle not found" }, { status: 404 })
  }

  const github = cycle.project.githubConnection
  if (!github) {
    return NextResponse.json({ error: "No GitHub connection" }, { status: 400 })
  }

  // Lock hypothesis
  await prisma.hypothesisDefinition.update({
    where: { id: cycle.hypothesisDefinition.id },
    data: { lockedAt: new Date() },
  })

  // Trigger workflow
  const result = await triggerWorkflow({
    owner: github.repoOwner,
    repo: github.repoName,
    workflowId,
    token: github.accessToken,
    inputs: {
      decision_cycle_id: cycleId,
      branch: `decisionos/${cycleId}`,
    },
  })

  // Create evidence
  await prisma.executionEvidence.create({
    data: {
      decisionCycleId: cycleId,
      type: "CI_RUN",
      referenceUrl: result.html_url,
      metadata: {
        runId: result.id,
        workflowId,
      },
    },
  })

  // Update cycle status
  await prisma.decisionCycle.update({
    where: { id: cycleId },
    data: { status: "EXECUTING" },
  })

  // Log audit event
  await prisma.auditEvent.create({
    data: {
      decisionCycleId: cycleId,
      userId: session.user.id,
      action: "EXECUTION_STARTED",
      metadata: { workflowId },
    },
  })

  return NextResponse.json(result)
}
```

**Deliverables**:
- [ ] POST /api/github/trigger
- [ ] Lock hypothesis
- [ ] Trigger workflow
- [ ] Create evidence
- [ ] Update status to EXECUTING

#### Task 9.2: Create GitHub Workflow Client
Create `/lib/github/workflows.ts`:
```typescript
import { Octokit } from "@octokit/rest"

interface TriggerWorkflowParams {
  owner: string
  repo: string
  workflowId: string
  token: string
  inputs: Record<string, string>
}

export async function triggerWorkflow(params: TriggerWorkflowParams) {
  const { owner, repo, workflowId, token, inputs } = params

  const octokit = new Octokit({ auth: token })

  try {
    await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref: "main", // or from inputs
      inputs,
    })

    // Get latest run (approximate, may need polling)
    const { data } = await octokit.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflowId,
      per_page: 1,
    })

    const latestRun = data.workflow_runs[0]

    return {
      id: latestRun.id,
      html_url: latestRun.html_url,
      status: latestRun.status,
    }
  } catch (error) {
    console.error("Failed to trigger workflow:", error)
    throw new Error("Failed to trigger workflow")
  }
}
```

**Deliverables**:
- [ ] Trigger workflow function
- [ ] Error handling

---

### Day 10: Webhook Handler

#### Task 10.1: Create Webhook Endpoint
Create `/app/api/webhooks/github/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { verifyGitHubSignature } from "@/lib/security/verify"
import { handleWorkflowRunCompleted } from "@/lib/github/webhooks"

export async function POST(req: Request) {
  const signature = req.headers.get("x-hub-signature-256")
  const body = await req.text()

  // Verify signature
  const isValid = verifyGitHubSignature(body, signature!)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = req.headers.get("x-github-event")
  const payload = JSON.parse(body)

  if (event === "workflow_run" && payload.action === "completed") {
    await handleWorkflowRunCompleted(payload)
  }

  return NextResponse.json({ received: true })
}
```

**Deliverables**:
- [ ] POST /api/webhooks/github
- [ ] Signature verification
- [ ] Event routing

#### Task 10.2: Create Signature Verification
Create `/lib/security/verify.ts`:
```typescript
import crypto from "crypto"

export function verifyGitHubSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET!
  const hmac = crypto.createHmac("sha256", secret)
  const digest = "sha256=" + hmac.update(payload).digest("hex")

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}
```

**Deliverables**:
- [ ] HMAC-SHA256 verification
- [ ] Timing-safe comparison

#### Task 10.3: Handle Workflow Run Completed
Create `/lib/github/webhooks.ts`:
```typescript
import { prisma } from "@/lib/db/client"

export async function handleWorkflowRunCompleted(payload: any) {
  const { workflow_run, repository } = payload
  const { id, status, conclusion, html_url, head_branch } = workflow_run

  // Find evidence by workflow run ID
  const evidence = await prisma.executionEvidence.findFirst({
    where: {
      metadata: {
        path: ["runId"],
        equals: id,
      },
    },
    include: {
      decisionCycle: true,
    },
  })

  if (!evidence) {
    console.warn(`No evidence found for run ${id}`)
    return
  }

  // Update evidence
  await prisma.executionEvidence.update({
    where: { id: evidence.id },
    data: {
      status,
      conclusion,
      metadata: {
        ...evidence.metadata,
        completedAt: new Date().toISOString(),
      },
    },
  })

  // Transition cycle to REVIEW
  await prisma.decisionCycle.update({
    where: { id: evidence.decisionCycleId },
    data: { status: "REVIEW" },
  })

  // Log audit event
  await prisma.auditEvent.create({
    data: {
      decisionCycleId: evidence.decisionCycleId,
      userId: evidence.decisionCycle.ownerUserId,
      action: "EXECUTION_COMPLETED",
      metadata: {
        runId: id,
        conclusion,
      },
    },
  })
}
```

**Deliverables**:
- [ ] Update evidence
- [ ] Transition to REVIEW
- [ ] Log audit event

---

### Day 11: Review & Outcome

#### Task 11.1: Create Review API
Create `/app/api/cycles/[id]/review/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { verdict, comment } = await req.json()

  const review = await prisma.decisionReview.create({
    data: {
      decisionCycleId: params.id,
      verdict,
      comment,
    },
  })

  await prisma.decisionCycle.update({
    where: { id: params.id },
    data: { status: "OUTCOME" },
  })

  await prisma.auditEvent.create({
    data: {
      decisionCycleId: params.id,
      userId: session.user.id,
      action: "REVIEW_SUBMITTED",
      metadata: { verdict },
    },
  })

  return NextResponse.json(review)
}
```

**Deliverables**:
- [ ] POST /api/cycles/:id/review
- [ ] Create review
- [ ] Transition to OUTCOME

#### Task 11.2: Create Outcome API with GitHub Write-back
Create `/app/api/cycles/[id]/outcome/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/client"
import { writeOutcomeToGitHub } from "@/lib/github/writeback"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { outcome, notes } = await req.json()

  const cycle = await prisma.decisionCycle.findUnique({
    where: { id: params.id },
    include: {
      project: {
        include: {
          githubConnection: true,
        },
      },
      hypothesisDefinition: true,
      decisionReview: true,
    },
  })

  if (!cycle) {
    return NextResponse.json({ error: "Cycle not found" }, { status: 404 })
  }

  // Write to GitHub
  const githubUrls = await writeOutcomeToGitHub({
    cycle,
    outcome,
    notes,
  })

  // Create outcome record
  const outcomeRecord = await prisma.decisionOutcome.create({
    data: {
      decisionCycleId: params.id,
      outcome,
      notes,
      githubIssueUrl: githubUrls.issueUrl,
      githubPrUrl: githubUrls.prUrl,
    },
  })

  // Close cycle
  await prisma.decisionCycle.update({
    where: { id: params.id },
    data: { status: "CLOSED" },
  })

  // Log audit event
  await prisma.auditEvent.create({
    data: {
      decisionCycleId: params.id,
      userId: session.user.id,
      action: "OUTCOME_RECORDED",
      metadata: { outcome },
    },
  })

  return NextResponse.json(outcomeRecord)
}
```

**Deliverables**:
- [ ] POST /api/cycles/:id/outcome
- [ ] Write to GitHub
- [ ] Create outcome
- [ ] Close cycle

#### Task 11.3: Implement GitHub Write-back
Create `/lib/github/writeback.ts`:
```typescript
import { Octokit } from "@octokit/rest"

export async function writeOutcomeToGitHub({ cycle, outcome, notes }) {
  const github = cycle.project.githubConnection
  const octokit = new Octokit({ auth: github.accessToken })

  const body = `
## Decision Outcome: ${outcome}

**Decision Cycle**: ${cycle.title}
**Review Verdict**: ${cycle.decisionReview.verdict}

### Hypothesis
${cycle.hypothesisDefinition.hypothesis}

### Success Criteria
${cycle.hypothesisDefinition.successCriteria}

### Outcome Notes
${notes || "No additional notes"}

---
_Generated by Decision OS_
  `.trim()

  try {
    // Try to find PR first (TODO: from webhook payload)
    // For now, create issue
    const { data: issue } = await octokit.issues.create({
      owner: github.repoOwner,
      repo: github.repoName,
      title: `[Decision OS] ${cycle.title} - ${outcome}`,
      body,
      labels: ["decision-os", outcome.toLowerCase()],
    })

    return {
      issueUrl: issue.html_url,
      prUrl: null,
    }
  } catch (error) {
    console.error("Failed to write to GitHub:", error)
    throw new Error("Failed to write outcome to GitHub")
  }
}
```

**Deliverables**:
- [ ] Create GitHub issue
- [ ] Format outcome message
- [ ] Add labels

---

## Phase 6: Billing (Days 12-13)

### Day 12: Stripe Setup

#### Task 12.1: Create Stripe Products
1. Login to Stripe Dashboard (test mode)
2. Create products:
   - **Starter**: $19/month
   - **Pro**: $49/month
3. Copy Price IDs

**Deliverables**:
- [ ] Stripe products created
- [ ] Price IDs obtained

#### Task 12.2: Create Stripe Client
Create `/lib/stripe/client.ts`:
```typescript
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})
```

**Deliverables**:
- [ ] Stripe client initialized

#### Task 12.3: Create Checkout API
Create `/app/api/stripe/checkout/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { stripe } from "@/lib/stripe/client"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { priceId } = await req.json()

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/app?checkout=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/app/pricing?checkout=canceled`,
    metadata: {
      userId: session.user.id,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

**Deliverables**:
- [ ] POST /api/stripe/checkout
- [ ] Create Stripe session

---

### Day 13: Stripe Webhooks & Limits

#### Task 13.1: Create Stripe Webhook Endpoint
Create `/app/api/webhooks/stripe/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/db/client"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata.userId

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: "ACTIVE",
          plan: "STARTER", // Infer from price
          currentPeriodEnd: new Date(session.expires_at * 1000),
        },
        update: {
          status: "ACTIVE",
          stripeSubscriptionId: session.subscription as string,
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: "CANCELED",
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

**Deliverables**:
- [ ] POST /api/webhooks/stripe
- [ ] Handle checkout.session.completed
- [ ] Handle subscription updates

#### Task 13.2: Implement Feature Gates
Create `/lib/billing/limits.ts`:
```typescript
import { prisma } from "@/lib/db/client"

export async function checkProjectLimit(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const projectCount = await prisma.project.count({
    where: {
      workspace: {
        members: {
          some: { userId },
        },
      },
    },
  })

  if (!subscription || subscription.status !== "ACTIVE") {
    // Free tier: 1 project
    return projectCount < 1
  }

  if (subscription.plan === "STARTER") {
    return projectCount < 5
  }

  // Pro: unlimited
  return true
}

export async function checkCycleLimit(projectId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            include: {
              user: {
                include: {
                  subscription: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const owner = project.workspace.members.find((m) => m.role === "OWNER")
  const subscription = owner?.user.subscription

  const cycleCount = await prisma.decisionCycle.count({
    where: { projectId },
  })

  if (!subscription || subscription.status !== "ACTIVE") {
    // Free tier: 3 cycles per project
    return cycleCount < 3
  }

  // Starter/Pro: unlimited
  return true
}
```

**Deliverables**:
- [ ] Check project limit
- [ ] Check cycle limit
- [ ] Return boolean

#### Task 13.3: Enforce Limits in APIs
Update `/app/api/cycles/route.ts`:
```typescript
import { checkCycleLimit } from "@/lib/billing/limits"

// In POST handler:
const canCreate = await checkCycleLimit(projectId)
if (!canCreate) {
  return NextResponse.json(
    { error: "Cycle limit reached. Upgrade to create more." },
    { status: 403 }
  )
}
```

**Deliverables**:
- [ ] Enforce limits in cycle creation
- [ ] Show upgrade prompt

---

## Phase 7: Polish & Deploy (Days 14-15)

### Day 14: UI Polish & Testing

#### Task 14.1: Add Loading States
- [ ] Add skeleton loaders to tables
- [ ] Add spinners to buttons
- [ ] Add loading indicators to forms

#### Task 14.2: Add Error Boundaries
Create `/app/error.tsx`:
```typescript
"use client"

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  )
}
```

**Deliverables**:
- [ ] Global error boundary
- [ ] Reset button

#### Task 14.3: Mobile Responsive Pass
- [ ] Test on mobile viewport
- [ ] Adjust grid layouts (3-col → 1-col)
- [ ] Responsive tabs
- [ ] Responsive forms

#### Task 14.4: Write Critical Tests
Create `/tests/webhooks.test.ts`:
```typescript
import { POST } from "@/app/api/webhooks/github/route"

describe("GitHub Webhook", () => {
  it("should reject invalid signatures", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/github", {
      method: "POST",
      headers: {
        "x-hub-signature-256": "invalid",
        "x-github-event": "workflow_run",
      },
      body: JSON.stringify({ action: "completed" }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})
```

**Deliverables**:
- [ ] Webhook signature test
- [ ] Billing limit test
- [ ] (Optional) E2E test

---

### Day 15: Deploy & Documentation

#### Task 15.1: Write Comprehensive README
Create `/README.md`:
```markdown
# Decision OS

Product Decision Management SaaS for modern teams.

## Features
- Decision cycle management (Hypothesis → Execution → Review → Outcome)
- GitHub workflow integration
- Automated evidence collection
- Billing & subscription management

## Tech Stack
- Next.js 14, TypeScript, TailwindCSS
- PostgreSQL (Supabase), Prisma ORM
- NextAuth.js, Stripe, GitHub API

## Prerequisites
- Node.js 18+
- PostgreSQL (or Supabase account)
- GitHub account
- Stripe account

## Local Setup

1. Clone repo:
   ```bash
   git clone https://github.com/yourusername/decision-os
   cd decision-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Fill `.env` with your credentials (see below)

5. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start dev server:
   ```bash
   npm run dev
   ```

7. Visit http://localhost:3000

## Environment Variables

See `.env.example` for full list. Required:

- `DATABASE_URL`: Supabase connection string
- `NEXTAUTH_URL`: http://localhost:3000 (dev) or your domain (prod)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GITHUB_CLIENT_ID`: From GitHub OAuth App
- `GITHUB_CLIENT_SECRET`: From GitHub OAuth App
- `GITHUB_WEBHOOK_SECRET`: Random string for webhook signature
- `STRIPE_SECRET_KEY`: From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET`: From Stripe webhook settings
- `STRIPE_PRICE_STARTER`: Stripe Price ID for Starter plan
- `STRIPE_PRICE_PRO`: Stripe Price ID for Pro plan

## GitHub Setup

### Create OAuth App
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App:
   - Name: Decision OS
   - Homepage: http://localhost:3000 (dev) or your domain (prod)
   - Callback: `{NEXTAUTH_URL}/api/auth/callback/github`
3. Copy Client ID and Client Secret to `.env`

### Setup Webhook
1. Go to your target repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: `{YOUR_DOMAIN}/api/webhooks/github`
   - Content type: application/json
   - Secret: Same as `GITHUB_WEBHOOK_SECRET` in `.env`
   - Events: Select "Workflow runs" and "Check suites"
3. Save webhook

## Stripe Setup

### Create Products
1. Go to Stripe Dashboard (test mode)
2. Create products:
   - Starter: $19/month (recurring)
   - Pro: $49/month (recurring)
3. Copy Price IDs to `.env`

### Setup Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint:
   - URL: `{YOUR_DOMAIN}/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Copy webhook secret to `.env`

## Vercel Deployment

1. Push to GitHub
2. Import repo to Vercel
3. Configure environment variables (same as `.env`)
4. Deploy
5. Update GitHub OAuth callback URL to Vercel domain
6. Update GitHub webhook URL to Vercel domain
7. Update Stripe webhook URL to Vercel domain

## Troubleshooting

### "Invalid signature" on webhook
- Verify `GITHUB_WEBHOOK_SECRET` matches in both GitHub and `.env`
- Check webhook payload is sent as `application/json`

### Workflow not triggering
- Verify GitHub token has `repo` and `workflow` scopes
- Check workflow file exists in `.github/workflows/`
- Verify workflow accepts `workflow_dispatch` event

### Stripe checkout not working
- Verify `STRIPE_PRICE_STARTER` and `STRIPE_PRICE_PRO` are correct Price IDs
- Check Stripe is in test mode during development

## Contributing

PRs welcome! Please open an issue first.

## License

MIT
```

**Deliverables**:
- [ ] Comprehensive README

#### Task 15.2: Create `.env.example`
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
DIRECT_URL=postgresql://user:pass@host:5432/db

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=

STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_
STRIPE_PRICE_STARTER=price_
STRIPE_PRICE_PRO=price_

# Optional
SENTRY_DSN=
RESEND_API_KEY=
```

**Deliverables**:
- [ ] `.env.example` created

#### Task 15.3: Deploy to Vercel
```bash
npm run build  # Verify build succeeds
vercel          # Deploy
```

**Steps**:
1. Connect GitHub repo
2. Configure environment variables in Vercel dashboard
3. Deploy
4. Update OAuth callback URLs
5. Update webhook URLs
6. Test end-to-end

**Deliverables**:
- [ ] Deployed to Vercel
- [ ] Custom domain (optional)
- [ ] SSL certificate (automatic)

#### Task 15.4: Final QA Checklist
- [ ] Can login with GitHub
- [ ] Can create project
- [ ] Can connect GitHub repo
- [ ] Can create decision cycle
- [ ] Can lock & start execution (workflow triggers)
- [ ] Webhook received and processed
- [ ] Evidence displayed in UI
- [ ] Can submit review
- [ ] Can record outcome
- [ ] Outcome written to GitHub (verify on GitHub)
- [ ] Stripe checkout works
- [ ] Subscription activated
- [ ] Limits enforced (free tier)
- [ ] Mobile responsive

**Deliverables**:
- [ ] All items checked
- [ ] Screenshots for documentation

---

## Completion Criteria

### Definition of Done
- [x] All 15 days of tasks completed
- [ ] README complete
- [ ] Deployed to Vercel
- [ ] All environment variables configured
- [ ] GitHub OAuth functional
- [ ] GitHub webhooks functional
- [ ] Stripe subscriptions functional
- [ ] Zero TypeScript errors
- [ ] Zero build errors
- [ ] Manual QA checklist 100%

### Success Metrics
- [ ] End-to-end flow works (hypothesis → execution → review → outcome)
- [ ] GitHub integration works (trigger + webhook)
- [ ] Billing works (checkout + limits)
- [ ] No critical bugs

---

## Risk Mitigation

### High Priority Risks

| Risk | Mitigation | Owner |
|------|------------|-------|
| GitHub webhook delivery fails | Implement retry logic, log failures | Backend |
| Token security breach | Encrypt tokens, audit access logs | Security |
| Billing limits bypassed | Server-side checks, not client-side | Backend |
| Deployment fails | Test build locally, verify env vars | DevOps |

### Contingency Plans
- **If GitHub API rate limit hit**: Cache repo metadata, use conditional requests
- **If webhook fails**: Manual trigger button for development
- **If Stripe webhook fails**: Admin panel to manually activate subscriptions

---

## Post-Launch (V1 Roadmap)

### Deferred Features
- Multiple workspaces per user
- Team collaboration (comments, @mentions)
- Slack notifications
- Email notifications
- Analytics dashboard
- Custom workflow templates

### Technical Debt to Address
- Encrypt GitHub tokens (use crypto library)
- Implement rate limiting (Upstash Redis)
- Add comprehensive test coverage (80%+)
- Setup Sentry error tracking
- Add logging infrastructure (Winston/Pino)

---

**Plan Version**: 1.0
**Last Updated**: 2026-01-11
**Status**: Ready for Execution by agent-manager
**Estimated Completion**: 15 days (120 hours)
