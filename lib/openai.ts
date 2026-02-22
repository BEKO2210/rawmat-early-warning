import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMarketWithGPT(marketData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Rohstoff-Analyst. Analysiere die Marktdaten und gib eine kurze Einschätzung (max 3 Sätze).'
        },
        {
          role: 'user',
          content: `Markt: ${marketData.name}
Preis: $${marketData.price}
24h Change: ${marketData.change24h}%
Mismatch Score: ${marketData.mismatchScore}
Demand Index: ${marketData.demandIndex}
Supply Index: ${marketData.supplyIndex}
Alert Level: ${marketData.alertLevel}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || 'Keine Analyse verfügbar.';
  } catch (error) {
    console.error('OpenAI Error:', error);
    return 'GPT-Analyse nicht verfügbar.';
  }
}

export async function generateTradingSignal(marketData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Gib eine kurze Handelsempfehlung (HOLD, BUY, SELL) mit Begründung (1 Satz).'
        },
        {
          role: 'user',
          content: `Markt: ${marketData.name}, Mismatch: ${marketData.mismatchScore}, Alert: ${marketData.alertLevel}`
        }
      ],
      max_tokens: 100,
      temperature: 0.5
    });

    return response.choices[0]?.message?.content || 'HOLD';
  } catch (error) {
    return 'HOLD';
  }
}
