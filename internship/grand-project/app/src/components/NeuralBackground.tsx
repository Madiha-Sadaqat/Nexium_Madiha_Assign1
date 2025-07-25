// app/src/components/NeuralBackground.tsx
"use client";
import { useEffect, useRef } from "react";

export default function NeuralBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Node {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 2 + Math.random() * 2;
        this.vx = -0.5 + Math.random();
        this.vy = -0.5 + Math.random();
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(165, 180, 252, 0.8)' : 'rgba(99, 102, 241, 0.8)';
        ctx.fill();
      }
    }

    class Connection {
      node1: Node;
      node2: Node;
      
      constructor(node1: Node, node2: Node) {
        this.node1 = node1;
        this.node2 = node2;
      }
      
      draw() {
        const dx = this.node1.x - this.node2.x;
        const dy = this.node1.y - this.node2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(this.node1.x, this.node1.y);
          ctx.lineTo(this.node2.x, this.node2.y);
          ctx.strokeStyle = darkMode ? `rgba(165, 180, 252, ${1 - dist/150})` : `rgba(99, 102, 241, ${1 - dist/150})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    const nodes = Array.from({ length: 30 }, () => new Node());
    const connections: Connection[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        connections.push(new Connection(nodes[i], nodes[j]));
      }
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      connections.forEach(conn => conn.draw());
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}