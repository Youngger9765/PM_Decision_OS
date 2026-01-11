"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Mock login - store user in localStorage
    localStorage.setItem("mockUser", JSON.stringify({
      id: "user_1",
      name: "Demo User",
      email: "demo@example.com",
      image: null
    }));
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg"></div>
            <span className="text-2xl font-bold">Decision OS</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-neutral-600">Sign in to manage your product decisions</p>
        </div>

        <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Continue with GitHub (Mock)
          </button>

          <p className="text-xs text-neutral-500 text-center mt-6">
            This is a demo. Click to login without real GitHub OAuth.
          </p>
        </div>

        <p className="text-center text-sm text-neutral-600 mt-6">
          <Link href="/" className="hover:text-neutral-900">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
