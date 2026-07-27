import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let dataParticles = [];
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNetwork();
    };

    const initNetwork = () => {
      nodes = [];
      dataParticles = [];
      const nodeCount = Math.floor(Math.random() * 21) + 60; // 60-80
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 2,
          baseRadius: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          baseOpacity: Math.random() * 0.6 + 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.05 + 0.02
        });
      }

      const particleCount = Math.floor(Math.random() * 6) + 15; // 15-20
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
        speed: Math.random() * 0.01 + 0.005,
        active: true
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isShanta = theme === 'shanta';
      const rgbColor = isShanta ? '0, 240, 255' : '255, 107, 0';
      const hexColor = isShanta ? '#00F0FF' : '#FF6B00';
      
      const maxDistance = 180;
      const mouseMaxDist = 200;

      // Update nodes
      nodes.forEach(node => {
        node.x += node.speedX;
        node.y += node.speedY;

        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        node.pulseOffset += node.pulseSpeed;
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSq);
            let opacity = 1 - (dist / maxDistance);
            
            const distToMouseI = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
            const distToMouseJ = Math.hypot(nodes[j].x - mouse.x, nodes[j].y - mouse.y);
            
            if (distToMouseI < mouseMaxDist || distToMouseJ < mouseMaxDist) {
              opacity = Math.min(1, opacity + 0.4);
              ctx.lineWidth = 1.5;
            } else {
              ctx.lineWidth = 1;
            }

            opacity *= 0.5; // Base connection opacity multiplier

            if (opacity > 0) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              
              const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
              grad.addColorStop(0, `rgba(${rgbColor}, ${opacity * nodes[i].baseOpacity})`);
              grad.addColorStop(1, `rgba(${rgbColor}, ${opacity * nodes[j].baseOpacity})`);
              
              ctx.strokeStyle = grad;
              ctx.stroke();
            }
          }
        }
      }

      // Draw Data Particles
      dataParticles.forEach((p, idx) => {
        if (!p || !p.active) {
          dataParticles[idx] = createDataParticle();
          return;
        }

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.active = false;
        } else {
          const curX = p.source.x + (p.target.x - p.source.x) * p.progress;
          const curY = p.source.y + (p.target.y - p.source.y) * p.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 12;
          ctx.shadowColor = hexColor;
          ctx.fill();
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const distToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        let currentOpacity = node.baseOpacity;
        let radius = node.baseRadius;

        currentOpacity += Math.sin(node.pulseOffset) * 0.15;
        
        if (distToMouse < mouseMaxDist) {
          const intensity = 1 - (distToMouse / mouseMaxDist);
          currentOpacity = Math.min(1, currentOpacity + intensity * 0.6);
          radius += intensity * 2;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbColor}, ${currentOpacity})`;
        ctx.shadowBlur = distToMouse < mouseMaxDist ? 15 : 8;
        ctx.shadowColor = hexColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
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
