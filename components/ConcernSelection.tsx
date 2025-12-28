'use client';

import { SkinConcernType, SKIN_CONCERNS } from '@/types';
import { getIconComponent } from './Icons';

interface ConcernSelectionProps {
  selectedConcerns: SkinConcernType[];
  onSelect: (concern: SkinConcernType) => void;
  onNext: () => void;
}

export default function ConcernSelection({
  selectedConcerns,
  onSelect,
  onNext,
}: ConcernSelectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          あなたの肌のお悩みは？
        </h1>
        <p className="text-gray-600">
          当てはまるものをすべて選択してください
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {SKIN_CONCERNS.map((concern) => {
          const IconComponent = getIconComponent(concern.id);
          const isSelected = selectedConcerns.includes(concern.id);
          return (
            <button
              key={concern.id}
              onClick={() => onSelect(concern.id)}
              className={`concern-card p-4 md:p-6 rounded-2xl bg-white shadow-md cursor-pointer text-center ${
                isSelected ? 'selected' : ''
              }`}
            >
              <div className={`flex justify-center mb-2 ${isSelected ? 'text-pink-500' : 'text-gray-500'}`}>
                <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{concern.name}</h3>
              <p className="text-xs md:text-sm text-gray-500">{concern.description}</p>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          disabled={selectedConcerns.length === 0}
          className={`px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 ${
            selectedConcerns.length > 0
              ? 'bg-pink-400 hover:bg-pink-500 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          次へ進む
        </button>
        {selectedConcerns.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            {selectedConcerns.length}個選択中
          </p>
        )}
      </div>
    </div>
  );
}
