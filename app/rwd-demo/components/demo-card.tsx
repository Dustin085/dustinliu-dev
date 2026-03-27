export function DemoCard({ text }: { text: string }) {
  return (
    <div className="rounded-md bg-card p-4 hover:scale-105 transition-all flex flex-col items-center">
      <p>{text}</p>
    </div>
  );
}
