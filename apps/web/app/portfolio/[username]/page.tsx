import { AMAWidget } from '../../components/ama/AMAWidget';

interface Props { params: { username: string } }

export default async function PortfolioPage({ params }: Props) {
  const { username } = params;
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-4">{username}</h1>
        <p className="text-zinc-400 mb-16">Software Engineer</p>
        <div className="grid gap-6">
          <div className="border border-zinc-800 rounded-xl p-6 text-zinc-500 text-sm">
            Projects appear here once imported.
          </div>
        </div>
      </section>
      <AMAWidget username={username} />
    </main>
  );
}
