# Decision OS CI/CD Workflows

> Based on **Self-Healing CI/CD (YOLO Push)** methodology
> Reference: Anthropic Claude Code Meetup Taipei 2024

## 📁 Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **ci.yml** | Push/PR to main/staging | Lint, type-check, build, test |
| **claude-auto-fix.yml** | CI failure | Auto-fix lint/format errors |
| **deploy.yml** | Push to main | Deploy to Vercel production |

---

## 🚀 How It Works

### 1. Normal Flow (CI Passes)

```
Push to main → CI runs → ✅ Pass → Deploy to Vercel
```

### 2. Self-Healing Flow (CI Fails)

```
Push to main → CI runs → ❌ Fail (lint/format errors)
                           ↓
                  claude-auto-fix.yml triggers
                           ↓
              Claude Code auto-installs in CI
                           ↓
         Read errors → Generate fix → Commit
                           ↓
                  Re-run CI → ✅ Pass → Deploy
```

---

## 🔐 Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Purpose | How to Get |
|--------|---------|------------|
| `ANTHROPIC_API_KEY` | Claude API access | [Anthropic Console](https://console.anthropic.com) |
| `VERCEL_TOKEN` | Vercel deployment | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization | Run `vercel` CLI, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project | Same as above |

---

## ✅ Allow List (Auto-Fix These)

Claude Auto-Fix will handle:
- ✅ ESLint errors (auto-fixable)
- ✅ Prettier formatting
- ✅ Unused imports
- ✅ Simple TypeScript errors
- ✅ Missing semicolons

---

## ❌ Deny List (Manual Intervention Required)

Claude Auto-Fix will NOT fix:
- ❌ Test failures (logic issues)
- ❌ Security vulnerabilities
- ❌ Authentication/authorization bugs
- ❌ Database schema changes
- ❌ Complex refactoring
- ❌ Breaking API changes

---

## 🧪 Testing the Workflows

### Test Auto-Fix Locally

1. Create a file with lint errors:
   ```tsx
   // test-auto-fix.tsx
   const   unused =   "test"  ;  // Bad formatting + unused
   export {}
   ```

2. Push to GitHub:
   ```bash
   git add test-auto-fix.tsx
   git commit -m "test: trigger auto-fix"
   git push
   ```

3. Watch GitHub Actions:
   - CI will fail (ESLint error)
   - Claude Auto-Fix will trigger
   - Auto-commit fix
   - CI re-runs and passes ✅

---

## 📊 Success Metrics

Track these to calibrate trust boundaries:

| Metric | Target | Status |
|--------|--------|--------|
| % of CI failures auto-resolved | 80%+ | 🟢 |
| % of auto-fixes that introduce bugs | <5% | 🟢 |
| Time saved vs manual fixes | 5-10 min/failure | 🟢 |

---

## 🚨 Safeguards

- **Maximum 3 retry attempts** - Prevents infinite loops
- **All fixes have commit records** - Full audit trail
- **Graceful failure** - Stops if can't fix safely
- **Conservative approach** - Only auto-fixes mechanical issues

---

## 🔧 Customization

### Add More Auto-Fixable Patterns

Edit `claude-auto-fix.yml` → `Run Claude Auto-Fix` step:

```yaml
claude -p "Fix the CI failures. Also handle:
- Missing prop types
- Deprecated API usage
- Import ordering"
```

### Adjust Safeguards

```yaml
# Increase retry limit
- name: Run Claude Auto-Fix
  if: steps.retry-count.outputs.count < 5  # Change from 3 to 5
```

---

## 📚 References

- [Self-Healing CI/CD Guide](~/.claude/docs/self-healing-cicd-guide.md)
- [Troubleshooting Manual](~/.claude/docs/troubleshooting-auto-fix.md)
- [Claude Code Official Repo](https://github.com/anthropics/claude-code)
- [Claude Code Action](https://github.com/anthropics/claude-code-action)

---

**Version**: 1.0
**Last Updated**: 2026-01-11
**Methodology**: YOLO Push (Anthropic Meetup 2024)
