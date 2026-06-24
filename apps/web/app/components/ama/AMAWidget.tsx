'use client';
import { useState, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function AMAWidget({ username }: { username: string }) {
  const [open, setOpen]         = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function ask() {
    if (!question.trim() || loading) return;
    const q = question;
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setQuestion('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

    abortRef.current = new AbortController();
    try {
      const res = await fetch(`/api/ama/${username}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, visitorId: getVisitorId() }),
        signal: abortRef.current.signal,
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const { text } = JSON.parse(line.slice(6));
            if (text) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = { ...last, content: last.content + text };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' };
          return updated;
        });
      }
    } finally {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = { ...last, isStreaming: false };
        return updated;
      });
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-sm font-medium text-white">Ask about {username}&apos;s work</span>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white text-lg leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 text-sm">
            {messages.length === 0 && (
              <p className="text-zinc-500 text-xs">Ask anything — architecture decisions, tech choices, how something works.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block px-3 py-2 rounded-xl max-w-[90%] ${
                  m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-100'
                }`}>
                  {m.content}
                  {m.isStreaming && <span className="animate-pulse ml-1">▍</span>}
                </span>
              </div>
            ))}
          </div>

          <p className="text-zinc-600 text-[10px] px-4 pb-1">
            Powered by hehhi AI · Answers based on {username}&apos;s own content
          </p>

          <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="Ask anything about my work..."
              className="flex-1 bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-zinc-500"
            />
            <button
              onClick={ask}
              disabled={loading || !question.trim()}
              className="text-white bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-2 rounded-lg text-sm transition-colors"
            >↑</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black rounded-full px-5 py-3 text-sm font-medium shadow-lg hover:bg-zinc-100 transition-colors"
        >
          Ask me anything ✦
        </button>
      )}
    </div>
  );
}

function getVisitorId(): string {
  const key = 'hehhi_vid';
  let id = sessionStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
  return id;
}
