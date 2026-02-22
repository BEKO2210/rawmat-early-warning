import { analyzeMarketWithGPT, generateTradingSignal } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { marketData, type } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key not configured' },
        { status: 500 }
      );
    }

    let result;
    if (type === 'analysis') {
      result = await analyzeMarketWithGPT(marketData);
    } else if (type === 'signal') {
      result = await generateTradingSignal(marketData);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
