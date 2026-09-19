"use client";
import { useState, useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import Dashboard from "./components/Dashboard";
import Controls from "./components/Controls";
import Modal from "./components/Modal";

export default function Home() {
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

  // ১. লিঙ্কে প্রথম প্রবেশের সাথে সাথে ব্রাউজার (localStorage) থেকে সেভ করা ডাটা লোড করা
  useEffect(() => {
    const savedWins = parseInt(localStorage.getItem("r15_wins") || "0", 10);
    const savedCoins = parseInt(localStorage.getItem("r15_coins") || "0", 10);
    const savedLevel = parseInt(localStorage.getItem("r15_level") || "1", 10);
    const savedHighScore = parseInt(localStorage.getItem("r15_highscore") || "0", 10);

    // শুধু ভ্যালিড সংখ্যা হলে মান সেট হবে (কখনো কমবে না বা রিসেট হবে না)
    if (!isNaN(savedWins)) setWins(savedWins);
    if (!isNaN(savedCoins)) setTotalCoins(savedCoins);
    if (!isNaN(savedLevel) && savedLevel > 0) setLevel(savedLevel);
    if (!isNaN(savedHighScore)) setHighScore(savedHighScore);
  }, []);

  // বর্তমান ম্যাচের রিয়েল-টাইম স্কোর
  const currentScore = Math.floor(progress / 10) + roundCoins * 10;

  // ২. হাই স্কোর চেক ও স্থায়ীভাবে সেভ (হাই স্কোর শুধু বাড়লেই সেভ হবে, কখনো কমবে না)
  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem("r15_highscore", currentScore.toString());
    }
  }, [currentScore, highScore]);

  const handleUpdateMetrics = (c, s, p, tl) => {
    setRoundCoins(c);
    setSpeed(s);
    setProgress(p);
    setTrackLength(tl);
  };

  // ৩. উইন হলে টোটাল কয়েন এবং লেভেল আপডেট (কখনো কমবে না)
  const handleWin = () => {
    setGameState("WIN");

    const newWins = wins + 1;
    const newTotalCoins = totalCoins + roundCoins;

    setWins(newWins);
    setTotalCoins(newTotalCoins);

    // ব্রাউজারে স্থায়ী সেভ
    localStorage.setItem("r15_wins", newWins.toString());
    localStorage.setItem("r15_coins", newTotalCoins.toString());

    // প্রতি ৩টি বিজয়ে ১ লেভেল বাড়বে
    if (newWins % 3 === 0) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      localStorage.setItem("r15_level", nextLevel.toString());
    }
  };

  // ৪. ক্র্যাশ করলে সংগৃহীত কয়েন স্থায়ীভাবে সেভ হবে
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