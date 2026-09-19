"use client";
import { useState, useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import Dashboard from "./components/Dashboard";
import Controls from "./components/Controls";
import Modal from "./components/Modal";

export default function Home() {
  const [level, setLevel] = useState(1);
  const [wins, setWins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0); // সেভ হওয়া টোটাল কয়েন
  const [roundCoins, setRoundCoins] = useState(0); // চলতি ম্যাচের কয়েন
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [trackLength, setTrackLength] = useState(500);
  const [highScore, setHighScore] = useState(0);

  const [gameState, setGameState] = useState("PLAYING");
  const [isGas, setIsGas] = useState(false);
  const [isBrake, setIsBrake] = useState(false);
  const [steerValue, setSteerValue] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // ১. সেভ হওয়া ডাটা লোড করা
  useEffect(() => {
    const savedWins = localStorage.getItem("r15_wins");
    const savedCoins = localStorage.getItem("r15_coins");
    const savedLevel = localStorage.getItem("r15_level");
    const savedHighScore = localStorage.getItem("r15_highscore");

    if (savedWins) setWins(parseInt(savedWins));
    if (savedCoins) setTotalCoins(parseInt(savedCoins)); // মোট কয়েন সেভ
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const currentScore = Math.floor(progress / 10) + roundCoins * 10;

  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem("r15_highscore", currentScore.toString());
    }
  }, [currentScore, highScore]);

  // ২. ক্যানভাস থেকে ম্যাট্রিক আপডেট পাওয়া
  const handleUpdateMetrics = (c, s, p, tl) => {
    setRoundCoins(c);
    setSpeed(s);
    setProgress(p);
    setTrackLength(tl);
  };

  // ৩. উইন হলে মোট কয়েন আপডেট ও সেভ করা
  const handleWin = () => {
    setGameState("WIN");
    const newWins = wins + 1;
    const newTotalCoins = totalCoins + roundCoins; // আগের মোট কয়েন + এই রাউন্ডের কয়েন

    setWins(newWins);
    setTotalCoins(newTotalCoins);

    localStorage.setItem("r15_wins", newWins.toString());
    localStorage.setItem("r15_coins", newTotalCoins.toString()); // মোট কয়েন সেভ করা হচ্ছে

    if (newWins % 3 === 0) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      localStorage.setItem("r15_level", nextLevel.toString());
    }
  };

  // ৪. ক্র্যাশ করলেও পর্যন্ত জমানো কয়েন টোটাল কয়েনে যোগ হবে
  const handleCrash = () => {
    setGameState("CRASH");
    const newTotalCoins = totalCoins + roundCoins;
    setTotalCoins(newTotalCoins);
    localStorage.setItem("r15_coins", newTotalCoins.toString());
  };

  const handleRestart = () => {
    setGameState("PLAYING");
    setRoundCoins(0);
    setIsGas(false);
    setIsBrake(false);
    setSteerValue(0);
    setGameKey((prev) => prev + 1);
  };

  return (
    <main className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center select-none">
      <Dashboard
        coins={totalCoins} // ড্যাশবোর্ড ও প্রোফাইলে টোটাল কয়েন দেখাবে
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
          coins={roundCoins} // মোডালে দেখাবে এই রাউন্ডে কত কয়েন পেলেন
          distance={progress}
          onAction={handleRestart}
        />
      )}
    </main>
  );
}