"use client";
import { useEffect, useRef } from "react";

export default function GameCanvas({
  level = 1,
  isGas,
  isBrake,
  steerValue = 0,
  onUpdateMetrics,
  onWin,
  onCrash,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    let speed = 0;
    const maxSpeed = 8 + level * 1.5;
    let playerX = canvas.width / 2;
    let distanceTraveled = 0;

    // ১. লেভেল অনুযায়ী ডায়নামিক দূরত্ব (লেভেল ১ = ৫০০m, লেভেল ২ = ৬০০m...)
    const trackLengthMeters = 800 + level * 250;
    const trackLength = trackLengthMeters * 20; // ক্যানভাস পিক্সেল স্কেলিং

    let coinsCount = 0;
    let coinsList = [];
    let trafficBikes = [];
    let sparkles = []; // বিজয়ের সময় ঝিলমিল কণা রাখার অ্যারে
    let isCelebrating = false;
    let celebrateFrame = 0;
    let frame = 0;

    // কিবোর্ড কন্ট্রোল
    let keys = {};
    const handleKeyDown = (e) => (keys[e.code] = true);
    const handleKeyUp = (e) => (keys[e.code] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // ঝিলমিল কণা (Confetti) তৈরি করার ফাংশন
    const createConfetti = () => {
      const colors = ["#facc15", "#38bdf8", "#f43f5e", "#34d399", "#a855f7"];
      for (let i = 0; i < 80; i++) {
        // বামপাশ থেকে কণা
        sparkles.push({
          x: Math.random() * 80,
          y: canvas.height - Math.random() * 100,
          vx: Math.random() * 8 + 2,
          vy: -(Math.random() * 10 + 5),
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
        // ডানপাশ থেকে কণা
        sparkles.push({
          x: canvas.width - Math.random() * 80,
          y: canvas.height - Math.random() * 100,
          vx: -(Math.random() * 8 + 2),
          vy: -(Math.random() * 10 + 5),
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const gameLoop = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // এক্সেলেরেশন ও ব্রেক
      if (isGas || keys["KeyW"] || keys["ArrowUp"]) {
        speed = Math.min(speed + 0.08, maxSpeed);
      } else if (isBrake || keys["KeyS"] || keys["ArrowDown"]) {
        speed = Math.max(speed - 0.25, 0);
      } else {
        speed = Math.max(speed - 0.03, 0);
      }

      if (!isCelebrating) {
        distanceTraveled += speed;
      }

      // স্টিয়ারিং
      let currentSteer = steerValue;
      if (keys["KeyA"] || keys["ArrowLeft"]) currentSteer = -1;
      if (keys["KeyD"] || keys["ArrowRight"]) currentSteer = 1;

      playerX += currentSteer * (3 + speed * 0.15);
      playerX = Math.max(120, Math.min(canvas.width - 120, playerX));

      // পরিবেশ ও রাস্তা
      ctx.fillStyle = "#15803d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const roadWidth = 360;
      const roadLeft = (canvas.width - roadWidth) / 2;
      ctx.fillStyle = "#334155";
      ctx.fillRect(roadLeft, 0, roadWidth, canvas.height);

      // সীমানা ও ডিভাইডার
      ctx.fillStyle = "#facc15";
      ctx.fillRect(roadLeft - 6, 0, 6, canvas.height);
      ctx.fillRect(roadLeft + roadWidth, 0, 6, canvas.height);

      ctx.strokeStyle = "#ffffff";
      ctx.setLineDash([30, 30]);
      ctx.lineDashOffset = -distanceTraveled % 60;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // দুপাশের গাছপালা
      const treeSpacing = 120;
      const treeOffset = distanceTraveled % treeSpacing;
      for (let y = -treeSpacing; y < canvas.height + treeSpacing; y += treeSpacing) {
        const drawY = y + treeOffset;
        ctx.fillStyle = "#166534";
        ctx.beginPath();
        ctx.arc(60, drawY, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvas.width - 60, drawY, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // ট্রাফিক ও কয়েন স্পন
      if (!isCelebrating) {
        if (frame % Math.max(35, 90 - level * 8) === 0) {
          trafficBikes.push({
            x: roadLeft + 30 + Math.random() * (roadWidth - 80),
            y: -100,
            speed: 1.5 + Math.random() * 2 + level * 0.4,
            color: ["#3b82f6", "#e11d48", "#8b5cf6"][Math.floor(Math.random() * 3)],
          });
        }

        if (frame % 60 === 0) {
          coinsList.push({
            x: roadLeft + 40 + Math.random() * (roadWidth - 80),
            y: -50,
          });
        }
      }

      // কয়েন প্রসেসিং
      for (let i = coinsList.length - 1; i >= 0; i--) {
        let coin = coinsList[i];
        coin.y += speed;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 9, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(playerX - coin.x, canvas.height - 100 - coin.y) < 26) {
          coinsCount += 1;
          coinsList.splice(i, 1);
        } else if (coin.y > canvas.height + 50) {
          coinsList.splice(i, 1);
        }
      }

      // ট্রাফিক ও ধাক্কা প্রসেসিং
      for (let i = trafficBikes.length - 1; i >= 0; i--) {
        let traffic = trafficBikes[i];
        traffic.y += speed - traffic.speed;

        ctx.fillStyle = traffic.color;
        ctx.fillRect(traffic.x - 12, traffic.y - 25, 24, 50);

        const isColliding =
          Math.abs(playerX - traffic.x) < 24 &&
          Math.abs(canvas.height - 100 - traffic.y) < 50;

        if (isColliding && !isCelebrating) {
          if (speed > 7) {
            if (onCrash) onCrash();
            return;
          } else {
            traffic.x += playerX < traffic.x ? 20 : -20;
          }
        }

        if (traffic.y > canvas.height + 100 || traffic.y < -200) {
          trafficBikes.splice(i, 1);
        }
      }

      // ফিনিশ লাইন এবং রেসিং ফ্ল্যাগ আঁকা
      const remainingDist = trackLength - distanceTraveled;
      if (remainingDist < canvas.height) {
        const flagY = canvas.height - 100 - remainingDist;

        // চেকার্ড ফিনিশ লাইন
        const blockSize = 20;
        for (let x = roadLeft; x < roadLeft + roadWidth; x += blockSize) {
          for (let yOffset = 0; yOffset < 30; yOffset += blockSize / 2) {
            const isBlack = (Math.floor(x / blockSize) + Math.floor(yOffset / (blockSize / 2))) % 2 === 0;
            ctx.fillStyle = isBlack ? "#000000" : "#ffffff";
            ctx.fillRect(x, flagY + yOffset, blockSize, blockSize / 2);
          }
        }

        // ফিনিশ লাইনে পৌঁছানোর পর
        if (remainingDist <= 0 && !isCelebrating) {
          isCelebrating = true;
          createConfetti(); // ঝিলমিল ছড়ানো শুরু
        }
      }

      // বিজয়ের ঝিলমিল (Confetti) অ্যানিমেশন
      if (isCelebrating) {
        celebrateFrame++;
        for (let i = sparkles.length - 1; i >= 0; i--) {
          let p = sparkles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // গ্র্যাভিটি
          
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.y > canvas.height) sparkles.splice(i, 1);
        }

        // ২ সেকেন্ড সেলিব্রেশনের পর মোডাল দেখাবে
        if (celebrateFrame > 120) {
          if (onWin) onWin();
          return;
        }
      }

      // প্লেয়ারের বাইক ও রাইডার
      const py = canvas.height - 100;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(playerX, py + 10, 18, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0284c7";
      ctx.fillRect(playerX - 10, py - 30, 20, 60);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(playerX - 8, py - 38, 16, 12);
      ctx.fillRect(playerX - 8, py + 24, 16, 12);

      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(playerX, py, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(playerX, py - 6, 9, 0, Math.PI * 2);
      ctx.fill();

      // মেট্রিক্স আপডেট (মিটার হিসেবে দূরত্ব পাঠানো)
      if (onUpdateMetrics) {
        onUpdateMetrics(
          coinsCount,
          Math.round(speed * 10),
          Math.min(trackLengthMeters, Math.floor(distanceTraveled / 20)),
          trackLengthMeters
        );
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [level, isGas, isBrake, steerValue]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={450}
      className="w-full h-full object-cover bg-slate-900"
    />
  );
}