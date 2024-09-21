import Image from 'next/image';

// TODO: Replace with actual emoji data
const dummyEmojis = [
  { id: 1, url: '/path/to/emoji1.png' },
  { id: 2, url: '/path/to/emoji2.png' },
  // Add more dummy emojis...
];

export default function EmojiGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      {dummyEmojis.map((emoji) => (
        <div key={emoji.id} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <Image src={emoji.url} alt={`Emoji ${emoji.id}`} width={64} height={64} />
        </div>
      ))}
    </div>
  );
}