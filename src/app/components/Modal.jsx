"use client";

export default function Modal({
  type,
  score = 0,
  coins = 0,
  distance = 0,
  onAction,
  onHome,
}) {
  const isWin = type === "WIN";

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/80 p-6 rounded-3xl text-center max-w-xs w-full shadow-2xl relative overflow-hidden">
        
        {/* টপ গ্লো ইফেক্ট */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-30 ${
            isWin ? "bg-emerald-500" : "bg-red-500"
          }`}
        />

        {/* টাইটেল */}
        <h2
          className={`text-2xl font-black mb-1 tracking-wider ${
            isWin ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          }`}
        >
          {isWin ? "VICTORY! 🏁" : "CRASHED! 💥"}
        </h2>

        <p className="text-gray-400 text-xs mb-5">
          {isWin
            ? "দারুণ রেসিং! আপনি সফলভাবে ফিনিশ লাইনে পৌঁছেছেন।"
            : "ওহো! অন্য গাড়ির সাথে ধাক্কা লেগেছে। আবার চেষ্টা করুন।"}
        </p>

        {/* ম্যাচ সামারি / মেট্রিকেস */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-3 rounded-2xl mb-5 border border-slate-700/50 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Coins Earned</span>
            <span className="text-base font-black text-amber-400 flex items-center gap-1">
              🪙 {coins}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Score</span>
            <span className="text-base font-black text-yellow-400">{score}</span>
          </div>

          <div className="col-span-2 border-t border-slate-700/60 my-1"></div>

          <div className="col-span-2 flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Distance Covered</span>
            <span className="text-xs font-bold text-cyan-400">{Math.round(distance)}m</span>
          </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAction}
            className={`w-full py-3 rounded-xl font-black text-sm text-white shadow-lg transition transform active:scale-95 ${
              isWin
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                : "bg-red-600 hover:bg-red-700 shadow-red-600/30"
            }`}
          >
            {isWin ? "NEXT RACE ➡️" : "TRY AGAIN 🔄"}
          </button>

          {/* হোম পেজে যাওয়ার অপশনাল বাটন */}
          {onHome && (
            <button
              onClick={onHome}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-gray-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95"
            >
              MAIN MENU 🏠
            </button>
          )}
        </div>

      </div>
    </div>
  );
}