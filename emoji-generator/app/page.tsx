import dynamic from 'next/dynamic';

const EmojiGenerator = dynamic(() => import('@/components/emoji-generator'), { ssr: false });
const EmojiGrid = dynamic(() => import('@/components/emoji-grid'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">🤔 Emoji maker</h1>
      </header>
      <main className="flex-grow flex flex-col items-center p-8 gap-8">
        <EmojiGenerator />
        <EmojiGrid />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Emoji Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
