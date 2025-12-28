'use client';

import { useState } from 'react';

interface AgeInputProps {
  onSubmit: (age: number) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function AgeInput({ onSubmit, onBack, isLoading }: AgeInputProps) {
  const [age, setAge] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (ageNum >= 10 && ageNum <= 100) {
      onSubmit(ageNum);
    }
  };

  const isValid = age && parseInt(age, 10) >= 10 && parseInt(age, 10) <= 100;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          年齢を教えてください
        </h1>
        <p className="text-gray-600">
          より適切なアドバイスをお届けするために
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <label className="block text-center">
            <span className="text-gray-600 mb-4 block">あなたの年齢</span>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="10"
                max="100"
                placeholder="30"
                className="w-24 text-center text-4xl font-bold text-gray-800 border-b-2 border-pink-300 focus:border-pink-500 outline-none bg-transparent"
                disabled={isLoading}
              />
              <span className="text-2xl text-gray-600">歳</span>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="px-6 py-3 rounded-full border-2 border-pink-300 text-pink-500 font-semibold hover:bg-pink-50 transition-all duration-300"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 flex items-center gap-2 ${
                isValid && !isLoading
                  ? 'bg-pink-400 hover:bg-pink-500 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  分析中...
                </>
              ) : (
                '診断する'
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSubmit(0)}
            disabled={isLoading}
            className="text-gray-400 text-sm hover:text-gray-600 transition-colors underline"
          >
            答えたくない
          </button>
        </div>
      </form>
    </div>
  );
}
