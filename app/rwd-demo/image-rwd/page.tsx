import Image from 'next/image';

export default function ImageRwdPage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-4 flex flex-col gap-6 items-center">
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
    </main>
  );
}
