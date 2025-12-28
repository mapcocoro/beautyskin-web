import { NextRequest, NextResponse } from 'next/server';
import { SkinConcernType, SKIN_CONCERNS } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { concerns, age } = await request.json() as {
      concerns: SkinConcernType[];
      age: number;
    };

    if (!concerns || concerns.length === 0 || !age) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    const concernNames = concerns
      .map((c) => SKIN_CONCERNS.find((sc) => sc.id === c)?.name)
      .filter(Boolean)
      .join('、');

    const prompt = `あなたは美容皮膚科医と美容カウンセラーの知識を持つ専門家です。以下の条件に基づいて、詳細でパーソナライズされた美容アドバイスを提供してください。

【ユーザー情報】
- 年齢: ${age}歳
- 肌の悩み: ${concernNames}

以下の5つのカテゴリに分けて、具体的で実践的なアドバイスを提供してください。

1. 症状分析: この悩みの原因と${age}歳特有の肌状態について詳しく分析（150文字程度）

2. 美容皮膚科・レーザー治療: 具体的な治療名と効果、費用目安を含めて説明
   - 例: ピコレーザー、フォトフェイシャル、ダーマペン、HIFU、ボトックス等
   - 治療の特徴と期待できる効果（200文字程度）

3. デパコスおすすめ: 高品質なデパートコスメから具体的なブランド・商品名を挙げて紹介
   - 例: SK-II、POLA、クレ・ド・ポー ボーテ、LANCOME、Dior等
   - 各商品の特徴と価格帯も記載（200文字程度）

4. ドラコスおすすめ: ドラッグストアで買えるコスパの良い商品を具体的に紹介
   - 例: 肌ラボ、メラノCC、キュレル、ミノン、ちふれ等
   - 各商品の特徴と価格帯も記載（200文字程度）

5. 生活習慣: 食事、睡眠、運動など内側からのケアアドバイス（150文字程度）

回答は以下のJSON形式で返してください：
{
  "analysis": "症状分析のテキスト",
  "treatment": "美容皮膚科・レーザー治療のテキスト",
  "depacos": "デパコスおすすめのテキスト",
  "drugstore": "ドラコスおすすめのテキスト",
  "lifestyle": "生活習慣のテキスト"
}`;

    if (!GEMINI_API_KEY) {
      // APIキーがない場合は症状に応じたダミーレスポンスを返す
      const dummyResponses = generateDummyResponse(concerns, age, concernNames);
      return NextResponse.json(dummyResponses);
    }

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
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
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

    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Advice API error:', error);
    return NextResponse.json(
      { error: 'アドバイスの生成に失敗しました' },
      { status: 500 }
    );
  }
}

