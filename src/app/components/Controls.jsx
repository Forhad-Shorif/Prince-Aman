"use client";
import { useState, useRef } from "react";

export default function Controls({ onSteer, onGas, onBrake }) {
  const [gasActive, setGasActive] = useState(false);
  const [brakeActive, setBrakeActive] = useState(false);
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [hornActive, setHornActive] = useState(false);

  // হর্ন অডিও কন্ট্রোলের রেফারেন্স
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  // হর্ন শুরু করার ফাংশন (যতক্ষণ চেপে ধরে রাখা হবে বাজবে)
  const startHorn = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (hornActive) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(420, ctx.currentTime); // হর্নের ফ্রিকোয়েন্সি

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setHornActive(true);
    } catch (err) {
      console.log("Audio error:", err);
    }
  };

  // হর্ন বন্ধ করার ফাংশন
  const stopHorn = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (err) {}
      oscRef.current = null;
    }
    setHornActive(false);
  };

  // --- স্টিয়ারিং কন্ট্রোল ---
  const startLeft = (e) => {
    if (e.cancelable) e.preventDefault();
    setLeftActive(true);
    onSteer(-1);
  };

  const stopLeft = (e) => {
    if (e && e.cancelable) e.preventDefault();
    setLeftActive(false);
    if (!rightActive) onSteer(0);
  };

  const startRight = (e) => {
    if (e.cancelable) e.preventDefault();
    setRightActive(true);
    onSteer(1);
  };

  const stopRight = (e) => {
    if (e && e.cancelable) e.preventDefault();
    setRightActive(false);
    if (!leftActive) onSteer(0);
  };

  // --- গ্যাস ও ব্রেক কন্ট্রোল ---
  const startGas = (e) => {
    if (e.cancelable) e.preventDefault();
    setGasActive(true);
    onGas(true);
  };

  const stopGas = (e) => {
    if (e && e.cancelable) e.preventDefault();
    setGasActive(false);
    onGas(false);
  };

  const startBrake = (e) => {
    if (e.cancelable) e.preventDefault();
    setBrakeActive(true);
    onBrake(true);
  };

  const stopBrake = (e) => {
    if (e && e.cancelable) e.preventDefault();
    setBrakeActive(false);
    onBrake(false);
  };

  return (
    <div className="absolute bottom-4 inset-x-4 flex justify-between items-end z-20 pointer-events-none select-none touch-none">
      
      {/* বাম পাশ: হর্ন এবং বাম-ডান বাটন */}
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        {/* কন্টিনিউয়াস হর্ন বাটন */}
        <button
          onTouchStart={startHorn}
          onTouchEnd={stopHorn}
          onTouchCancel={stopHorn}
          onMouseDown={startHorn}
          onMouseUp={stopHorn}
          onMouseLeave={stopHorn}
          className={`w-12 h-12 rounded-full text-white font-black text-lg shadow-lg border-2 transition flex items-center justify-center select-none touch-none ${
            hornActive
              ? "bg-amber-600 border-amber-100 shadow-amber-500/50 scale-90"
              : "bg-amber-500 border-amber-200"
          }`}
          title="Horn"
        >
          📢
        </button>

        {/* বাম এবং ডান বাটন */}
        <div className="flex gap-3">
          <button
            onTouchStart={startLeft}
            onTouchEnd={stopLeft}
            onTouchCancel={stopLeft}
            onMouseDown={startLeft}
            onMouseUp={stopLeft}
            onMouseLeave={stopLeft}
            className={`w-16 h-16 rounded-2xl text-white font-black text-xl shadow-xl border-2 transition transform flex items-center justify-center select-none touch-none ${
              leftActive
                ? "bg-cyan-600 border-cyan-200 shadow-cyan-500/50 scale-95"
                : "bg-cyan-600/80 border-cyan-300"
            }`}
          >
            ◀️
          </button>

          <button
            onTouchStart={startRight}
            onTouchEnd={stopRight}
            onTouchCancel={stopRight}
            onMouseDown={startRight}
            onMouseUp={stopRight}
            onMouseLeave={stopRight}
            className={`w-16 h-16 rounded-2xl text-white font-black text-xl shadow-xl border-2 transition transform flex items-center justify-center select-none touch-none ${
              rightActive
                ? "bg-cyan-600 border-cyan-200 shadow-cyan-500/50 scale-95"
                : "bg-cyan-600/80 border-cyan-300"
            }`}
          >
            ▶️
          </button>
        </div>
      </div>

      {/* ডান পাশ: ব্রেক ও গ্যাস বাটন */}
      <div className="pointer-events-auto flex gap-2.5 items-end">
        <button
          onTouchStart={startBrake}
          onTouchEnd={stopBrake}
          onTouchCancel={stopBrake}
          onMouseDown={startBrake}
          onMouseUp={stopBrake}
          onMouseLeave={stopBrake}
          className={`w-16 h-16 rounded-2xl text-white font-extrabold text-xs shadow-lg border-2 transition transform flex flex-col items-center justify-center gap-0.5 select-none touch-none ${
            brakeActive
              ? "bg-red-600 border-red-300 shadow-red-500/50 scale-95"
              : "bg-red-600/80 border-red-400"
          }`}
        >
          <span>🛑</span>
          <span>BRAKE</span>
        </button>

        <button
          onTouchStart={startGas}
          onTouchEnd={stopGas}
          onTouchCancel={stopGas}
          onMouseDown={startGas}
          onMouseUp={stopGas}
          onMouseLeave={stopGas}
          className={`w-20 h-20 rounded-full text-white font-black text-xs shadow-xl border-4 transition transform flex flex-col items-center justify-center gap-0.5 select-none touch-none ${
            gasActive
              ? "bg-emerald-500 border-emerald-200 shadow-emerald-500/50 scale-95"
              : "bg-emerald-500/90 border-emerald-300"
          }`}
        >
          <span className="text-base">🚀</span>
          <span>GAS</span>
        </button>
      </div>

    </div>
  );
}