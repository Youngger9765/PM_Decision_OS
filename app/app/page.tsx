"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockProjects, mockCycles } from "@/lib/mock-data";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router]);

  if (!user) return null;

  const recentCycles = mockCycles.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFTING": return "bg-amber-100 text-amber-800";
      case "EXECUTING": return "bg-blue-100 text-blue-800";
      case "REVIEW": return "bg-purple-100 text-purple-800";
      case "OUTCOME": return "bg-teal-100 text-teal-800";
      case "CLOSED": return "bg-neutral-100 text-neutral-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-md"></div>
              <h1 className="text-xl font-semibold">Decision OS</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("mockUser");
                  router.push("/");
                }}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 text-sm font-medium">
              New Project
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className="block bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-teal-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {project.githubConnection ? (
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">Connected</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">Not Connected</span>
                  )}
                </div>
                {project.githubConnection && (
                  <p className="text-sm text-neutral-600 mb-3 font-mono">
                    {project.githubConnection.repoOwner}/{project.githubConnection.repoName}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{project.cycleCount} cycles</span>
                  <span className="text-neutral-400">{project.updatedAt.toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Decision Cycles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Decision Cycles</h2>

          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentCycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => router.push(`/app/cycles/${cycle.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{cycle.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{cycle.projectName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cycle.status)}`}>
                        {cycle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{cycle.updatedAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
