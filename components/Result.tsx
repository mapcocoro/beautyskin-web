'use client';

import { useState } from 'react';
import { AdviceResult, SkinConcernType, SKIN_CONCERNS } from '@/types';

interface ResultProps {
  concerns: SkinConcernType[];
  age: number;
  result: AdviceResult;
  onRestart: () => void;
}

type CategoryKey = 'analysis' | 'treatment' | 'depacos' | 'drugstore' | 'lifestyle';

interface Category {
  key: CategoryKey;
  title: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    key: 'analysis',
    title: '症状分析',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    key: 'treatment',
    title: '美容レーザー',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    key: 'depacos',
    title: 'デパコス',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    key: 'drugstore',
    title: 'ドラコス',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    key: 'lifestyle',
    title: '生活習慣',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

export default function Result({
  concerns,
  age,
  result,
  onRestart,
}: ResultProps) {
  const [openCategories, setOpenCategories] = useState<Set<CategoryKey>>(new Set());

  const selectedConcernNames = concerns
    .map((c) => SKIN_CONCERNS.find((sc) => sc.id === c)?.name)
    .filter(Boolean);

  const toggleCategory = (key: CategoryKey) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          あなたへの美容アドバイス
        </h1>
        <p className="text-sm text-pink-500">
          {age}歳 | {selectedConcernNames.join('・')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {categories.map((category) => {
          const isOpen = openCategories.has(category.key);
          const content = result[category.key];

          return (
            <div
              key={category.key}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.key)}
                className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${
                  isOpen ? 'bg-pink-50' : 'hover:bg-pink-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isOpen ? 'text-pink-500' : 'text-pink-400'}`}>
                    {category.icon}
                  </span>
                  <span className={`text-base font-bold ${isOpen ? 'text-pink-500' : 'text-gray-700'}`}>
                    {category.title}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-pink-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-2 border-t border-pink-100">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 免責事項 */}
      <div className="bg-pink-50 rounded-xl p-4 mb-6 text-xs text-gray-600">
        <p>
          ※ このアドバイスはAIによる一般的な情報提供であり、医療アドバイスではありません。
          具体的な治療については、必ず医師にご相談ください。
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  );
}
