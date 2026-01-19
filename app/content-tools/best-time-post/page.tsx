'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PLATFORMS = {
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: 'from-pink-500 to-purple-500',
    bestTimes: {
      monday: ['11:00', '14:00', '19:00'],
      tuesday: ['09:00', '13:00', '19:00'],
      wednesday: ['11:00', '15:00', '19:00'],
      thursday: ['12:00', '15:00', '19:00'],
      friday: ['10:00', '14:00', '17:00'],
      saturday: ['09:00', '11:00', '19:00'],
      sunday: ['10:00', '14:00', '19:00'],
    },
    peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
    avoidTimes: ['3:00 AM - 6:00 AM'],
    tips: [
      'Reels perform best between 9 AM - 12 PM',
      'Stories get most views in the morning',
      'Engagement drops significantly after 9 PM',
      'Posting consistently matters more than perfect timing',
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: 'from-cyan-500 to-pink-500',
    bestTimes: {
      monday: ['06:00', '10:00', '22:00'],
      tuesday: ['02:00', '04:00', '09:00'],
      wednesday: ['07:00', '08:00', '23:00'],
      thursday: ['09:00', '12:00', '19:00'],
      friday: ['05:00', '13:00', '15:00'],
      saturday: ['11:00', '19:00', '20:00'],
      sunday: ['07:00', '08:00', '16:00'],
    },
    peakDays: ['Tuesday', 'Thursday', 'Friday'],
    avoidTimes: ['12:00 AM - 4:00 AM'],
    tips: [
      'TikTok audience is most active in the evening',
      'Weekday mornings work well for educational content',
      'Post 1-4 times per day for best growth',
      'The algorithm favors consistent posting schedules',
    ],
  },
  twitter: {
    name: 'Twitter/X',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600',
    bestTimes: {
      monday: ['08:00', '10:00', '12:00'],
      tuesday: ['09:00', '10:00', '12:00'],
      wednesday: ['09:00', '10:00', '12:00'],
      thursday: ['08:00', '10:00', '17:00'],
      friday: ['09:00', '10:00', '11:00'],
      saturday: ['09:00', '10:00'],
      sunday: ['09:00', '17:00'],
    },
    peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
    avoidTimes: ['10:00 PM - 4:00 AM', 'Weekends generally'],
    tips: [
      'B2B content performs best during work hours',
      'Breaking news and trending topics peak 8-10 AM',
      'Engagement drops significantly on weekends',
      'Tweet 3-5 times per day for optimal reach',
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-600 to-blue-800',
    bestTimes: {
      monday: ['07:00', '10:00', '12:00'],
      tuesday: ['08:00', '10:00', '12:00'],
      wednesday: ['08:00', '10:00', '12:00'],
      thursday: ['08:00', '10:00', '14:00'],
      friday: ['08:00', '10:00'],
      saturday: ['10:00'],
      sunday: ['18:00'],
    },
    peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
    avoidTimes: ['Weekends', 'After 5 PM', 'Before 7 AM'],
    tips: [
      'Tuesday-Thursday are the best days by far',
      'Morning posts (7-8 AM) catch early commuters',
      'Lunch hour (12 PM) sees high engagement',
      'Avoid posting on weekends - engagement drops 60%',
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: 'from-red-500 to-red-700',
    bestTimes: {
      monday: ['14:00', '16:00'],
      tuesday: ['14:00', '16:00'],
      wednesday: ['14:00', '16:00'],
      thursday: ['12:00', '15:00'],
      friday: ['12:00', '15:00'],
      saturday: ['09:00', '11:00'],
      sunday: ['09:00', '11:00'],
    },
    peakDays: ['Thursday', 'Friday', 'Saturday'],
    avoidTimes: ['Early mornings (before 9 AM)'],
    tips: [
      'Post 2-3 hours before peak viewing time',
      'Weekends are great for entertainment content',
      'Thursday/Friday posts build momentum for weekend',
      'Consistency in upload schedule matters most',
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'from-blue-500 to-blue-700',
    bestTimes: {
      monday: ['09:00', '12:00', '15:00'],
      tuesday: ['09:00', '12:00', '15:00'],
      wednesday: ['09:00', '12:00', '15:00'],
      thursday: ['09:00', '12:00', '15:00'],
      friday: ['09:00', '11:00'],
      saturday: ['12:00', '13:00'],
      sunday: ['13:00', '14:00'],
    },
    peakDays: ['Wednesday', 'Thursday', 'Friday'],
    avoidTimes: ['Late night (after 9 PM)', 'Early morning (before 7 AM)'],
    tips: [
      'Video content gets 59% more engagement',
      'Facebook Live notifications boost visibility',
      'Posting frequency: 1-2 times per day optimal',
      'Facebook Groups have different peak times than pages',
    ],
  },
};

type Platform = keyof typeof PLATFORMS;
type Day = keyof typeof PLATFORMS.instagram.bestTimes;

const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function BestTimePostPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [timezone, setTimezone] = useState('local');

  const platform = PLATFORMS[selectedPlatform];

  const formatTime = (time: string) => {
    const [hours] = time.split(':').map(Number);
    if (hours === 0) return '12 AM';
    if (hours === 12) return '12 PM';
    if (hours > 12) return `${hours - 12} PM`;
    return `${hours} AM`;
  };

  const isOptimalTime = (day: Day, hour: number) => {
    const times = platform.bestTimes[day] || [];
    return times.some(t => {
      const [h] = t.split(':').map(Number);
      return h === hour;
    });
  };

  const getHourIntensity = (hour: number) => {
    let count = 0;
    DAYS.forEach(day => {
      if (isOptimalTime(day, hour)) count++;
    });
    return count / 7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            Strategy Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Best Time to Post
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Optimize your posting schedule for maximum engagement.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(PLATFORMS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key as Platform)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                selectedPlatform === key
                  ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{p.icon}</span>
              <span className="font-medium">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {platform.icon} {platform.name} Posting Heatmap
            </h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hours header */}
                <div className="flex gap-1 mb-2 pl-20">
                  {[0, 4, 8, 12, 16, 20].map(h => (
                    <div key={h} className="flex-1 text-xs text-gray-500 text-center">
                      {formatTime(`${h}:00`)}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                {DAYS.map(day => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <div className="w-16 text-sm text-gray-400 capitalize">{day.slice(0, 3)}</div>
                    <div className="flex-1 flex gap-0.5">
                      {HOURS.map(hour => {
                        const isOptimal = isOptimalTime(day, hour);
                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-6 rounded-sm transition-colors ${
                              isOptimal
                                ? `bg-gradient-to-r ${platform.color}`
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            title={`${day} ${formatTime(`${hour}:00`)}${isOptimal ? ' - Best time!' : ''}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${platform.color}`} />
                    <span>Best time to post</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/5" />
                    <span>Standard hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Best Times Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">🏆 Peak Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {platform.peakDays.map(day => (
                      <span 
                        key={day}
                        className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${platform.color} text-white`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-2">⚠️ Avoid Posting</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {platform.avoidTimes.map((time, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-400">•</span>
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h2>
              <ul className="space-y-3">
                {platform.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-indigo-300">Note:</strong> These times are based on general audience data. 
                Check your own analytics for your specific audience&apos;s active hours.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📅 Daily Best Times</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DAYS.map(day => (
              <div key={day} className="bg-white/5 rounded-xl p-4">
                <h3 className="font-medium text-white capitalize mb-2">{day}</h3>
                <div className="space-y-1">
                  {platform.bestTimes[day].map((time, i) => (
                    <div 
                      key={i}
                      className={`text-sm px-2 py-1 rounded bg-gradient-to-r ${platform.color} text-white text-center`}
                    >
                      {formatTime(time)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

