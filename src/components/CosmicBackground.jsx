import React, { useEffect, useRef } from 'react';

export default function CosmicBackground({ themeMode = 'earth' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for subtle parallax effect
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Generate Twinkling Stars
    const starCount = Math.floor((width * height) / 6000);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.9 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: ['#ffffff', '#93c5fd', '#60a5fa', '#a78bfa', '#c084fc', '#38bdf8', '#7dd3fc'][Math.floor(Math.random() * 7)]
    }));

    // Generate Floating Cosmic Nebula Orbs
    const nebulaOrbs = [
      { x: width * 0.15, y: height * 0.2, radius: 400, color: 'rgba(37, 99, 235, 0.16)', vx: 0.12, vy: 0.08 },
      { x: width * 0.85, y: height * 0.65, radius: 480, color: 'rgba(147, 51, 234, 0.14)', vx: -0.09, vy: -0.1 },
      { x: width * 0.5, y: height * 0.85, radius: 360, color: 'rgba(14, 165, 233, 0.14)', vx: 0.07, vy: -0.12 },
      { x: width * 0.75, y: height * 0.15, radius: 320, color: 'rgba(79, 70, 229, 0.15)', vx: -0.1, vy: 0.08 }
    ];

    // Shooting Stars / Meteors Array
    const meteors = [];

    const spawnMeteor = () => {
      if (Math.random() < 0.025) {
        const startX = Math.random() * (width * 1.2) - width * 0.1;
        const startY = Math.random() * (height * 0.4);
        const isCyan = Math.random() > 0.4;
        meteors.push({
          x: startX,
          y: startY,
          length: Math.random() * 90 + 60,
          speed: Math.random() * 8 + 10,
          alpha: 1.0,
          thickness: Math.random() * 1.6 + 0.8,
          headColor: isCyan ? '#38bdf8' : '#c084fc',
          tailColor: isCyan ? 'rgba(56, 189, 248, 0)' : 'rgba(192, 132, 252, 0)'
        });
      }
    };

    // Planetary Earth Globe Setup (Earth Mode)
    let globeAngle = 0;
    const landmassPoints = [];
    const numPoints = 280;
    for (let i = 0; i < numPoints; i++) {
      const lat = (Math.random() - 0.5) * Math.PI * 0.85;
      const lon = Math.random() * Math.PI * 2;
      const isCityLight = Math.random() > 0.3;
      const color = isCityLight
        ? (Math.random() > 0.4 ? '#38bdf8' : '#fbbf24')
        : '#818cf8';
      landmassPoints.push({ lat, lon, color, size: Math.random() * 2.2 + 0.8 });
    }

    const satellites = [
      { angle: 0, speed: 0.0035, radiusOffset: 50, color: '#38bdf8', size: 3 },
      { angle: Math.PI * 0.7, speed: -0.0028, radiusOffset: 80, color: '#c084fc', size: 2.5 },
      { angle: Math.PI * 1.4, speed: 0.0042, radiusOffset: 35, color: '#34d399', size: 2.5 }
    ];

    // Galactic Stream Planets Setup (Stream Mode - 5 Planets along S-Curve)
    const streamPlanets = [
      { t: 0.15, radius: 55, color: '#38bdf8', halo: 'rgba(56, 189, 248, 0.3)', rotSpeed: 0.003, angle: 0, type: 'gas' },
      { t: 0.35, radius: 32, color: '#fbbf24', halo: 'rgba(251, 191, 36, 0.3)', rotSpeed: -0.004, angle: 0, type: 'moon' },
      { t: 0.55, radius: 24, color: '#34d399', halo: 'rgba(52, 211, 153, 0.35)', rotSpeed: 0.006, angle: 0, type: 'crystal' },
      { t: 0.75, radius: 75, color: '#818cf8', halo: 'rgba(129, 140, 248, 0.3)', rotSpeed: 0.002, angle: 0, type: 'saturn' },
      { t: 0.92, radius: 42, color: '#c084fc', halo: 'rgba(192, 132, 252, 0.3)', rotSpeed: -0.003, angle: 0, type: 'dwarf' }
    ];

    // Cubic Bézier Helper: returns (x, y) along S-Curve
    const getBezierPoint = (t, p0, p1, p2, p3) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      return { x, y };
    };

    // Render Animation Loop
    const render = () => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep Space Base Gradient
      const baseGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      baseGrad.addColorStop(0, '#0a0e1a');
      baseGrad.addColorStop(0.5, '#040713');
      baseGrad.addColorStop(1, '#020308');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Floating Nebula Orbs
      nebulaOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const offsetX = (mouse.x - width / 2) * 0.035;
        const offsetY = (mouse.y - height / 2) * 0.035;

        const orbGrad = ctx.createRadialGradient(
          orb.x + offsetX,
          orb.y + offsetY,
          0,
          orb.x + offsetX,
          orb.y + offsetY,
          orb.radius
        );
        orbGrad.addColorStop(0, orb.color);
        orbGrad.addColorStop(0.7, orb.color.replace(/[\d\.]+\)$/, '0.03)'));
        orbGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x + offsetX, orb.y + offsetY, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Twinkling Stars
      stars.forEach((star) => {
        star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.008;
        const clampedAlpha = Math.max(0.15, Math.min(0.95, star.alpha));

        const parallaxX = (mouse.x - width / 2) * (star.size * 0.008);
        const parallaxY = (mouse.y - height / 2) * (star.size * 0.008);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 1.3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      ctx.globalAlpha = 1.0;

      // ----------------------------------------------------
      // MODE 1: EARTH HORIZON BACKGROUND
      // ----------------------------------------------------
      if (themeMode === 'earth') {
        globeAngle += 0.0012;
        const R = Math.max(width * 0.55, 620);
        const cX = width / 2 + (mouse.x - width / 2) * 0.02;
        const cY = height + R * 0.52;

        // Atmosphere Corona Glow
        const atmosphereGrad = ctx.createRadialGradient(cX, cY, R * 0.82, cX, cY, R + 180);
        atmosphereGrad.addColorStop(0, 'rgba(14, 165, 233, 0.24)');
        atmosphereGrad.addColorStop(0.35, 'rgba(59, 130, 246, 0.16)');
        atmosphereGrad.addColorStop(0.65, 'rgba(147, 51, 234, 0.08)');
        atmosphereGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = atmosphereGrad;
        ctx.beginPath();
        ctx.arc(cX, cY, R + 180, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body Base
        const planetBodyGrad = ctx.createRadialGradient(cX, cY - R * 0.5, 0, cX, cY, R);
        planetBodyGrad.addColorStop(0, '#0d2342');
        planetBodyGrad.addColorStop(0.5, '#07152b');
        planetBodyGrad.addColorStop(0.85, '#030a17');
        planetBodyGrad.addColorStop(1, '#01040a');

        ctx.fillStyle = planetBodyGrad;
        ctx.beginPath();
        ctx.arc(cX, cY, R, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Longitude Meridians
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          const lon = (i * Math.PI) / 6 + globeAngle;
          const cosLon = Math.cos(lon);
          if (cosLon > -0.2) {
            const alpha = Math.max(0.02, cosLon * 0.12);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            const radiusX = Math.abs(R * cosLon);
            ctx.ellipse(cX, cY, radiusX, R, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Latitude Parallels
        const latRings = [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6];
        latRings.forEach((latFactor) => {
          const latR = R * Math.cos((latFactor * Math.PI) / 2);
          const latY = cY - R * Math.sin((latFactor * Math.PI) / 2);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.07)';
          ctx.beginPath();
          ctx.ellipse(cX, latY, latR, latR * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Rotating Continent & City Light Nodes
        landmassPoints.forEach((pt) => {
          const currLon = pt.lon + globeAngle;
          const z = Math.cos(pt.lat) * Math.cos(currLon);
          if (z > 0) {
            const pX = cX + R * Math.cos(pt.lat) * Math.sin(currLon);
            const pY = cY - R * Math.sin(pt.lat);
            const alpha = z * 0.85;

            ctx.fillStyle = pt.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(pX, pY, pt.size * (0.7 + z * 0.5), 0, Math.PI * 2);
            ctx.fill();

            if (pt.size > 2.0 && z > 0.4) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = pt.color;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
        ctx.globalAlpha = 1.0;

        // Rim Light Crescent Glow
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.95)';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 24;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cX, cY, R, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Orbiting Satellites
        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          const satR = R + sat.radiusOffset;
          const sX = cX + satR * Math.cos(sat.angle);
          const sY = cY + satR * Math.sin(sat.angle) * 0.38 - R * 0.35;

          const tailX = cX + satR * Math.cos(sat.angle - sat.speed * 10);
          const tailY = cY + satR * Math.sin(sat.angle - sat.speed * 10) * 0.38 - R * 0.35;

          const satGrad = ctx.createLinearGradient(sX, sY, tailX, tailY);
          satGrad.addColorStop(0, sat.color);
          satGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.strokeStyle = satGrad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sX, sY);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 14;
          ctx.shadowColor = sat.color;
          ctx.beginPath();
          ctx.arc(sX, sY, sat.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ----------------------------------------------------
      // MODE 2: GALACTIC SPIRAL STREAM (Lower-Left to Upper-Right S-Curve)
      // ----------------------------------------------------
      if (themeMode === 'stream') {
        const p0 = { x: -width * 0.1, y: height * 1.1 };
        const p1 = { x: width * 0.4, y: height * 0.95 };
        const p2 = { x: width * 0.6, y: height * 0.05 };
        const p3 = { x: width * 1.1, y: -height * 0.1 };

        // 1. Draw Glowing Bézier S-Curve Stream Ribbon
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#38bdf8';
        const ribbonGrad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
        ribbonGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        ribbonGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
        ribbonGrad.addColorStop(1, 'rgba(52, 211, 153, 0.4)');

        ctx.strokeStyle = ribbonGrad;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Faint parallel stream aura lines
        [-15, 15].forEach((offset) => {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p0.x + offset, p0.y - offset);
          ctx.bezierCurveTo(p1.x + offset, p1.y - offset, p2.x + offset, p2.y - offset, p3.x + offset, p3.y - offset);
          ctx.stroke();
        });

        // 2. Render 5 Multi-Size Rotating Planets Along the Stream
        streamPlanets.forEach((planet) => {
          planet.angle += planet.rotSpeed;
          const pos = getBezierPoint(planet.t, p0, p1, p2, p3);
          const px = pos.x + (mouse.x - width / 2) * 0.02;
          const py = pos.y + (mouse.y - height / 2) * 0.02;

          // Outer Atmosphere Halo
          const haloGrad = ctx.createRadialGradient(px, py, planet.radius * 0.7, px, py, planet.radius * 1.8);
          haloGrad.addColorStop(0, planet.halo);
          haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(px, py, planet.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Planet Body Sphere Base
          const pBodyGrad = ctx.createRadialGradient(px - planet.radius * 0.3, py - planet.radius * 0.3, 0, px, py, planet.radius);
          pBodyGrad.addColorStop(0, planet.color);
          pBodyGrad.addColorStop(0.7, '#07152b');
          pBodyGrad.addColorStop(1, '#020611');

          ctx.fillStyle = pBodyGrad;
          ctx.beginPath();
          ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
          ctx.fill();

          // Type-Specific Details
          if (planet.type === 'saturn') {
            // Tilted Dust Ring (Saturn Style)
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(-Math.PI / 6 + planet.angle * 0.2);

            ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
            ctx.lineWidth = 6;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#c084fc';
            ctx.beginPath();
            ctx.ellipse(0, 0, planet.radius * 1.9, planet.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Rotating Longitude Meridians
          ctx.lineWidth = 1;
          for (let m = 0; m < 6; m++) {
            const lon = (m * Math.PI) / 3 + planet.angle;
            const cosL = Math.cos(lon);
            if (cosL > 0) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${cosL * 0.25})`;
              ctx.beginPath();
              ctx.ellipse(px, py, Math.abs(planet.radius * cosL), planet.radius, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Fresnel Rim Light Arc
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 12;
          ctx.shadowColor = planet.color;
          ctx.beginPath();
          ctx.arc(px, py, planet.radius, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      }

      // 8. Spawn & Draw Meteors
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.speed;
        m.y += m.speed * 0.6;
        m.alpha -= 0.012;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - m.length;
        const tailY = m.y - m.length * 0.6;

        const mGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        mGrad.addColorStop(0, m.headColor);
        mGrad.addColorStop(1, m.tailColor);

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = m.thickness;
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = m.headColor;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}



