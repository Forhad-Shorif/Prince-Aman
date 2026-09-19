"use client";
import { useState, useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import Dashboard from "./components/Dashboard";
import Controls from "./components/Controls";
import Modal from "./components/Modal";

export default function Home() {
  // --- পাসওয়ার্ড ও স্ক্রিন স্টেট ---
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔑 গেমের ডিফল্ট পাসওয়ার্ড (পরবর্তীতে এখান থেকে পরিবর্তন করতে পারবেন)
  const CORRECT_PASSWORD = "4961";

  // --- মূল গেম স্টেটসমূহ ---
  const [level, setLevel] = useState(1);
  const [wins, setWins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [roundCoins, setRoundCoins] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [trackLength, setTrackLength] = useState(1000);
  const [highScore, setHighScore] = useState(0);

  const [gameState, setGameState] = useState("PLAYING");
  const [isGas, setIsGas] = useState(false);
  const [isBrake, setIsBrake] = useState(false);
  const [steerValue, setSteerValue] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // ১. ব্রাউজারে জমানো মোট কয়েন ও অন্যান্য ডাটা লোড করা
  useEffect(() => {
    const savedWins = parseInt(localStorage.getItem("r15_wins") || "0", 10);
    const savedCoins = parseInt(localStorage.getItem("r15_coins") || "0", 10);
    const savedLevel = parseInt(localStorage.getItem("r15_level") || "1", 10);
    const savedHighScore = parseInt(localStorage.getItem("r15_highscore") || "0", 10);

    if (!isNaN(savedWins)) setWins(savedWins);
    if (!isNaN(savedCoins)) setTotalCoins(savedCoins);
    if (!isNaN(savedLevel) && savedLevel > 0) setLevel(savedLevel);
    if (!isNaN(savedHighScore)) setHighScore(savedHighScore);
  }, []);

  // রিয়েল-টাইম রানিং স্কোর
  const currentScore = Math.floor(progress / 10) + roundCoins * 10;

  // ২. হাই স্কোর চেক ও সেভ
  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem("r15_highscore", currentScore.toString());
    }
  }, [currentScore, highScore]);

  // ৩. কয়েন স্পর্শ করার সাথে সাথেই ১টি কয়েন যোগ করার লজিক
  const handleCoinCollect = () => {
    setRoundCoins((prevRound) => prevRound + 1);
    setTotalCoins((prevTotal) => {
      const updatedTotal = prevTotal + 1;
      localStorage.setItem("r15_coins", updatedTotal.toString());
      return updatedTotal;
    });
  };

  const handleUpdateMetrics = (s, p, tl) => {
    setSpeed(s);
    setProgress(p);
    setTrackLength(tl);
  };

  // ৪. উইন হলে বিজয়ের সংখ্যা ও লেভেল বৃদ্ধি
  const handleWin = () => {
    setGameState("WIN");

    const newWins = wins + 1;
    setWins(newWins);
    localStorage.setItem("r15_wins", newWins.toString());

    if (newWins % 3 === 0) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      localStorage.setItem("r15_level", nextLevel.toString());
    }
  };

  // ৫. ক্র্যাশ করলে স্টেট পরিবর্তন
  const handleCrash = () => {
    setGameState("CRASH");
  };

  const handleRestart = () => {
    setGameState("PLAYING");
    setRoundCoins(0);
    setIsGas(false);
    setIsBrake(false);
    setSteerValue(0);
    setGameKey((prev) => prev + 1);
  };

  // --- পাসওয়ার্ড সাবমিট হ্যান্ডলার ---
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।");
    }
  };

  // পাসওয়ার্ড সফলভাবে না দেওয়া পর্যন্ত এই লোগো এবং পাসওয়ার্ড ইন্টারফেসটি দেখাবে
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-white font-sans select-none overflow-hidden">
        
        {/* ধাপ ১: অ্যাপ গেম লোগো (শুরুতে শুধু এটি দেখাবে) */}
        {!showPasswordCard ? (
          <div 
            onClick={() => setShowPasswordCard(true)}
            className="flex flex-col items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-105"
          >
            {/* নিওন গ্লো সহ গেমের লোগো আইকন */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(0,243,255,0.4)] border-2 border-cyan-300/50 group-hover:shadow-[0_0_80px_rgba(217,70,239,0.6)] transition-all animate-pulse">
              <span className="text-6xl md:text-7xl">🏎️</span>
            </div>
            
            <h2 className="mt-6 text-xl md:text-2xl font-bold text-cyan-400 tracking-wider group-hover:text-fuchsia-400 transition-colors">
              গেম শুরু করতে চাপ দিন
            </h2>
            <p className="text-slate-400 text-sm mt-1 animate-bounce">
              👆 লোগোতে ক্লিক করুন
            </p>
          </div>
        ) : (
          /* ধাপ ২: লোগোতে ক্লিক করলে স্টাইলিশ বাংলা ওয়েলকাম ও পাসওয়ার্ড বক্স আসবে */
          <div className="max-w-md w-full bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,243,255,0.2)] text-center backdrop-blur-lg animate-in fade-in zoom-in duration-300">
            
            {/* ছোট লোগো আইকন */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
              🏎️
            </div>

            {/* স্টাইলিশ বাংলা ওয়েলকাম মেসেজ */}
            <div className="space-y-1 mb-6">
              <span className="inline-block text-xs uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1 font-semibold">
                স্বাগতম
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 leading-snug drop-shadow">
                ফোরহাদ শরীফ ভাইয়ের প্রথম গেমে আপনাকে স্বাগতম!
              </h1>
              <p className="text-slate-400 text-sm pt-2">
                গেমে প্রবেশ করতে নিচে পাসওয়ার্ড প্রদান করুন
              </p>
            </div>

            {/* নিচের পাসওয়ার্ড চেকিং অংশ */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 text-center text-lg tracking-widest text-cyan-300 placeholder-slate-600 transition-all shadow-inner"
                  autoFocus
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-rose-500 text-sm font-medium animate-pulse">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] active:scale-95 transition-all cursor-pointer"
              >
                গেমে প্রবেশ করুন
              </button>
            </form>

          </div>
        )}

      </div>
    );
  }

  // ৩. পাসওয়ার্ড সঠিক হলে মূল গেম রেন্ডার হবে
  return (
    <main className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center select-none">
      <Dashboard
        coins={totalCoins}
        speed={speed}
        level={level}
        wins={wins}
        progress={progress}
        trackLength={trackLength}
        score={currentScore}
        highScore={highScore}
      />

      <GameCanvas
        key={gameKey}
        level={level}
        isGas={isGas}
        isBrake={isBrake}
        steerValue={steerValue}
        onCoinCollect={handleCoinCollect}
        onUpdateMetrics={handleUpdateMetrics}
        onWin={handleWin}
        onCrash={handleCrash}
      />

      <Controls
        onSteer={setSteerValue}
        onGas={setIsGas}
        onBrake={setIsBrake}
      />

      {gameState !== "PLAYING" && (
        <Modal
          type={gameState}
          score={currentScore}
          coins={roundCoins}
          distance={progress}
          onAction={handleRestart}
        />
      )}
    </main>
  );
}