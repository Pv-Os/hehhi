'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  primaryLanguage: string;
  url: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [repoUrl, setRepoUrl]     = useState('');
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // Fetch existing projects on load
  useEffect(() => {
    if (!session?.username) return;
    fetch(`http://localhost:3001/api/portfolio/${session.username}`)
      .then(r => r.json())
      .then(data => {
        if (data.portfolio?.projects) {
          setProjects(data.portfolio.projects);
        }
      });
  }, [session]);

  async function handleImport() {
    if (!repoUrl.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/github/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          accessToken: session?.accessToken,
          portfolioId: session?.portfolioId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }

      setProjects(prev => [data.project, ...prev]);
      setRepoUrl('');
    } catch (err) {
      setError('Failed to import repo. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return <p className="p-8 text-white">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {session.user?.name}</h1>
      <p className="text-zinc-400 mb-8">Let's build your portfolio.</p>

      {/* Import form */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Add a project</h2>
        <div className="flex gap-3">
          <input
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleImport()}
            placeholder="https://github.com/owner/repo"
            className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg outline-none placeholder-zinc-500 text-sm"
          />
          <button
            onClick={handleImport}
            disabled={loading || !repoUrl.trim()}
            className="bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Importing...' : 'Import →'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Projects list */}
      {projects.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-3">Your projects</h2>
          <div className="grid gap-4">
            {projects.map(project => (
              <div key={project.id} className="border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.primaryLanguage && (
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">
                      {project.primaryLanguage}
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  {project.description || 'No description'}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  {project.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-xl p-6 text-zinc-500 text-sm">
          No projects yet. Paste a GitHub URL above to get started.
        </div>
      )}
    </main>
  );
}