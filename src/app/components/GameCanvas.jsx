"use client";
import { useEffect, useRef } from "react";

export default function GameCanvas({
  level = 1,
  isGas,
  isBrake,
  steerValue = 0,
  onCoinCollect,
  onUpdateMetrics,
  onWin,
  onCrash,
}) {
  const canvasRef = useRef(null);

  // 1. Controls State Hold Korar Jonno Ref (Re-render chada live data pabe)
  const controlsRef = useRef({ isGas, isBrake, steerValue });

  useEffect(() => {
    controlsRef.current = { isGas, isBrake, steerValue };
  }, [isGas, isBrake, steerValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    // --- Dynamic Sizing & Mobile DPR Fix ---
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const getWidth = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      return canvas.width / dpr;
    };
    const getHeight = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      return canvas.height / dpr;
    };

    let speed = 0;
    const maxSpeed = 8 + level * 1.5;
    let playerX = getWidth() / 2;
    let distanceTraveled = 0;

    const trackLengthMeters = 800 + level * 200;
    const trackLength = trackLengthMeters * 20;

    let coinsList = [];
    let trafficBikes = [];
    let sparkles = [];
    let isCelebrating = false;
    let celebrateFrame = 0;
    let frame = 0;

    // --- Keyboard & Touch Handlers ---
    let keys = {};
    let touchStartX = null;
    let touchSteer = 0;

    const handleKeyDown = (e) => (keys[e.code] = true);
    const handleKeyUp = (e) => (keys[e.code] = false);

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartX !== null && e.touches.length > 0) {
        const diffX = e.touches[0].clientX - touchStartX;
        if (diffX > 15) touchSteer = 1;
        else if (diffX < -15) touchSteer = -1;
        else touchSteer = 0;
      }
    };

    const handleTouchEnd = () => {
      touchStartX = null;
      touchSteer = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    const createConfetti = () => {
      const colors = ["#00f3ff", "#ff0055", "#ffe600", "#39ff14", "#b026ff"];
      const currentWidth = getWidth();
      const currentHeight = getHeight();

      for (let i = 0; i < 90; i++) {
        sparkles.push({
          x: Math.random() * 80,
          y: currentHeight - Math.random() * 100,
          vx: Math.random() * 8 + 2,
          vy: -(Math.random() * 10 + 5),
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
        sparkles.push({
          x: currentWidth - Math.random() * 80,
          y: currentHeight - Math.random() * 100,
          vx: -(Math.random() * 8 + 2),
          vy: -(Math.random() * 10 + 5),
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // --- Futuristic Bike Drawing ---
    const drawFuturisticBike = (x, y, isPlayer = false, customColor = null, activeBrake = false) => {
      ctx.save();
      ctx.translate(x, y);

      const mainColor = isPlayer ? "#00f3ff" : customColor || "#ff0055";
      const bodyColor = isPlayer ? "#0f172a" : "#1e1b4b";

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      if (!isMobile) {
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = isPlayer ? 20 : 10;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.beginPath();
      ctx.ellipse(0, 8, 14, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isPlayer) {
        const headlight = ctx.createRadialGradient(0, -30, 2, 0, -120, 80);
        headlight.addColorStop(0, "rgba(0, 243, 255, 0.9)");
        headlight.addColorStop(0.4, "rgba(0, 243, 255, 0.3)");
        headlight.addColorStop(1, "rgba(0, 243, 255, 0)");
        ctx.fillStyle = headlight;
        ctx.beginPath();
        ctx.moveTo(-15, -25);
        ctx.lineTo(-75, -140);
        ctx.lineTo(75, -140);
        ctx.lineTo(15, -25);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = "#020617";
      ctx.fillRect(-6, -30, 12, 16);
      ctx.fillRect(-7, 14, 14, 18);

      ctx.fillStyle = mainColor;
      ctx.fillRect(-5, -26, 10, 2);
      ctx.fillRect(-6, 22, 12, 2);

      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(12, -10);
      ctx.lineTo(9, 20);
      ctx.lineTo(-9, 20);
      ctx.lineTo(-12, -10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.lineTo(6, -8);
      ctx.lineTo(-6, -8);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.lineTo(-6, 15);
      ctx.moveTo(10, -5);
      ctx.lineTo(6, 15);
      ctx.stroke();

      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.ellipse(0, 2, 9, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = mainColor;
      if (!isMobile) ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -3, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#020617";
      ctx.fillRect(-8, 0, 16, 5);

      const brakeGlow = activeBrake && isPlayer ? "#ff0055" : mainColor;
      ctx.fillStyle = brakeGlow;
      if (!isMobile) {
        ctx.shadowColor = brakeGlow;
        ctx.shadowBlur = activeBrake && isPlayer ? 25 : 12;
      }
      ctx.fillRect(-6, 22, 12, 4);

      ctx.restore();
    };

    // --- Main Game Loop ---
    const gameLoop = () => {
      frame++;
      const currentWidth = getWidth();
      const currentHeight = getHeight();
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      // Ref theke latest controls state neya
      const { isGas: curGas, isBrake: curBrake, steerValue: curSteerVal } = controlsRef.current;

      // Bike-er position screen-er thik control button-er opore (160px up)
      const py = currentHeight - 160;

      ctx.clearRect(0, 0, currentWidth, currentHeight);

      if (curGas || keys["KeyW"] || keys["ArrowUp"]) {
        speed = Math.min(speed + 0.08, maxSpeed);
      } else if (curBrake || keys["KeyS"] || keys["ArrowDown"]) {
        speed = Math.max(speed - 0.25, 0);
      } else {
        speed = Math.max(speed - 0.03, 0);
      }

      if (!isCelebrating) {
        distanceTraveled += speed;
      }

      let currentSteer = curSteerVal || touchSteer;
      if (keys["KeyA"] || keys["ArrowLeft"]) currentSteer = -1;
      if (keys["KeyD"] || keys["ArrowRight"]) currentSteer = 1;

      playerX += currentSteer * (3.2 + speed * 0.15);

      const roadWidth = Math.min(currentWidth * 0.85, 380);
      const roadLeft = (currentWidth - roadWidth) / 2;
      const minAllowedX = roadLeft + 20;
      const maxAllowedX = roadLeft + roadWidth - 20;

      playerX = Math.max(minAllowedX, Math.min(maxAllowedX, playerX));

      // Background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, currentWidth, currentHeight);

      const buildingWidth = Math.max(5, roadLeft - 10);
      const bHeight = 130;
      const buildingOffset = distanceTraveled % bHeight;

      for (let y = -bHeight * 2; y < currentHeight + bHeight; y += bHeight) {
        const drawY = y + buildingOffset;

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(2, drawY, buildingWidth, bHeight - 12);
        ctx.fillRect(roadLeft + roadWidth + 8, drawY, buildingWidth, bHeight - 12);

        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        ctx.strokeRect(2, drawY, buildingWidth, bHeight - 12);
        ctx.strokeRect(roadLeft + roadWidth + 8, drawY, buildingWidth, bHeight - 12);

        if (buildingWidth > 20) {
          for (let wx = 8; wx < buildingWidth - 8; wx += 16) {
            for (let wy = 15; wy < bHeight - 25; wy += 22) {
              if ((Math.floor(drawY) + wx + wy) % 4 === 0) {
                ctx.fillStyle = (wx + wy) % 2 === 0 ? "#00f3ff" : "#ff0055";
                if (!isMobile) {
                  ctx.shadowColor = ctx.fillStyle;
                  ctx.shadowBlur = 6;
                }
                ctx.fillRect(2 + wx, drawY + wy, 6, 8);
                ctx.fillRect(roadLeft + roadWidth + 8 + wx, drawY + wy, 6, 8);
              }
            }
          }
        }
        ctx.shadowBlur = 0;
      }

      // Neon Road
      ctx.fillStyle = "#090d16";
      ctx.fillRect(roadLeft, 0, roadWidth, currentHeight);

      const borderSegment = 40;
      const borderOffset = distanceTraveled % (borderSegment * 2);
      ctx.lineWidth = 5;

      for (let y = -borderSegment * 2; y < currentHeight + borderSegment * 2; y += borderSegment) {
        const drawY = y + borderOffset;
        const isCyan = Math.floor((y - borderOffset) / borderSegment) % 2 === 0;

        ctx.strokeStyle = isCyan ? "#00f3ff" : "#ff0055";
        if (!isMobile) {
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.moveTo(roadLeft, drawY);
        ctx.lineTo(roadLeft, drawY + borderSegment);
        ctx.moveTo(roadLeft + roadWidth, drawY);
        ctx.lineTo(roadLeft + roadWidth, drawY + borderSegment);
        ctx.stroke();
      }

      ctx.strokeStyle = "#00f3ff";
      if (!isMobile) {
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 8;
      }
      ctx.setLineDash([30, 30]);
      ctx.lineDashOffset = -distanceTraveled % 60;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(roadLeft + roadWidth / 3, 0);
      ctx.lineTo(roadLeft + roadWidth / 3, currentHeight);
      ctx.moveTo(roadLeft + (roadWidth / 3) * 2, 0);
      ctx.lineTo(roadLeft + (roadWidth / 3) * 2, currentHeight);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Spawn Logic
      if (!isCelebrating) {
        if (frame % Math.max(35, 90 - level * 8) === 0) {
          trafficBikes.push({
            x: roadLeft + 30 + Math.random() * (roadWidth - 60),
            y: -100,
            speed: 1.5 + Math.random() * 2 + level * 0.4,
            color: ["#ff0055", "#ffe600", "#39ff14", "#b026ff"][Math.floor(Math.random() * 4)],
          });
        }

        if (frame % 60 === 0) {
          coinsList.push({
            x: roadLeft + 30 + Math.random() * (roadWidth - 60),
            y: -50,
          });
        }
      }

      // Coin Logic
      for (let i = coinsList.length - 1; i >= 0; i--) {
        let coin = coinsList[i];
        coin.y += speed;

        if (!isMobile) {
          ctx.shadowColor = "#ffe600";
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = "#ffe600";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (Math.hypot(playerX - coin.x, py - coin.y) < 28) {
          if (onCoinCollect) onCoinCollect();
          coinsList.splice(i, 1);
        } else if (coin.y > currentHeight + 50) {
          coinsList.splice(i, 1);
        }
      }

      // Traffic Logic
      for (let i = trafficBikes.length - 1; i >= 0; i--) {
        let traffic = trafficBikes[i];
        traffic.y += speed - traffic.speed;

        drawFuturisticBike(traffic.x, traffic.y, false, traffic.color);

        const isColliding =
          Math.abs(playerX - traffic.x) < 22 &&
          Math.abs(py - traffic.y) < 45;

        if (isColliding && !isCelebrating) {
          if (speed > 7) {
            if (onCrash) onCrash();
            return;
          } else {
            traffic.x += playerX < traffic.x ? 20 : -20;
          }
        }

        if (traffic.y > currentHeight + 100 || traffic.y < -200) {
          trafficBikes.splice(i, 1);
        }
      }

      // Finish Line
      const remainingDist = trackLength - distanceTraveled;
      if (remainingDist < currentHeight) {
        const flagY = py - remainingDist;
        const blockSize = 20;

        for (let x = roadLeft; x < roadLeft + roadWidth; x += blockSize) {
          for (let yOffset = 0; yOffset < 30; yOffset += blockSize / 2) {
            const isBlack = (Math.floor(x / blockSize) + Math.floor(yOffset / (blockSize / 2))) % 2 === 0;
            ctx.fillStyle = isBlack ? "#00f3ff" : "#ff0055";
            ctx.fillRect(x, flagY + yOffset, blockSize, blockSize / 2);
          }
        }

        if (remainingDist <= 0 && !isCelebrating) {
          isCelebrating = true;
          createConfetti();
        }
      }

      if (isCelebrating) {
        celebrateFrame++;
        for (let i = sparkles.length - 1; i >= 0; i--) {
          let p = sparkles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;

          ctx.fillStyle = p.color;
          if (!isMobile) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.y > currentHeight) sparkles.splice(i, 1);
        }
        ctx.shadowBlur = 0;

        if (celebrateFrame > 120) {
          if (onWin) onWin();
          return;
        }
      }

      // Player Bike
      drawFuturisticBike(playerX, py, true, null, curBrake);

      if (onUpdateMetrics) {
        onUpdateMetrics(
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
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [level]); // 2. Dependency array-te sudhu [level] rakha hoyeche jeno button press-e loop reset na hoy.

  return (
    <div className="w-full h-full relative overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-slate-950"
      />
    </div>
  );
}