'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Preview

This is a **bold** text and this is *italic*.

## Features

- Real-time preview
- GitHub Flavored Markdown
- Code syntax highlighting
- Tables support

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Tables | ✅ |

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Links and Images

[Visit FileForge](https://fileforge.app)

---

That's it! Start typing in the editor.
`);
  const [html, setHtml] = useState('');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  // Simple markdown parser
  const parseMarkdown = (md: string): string => {
    let result = md
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      
      // Strikethrough
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      
      // Blockquotes
      .replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>')
      
      // Horizontal rule
      .replace(/^---$/gm, '<hr />')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      
      // Unordered lists
      .replace(/^\s*[-*+] (.*)$/gm, '<li>$1</li>')
      
      // Ordered lists
      .replace(/^\s*\d+\. (.*)$/gm, '<li>$1</li>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      
      // Line breaks
      .replace(/\n/g, '<br />');

    // Wrap lists
    result = result.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    result = result.replace(/<\/ul><ul>/g, '');

    // Wrap in paragraph if not already wrapped
    if (!result.startsWith('<')) {
      result = '<p>' + result + '</p>';
    }

    return result;
  };

  // Parse tables separately (more complex)
  const parseTablesAndRender = (md: string): string => {
    const tableRegex = /\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g;
    
    let result = md.replace(tableRegex, (match, header, body) => {
      const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
      const rows = body.trim().split('\n').map((row: string) => 
        row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
      );

      let table = '<table><thead><tr>';
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`;
      });
      table += '</tr></thead><tbody>';
      rows.forEach((row: string[]) => {
        table += '<tr>';
        row.forEach((cell: string) => {
          table += `<td>${cell}</td>`;
        });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return table;
    });

    return parseMarkdown(result);
  };

  useEffect(() => {
    setHtml(parseTablesAndRender(markdown));
  }, [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { margin-top: 1.5em; }
    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f4f4f4; }
    img { max-width: 100%; }
    a { color: #0066cc; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-slate-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
              <Link href="/tools/word-counter" className="text-gray-300 hover:text-white transition-colors">Word Count</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(['split', 'edit', 'preview'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === v
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyHtml}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={downloadMarkdown}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Download MD
            </button>
            <button
              onClick={downloadHtml}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Download HTML
            </button>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className={`grid gap-4 ${view === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {(view === 'split' || view === 'edit') && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-sm text-gray-400">
                Markdown
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[calc(100vh-250px)] p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                placeholder="Type your markdown here..."
              />
            </div>
          )}

          {(view === 'split' || view === 'preview') && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-sm text-gray-400">
                Preview
              </div>
              <div
                className="p-6 h-[calc(100vh-250px)] overflow-y-auto prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .prose h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; color: white; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: white; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; color: white; }
        .prose p { margin-bottom: 1em; color: #d1d5db; }
        .prose strong { color: white; }
        .prose em { color: #d1d5db; }
        .prose code { background: rgba(255,255,255,0.1); padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .prose pre { background: #1e1e1e; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
        .prose pre code { background: none; padding: 0; }
        .prose blockquote { border-left: 4px solid #4b5563; padding-left: 1rem; margin: 1em 0; color: #9ca3af; }
        .prose ul, .prose ol { padding-left: 1.5em; margin: 1em 0; color: #d1d5db; }
        .prose li { margin: 0.25em 0; }
        .prose hr { border-color: #374151; margin: 2em 0; }
        .prose a { color: #60a5fa; text-decoration: underline; }
        .prose table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose th, .prose td { border: 1px solid #374151; padding: 0.5rem; text-align: left; }
        .prose th { background: rgba(255,255,255,0.05); color: white; }
        .prose td { color: #d1d5db; }
        .prose img { max-width: 100%; border-radius: 8px; }
        .prose del { color: #6b7280; }
      `}</style>

      <Footer />
    </div>
  );
}

