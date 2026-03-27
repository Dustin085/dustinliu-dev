import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Rwd Demo',
  description: 'Making some good RWD layout.',
};

export default function RWDDemoPage() {
  const cardListData = [
    '卡片文字',
    '卡片長文字',
    '卡片長文字卡片長文字卡片長文字',
    '卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字',
    '卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字',
    '卡片長文字',
    '卡片長文字卡片長文字卡片長文字',
    '卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字',
    '卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字卡片長文字',
  ];
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-4 flex flex-col gap-6 items-center">
      {/* 6 squares section */}
      <section className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-500 aspect-square flex items-center justify-center text-white text-xl"
          >
            {i + 1}
          </div>
        ))}
      </section>

      {/* RWD image */}
      <section className="w-full flex flex-col md:flex-row items-center gap-4">
        {/* 圖片容器 */}
        <div className="relative aspect-video w-full md:w-1/2 lg:aspect-video">
          <Image src="/cry-anya.gif" alt="rwd image" fill style={{ objectFit: 'cover' }} />
        </div>

        {/* 文字說明 */}
        <div className="md:w-1/2">
          <p>圖片文字說明</p>
        </div>
      </section>

      {/* Card List */}
      <section className="w-full">
        {/* grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card */}
          {cardListData.map((text, i) => {
            return (
              <div
                key={i}
                className="rounded-md bg-card p-4 h-32 hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center"
                title={text}
              >
                <p className="line-clamp-3">{text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
