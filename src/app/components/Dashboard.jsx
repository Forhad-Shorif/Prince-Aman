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

  const remainingMeters = Math.max(0, trackLength - progress);
  const remainingText =
    remainingMeters >= 1000
      ? `${(remainingMeters / 1000).toFixed(2)} KM`
      : `${remainingMeters} M`;

  const progressPercent = Math.min(100, Math.max(0, (progress / trackLength) * 100));

  return (
    <>
      {/* মোবাইল ফ্রেন্ডলি স্মার্ট নেভবার ড্যাশবোর্ড */}
      <div className="absolute top-2 inset-x-2 sm:inset-x-6 z-20 pointer-events-none select-none flex flex-col gap-1.5">
        
        {/* গ্লাস হেডার বার */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl px-2.5 py-1.5 flex items-center justify-between pointer-events-auto gap-1">
          
          {/* ১. প্রোফাইল (মোবাইলে নাম রেসপন্সিভ দেখাবে) */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-600/50 p-1 pr-2.5 rounded-xl shadow-md active:scale-95 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              👤
            </div>
            <div className="text-left">
              <p className="text-[8px] text-cyan-400 font-extrabold uppercase leading-none tracking-widest">PROFILE</p>
              <p className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 leading-tight drop-shadow-[0_0_6px_rgba(0,243,255,0.4)]">
                Forhad Shorif
              </p>
            </div>
          </button>

          {/* ২. স্পিডোমিটার */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-950/40 via-slate-800/90 to-indigo-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-xl shadow-inner">
            <span className="text-[10px] animate-pulse">⚡</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                {speed}
              </span>
              <span className="text-[9px] text-cyan-400 font-extrabold tracking-widest">KM/H</span>
            </div>
          </div>

          {/* ৩. কয়েন ও লেভেল */}
          <div className="flex items-center gap-1">
            <div className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-xl flex items-center gap-1 text-amber-400 font-black text-[11px] shadow-inner">
              <span>🪙</span> {coins}
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-xl flex items-center gap-1 text-cyan-400 font-black text-[11px] shadow-inner">
              <span>🏆</span> Lv.{level}
            </div>
          </div>
        </div>

        {/* ৪. ডিস্ট্যান্স প্রোগ্রেস বার */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-xl px-2.5 py-1 flex flex-col gap-0.5 shadow-lg pointer-events-auto max-w-xs mx-auto w-full">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
            <span className="text-slate-400 flex items-center gap-1">
              🏁 WIN DISTANCE
            </span>
            <span className="text-emerald-400 font-mono text-[10px] drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
              {remainingMeters <= 0 ? "FINISH LINE! 🎉" : `${remainingText} LEFT`}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-150 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* প্রোফাইল পপআপ মোডাল */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 p-5 rounded-3xl max-w-xs w-full text-center relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-800 text-gray-400 hover:text-white font-bold flex items-center justify-center border border-slate-700 text-xs"
            >
              ✕
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg mb-2 border border-cyan-300/30">
              🏎️
            </div>
            
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-wider">
              Forhad Shorif
            </h3>
            <div className={`inline-block px-3 py-0.5 rounded-full border ${rank.border} ${rank.color} text-[10px] font-black my-1.5 bg-slate-800/90 shadow-md`}>
              {rank.title}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-left">
              <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60">
                <p className="text-[8px] text-slate-400 font-extrabold uppercase">High Score</p>
                <p className="text-sm font-black text-yellow-400">{highScore}</p>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60">
                <p className="text-[8px] text-slate-400 font-extrabold uppercase">Total Wins</p>
                <p className="text-sm font-black text-emerald-400">{wins}</p>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60 col-span-2 flex justify-between items-center">
                <p className="text-[8px] text-slate-400 font-extrabold uppercase">Total Coins</p>
                <p className="text-sm font-black text-amber-400 flex items-center gap-1">
                  🪙 {coins}
                </p>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60 col-span-2 flex justify-between items-center">
                <p className="text-[8px] text-slate-400 font-extrabold uppercase">Level Progress</p>
                <p className="text-[11px] font-black text-cyan-400">
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