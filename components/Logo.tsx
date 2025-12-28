export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 背景の円 */}
      <circle cx="50" cy="50" r="48" fill="#FDE8EC" />

      {/* 位置マーカーの形 */}
      <path
        d="M50 10C32 10 18 24 18 42C18 60 50 88 50 88C50 88 82 60 82 42C82 24 68 10 50 10Z"
        fill="#F9A8C9"
      />

      {/* 女性のシルエット */}
      <ellipse cx="50" cy="32" rx="10" ry="11" fill="#E88AAE" />
      <path
        d="M50 44C42 44 35 50 35 58V62C35 64 37 66 39 66H61C63 66 65 64 65 62V58C65 50 58 44 50 44Z"
        fill="#E88AAE"
      />

      {/* 髪の毛 */}
      <path
        d="M40 28C40 28 42 20 50 20C58 20 60 28 60 28C60 28 62 24 58 22C54 20 50 18 50 18C50 18 46 20 42 22C38 24 40 28 40 28Z"
        fill="#D06B94"
      />
    </svg>
  );
}
