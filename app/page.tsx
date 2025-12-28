'use client';

import { useState } from 'react';
import { Step, SkinConcernType, AdviceResult } from '@/types';
import ConcernSelection from '@/components/ConcernSelection';
import AgeInput from '@/components/AgeInput';
import Result from '@/components/Result';
import Logo from '@/components/Logo';

export default function Home() {
  const [step, setStep] = useState<Step>('concern');
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcernType[]>([]);
  const [age, setAge] = useState<number>(0);
  const [result, setResult] = useState<AdviceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConcernSelect = (concern: SkinConcernType) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const handleAgeSubmit = async (inputAge: number) => {
    setAge(inputAge);
    setIsLoading(true);

    try {
      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concerns: selectedConcerns,
          age: inputAge,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setStep('result');
    } catch (error) {
      console.error('Error fetching advice:', error);
      // エラーでもダミーデータで結果を表示
      setResult({
        analysis: '肌の状態を分析中にエラーが発生しました。再度お試しください。',
        treatment: '美容皮膚科では様々な治療オプションがあります。まずはカウンセリングで自分に合った治療を見つけましょう。',
        depacos: 'SK-IIやPOLA、クレ・ド・ポー ボーテなど、高品質なデパコスがおすすめです。',
        drugstore: '肌ラボ、キュレル、ミノンなど、ドラッグストアでも優秀なスキンケア製品が揃っています。',
        lifestyle: '十分な睡眠（7-8時間）、バランスの良い食事、適度な運動が大切です。紫外線対策も年間を通じて行いましょう。',
      });
      setStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setStep('concern');
    setSelectedConcerns([]);
    setAge(0);
    setResult(null);
  };

  return (
    <main className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-lg font-bold text-pink-500">美肌コンシェルジュ</h1>
          </div>
        </div>
      </header>

      {/* プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          {['concern', 'age', 'result'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step === s
                    ? 'bg-pink-400 text-white'
                    : ['concern', 'age', 'result'].indexOf(step) > i
                    ? 'bg-pink-200 text-pink-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-10 h-1 mx-1 rounded ${
                    ['concern', 'age', 'result'].indexOf(step) > i
                      ? 'bg-pink-200'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-1 text-xs text-gray-500">
          <span className="w-16 text-center">悩み</span>
          <span className="w-16 text-center">年齢</span>
          <span className="w-16 text-center">結果</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {step === 'concern' && (
          <ConcernSelection
            selectedConcerns={selectedConcerns}
            onSelect={handleConcernSelect}
            onNext={() => setStep('age')}
          />
        )}

        {step === 'age' && (
          <AgeInput
            onSubmit={handleAgeSubmit}
            onBack={() => setStep('concern')}
            isLoading={isLoading}
          />
        )}

        {step === 'result' && result && (
          <Result
            concerns={selectedConcerns}
            age={age}
            result={result}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* フッター */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-500">
        <p>© 2025 美肌コンシェルジュ</p>
        <p className="mt-1">
          ※ AIによる一般的な情報提供であり、医療アドバイスではありません
        </p>
      </footer>
    </main>
  );
}
