'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface RepurposedContent {
  platform: string;
  icon: string;
  type: string;
  content: string;
}

export default function ContentRepurposePage() {
  const [input, setInput] = useState('');
  const [repurposed, setRepurposed] = useState<RepurposedContent[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractKeyPoints = (text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 10);
  };

  const createHook = (text: string): string => {
    const hooks = [
      `Here's what nobody tells you about this:`,
      `I spent hours researching this so you don't have to:`,
      `Stop scrolling. This is important:`,
      `The thing that changed everything for me:`,
      `Most people get this wrong:`,
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  };

  const repurposeContent = () => {
    if (!input.trim()) return;
    setIsProcessing(true);

    const keyPoints = extractKeyPoints(input);
    const firstSentence = input.split(/[.!?]/)[0]?.trim() || '';
    const wordCount = input.split(/\s+/).length;

    const results: RepurposedContent[] = [];

    // Twitter Thread
    const tweetChunks: string[] = [];
    let currentChunk = `🧵 ${createHook(input)}\n\n`;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach((sentence, i) => {
      const test = currentChunk + sentence.trim() + '. ';
      if (test.length > 260 && currentChunk.length > 50) {
        tweetChunks.push(currentChunk.trim());
        currentChunk = sentence.trim() + '. ';
      } else {
        currentChunk = test;
      }
    });
    if (currentChunk.trim()) tweetChunks.push(currentChunk.trim());
    
    tweetChunks.forEach((chunk, i) => {
      results.push({
        platform: 'Twitter/X',
        icon: '🐦',
        type: `Thread ${i + 1}/${tweetChunks.length}`,
        content: i === 0 ? chunk : `${i + 1}/ ${chunk}`,
      });
    });

    // LinkedIn Post
    const linkedinPost = `${createHook(input)}

${keyPoints.slice(0, 5).map((point, i) => `${i + 1}. ${point.trim()}`).join('\n\n')}

What's your experience with this? Share in the comments 👇

#contentmarketing #business #growth`;
    
    results.push({
      platform: 'LinkedIn',
      icon: '💼',
      type: 'Post',
      content: linkedinPost,
    });

    // Instagram Caption
    const instagramCaption = `${createHook(input)} 👇

${keyPoints.slice(0, 3).map(p => `✨ ${p.trim()}`).join('\n\n')}

Save this post for later! 📌

.
.
.
#contentcreator #socialmediatips #instagramtips #growthhacking #digitalmarketing`;

    results.push({
      platform: 'Instagram',
      icon: '📷',
      type: 'Caption',
      content: instagramCaption,
    });

    // Instagram Carousel Ideas
    results.push({
      platform: 'Instagram',
      icon: '📷',
      type: 'Carousel Slides',
      content: `Slide 1 (Hook): "${firstSentence.slice(0, 50)}..."

Slide 2-${Math.min(keyPoints.length + 1, 6)}: 
${keyPoints.slice(0, 5).map((point, i) => `• Slide ${i + 2}: ${point.trim().slice(0, 100)}`).join('\n')}

Final Slide: "Follow for more tips! 💡"`,
    });

    // TikTok Script
    results.push({
      platform: 'TikTok',
      icon: '🎵',
      type: 'Video Script',
      content: `HOOK (0-3s): "${createHook(input)}"

PROBLEM (3-10s): Most people struggle with this...

MAIN POINTS (10-45s):
${keyPoints.slice(0, 3).map((point, i) => `Point ${i + 1}: ${point.trim().slice(0, 80)}`).join('\n')}

CTA (45-60s): Follow for more tips like this! Drop a 🔥 if this helped!`,
    });

    // Pull Quotes for Graphics
    const quotes = keyPoints.slice(0, 5).map(point => `"${point.trim()}"`);
    results.push({
      platform: 'Graphics',
      icon: '🎨',
      type: 'Pull Quotes',
      content: quotes.join('\n\n'),
    });

    // Email Newsletter Snippet
    results.push({
      platform: 'Email',
      icon: '📧',
      type: 'Newsletter Snippet',
      content: `Subject: ${firstSentence.slice(0, 50)}...

Hey there,

${input.slice(0, 500)}${input.length > 500 ? '...' : ''}

[Read the full post →]

Talk soon,
[Your name]`,
    });

    // YouTube Shorts/Reels Hook
    results.push({
      platform: 'YouTube Shorts',
      icon: '▶️',
      type: 'Video Hook',
      content: `🎬 Video Idea: "${firstSentence.slice(0, 60)}..."

Opening Line: "${createHook(input)}"

Key Points to Cover:
${keyPoints.slice(0, 3).map((p, i) => `${i + 1}. ${p.trim().slice(0, 60)}`).join('\n')}

End Screen: "Subscribe for more!"`,
    });

    setRepurposed(results);
    setIsProcessing(false);
  };

  const copyContent = (index: number) => {
    navigator.clipboard.writeText(repurposed[index].content);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-cyan-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300 text-sm mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Content Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Content Repurposing Tool
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Turn one piece of content into posts for every platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste your original content
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Blog post, article, newsletter, or any long-form content
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your blog post, article, or long-form content here...

Example: Today I want to talk about the importance of consistency in content creation. Many creators struggle with this because they focus too much on perfection instead of progress. The key is to show up every day, even when you don't feel like it..."
                rows={16}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">
                  {input.split(/\s+/).filter(w => w).length} words
                </span>
                <button
                  onClick={repurposeContent}
                  disabled={!input.trim() || isProcessing}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                >
                  {isProcessing ? 'Processing...' : '🔄 Repurpose Content'}
                </button>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2">💡 Tips for Best Results</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Paste complete articles or blog posts</li>
                <li>• Include clear points or tips in your content</li>
                <li>• The more structured your input, the better the output</li>
                <li>• Edit the generated content to match your voice</li>
              </ul>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Repurposed Content ({repurposed.length} pieces)
            </h2>

            {repurposed.length > 0 ? (
              <div className="space-y-4 max-h-[700px] overflow-y-auto">
                {repurposed.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-white">{item.platform}</span>
                        <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400">
                          {item.type}
                        </span>
                      </div>
                      <button
                        onClick={() => copyContent(index)}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        {copied === index ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                      {item.content}
                    </pre>
                    <div className="mt-2 text-xs text-gray-500">
                      {item.content.length} characters
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🔄</div>
                <p className="text-lg">Paste your content and click repurpose</p>
                <p className="text-sm mt-2">Generate content for Twitter, LinkedIn, Instagram, TikTok, and more</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

