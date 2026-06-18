import Anthropic from '@anthropic-ai/sdk';
import type { ServerResponse } from 'http';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(devName: string, context: string): string {
  return `You are an AI assistant representing ${devName}'s portfolio on hehhi.me.
Your ONLY job is to answer questions about ${devName}'s work using the context below.

STRICT RULES:
1. Only answer using information explicitly present in the CONTEXT section below.
2. If the answer is not in the context, respond with exactly:
   "I don't have enough context to answer that. ${devName} would know best — you can reach them directly."
3. Never invent, infer, or speculate about skills, experience, or credentials not in the context.
4. Never claim the developer built something not in the context.
5. Keep answers concise and technically accurate.
6. You are NOT a general AI assistant. Redirect off-topic questions politely.

CONTEXT:
${context}`;
}

async function retrieveContext(username: string): Promise<{ devName: string; context: string }> {
  // TODO: query DB for portfolio by username
  // TODO: Phase 2 — embed question, query Pinecone, get top-k chunks
  return { devName: username, context: '[Portfolio context loaded from DB here]' };
}

export async function askAMA({
  username, question, visitorId, stream,
}: {
  username: string;
  question: string;
  visitorId: string;
  stream: ServerResponse;
}) {
  const { devName, context } = await retrieveContext(username);
  const systemPrompt = buildSystemPrompt(devName, context);

  const response = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  });

  for await (const chunk of response) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      stream.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
    }
  }
  // TODO: log question + answer to DB (REQ-010)
}
