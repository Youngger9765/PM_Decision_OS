"use client";

import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingPage() {
  const locale = useLocale();
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-editorial">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <span className="text-xl font-bold">{tCommon('appName')}</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.howItWorks')}
              </a>
              <a href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.pricing')}
              </a>
              <Link href={`/${locale}/auth/login`} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.signIn')}
              </Link>
              <LanguageSwitcher />
              <Link
                href={`/${locale}/auth/login`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-dark transition-smooth"
              >
                {t('hero.cta.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-glow-pulse"></span>
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/${locale}/auth/login`}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover-lift shadow-glow transition-smooth"
            >
              {t('hero.cta.getStarted')}
            </Link>
            <button className="px-8 py-4 border-2 border-neutral-300 rounded-lg font-semibold text-lg hover:border-primary transition-smooth">
              Book a Demo
            </button>
          </div>

          <p className="text-sm text-neutral-500 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sound familiar?
            </h2>
            <p className="text-lg text-neutral-600">
              Product decisions that disappear into the void
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤔</div>
              <h3 className="font-semibold text-lg mb-2">Why did we build this?</h3>
              <p className="text-neutral-600 text-sm">
                Three months later, nobody remembers the original hypothesis or success criteria.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Did it actually work?</h3>
              <p className="text-neutral-600 text-sm">
                Shipped the feature, moved on. No idea if it hit the goals or why it failed.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-semibold text-lg mb-2">Repeating mistakes</h3>
              <p className="text-neutral-600 text-sm">
                Making the same bad decisions because there's no learning system in place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg text-neutral-600">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary transition-smooth hover-lift">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('howItWorks.phases.hypothesis.title')}</h3>
                <p className="text-neutral-600 text-sm">
                  {t('howItWorks.phases.hypothesis.description')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary transition-smooth hover-lift">
                <div className="w-12 h-12 bg-info/10 text-info rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('howItWorks.phases.execution.title')}</h3>
                <p className="text-neutral-600 text-sm">
                  {t('howItWorks.phases.execution.description')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary transition-smooth hover-lift">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('howItWorks.phases.review.title')}</h3>
                <p className="text-neutral-600 text-sm">
                  {t('howItWorks.phases.review.description')}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary transition-smooth hover-lift">
                <div className="w-12 h-12 bg-success/10 text-success rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('howItWorks.phases.outcome.title')}</h3>
                <p className="text-neutral-600 text-sm">
                  {t('howItWorks.phases.outcome.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JTBD Comparison Table */}
      <section className="bg-white py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
              Choose the Right Tool
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('jtbd.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('jtbd.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr] bg-neutral-50 border-b border-neutral-200">
                <div className="p-4 text-sm font-semibold text-neutral-600">{t('jtbd.headers.task')}</div>
                <div className="p-4 text-sm font-semibold text-neutral-600 text-center border-l border-neutral-200">
                  {t('jtbd.headers.github')}
                </div>
                <div className="p-4 text-sm font-semibold text-neutral-600 text-center border-l border-neutral-200">
                  {t('jtbd.headers.decisionOS')}
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                <div className="p-4 text-sm">
                  <div className="font-medium mb-1">{t('jtbd.tasks.bugTracking.title')}</div>
                  <div className="text-xs text-neutral-500">{t('jtbd.tasks.bugTracking.description')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-success text-xl font-bold">
                    ✓
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.bugTracking.perfect')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-error text-xl font-bold">
                    ✗
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.bugTracking.wrong')}</div>
                </div>
              </div>

              {/* Row 2: hypothesis */}
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                <div className="p-4 text-sm">
                  <div className="font-medium mb-1">{t('jtbd.tasks.hypothesis.title')}</div>
                  <div className="text-xs text-neutral-500">{t('jtbd.tasks.hypothesis.description')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-error text-xl font-bold">
                    ✗
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.hypothesis.github')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-success text-xl font-bold">
                    ✓
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.hypothesis.decisionOS')}</div>
                </div>
              </div>

              {/* Row 3: evidence */}
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                <div className="p-4 text-sm">
                  <div className="font-medium mb-1">{t('jtbd.tasks.evidence.title')}</div>
                  <div className="text-xs text-neutral-500">{t('jtbd.tasks.evidence.description')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-error text-xl font-bold">
                    ✗
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.evidence.github')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-success text-xl font-bold">
                    ✓
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.evidence.decisionOS')}</div>
                </div>
              </div>

              {/* Row 4: validate */}
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                <div className="p-4 text-sm">
                  <div className="font-medium mb-1">{t('jtbd.tasks.validate.title')}</div>
                  <div className="text-xs text-neutral-500">{t('jtbd.tasks.validate.description')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-error text-xl font-bold">
                    ✗
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.validate.github')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-success text-xl font-bold">
                    ✓
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.validate.decisionOS')}</div>
                </div>
              </div>

              {/* Row 5: learn */}
              <div className="grid grid-cols-[2fr_1fr_1fr] hover:bg-neutral-50 transition-colors">
                <div className="p-4 text-sm">
                  <div className="font-medium mb-1">{t('jtbd.tasks.learn.title')}</div>
                  <div className="text-xs text-neutral-500">{t('jtbd.tasks.learn.description')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-error text-xl font-bold">
                    ✗
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.learn.github')}</div>
                </div>
                <div className="p-4 text-center border-l border-neutral-200">
                  <span className="inline-flex items-center gap-1 text-success text-xl font-bold">
                    ✓
                  </span>
                  <div className="text-xs text-neutral-500 mt-1">{t('jtbd.tasks.learn.decisionOS')}</div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <div className="flex items-start gap-4">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-lg mb-2">The Bottom Line</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    <strong>Use GitHub Issues</strong> to track bugs and tasks.
                    <strong className="text-primary"> Use Decision OS</strong> to validate product decisions before committing engineering resources.
                    They work great together, but they solve completely different problems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Integration Highlight */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            {t('github.features.automation')}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('github.title')}
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            {t('github.description')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">✓ CI/CD logs</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">✓ Preview URLs</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">✓ Deployment status</div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-neutral-600">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
              <h3 className="font-bold text-xl mb-2">{t('pricing.starter.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-neutral-600">{t('pricing.starter.period')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>5 decision cycles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>1 project</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>GitHub integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Basic analytics</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/auth/login`}
                className="block text-center px-6 py-3 border-2 border-neutral-300 rounded-lg font-semibold hover:border-primary transition-smooth"
              >
                Start Free
              </Link>
            </div>

            {/* Pro - Highlighted */}
            <div className="bg-white border-2 border-primary rounded-xl p-8 relative shadow-glow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="font-bold text-xl mb-2">{t('pricing.pro.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                <span className="text-neutral-600">{t('pricing.pro.period')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Unlimited cycles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/auth/login`}
                className="block text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift transition-smooth"
              >
                Start 14-Day Trial
              </Link>
            </div>

            {/* Team */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
              <h3 className="font-bold text-xl mb-2">Team</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Up to 10 team members</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Advanced permissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/auth/login`}
                className="block text-center px-6 py-3 border-2 border-neutral-300 rounded-lg font-semibold hover:border-primary transition-smooth"
              >
                Start Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-primary-to-accent py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stop making decisions in the dark
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join product teams who validate, learn, and improve with every decision
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover-lift shadow-lg transition-smooth"
          >
            {t('hero.cta.getStarted')}
          </Link>
          <p className="text-sm mt-4 opacity-75">
            14 days free • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
              <span className="font-semibold">{tCommon('appName')}</span>
            </div>
            <div className="text-sm text-neutral-400">
              {t('footer.builtFor')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
