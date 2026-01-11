# CI/CD Setup Guide

> **Status**: ✅ Workflows created and deployed
> **Date**: 2026-01-11

## 🎯 Current Status

### ✅ Completed

- [x] Created CI workflow (lint, type-check, build)
- [x] Created Claude Auto-Fix workflow (Self-Healing CI)
- [x] Created Vercel deployment workflow
- [x] Pushed to GitHub
- [x] Workflows triggered automatically

### ⏳ Running

```bash
# Check current status:
gh run list --limit 5

# Watch specific run:
gh run watch <run-id>
```

---

## 🔐 Required Secrets Setup

Before Claude Auto-Fix and Vercel deployment work, configure these secrets:

### 1. GitHub Repository Settings

Navigate to: **Settings → Secrets and variables → Actions → New repository secret**

### 2. Add These Secrets

| Secret Name | Required For | How to Get | Priority |
|-------------|--------------|------------|----------|
| `ANTHROPIC_API_KEY` | Claude Auto-Fix | [Anthropic Console](https://console.anthropic.com) → Settings → API Keys | 🔴 Critical |
| `VERCEL_TOKEN` | Deployment | Vercel Dashboard → Settings → Tokens → Create | 🟡 Important |
| `VERCEL_ORG_ID` | Deployment | Run `vercel` locally, check `.vercel/project.json` | 🟡 Important |
| `VERCEL_PROJECT_ID` | Deployment | Same as above | 🟡 Important |

---

## 🚀 Quick Setup Steps

### Step 1: Get Anthropic API Key

```bash
# 1. Visit https://console.anthropic.com
# 2. Login with your account
# 3. Go to Settings → API Keys
# 4. Create new API key
# 5. Copy the key (starts with sk-ant-...)
# 6. Add to GitHub Secrets as ANTHROPIC_API_KEY
```

### Step 2: Get Vercel Credentials

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Link to Vercel project
vercel

# This will create .vercel/project.json with:
# - projectId (VERCEL_PROJECT_ID)
# - orgId (VERCEL_ORG_ID)

# Get Vercel token from dashboard:
# https://vercel.com/account/tokens
```

### Step 3: Configure GitHub Secrets

```bash
# Option A: Via GitHub UI
# 1. Go to repo → Settings → Secrets and variables → Actions
# 2. Click "New repository secret"
# 3. Add each secret one by one

# Option B: Via GitHub CLI
gh secret set ANTHROPIC_API_KEY
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

---

## 🧪 Testing the CI/CD

### Test 1: Normal CI Pass

```bash
# Make a valid change
echo "// Test CI" >> app/page.tsx

git add app/page.tsx
git commit -m "test: verify CI workflow"
git push

# Watch CI run
gh run watch
```

Expected: ✅ CI passes → Deploys to Vercel

---

### Test 2: Self-Healing Auto-Fix

```bash
# Create a file with lint errors
cat > test-auto-fix.tsx << 'EOF'
const   unused =   "test"  ;  // Bad formatting + unused variable
export {}
EOF

git add test-auto-fix.tsx
git commit -m "test: trigger auto-fix workflow"
git push

# Watch the magic happen
gh run watch
```

Expected:
1. ❌ CI fails (ESLint error)
2. 🤖 Claude Auto-Fix triggers
3. 🔧 Auto-commits fix
4. ✅ CI re-runs and passes

---

## 📊 Monitoring

### Check Workflow Status

```bash
# List recent runs
gh run list

# Watch specific run
gh run watch <run-id>

# View run details
gh run view <run-id>
```

### View Logs

```bash
# Download logs
gh run download <run-id>

# View logs in browser
gh run view <run-id> --web
```

---

## ⚠️ Troubleshooting

### CI Fails but Auto-Fix Doesn't Trigger

**Cause**: Missing `ANTHROPIC_API_KEY` secret

**Fix**:
```bash
gh secret set ANTHROPIC_API_KEY
# Paste your API key when prompted
```

---

### Deployment Fails

**Cause**: Missing Vercel secrets

**Fix**:
```bash
# Verify Vercel is linked
vercel

# Add all required secrets
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

---

### Auto-Fix Commits But CI Still Fails

**Cause**: Issue is too complex for auto-fix (e.g., logic error)

**Fix**: Manual intervention required. Auto-fix only handles:
- ESLint auto-fixable errors
- Formatting issues
- Unused imports
- Simple TypeScript errors

It will NOT fix:
- Test failures
- Security issues
- Complex refactoring

---

## 🎯 Next Steps

1. **Add `ANTHROPIC_API_KEY`** to enable Claude Auto-Fix
2. **Add Vercel secrets** to enable deployment
3. **Test the workflows** with a simple change
4. **Monitor first few runs** to ensure everything works
5. **Adjust safeguards** if needed (see `.github/workflows/README.md`)

---

## 📚 Resources

- [CI/CD Workflows README](.github/workflows/README.md)
- [Self-Healing CI/CD Guide](~/.claude/docs/self-healing-cicd-guide.md)
- [Troubleshooting Manual](~/.claude/docs/troubleshooting-auto-fix.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)

---

**Status**: Ready for testing after secrets are configured
**Priority**: 🔴 Add `ANTHROPIC_API_KEY` first
**Version**: 1.0
