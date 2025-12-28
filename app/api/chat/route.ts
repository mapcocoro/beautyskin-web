import { NextRequest, NextResponse } from 'next/server';
import { SkinConcernType, SKIN_CONCERNS } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, concerns, age, history } = await request.json() as {
      message: string;
      concerns: SkinConcernType[];
      age: number;
      history: ChatHistory[];
    };

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    const concernNames = concerns
      .map((c) => SKIN_CONCERNS.find((sc) => sc.id === c)?.name)
      .filter(Boolean)
      .join('、');

    const systemPrompt = `あなたは「美肌コンシェルジュ」という名前の美容アドバイザーAIです。
以下のユーザー情報を元に、親身になって美容相談に応じてください。

【ユーザー情報】
- 年齢: ${age}歳
- 肌の悩み: ${concernNames}

【応答ルール】
- 丁寧で親しみやすい口調で話してください
- 具体的で実践的なアドバイスを心がけてください
- 医療に関しては「医師にご相談ください」と付け加えてください
- 回答は200文字程度で簡潔にまとめてください`;

    if (!GEMINI_API_KEY) {
      // APIキーがない場合はダミーレスポンスを返す
      const dummyResponses = [
        `${concernNames}についてのご質問ですね。毎日のスキンケアで大切なのは、まず自分の肌質を知ることです。${age}歳の方には、年齢に合った保湿ケアをおすすめします。`,
        'ご質問ありがとうございます。美肌のためには、外側からのケアだけでなく、内側からのケアも大切です。バランスの良い食事と十分な睡眠を心がけましょう。',
        '素敵なご質問ですね。スキンケア製品を選ぶ際は、自分の肌悩みに合った成分が配合されているかチェックしてみてください。',
      ];
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      return NextResponse.json({ response: randomResponse });
    }

    // 会話履歴を構築
    const conversationHistory = history.map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            {
              role: 'model',
              parts: [{ text: 'はい、美肌コンシェルジュとしてお手伝いさせていただきます。' }],
            },
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'チャットの応答に失敗しました' },
      { status: 500 }
    );
  }
}
