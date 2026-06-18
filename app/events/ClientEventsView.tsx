'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Camera, Lock, Inbox, Search, Key, Filter } from 'lucide-react';

export default function ClientEventsView({ initialEvents, user }: { initialEvents: any[], user: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'no-password' | 'password'>('all');

  const handleFilterClick = () => {
    if (filterMode === 'all') setFilterMode('no-password');
    else if (filterMode === 'no-password') setFilterMode('password');
    else setFilterMode('all');
  };

  const filteredEvents = useMemo(() => initialEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasPassword = event.password !== null && event.password !== undefined && String(event.password).trim() !== '';

    let matchesFilter = true;
    if (filterMode === 'no-password') matchesFilter = !hasPassword;
    else if (filterMode === 'password') matchesFilter = hasPassword;

    return matchesSearch && matchesFilter;
  }), [initialEvents, searchTerm, filterMode]);

  return (
    <div className="w-full">
      {/* Search Bar & Filter */}
      <div className="mb-8 sm:mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
        <div className="relative group w-full flex-1">
          <input
            type="text"
            placeholder="ค้นหาชื่ออีเวนต์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 sm:pl-14 pr-5 sm:pr-6 py-3.5 sm:py-4 rounded-full border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-yellow focus:outline-none focus:ring-4 focus:ring-accent-yellow/30 transition-all text-base sm:text-xl shadow-sm hover:border-slate-200"
          />
          <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-orange w-5 sm:w-7 h-5 sm:h-7 transition-colors" />
        </div>
        <button
          onClick={handleFilterClick}
          className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border-4 transition-all focus:outline-none shadow-sm whitespace-nowrap font-bold text-base sm:text-lg flex-shrink-0 ${filterMode === 'all'
            ? 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-700'
            : filterMode === 'no-password'
              ? 'border-accent-peach bg-accent-peach/10 text-orange-600 hover:bg-accent-peach/20'
              : 'border-slate-400 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          title="ตัวกรองอีเวนต์"
        >
          <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
          <span>
            {filterMode === 'all' ? 'ทั้งหมด' : filterMode === 'no-password' ? 'สาธารณะ' : 'ส่วนตัว'}
          </span>
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center relative">
          <Inbox className="w-20 h-20 text-slate-300 mb-6 mx-auto animate-bounce-slow" />
          <h3 className="text-3xl font-black text-slate-700">ไม่มีอีเวนต์ที่ตรงกับคำค้นหา</h3>
          <p className="text-slate-500 mt-2 font-bold text-lg">ลองเปลี่ยนคำค้นหาใหม่ดูน้าา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: any) => (
            <EventCard key={event.id} event={event} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, user }: { event: any, user: any }) {
  // หากยังไม่ล็อกอิน ให้โดนบังคับไปหน้า login
  const targetHref = user ? `/events/${event.id}` : '/login';

  return (
    <Link href={targetHref} className="bubbly-card group relative flex flex-col overflow-hidden transition-all duration-300 aspect-[1/1.414] rounded-[28px] border-4 border-white/50 bg-slate-200 shadow-sm hover:shadow-xl">
      {/* Background Image */}
      {event.poster ? (
        <img src={`/api/event-image/${event.poster}`} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100">ไม่มีรูปโปสเตอร์</div>
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* User check overlay */}
      {!user && (
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-slate-900/40">
          <span className="font-extrabold text-white bg-accent-orange px-6 py-3 rounded-full shadow-xl animate-pop-in flex items-center gap-2">
            <Lock className="w-5 h-5" /> ล็อกอินเพื่อดูรูป
          </span>
        </div>
      )}

      {/* Badges (top-right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {event.password && (
          <div className="flex items-center justify-center bg-accent-orange/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full border border-white/20 shadow" title="อีเวนต์นี้ต้องใช้รหัสผ่าน">
            <Key className="w-4 h-4" />
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20 shadow">
          <Camera className="w-4 h-4" />
          {event.photo_count ?? 0}
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-end mt-auto w-full overflow-hidden">
        <h3 className="text-2xl sm:text-3xl font-black text-white truncate w-full mb-1 group-hover:text-accent-yellow transition-colors leading-tight drop-shadow-md">{event.name}</h3>
        <p className="text-slate-200 text-sm font-medium truncate w-full leading-relaxed drop-shadow-md">{event.detail}</p>
      </div>
    </Link>
  );
}
