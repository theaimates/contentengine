import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Vercel Pro: up to 60s. Free tier: 10s (n8n may exceed that — use Pro or self-host).
export const maxDuration = 60;

export async function POST(request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, errorCode: 'WEBHOOK_NOT_CONFIGURED', message: 'Webhook URL is not set on the server.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errorCode: 'INVALID_REQUEST', message: 'Request body must be JSON.' },
      { status: 400 }
    );
  }

  const { url, tone } = body;
  if (!url) {
    return NextResponse.json(
      { success: false, errorCode: 'MISSING_URL', message: 'url is required.' },
      { status: 400 }
    );
  }

  let n8nRes;
  try {
    n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, tone: tone || 'default' }),
      signal: AbortSignal.timeout(58000),
    });
  } catch (err) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError';
    return NextResponse.json(
      {
        success: false,
        errorCode: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout
          ? 'The workflow timed out. Try a shorter video.'
          : 'Could not reach the automation server.',
      },
      { status: 502 }
    );
  }

  let data;
  try {
    data = await n8nRes.json();
  } catch {
    return NextResponse.json(
      { success: false, errorCode: 'INVALID_RESPONSE', message: 'The automation server returned an unexpected response.' },
      { status: 502 }
    );
  }

  return NextResponse.json(data, { status: n8nRes.status });
}
