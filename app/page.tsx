"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const phases = [
    { title: "Hypothesis", status: "DRAFTING", color: "amber" },
    { title: "Execution", status: "EXECUTING", color: "blue" },
    { title: "Review", status: "REVIEW", color: "purple" },
    { title: "Outcome", status: "CLOSED", color: "teal" }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-md"></div>
              <span className="text-lg font-semibold tracking-tight">Decision OS</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Youngger9765/PM_Decision_OS" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                GitHub
              </a>
              <Link href="/auth/login" className="text-sm font-medium px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            Turn product decisions into actionable outcomes
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Execute structured decision cycles with GitHub workflow integration
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login" className="px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
              Get Started
            </Link>
            <a href="https://github.com/Youngger9765/PM_Decision_OS" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-neutral-300 rounded-lg hover:border-neutral-400">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-neutral-200 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">How Decision OS Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Hypothesis Definition", desc: "Define hypothesis, success criteria, and scope" },
              { step: "02", title: "Execution", desc: "Trigger GitHub workflows with one click" },
              { step: "03", title: "Review", desc: "Examine evidence and validate hypothesis" },
              { step: "04", title: "Outcome", desc: "Record outcome: Proceed, Iterate, or Stop" }
            ].map((item, i) => (
              <div key={i} className="border border-neutral-200 rounded-xl p-6">
                <div className="text-xs font-mono text-neutral-400 mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-neutral-200 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">$0</div>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ 1 Project</li>
                <li>✓ 3 Decision Cycles</li>
              </ul>
            </div>
            <div className="bg-neutral-900 text-white rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-6">$19<span className="text-base font-normal">/mo</span></div>
              <ul className="space-y-2 text-sm">
                <li>✓ 5 Projects</li>
                <li>✓ Unlimited Cycles</li>
              </ul>
            </div>
            <div className="border-2 border-neutral-200 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$49<span className="text-base font-normal text-neutral-600">/mo</span></div>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Unlimited Projects</li>
                <li>✓ Team Collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-neutral-600">Built for Product Managers who take decisions seriously</p>
        </div>
      </footer>
    </div>
  );
}
