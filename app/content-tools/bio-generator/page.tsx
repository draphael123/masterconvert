'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TEMPLATES = {
  professional: [
    '{role} at {company} | {specialty} | {cta}',
    '{title} helping {audience} with {specialty} | {achievement} | {cta}',
    '{role} | {years}+ years in {industry} | {achievement} | {link}',
    '{specialty} expert | Speaker | {achievement} | {cta}',
  ],
  creative: [
    '{emoji} {role} | Creating {specialty} | {cta}',
    '{specialty} enthusiast 🎨 | {achievement} | DM for collabs',
    'Making {audience} look amazing ✨ | {specialty} | {cta}',
    '{emoji} {title} by day, {hobby} by night | {cta}',
  ],
  casual: [
    'Just a {role} who loves {hobby} {emoji}',
    '{specialty} lover | {hobby} addict | {location} based {emoji}',
    'Living life one {hobby} at a time | {cta}',
    '{emoji} {specialty} | Coffee enthusiast | {location}',
  ],
  business: [
    'Founder @{company} | We help {audience} {benefit} | {cta}',
    'CEO of {company} | {industry} | {achievement}',
    'Building {company} | {specialty} | Featured in {publication}',
    '{role} @{company} | {achievement} | Hiring → {link}',
  ],
};

const EMOJIS = ['✨', '🚀', '💡', '🎯', '💪', '🌟', '🔥', '💼', '🎨', '📈', '🌍', '💻', '📱', '🎬', '✍️'];

export default function BioGeneratorPage() {
  const [style, setStyle] = useState<keyof typeof TEMPLATES>('professional');
  const [fields, setFields] = useState({
    role: '',
    title: '',
    company: '',
    specialty: '',
    audience: '',
    achievement: '',
    industry: '',
    years: '',
    hobby: '',
    location: '',
    benefit: '',
    publication: '',
    cta: '',
    link: '',
    emoji: '🚀',
  });
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const generateBios = () => {
    const templates = TEMPLATES[style];
    const bios = templates.map(template => {
      let bio = template;
      Object.entries(fields).forEach(([key, value]) => {
        bio = bio.replace(new RegExp(`{${key}}`, 'g'), value || `[${key}]`);
      });
      return bio;
    });
    setGeneratedBios(bios);
  };

  const copyBio = (index: number) => {
    navigator.clipboard.writeText(generatedBios[index]);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bio Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create compelling social media bios using proven templates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Style</h2>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                      style === s ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Role/Title</label>
                  <input
                    type="text"
                    value={fields.role}
                    onChange={(e) => updateField('role', e.target.value)}
                    placeholder="Marketing Manager"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Company</label>
                  <input
                    type="text"
                    value={fields.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    placeholder="Acme Inc"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Specialty</label>
                  <input
                    type="text"
                    value={fields.specialty}
                    onChange={(e) => updateField('specialty', e.target.value)}
                    placeholder="Content Strategy"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Target Audience</label>
                  <input
                    type="text"
                    value={fields.audience}
                    onChange={(e) => updateField('audience', e.target.value)}
                    placeholder="startups"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Achievement</label>
                  <input
                    type="text"
                    value={fields.achievement}
                    onChange={(e) => updateField('achievement', e.target.value)}
                    placeholder="10K+ followers"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Industry</label>
                  <input
                    type="text"
                    value={fields.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    placeholder="SaaS"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Years Experience</label>
                  <input
                    type="text"
                    value={fields.years}
                    onChange={(e) => updateField('years', e.target.value)}
                    placeholder="5"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Hobby/Interest</label>
                  <input
                    type="text"
                    value={fields.hobby}
                    onChange={(e) => updateField('hobby', e.target.value)}
                    placeholder="coffee"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Location</label>
                  <input
                    type="text"
                    value={fields.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="NYC"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Call to Action</label>
                  <input
                    type="text"
                    value={fields.cta}
                    onChange={(e) => updateField('cta', e.target.value)}
                    placeholder="DM for collabs"
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-400 block mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => updateField('emoji', emoji)}
                      className={`w-8 h-8 text-lg rounded-lg transition-colors ${
                        fields.emoji === emoji ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateBios}
                className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
              >
                Generate Bios
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Generated Bios</h2>
            
            {generatedBios.length > 0 ? (
              <div className="space-y-4">
                {generatedBios.map((bio, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl group">
                    <p className="text-white mb-3">{bio}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${bio.length > 150 ? 'text-red-400' : 'text-gray-500'}`}>
                        {bio.length}/150 characters
                      </span>
                      <button
                        onClick={() => copyBio(i)}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        {copied === i ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">👤</div>
                <p>Fill in your details and generate bios</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">💡 Bio Tips</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Instagram: 150 characters max</li>
                <li>• Twitter/X: 160 characters max</li>
                <li>• LinkedIn: 220 characters headline</li>
                <li>• Include a clear call-to-action</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

