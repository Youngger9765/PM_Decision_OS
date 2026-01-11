# Decision OS

> **Status**: 🚧 Under Development (Phase 1 Complete)

Product decision management SaaS for modern teams. Execute complete decision cycles (Hypothesis → Execution → Review → Outcome → Closure) with seamless GitHub workflow integration.

## Features

- ✅ **Decision Cycle Management**: Structured workflow from hypothesis to outcome
- ✅ **GitHub Integration**: Trigger workflows, collect evidence, write back results
- ✅ **Subscription Management**: Stripe-powered billing with Starter/Pro plans
- ✅ **Audit Trail**: Complete history of all decision changes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase), Prisma ORM
- **Auth**: NextAuth.js with GitHub OAuth
- **Payments**: Stripe
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase account recommended)
- GitHub account
- Stripe account (test mode)

## Local Setup

### 1. Clone and Install

```bash
git clone https://github.com/Youngger9765/PM_Decision_OS.git
cd PM_Decision_OS
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the required values (see setup guides below).

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client (if not auto-generated)
npx prisma generate

# (Optional) Seed database
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Setup Guides

### Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Update `DATABASE_URL` in `.env`

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - **Name**: Decision OS (Dev)
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret to `.env`

### GitHub Webhook Setup

1. Go to target repository → Settings → Webhooks
2. Add webhook:
   - **Payload URL**: `https://your-domain.vercel.app/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Same as `GITHUB_WEBHOOK_SECRET` in `.env`
   - **Events**: Select "Workflow runs" and "Check suites"

### Stripe Setup

1. Login to [Stripe Dashboard](https://dashboard.stripe.com) (test mode)
2. Create products:
   - **Starter**: $19/month (recurring)
   - **Pro**: $49/month (recurring)
3. Copy Price IDs to `.env` (`STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`)
4. Go to Developers → Webhooks
5. Add endpoint:
   - **URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
   - **Events**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. Copy webhook secret to `.env`

## Vercel Deployment

1. Push code to GitHub
2. Import repository to [Vercel](https://vercel.com)
3. Configure environment variables (same as `.env`)
4. Deploy
5. Update OAuth callback and webhook URLs to Vercel domain

## Project Structure

```
PM_Decision_OS/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── db.ts            # Prisma client
│   ├── utils.ts         # Helper functions
│   ├── auth.ts          # NextAuth config (TODO)
│   ├── github.ts        # GitHub API client (TODO)
│   └── stripe.ts        # Stripe client (TODO)
├── prisma/
│   └── schema.prisma    # Database schema
├── docs/
│   ├── PRD.md           # Product requirements
│   └── IMPLEMENTATION_PLAN.md  # 15-day implementation plan
└── README.md
```

## Development Status

**Phase 1** (Days 1-2): Foundation ✅ **COMPLETE**
- ✅ Next.js 14 initialized with TypeScript
- ✅ Prisma schema with 12 models
- ✅ Project structure created
- ✅ Basic landing page

**Phase 2** (Days 3-4): Authentication 🚧 **IN PROGRESS**
- ⏳ NextAuth setup
- ⏳ GitHub OAuth integration
- ⏳ Login page

**Phases 3-7** (Days 5-15): ⏳ **TODO**
- Core UI (Dashboard, Projects, Decision Cycles)
- GitHub Integration (Workflow trigger, Webhooks)
- Stripe Billing
- Deploy & Polish

See [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for full roadmap.

## Contributing

This is currently a personal project. Contributions will be welcome once V0 is complete.

## License

MIT

---

**Built with ❤️ for Product Managers**
