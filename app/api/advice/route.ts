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

    const prompt = `あなたは「美肌コンシェルジュ」という美容カウンセラーです。
お客様に寄り添い、親身になってアドバイスを提供してください。

【お客様情報】
- 年齢: ${age}歳
- 肌の悩み: ${concernNames}

以下の5つのカテゴリに分けて、温かみのある口調でアドバイスしてください。
各項目は改行を入れて読みやすくしてください。

1. 症状分析:
   - お悩みに共感しながら、原因をやさしく説明
   - ${age}歳特有の肌状態にも触れる

2. 美容皮膚科・レーザー治療:
   - 具体的な治療名と効果、費用目安
   - 各治療は改行して見やすく
   - 例: ピコレーザー、フォトフェイシャル、ダーマペン、HIFU等

3. デパコスおすすめ:
   - 具体的なブランド・商品名と価格帯
   - 各商品は改行して見やすく
   - 例: SK-II、POLA、クレ・ド・ポー ボーテ等

4. ドラコスおすすめ:
   - ドラッグストアで買えるコスパの良い商品
   - 各商品は改行して見やすく
   - 例: 肌ラボ、メラノCC、キュレル等

5. 生活習慣:
   - 内側からのケアを優しくアドバイス

回答は以下のJSON形式で返してください：
{
  "analysis": "症状分析のテキスト（改行は\\nで）",
  "treatment": "美容皮膚科・レーザー治療のテキスト（改行は\\nで）",
  "depacos": "デパコスおすすめのテキスト（改行は\\nで）",
  "drugstore": "ドラコスおすすめのテキスト（改行は\\nで）",
  "lifestyle": "生活習慣のテキスト（改行は\\nで）"
}`;

    if (!GEMINI_API_KEY) {
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
  // 年代別のアドバイス調整
  const ageGroup = age < 30 ? '20代' : age < 40 ? '30代' : age < 50 ? '40代' : '50代以上';

  let analysis = `${age}歳で${concernNames}にお悩みなのですね。\n\nお気持ち、よく分かります。多くの方が同じお悩みを抱えていらっしゃいますので、ご安心くださいね。\n\n`;
  let treatment = '';
  let depacos = '';
  let drugstore = '';

  // 肝斑チェック（シミの場合は注意喚起）
  const hasSpots = concerns.includes('spots');
  const spotWarning = hasSpots ? '\n\n⚠️ 大切なお知らせ\nシミには「肝斑（かんぱん）」という種類があり、頬骨あたりに左右対称にもやっと広がるタイプです。\n肝斑は刺激で悪化することがあるため、レーザー治療は慎重に。\nまずは医師に診断してもらうことをおすすめします。' : '';

  if (concerns.includes('dryness')) {
    analysis += `乾燥は、肌のバリア機能が低下しているサインです。\n\n${ageGroup}は${age < 30 ? '環境の変化やストレスで' : '皮脂分泌の減少で'}乾燥しやすい時期。\n季節や環境の変化も影響しています。\n\n適切なケアで、しっとり潤う肌を目指しましょう！`;
    treatment += `✨ 水光注射\nヒアルロン酸を直接注入して、内側からぷるぷるに♪\nダウンタイム：ほぼなし〜数日\n💰 1回 2〜3万円\n\n✨ イオン導入\n美容成分を効率的に届けるやさしい施術です\nダウンタイム：なし\n💰 1回 5千〜1万円`;
    depacos += `💎 SK-II フェイシャルトリートメントエッセンス\nピテラ配合で、使うほどに潤いを実感できます\n💰 約2.3万円\n\n💎 POLA B.A ローション\nエイジングケアと保湿を同時に叶える贅沢な一本\n💰 約2.2万円`;
    drugstore += `🌟 肌ラボ 極潤ヒアルロン液\n5種のヒアルロン酸でしっかり保湿！コスパ最強です\n💰 約700円\n\n🌟 キュレル 潤浸保湿フェイスクリーム\nセラミド配合で敏感肌さんにも安心\n💰 約2,500円`;
  }

  if (concerns.includes('spots')) {
    analysis += `シミは、これまでの紫外線ダメージの蓄積や、ホルモンバランスの変化が原因です。\n\n${ageGroup}は${age < 35 ? 'そばかすが気になる方も多い時期' : 'シミが増えやすい、または濃くなりやすい時期'}。\nメラニンが過剰に作られ、うまく排出できなくなっているんですね。\n\n今からでも遅くありません！一緒にケアしていきましょう♪${spotWarning}`;
    treatment += `✨ ピコレーザー（ピコ秒レーザー）\n従来のQスイッチより短いパルスでシミにアプローチ\nダウンタイム：点状のかさぶた数日〜1週間\n💰 1回 1〜3万円\n\n✨ フォトフェイシャル（IPL/BBL）\n光の力で薄いシミ・赤み・くすみをまとめてケア\nシミ単品より「全体の底上げ」向き\nダウンタイム：ほぼなし\n💰 1回 1.5〜3万円\n\n✨ Qスイッチレーザー\nスポット状の濃いシミに効果的\nダウンタイム：かさぶた1〜2週間\n💰 1回 5千〜2万円`;
    depacos += `💎 HAKU メラノフォーカスZ\n資生堂の本格美白美容液。シミ予防の定番です\n💰 約1.1万円\n\n💎 クレ・ド・ポー セラムエクレルシサン\n贅沢な使用感の高級美白美容液\n💰 約2.6万円`;
    drugstore += `🌟 メラノCC 薬用しみ集中対策美容液\nビタミンC誘導体配合でコスパ◎\n💰 約1,200円\n\n🌟 ケシミンクリーム\nシミ・そばかすを防ぐロングセラー\n💰 約1,800円`;
  }

  if (concerns.includes('acne')) {
    analysis += `ニキビは、毛穴の詰まりと皮脂、アクネ菌が原因です。\n\n${ageGroup}は${age < 25 ? 'ホルモンバランスの影響を受けやすい時期' : 'ストレスや生活習慣が影響しやすい時期'}。\n\n焦らず、正しいケアを続けていきましょうね！`;
    treatment += `✨ ケミカルピーリング\n古い角質をオフして、毛穴詰まりをスッキリ解消\nダウンタイム：ほぼなし〜軽い赤み数日\n💰 1回 5千〜1.5万円\n\n✨ PDT（光線力学療法）\nアクネ菌を殺菌して炎症を鎮めます\nダウンタイム：赤み1〜3日\n💰 1回 1〜2万円\n\n✨ ノンアブレイティブ・フラクショナル\nニキビ跡の凹みにも効果的\nダウンタイム：赤み数日\n💰 1回 2〜4万円`;
    depacos += `💎 CLINIQUE アクネクリアリングジェル\nニキビケア専用。さっぱりした使用感\n💰 約4,400円\n\n💎 ALBION スキンコンディショナー\n皮脂バランスを整える名品化粧水\n💰 約5,500円`;
    drugstore += `🌟 ペアアクネクリームW\n炎症ニキビにしっかり効く医薬品\n💰 約1,000円\n\n🌟 NOV ACアクティブ\n敏感肌でも使えるニキビケアライン\n💰 約1,600円`;
  }

  if (concerns.includes('pores')) {
    analysis += `毛穴の開きは、皮脂の過剰分泌や、年齢によるたるみ、角栓の蓄積が原因です。\n\n${ageGroup}は${age < 35 ? '皮脂分泌が多く毛穴が目立ちやすい時期' : 'たるみ毛穴（縦に伸びる毛穴）も気になり始める時期'}。\n\n正しいケアで、キュッと引き締まった肌を目指しましょう！`;
    treatment += `✨ ダーマペン4\n微細な針でコラーゲン生成を促進。毛穴がキュッと引き締まります\nダウンタイム：赤み2〜3日\n💰 1回 2〜4万円\n\n✨ カーボンピーリング\nレーザーで毛穴の汚れをスッキリ除去\nダウンタイム：ほぼなし\n💰 1回 1〜2万円\n\n✨ ノンアブレイティブ・フラクショナル（1550nm等）\n毛穴・肌理・小じわを回数で改善\nダウンタイム：赤み数日\n💰 1回 2〜4万円`;
    depacos += `💎 LANCOME ジェニフィック アドバンスト\n毛穴を目立たなくする人気美容液\n💰 約1.5万円\n\n💎 Dior プレステージ ホワイト\n毛穴ケアと美白を同時に叶えます\n💰 約3万円`;
    drugstore += `🌟 毛穴撫子 お米のマスク\n毛穴を引き締めるプチプラの名品\n💰 約700円/10枚\n\n🌟 ビオレ おうちdeエステ 洗顔ジェル\n毛穴汚れをやさしく落とします\n💰 約600円`;
  }

  if (concerns.includes('wrinkles')) {
    analysis += `しわは、コラーゲンやエラスチンの減少、乾燥、表情筋の動きの積み重ねが原因です。\n\n${ageGroup}は${age < 35 ? '目元の小じわが気になり始める時期' : age < 45 ? '表情じわが定着しやすい時期' : 'しわの深さが気になる時期'}。\n紫外線ダメージも大きく影響しています。\n\nでも大丈夫！今からのケアで、ハリのある肌を取り戻せますよ♪`;
    treatment += `✨ ボトックス注射\n表情じわ（眉間・額・目尻）を改善＆予防。自然な仕上がりが人気です\nダウンタイム：ほぼなし\n💰 1回 3〜6万円\n\n✨ ヒアルロン酸注入\n深いしわを直接ふっくら埋めます\nダウンタイム：腫れ数日\n💰 1回 5〜10万円\n\n✨ HIFU（ハイフ）\n超音波で肌の奥からリフトアップ\nダウンタイム：ほぼなし\n💰 1回 5〜15万円${age >= 50 ? '\n\n✨ CO2フラクショナル / Er:YAGレーザー\n深いしわ・強い肌の作り替えに\nダウンタイム：CO2は〜2週間、Er:YAGは〜1週間\n💰 1回 5〜15万円\n※計画的な休暇が必要です' : ''}`;
    depacos += `💎 POLA リンクルショット メディカルセラム\nシワ改善効果が認められた実力派\n💰 約1.5万円\n\n💎 エスティローダー アドバンスナイトリペア\n夜の間に集中ケア\n💰 約1.3万円`;
    drugstore += `🌟 エリクシール シュペリエル エンリッチド リンクルクリーム\nシワ改善クリームの定番\n💰 約6,000円\n\n🌟 純粋レチノール原液\nエイジングケアの味方\n💰 約1,500円`;
  }

  if (concerns.includes('sagging')) {
    analysis += `たるみは、コラーゲン・エラスチンの減少、筋肉の衰え、脂肪の下垂が主な原因です。\n\n${ageGroup}は${age < 40 ? 'たるみの初期サインが出始める時期。今からのケアが大切！' : 'フェイスラインやほうれい線の影が気になる時期'}。\n\n重力には逆らえない…と思いがちですが、適切なケアで改善できますよ♪`;
    treatment += `✨ HIFU（ハイフ）\n超音波で肌の深部をキュッと引き締め\nたるみ治療の定番です\nダウンタイム：ほぼなし\n💰 1回 5〜15万円\n\n✨ 糸リフト\n溶ける糸で物理的にリフトアップ。効果実感◎\nダウンタイム：腫れ・内出血1〜2週間\n💰 1回 15〜30万円\n\n✨ サーマクール\n高周波でたるみを改善\nダウンタイム：ほぼなし\n💰 1回 15〜30万円\n\n✨ RFニードル（高周波×針）\n引き締め＋毛穴・肌質改善\nダウンタイム：赤み数日\n💰 1回 5〜10万円\n\n💡 ポイント\nたるみはレーザー単独より、HIFU/RF/注入の組み合わせが効果的なことが多いです`;
    depacos += `💎 クレ・ド・ポー シナクティフ\n最高峰のエイジングケアライン\n💰 クリーム約6万円\n\n💎 SK-II R.N.A.パワー ラディカル ニューエイジ\nハリを与える濃密クリーム\n💰 約1.5万円`;
    drugstore += `🌟 なめらか本舗 リンクルクリーム\n豆乳イソフラボンでハリケア\n💰 約1,000円\n\n🌟 肌美精 リフト保湿クリーム\n手軽にリフトケア\n💰 約1,500円`;
  }

  if (concerns.includes('sensitive')) {
    analysis += `敏感肌は、バリア機能が低下して外部刺激に反応しやすくなっている状態です。\n\n${ageGroup}は${age < 30 ? '環境変化やストレスで敏感になりやすい時期' : '肌の回復力が落ちてきて敏感に傾きやすい時期'}。\nストレスや季節の変わり目、合わないスキンケアも原因になります。\n\nやさしいケアで、肌を守っていきましょうね♪`;
    treatment += `✨ エレクトロポレーション\n針を使わず美容成分を浸透。敏感肌さんにも◎\nダウンタイム：なし\n💰 1回 1〜2万円\n\n✨ プラセンタ注射\n肌の再生力を高めます\nダウンタイム：なし\n💰 1回 2〜5千円\n\n✨ イオン導入\nやさしい電流で美容成分を届けます\nダウンタイム：なし\n💰 1回 5千〜1万円\n\n⚠️ 敏感肌の方へ\n強いレーザーは色素沈着のリスクがあります。\n必ず医師に相談して、あなたの肌に合った施術を選んでくださいね。`;
    depacos += `💎 DECORTE リポソーム アドバンスト リペアセラム\n肌にやさしい保湿美容液\n💰 約1.2万円\n\n💎 アクセーヌ モイストバランスローション\n敏感肌専門ブランドの化粧水\n💰 約6,050円`;
    drugstore += `🌟 ミノン アミノモイスト\n低刺激で保湿力抜群！敏感肌の味方\n💰 約1,500円\n\n🌟 キュレル 化粧水\nセラミドケアの定番\n💰 約2,000円\n\n🌟 dプログラム\n資生堂の敏感肌ライン\n💰 約2,500円`;
  }

  // デフォルト値の設定
  if (!treatment) treatment = '美容皮膚科では、お悩みに応じた様々な治療オプションがあります。\n\nまずはカウンセリングで肌状態を診てもらうのがおすすめです♪';
  if (!depacos) depacos = 'SK-IIやPOLA、クレ・ド・ポー ボーテなど、高品質なデパコスがおすすめです。\n\nカウンターで肌診断を受けると、あなたにぴったりの商品が見つかりますよ♪';
  if (!drugstore) drugstore = '肌ラボ、キュレル、ミノンなど、ドラッグストアにも優秀なアイテムが揃っています。\n\nまずはトライアルサイズから試してみてくださいね♪';

  const lifestyle = `美肌は内側からも作られます♪\n\n🌙 睡眠\n7〜8時間のぐっすり睡眠で、肌の修復タイムを確保しましょう\n\n🥗 食事\nビタミンC・E、タンパク質を意識して摂取してみてください\n\n☀️ 紫外線対策\n曇りの日も年間通して日焼け止めを！\nこれが最強の「シミ・たるみ予防」です\n\n🏃‍♀️ 運動\n適度な運動で血行促進も大切です\n\n💆‍♀️ ストレス管理\nリラックスする時間を作ってくださいね\n\n🚫 こすらない習慣\n摩擦は色素沈着の原因に。やさしくケアしましょう`;

  return {
    analysis,
    treatment,
    depacos,
    drugstore,
    lifestyle,
  };
}
