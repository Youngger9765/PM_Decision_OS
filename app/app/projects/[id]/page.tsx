"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getMockProject, getMockCyclesForProject } from "@/lib/mock-data";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
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

  const project = getMockProject(params.id as string);
  if (!project) return <div>Project not found</div>;

  const cycles = getMockCyclesForProject(project.id);

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
            <Link href="/app" className="flex items-center gap-3 hover:opacity-80">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-md"></div>
              <h1 className="text-xl font-semibold">Decision OS</h1>
            </Link>
            <span className="text-sm text-neutral-600">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/app" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              {project.githubConnection && (
                <p className="text-neutral-600 font-mono">
                  {project.githubConnection.repoOwner}/{project.githubConnection.repoName}
                </p>
              )}
            </div>
            {project.githubConnection ? (
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                ✓ GitHub Connected
              </span>
            ) : (
              <button className="px-4 py-2 border-2 border-neutral-300 rounded-md hover:border-teal-600 text-sm font-medium">
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Decision Cycles</h2>
          <button
            onClick={() => router.push(`/app/cycles/new?projectId=${project.id}`)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 text-sm font-medium"
          >
            New Decision Cycle
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Owner</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {cycles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No decision cycles yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                cycles.map((cycle) => (
                  <tr
                    key={cycle.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => router.push(`/app/cycles/${cycle.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{cycle.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{cycle.ownerName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cycle.status)}`}>
                        {cycle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{cycle.updatedAt.toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
