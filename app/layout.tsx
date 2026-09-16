import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://pulse-team-messaging.aishwarya-r0122.chatgpt.site'),
  title: 'Pulse — Team Messaging',
  description: 'Fast, focused team communication in one calm workspace.',
  openGraph: { title: 'Pulse — Team Messaging', description: 'Team messaging, in sync.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Pulse — Team Messaging', description: 'Team messaging, in sync.', images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${geist.variable} ${geistMono.variable}`}>{children}</body></html>; }
