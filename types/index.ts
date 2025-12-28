export type SkinConcernType =
  | 'dryness'
  | 'spots'
  | 'acne'
  | 'pores'
  | 'wrinkles'
  | 'sagging'
  | 'sensitive';

export interface SkinConcern {
  id: SkinConcernType;
  name: string;
  description: string;
}

export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: 'dryness',
    name: '乾燥',
    description: '肌のかさつき・つっぱり感'
  },
  {
    id: 'spots',
    name: 'シミ・そばかす',
    description: '色素沈着・くすみ'
  },
  {
    id: 'acne',
    name: 'ニキビ',
    description: '吹き出物・肌荒れ'
  },
  {
    id: 'pores',
    name: '毛穴',
    description: '毛穴の開き・黒ずみ'
  },
  {
    id: 'wrinkles',
    name: 'しわ',
    description: '小じわ・表情じわ'
  },
  {
    id: 'sagging',
    name: 'たるみ',
    description: 'フェイスラインの緩み'
  },
  {
    id: 'sensitive',
    name: '敏感肌',
    description: '赤み・かゆみ・刺激に弱い'
  }
];

export interface AdviceResult {
  analysis: string;
  treatment: string;
  depacos: string;
  drugstore: string;
  lifestyle: string;
}

export type Step = 'concern' | 'age' | 'result';