function generateDummyResponse(concerns: SkinConcernType[], age: number, concernNames: string) {
  let analysis = `${age}歳で${concernNames}にお悩みとのこと。`;
  let treatment = '';
  let depacos = '';
  let drugstore = '';

  if (concerns.includes('dryness')) {
    analysis += '乾燥は肌のバリア機能低下が主な原因です。加齢による皮脂分泌の減少や、季節・環境の影響も考えられます。';
    treatment += '【水光注射】ヒアルロン酸を直接注入し、内側から潤いをプラス（1回2-3万円）。【イオン導入】美容成分を効率的に浸透させる施術（1回5千-1万円）。';
    depacos += '【SK-II フェイシャルトリートメントエッセンス】ピテラ配合で保湿力抜群（約2.3万円）。【POLA B.A ローション】エイジングケアと保湿を両立（約2.2万円）。';
    drugstore += '【肌ラボ 極潤ヒアルロン液】5種のヒアルロン酸配合でしっかり保湿（約700円）。【キュレル 潤浸保湿フェイスクリーム】セラミド配合で敏感肌にも（約2,500円）。';
  }

  if (concerns.includes('spots')) {
    analysis += 'シミは紫外線ダメージの蓄積やホルモンバランスの変化が原因です。メラニンが過剰に生成され、排出が追いつかなくなっています。';
    treatment += '【ピコレーザー】従来のレーザーより短い照射時間でシミを除去（1回1-3万円）。【フォトフェイシャル（IPL）】光でメラニンを分解、肌全体のトーンアップ（1回1.5-3万円）。';
    depacos += '【HAKU メラノフォーカスZ】資生堂の美白美容液、シミ予防に効果的（約1.1万円）。【クレ・ド・ポー セラムエクレルシサン】高級美白美容液（約2.6万円）。';
    drugstore += '【メラノCC 薬用しみ集中対策美容液】ビタミンC誘導体配合（約1,200円）。【ケシミンクリーム】シミ・そばかすを防ぐ薬用クリーム（約1,800円）。';
  }

  if (concerns.includes('acne')) {
    analysis += 'ニキビは毛穴の詰まりと皮脂の過剰分泌、アクネ菌の増殖が原因です。ホルモンバランスやストレス、食生活も影響します。';
    treatment += '【ケミカルピーリング】古い角質を除去し、毛穴詰まりを解消（1回5千-1.5万円）。【PDT（光線力学療法）】アクネ菌を殺菌し、ニキビの炎症を抑制（1回1-2万円）。';
    depacos += '【CLINIQUE アクネクリアリングジェル】ニキビケア専用ジェル（約4,400円）。【ALBION スキンコンディショナー】皮脂バランスを整える（約5,500円）。';
    drugstore += '【ペアアクネクリームW】炎症を抑える医薬品（約1,000円）。【NOV ACアクティブ】敏感肌向けニキビケア（約1,600円）。';
  }

  if (concerns.includes('pores')) {
    analysis += '毛穴の開きは皮脂の過剰分泌や加齢によるたるみ、角栓の蓄積が原因です。特に鼻周りは皮脂腺が多く目立ちやすいです。';
    treatment += '【ダーマペン4】微細な針で肌を刺激し、コラーゲン生成を促進（1回2-4万円）。【カーボンピーリング】レーザーで毛穴の汚れを除去（1回1-2万円）。';
    depacos += '【LANCOME ジェニフィック アドバンスト】毛穴を目立たなくする美容液（約1.5万円）。【Dior プレステージ ホワイト】毛穴ケアと美白を両立（約3万円）。';
    drugstore += '【毛穴撫子 お米のマスク】毛穴を引き締める（約700円/10枚）。【ビオレ おうちdeエステ 洗顔ジェル】毛穴汚れを落とす（約600円）。';
  }

  if (concerns.includes('wrinkles')) {
    analysis += 'しわは肌のコラーゲンやエラスチンの減少、乾燥、表情筋の動きの蓄積が原因です。紫外線ダメージも大きく影響します。';
    treatment += '【ボトックス注射】表情じわを改善、予防にも効果的（1回3-6万円）。【ヒアルロン酸注入】深いしわを直接埋める（1回5-10万円）。【HIFU】超音波でリフトアップ（1回5-15万円）。';
    depacos += '【POLA リンクルショット メディカルセラム】シワ改善効果が認められた美容液（約1.5万円）。【エスティローダー アドバンスナイトリペア】夜用美容液（約1.3万円）。';
    drugstore += '【エリクシール シュペリエル エンリッチド リンクルクリーム】シワ改善クリーム（約6,000円）。【純粋レチノール原液】エイジングケアに（約1,500円）。';
  }

  if (concerns.includes('sagging')) {
    analysis += 'たるみは加齢によるコラーゲン・エラスチンの減少、筋肉の衰え、脂肪の下垂が原因です。重力の影響も徐々に現れてきます。';
    treatment += '【HIFU（ハイフ）】超音波で肌の深部を引き締め（1回5-15万円）。【糸リフト】溶ける糸で物理的にリフトアップ（1回15-30万円）。【サーマクール】高周波でたるみを改善（1回15-30万円）。';
    depacos += '【クレ・ド・ポー シナクティフ】最高峰のエイジングケアライン（クリーム約6万円）。【SK-II R.N.A.パワー ラディカル ニューエイジ】ハリを与える（約1.5万円）。';
    drugstore += '【なめらか本舗 リンクルクリーム】豆乳イソフラボン配合（約1,000円）。【肌美精 リフト保湿クリーム】リフトケア（約1,500円）。';
  }

  if (concerns.includes('sensitive')) {
    analysis += '敏感肌はバリア機能の低下により、外部刺激に反応しやすくなっている状態です。ストレスや季節の変わり目、不適切なスキンケアも原因になります。';
    treatment += '【エレクトロポレーション】針を使わず美容成分を浸透（1回1-2万円）。【プラセンタ注射】肌の再生力を高める（1回2-5千円）。敏感肌でも受けられる施術を相談しましょう。';
    depacos += '【DECORTE リポソーム アドバンスト リペアセラム】肌に優しい保湿美容液（約1.2万円）。【アクセーヌ モイストバランスローション】敏感肌向け（約6,050円）。';
    drugstore += '【ミノン アミノモイスト】低刺激で保湿力抜群（約1,500円）。【キュレル 化粧水】セラミドケア（約2,000円）。【dプログラム】資生堂の敏感肌ライン（約2,500円）。';
  }

  // デフォルト値の設定
  if (!treatment) treatment = '美容皮膚科では、お悩みに応じた様々な治療オプションがあります。まずはカウンセリングで肌状態を診てもらいましょう。';
  if (!depacos) depacos = 'SK-IIやPOLA、クレ・ド・ポー ボーテなど、高品質なデパコスがおすすめです。カウンターで肌診断を受けると最適な商品が見つかります。';
  if (!drugstore) drugstore = '肌ラボ、キュレル、ミノンなど、ドラッグストアでも優秀なスキンケア製品が揃っています。まずはトライアルサイズから試してみましょう。';

  const lifestyle = `美肌のためには、十分な睡眠（7-8時間）とバランスの良い食事が基本です。ビタミンC・E、タンパク質を積極的に摂取しましょう。紫外線対策は年間を通じて行い、適度な運動で血行促進も心がけてください。ストレス管理も肌状態に大きく影響します。`;

  return {
    analysis,
    treatment,
    depacos,
    drugstore,
    lifestyle,
  };
}
