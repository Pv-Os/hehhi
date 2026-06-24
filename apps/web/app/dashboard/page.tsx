import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {session.user?.name}</h1>
      <p className="text-zinc-400 mb-8">Let's build your portfolio.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 rounded-xl p-6">
          <div className="text-xs text-zinc-500 mb-2">STEP 1</div>
          <h2 className="font-semibold mb-1">Import your repos</h2>
          <p className="text-sm text-zinc-400">Paste a GitHub URL or import from your profile.</p>
          <button className="mt-4 text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            Add project →
          </button>
        </div>

        <div className="border border-zinc-800 rounded-xl p-6">
          <div className="text-xs text-zinc-500 mb-2">STEP 2</div>
          <h2 className="font-semibold mb-1">Set up your AMA</h2>
          <p className="text-sm text-zinc-400">Tell visitors about your work in your own words.</p>
          <button className="mt-4 text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            Configure AMA →
          </button>
        </div>

        <div className="border border-zinc-800 rounded-xl p-6">
          <div className="text-xs text-zinc-500 mb-2">STEP 3</div>
          <h2 className="font-semibold mb-1">Publish</h2>
          <p className="text-sm text-zinc-400">Go live at your hehhi.me URL.</p>
          <button className="mt-4 text-sm bg-zinc-800 text-zinc-500 px-4 py-2 rounded-lg cursor-not-allowed">
            Publish (complete steps first)
          </button>
        </div>
      </div>
    </main>
  );
}
