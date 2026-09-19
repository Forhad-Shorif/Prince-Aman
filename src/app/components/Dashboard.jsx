"use client";
import { useState } from "react";

export default function Dashboard({
  coins = 0,
  speed = 0,
  level = 1,
  wins = 0,
  progress = 0,
  trackLength = 1000,
  score = 0,
  highScore = 0,
}) {
  const [showProfile, setShowProfile] = useState(false);

  // লেভেল অনুযায়ী প্লেয়ারের স্কিল র‍্যাঙ্ক/ব্যাজ নির্ধারণ
  const getSkillRank = (lvl) => {
    if (lvl <= 1) return { title: "BOT 🤖", color: "text-gray-400", border: "border-gray-500" };
    if (lvl <= 3) return { title: "BRONZE 🥉", color: "text-amber-500", border: "border-amber-500" };
    if (lvl <= 5) return { title: "SILVER 🥈", color: "text-slate-300", border: "border-slate-300" };
    if (lvl <= 8) return { title: "GOLD 🥇", color: "text-yellow-400", border: "border-yellow-400" };
    if (lvl <= 11) return { title: "HERO ⚔️", color: "text-cyan-400", border: "border-cyan-400" };
    if (lvl <= 15) return { title: "MASTER 👑", color: "text-purple-400", border: "border-purple-400" };
    if (lvl <= 20) return { title: "GRANDMASTER 🏆", color: "text-rose-500", border: "border-rose-500" };
    return { title: "WINNER HERO ⚡", color: "text-emerald-400", border: "border-emerald-400" };
  };

  const rank = getSkillRank(level);

  // বাকি দূরত্বের হিসাব (মিটার বা কিলোমিটারে রূপান্তর)
  const remainingMeters = Math.max(0, trackLength - progress);
  const remainingText =
    remainingMeters >= 1000
      ? `${(remainingMeters / 1000).toFixed(2)} KM`
      : `${remainingMeters} M`;

  // প্রোগ্রেস পার্সেন্টেজ
  const progressPercent = Math.min(100, Math.max(0, (progress / trackLength) * 100));

  return (
    <>
      {/* WOW স্টাইলের আধুনিক নেভবার ড্যাশবোর্ড */}
      <div className="absolute top-3 inset-x-3 md:inset-x-6 z-20 pointer-events-none select-none flex flex-col gap-2">
        
        {/* মেনু ও হেডার বার (Glassmorphism Navbar) */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center justify-between pointer-events-auto">
          
          {/* ১. বাম পাশ: প্রোফাইল বাটন */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 p-1 pr-3.5 rounded-xl shadow-md active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              👤
            </div>
            <div className="text-left">
              <p className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Profile</p>
              <p className={`text-xs font-black ${rank.color} leading-tight`}>{rank.title}</p>
            </div>
          </button>

          {/* ২. মাঝখান: স্পিডোমিটার (WOW Speed Display) */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 via-slate-800/80 to-indigo-950/40 border border-cyan-500/30 px-4 py-1 rounded-xl shadow-inner">
            <span className="text-xs animate-pulse">⚡</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                {speed}
              </span>
              <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest">KM/H</span>
            </div>
          </div>

          {/* ৩. ডান পাশ: কয়েন ও লেভেল */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-400 font-black text-xs shadow-inner">
              <span className="text-sm">🪙</span> {coins}
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-cyan-400 font-black text-xs shadow-inner">
              <span className="text-sm">🏆</span> Lv.{level}
            </div>
          </div>
        </div>

        {/* ৪. নিচে ফিনিশ লাইনের দূরত্ব এবং প্রোগ্রেস বার */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 flex flex-col gap-1 shadow-lg pointer-events-auto max-w-sm mx-auto w-full">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
            <span className="text-slate-400 flex items-center gap-1">
              🏁 WIN DISTANCE
            </span>
            <span className="text-emerald-400 font-mono text-xs drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
              {remainingMeters <= 0 ? "FINISH LINE! 🎉" : `${remainingText} LEFT`}
            </span>
          </div>

          {/* অ্যানিমেটেড প্রোগ্রেস বার */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-150 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* প্রোফাইল পপআপ মোডাল */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 p-6 rounded-3xl max-w-xs w-full text-center relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 text-gray-400 hover:text-white font-bold flex items-center justify-center border border-slate-700"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg mb-2 border border-cyan-300/30">
              🏎️
            </div>
            <h3 className="text-xl font-black text-white tracking-wider">RACER PROFILE</h3>
            <div className={`inline-block px-3.5 py-1 rounded-full border ${rank.border} ${rank.color} text-xs font-black my-2 bg-slate-800/90 shadow-md`}>
              {rank.title}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-left">
              <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase">High Score</p>
                <p className="text-base font-black text-yellow-400">{highScore}</p>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase">Total Wins</p>
                <p className="text-base font-black text-emerald-400">{wins}</p>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60 col-span-2 flex justify-between items-center">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase">Total Coins</p>
                <p className="text-base font-black text-amber-400 flex items-center gap-1">
                  🪙 {coins}
                </p>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60 col-span-2 flex justify-between items-center">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase">Level Progress</p>
                <p className="text-xs font-black text-cyan-400">
                  Level {level} ({wins % 3}/3 Wins)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}