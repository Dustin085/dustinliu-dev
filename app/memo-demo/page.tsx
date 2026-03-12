import { MemoDemoPageClient } from '@/app/memo-demo/page.client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memo Demo',
  description: 'A demo for React.Memo',
};

export default function MemoDemoPage() {
  return <MemoDemoPageClient />;
}
