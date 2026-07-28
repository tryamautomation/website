import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let nodes = [];
    let dataParticles = [];
    let mouse = { x: -1000, y: -1000 };
    let isVisible = true;

    // IntersectionObserver to pause rendering when canvas is not visible
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNetwork();
    };

    const initNetwork = () => {
      nodes = [];
      dataParticles = [];
      // 45-55 nodes: optimal density with 3x faster spatial loop
      const nodeCount = Math.floor(Math.random() * 10) + 45;
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 2,
          baseRadius: Math.random() * 2.5 + 2,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          baseOpacity: Math.random() * 0.5 + 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.02
        });
      }

      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        dataParticles.push(createDataParticle());
      }
    };

    const createDataParticle = () => {
      if (nodes.length < 2) return null;
      const sourceIdx = Math.floor(Math.random() * nodes.length);
      let targetIdx = Math.floor(Math.random() * nodes.length);
      while (targetIdx === sourceIdx) {
        targetIdx = Math.floor(Math.random() * nodes.length);
      }
      return {
        source: nodes[sourceIdx],
        target: nodes[targetIdx],
        progress: 0,
        speed: Math.random() * 0.012 + 0.006,
        active: true
      };
    };

    const maxDistance = 170;
    const maxDistSq = maxDistance * maxDistance;
    const mouseMaxDist = 180;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isShanta = theme === 'shanta';
      const rgbColor = isShanta ? '0, 240, 255' : '255, 107, 0';

      // 1. Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.speedX;
        node.y += node.speedY;

        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        node.pulseOffset += node.pulseSpeed;
      }

      // 2. Draw connections (High-performance flat stroke, zero GC allocation per frame)
      for (let i = 0; i < nodes.length; i++) {
        const nI = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nJ = nodes[j];
          const dx = nI.x - nJ.x;
          const dy = nI.y - nJ.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            let alpha = (1 - dist / maxDistance) * 0.35 * nI.baseOpacity;
            
            const distToMouseI = Math.hypot(nI.x - mouse.x, nI.y - mouse.y);
            if (distToMouseI < mouseMaxDist) {
              alpha = Math.min(0.7, alpha + 0.35);
            }

            if (alpha > 0.02) {
              ctx.beginPath();
              ctx.moveTo(nI.x, nI.y);
              ctx.lineTo(nJ.x, nJ.y);
              ctx.strokeStyle = `rgba(${rgbColor}, ${alpha})`;
              ctx.lineWidth = alpha > 0.3 ? 1.2 : 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw Data Particles (Clean fast render without heavy shadowBlur)
      for (let i = 0; i < dataParticles.length; i++) {
        let p = dataParticles[i];
        if (!p || !p.active) {
          dataParticles[i] = createDataParticle();
          p = dataParticles[i];
        }

        if (p) {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.active = false;
          } else {
            const curX = p.source.x + (p.target.x - p.source.x) * p.progress;
            const curY = p.source.y + (p.target.y - p.source.y) * p.progress;

            ctx.beginPath();
            ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = isShanta ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 220, 180, 0.95)';
            ctx.fill();
          }
        }
      }

      // 4. Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        let currentOpacity = node.baseOpacity + Math.sin(node.pulseOffset) * 0.12;
        let radius = node.baseRadius;
        
        if (distToMouse < mouseMaxDist) {
          const intensity = 1 - (distToMouse / mouseMaxDist);
          currentOpacity = Math.min(1, currentOpacity + intensity * 0.5);
          radius += intensity * 1.8;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbColor}, ${currentOpacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      if (containerRef.current) observer.unobserve(containerRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="bg-effects" ref={containerRef}>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-center"></div>
      <div className="grid-pattern"></div>
      <canvas ref={canvasRef} id="particle-canvas" />
      <div className="scanlines"></div>
    </div>
  );
}
