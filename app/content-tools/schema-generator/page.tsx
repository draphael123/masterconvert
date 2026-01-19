'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

type SchemaType = 'article' | 'faq' | 'product' | 'organization' | 'person' | 'howto';

export default function SchemaGeneratorPage() {
  const [schemaType, setSchemaType] = useState<SchemaType>('article');
  const [copied, setCopied] = useState(false);

  // Article fields
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articlePublishDate, setArticlePublishDate] = useState('');
  const [articleImage, setArticleImage] = useState('');
  const [articleUrl, setArticleUrl] = useState('');

  // FAQ fields
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);

  // Product fields
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCurrency, setProductCurrency] = useState('USD');
  const [productImage, setProductImage] = useState('');
  const [productAvailability, setProductAvailability] = useState('InStock');

  // Organization fields
  const [orgName, setOrgName] = useState('');
  const [orgUrl, setOrgUrl] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const generateSchema = () => {
    switch (schemaType) {
      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: articleTitle,
          description: articleDescription,
          author: {
            '@type': 'Person',
            name: articleAuthor,
          },
          datePublished: articlePublishDate,
          image: articleImage,
          url: articleUrl,
        };

      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.filter(f => f.question && f.answer).map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          description: productDescription,
          image: productImage,
          offers: {
            '@type': 'Offer',
            price: productPrice,
            priceCurrency: productCurrency,
            availability: `https://schema.org/${productAvailability}`,
          },
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: orgName,
          url: orgUrl,
          logo: orgLogo,
          description: orgDescription,
        };

      default:
        return {};
    }
  };

  const schemaJson = JSON.stringify(generateSchema(), null, 2);
  const scriptTag = `<script type="application/ld+json">\n${schemaJson}\n</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-emerald-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Schema Markup Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate JSON-LD structured data for rich search results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-6">
            {/* Schema Type Selector */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Schema Type</h2>
              <div className="flex flex-wrap gap-2">
                {(['article', 'faq', 'product', 'organization'] as SchemaType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSchemaType(type)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                      schemaType === type
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {schemaType === 'article' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-2">Article Details</h2>
                  <div>
                    <label className="text-sm text-gray-400">Headline</label>
                    <input
                      type="text"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Article title"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                      value={articleDescription}
                      onChange={(e) => setArticleDescription(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                      rows={2}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Author Name</label>
                      <input
                        type="text"
                        value={articleAuthor}
                        onChange={(e) => setArticleAuthor(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Publish Date</label>
                      <input
                        type="date"
                        value={articlePublishDate}
                        onChange={(e) => setArticlePublishDate(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Image URL</label>
                    <input
                      type="text"
                      value={articleImage}
                      onChange={(e) => setArticleImage(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Article URL</label>
                    <input
                      type="text"
                      value={articleUrl}
                      onChange={(e) => setArticleUrl(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://example.com/article"
                    />
                  </div>
                </div>
              )}

              {schemaType === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">FAQ Items</h2>
                    <button
                      onClick={addFaq}
                      className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      + Add Question
                    </button>
                  </div>
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Question {index + 1}</span>
                        {faqs.length > 1 && (
                          <button
                            onClick={() => removeFaq(index)}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        placeholder="What is your question?"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                        rows={2}
                        placeholder="The answer to the question..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {schemaType === 'product' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-2">Product Details</h2>
                  <div>
                    <label className="text-sm text-gray-400">Product Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Price</label>
                      <input
                        type="text"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        placeholder="29.99"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Currency</label>
                      <select
                        value={productCurrency}
                        onChange={(e) => setProductCurrency(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      >
                        <option value="USD" className="bg-slate-800">USD</option>
                        <option value="EUR" className="bg-slate-800">EUR</option>
                        <option value="GBP" className="bg-slate-800">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Availability</label>
                    <select
                      value={productAvailability}
                      onChange={(e) => setProductAvailability(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                      <option value="InStock" className="bg-slate-800">In Stock</option>
                      <option value="OutOfStock" className="bg-slate-800">Out of Stock</option>
                      <option value="PreOrder" className="bg-slate-800">Pre-Order</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Image URL</label>
                    <input
                      type="text"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              )}

              {schemaType === 'organization' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-2">Organization Details</h2>
                  <div>
                    <label className="text-sm text-gray-400">Organization Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Website URL</label>
                    <input
                      type="text"
                      value={orgUrl}
                      onChange={(e) => setOrgUrl(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Logo URL</label>
                    <input
                      type="text"
                      value={orgLogo}
                      onChange={(e) => setOrgLogo(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Generated Schema</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm text-gray-300 font-mono max-h-[500px]">
              {scriptTag}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

