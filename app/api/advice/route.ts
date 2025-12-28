import { NextRequest, NextResponse } from 'next/server';
import { SkinConcernType } from '@/types';
import {
  drynessAdvice,
  spotsAdvice,
  acneAdvice,
  poresAdvice,
  wrinklesAdvice,
  saggingAdvice,
  sensitiveAdvice,
  lifestyleAdvice,
} from '@/lib/adviceData';

// 各悩みのアドバイスデータを取得
const adviceMap: Record<SkinConcernType, typeof drynessAdvice> = {
  dryness: drynessAdvice,
  spots: spotsAdvice,
  acne: acneAdvice,
  pores: poresAdvice,
  wrinkles: wrinklesAdvice,
  sagging: saggingAdvice,
  sensitive: sensitiveAdvice,
};

// ランダムにインデックスを選択
function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export async function POST(request: NextRequest) {
  try {
    const { concerns } = await request.json() as {
      concerns: SkinConcernType[];
      age: number;
    };

    if (!concerns || concerns.length === 0) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 選択された悩みに応じたアドバイスを生成
    const analysisTexts: string[] = [];
    const treatmentTexts: string[] = [];
    const depacosTexts: string[] = [];
    const drugstoreTexts: string[] = [];

    // 各悩みからランダムにアドバイスを選択
    concerns.forEach((concern) => {
      const advice = adviceMap[concern];
      if (advice) {
        const idx = getRandomIndex(advice.analysis.length);
        analysisTexts.push(advice.analysis[idx]);
        treatmentTexts.push(advice.treatment[idx]);
        depacosTexts.push(advice.depacos[idx]);
        drugstoreTexts.push(advice.drugstore[idx]);
      }
    });

    // 生活習慣アドバイスをランダムに選択
    const lifestyleIdx = getRandomIndex(lifestyleAdvice.length);
    const lifestyle = lifestyleAdvice[lifestyleIdx];

    // 複数の悩みがある場合は区切りを入れて結合
    const separator = '\n\n━━━━━━━━━━━━━━━━━\n\n';

    const result = {
      analysis: analysisTexts.join(separator),
      treatment: treatmentTexts.join(separator),
      depacos: depacosTexts.join(separator),
      drugstore: drugstoreTexts.join(separator),
      lifestyle,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Advice API error:', error);
    return NextResponse.json(
      { error: 'アドバイスの生成に失敗しました' },
      { status: 500 }
    );
  }
}
