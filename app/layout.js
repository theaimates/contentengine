import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const BASE_URL = 'https://theaimates.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'AI Content Repurposing Engine — AImates',
    template: '%s | AImates',
  },
  description:
    'Turn any YouTube video into a blog post, Twitter thread, LinkedIn post, email newsletter, key quotes, and short-form content in under 60 seconds. Powered by Claude AI. Built by AImates.',

  keywords: [
    'AI content repurposing',
    'YouTube to blog post',
    'AI automation',
    'workflow automation',
    'agentic workflows',
    'AI workflow builder',
    'Claude Code',
    'Claude AI',
    'n8n automation',
    'content engine',
    'AI content generation',
    'system building',
    'no-code automation',
    'social media automation',
    'AI content marketing',
    'AImates',
  ],

  authors: [{ name: 'AImates', url: BASE_URL }],
  creator: 'AImates',
  publisher: 'AImates',

  alternates: {
    canonical: `${BASE_URL}/content-engine`,
  },

  openGraph: {
    type: 'website',
    url: `${BASE_URL}/content-engine`,
    siteName: 'AImates',
    title: 'AI Content Repurposing Engine — AImates',
    description:
      'Paste a YouTube URL. Get a blog post, Twitter thread, LinkedIn post, email newsletter, key quotes, and TikTok/Reels script — all in under 60 seconds. AI automation built by AImates.',
    locale: 'en_US',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  category: 'AI Automation & Workflow Systems',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
