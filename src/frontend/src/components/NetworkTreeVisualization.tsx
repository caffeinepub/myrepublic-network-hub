import { useEffect, useRef } from 'react';
import type { FamilyTreeNode } from '../backend';

interface NetworkTreeVisualizationProps {
  treeData: FamilyTreeNode;
}

export default function NetworkTreeVisualization({ treeData }: NetworkTreeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tree
    const nodeRadius = 30;
    const levelHeight = 120;
    const startX = canvas.width / 2;
    const startY = 50;

    function drawNode(x: number, y: number, node: FamilyTreeNode, level: number) {
      if (!ctx) return;

      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = level === 0 ? '#2563eb' : level === 1 ? '#3b82f6' : level === 2 ? '#60a5fa' : '#93c5fd';
      ctx.fill();
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const name = node.basic.name.length > 10 ? node.basic.name.slice(0, 10) + '...' : node.basic.name;
      ctx.fillText(name, x, y);

      // Draw children
      if (node.children.length > 0) {
        const childrenWidth = node.children.length * 150;
        const startChildX = x - childrenWidth / 2 + 75;

        node.children.forEach((child, index) => {
          const childX = startChildX + index * 150;
          const childY = y + levelHeight;

          // Draw line to child
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(childX, childY - nodeRadius);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw child node
          drawNode(childX, childY, child, level + 1);
        });
      }
    }

    drawNode(startX, startY, treeData, 0);
  }, [treeData]);

  return (
    <div className="w-full overflow-x-auto">
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white"
        style={{ minWidth: '800px' }}
      />
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
          <span>Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Level 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-400"></div>
          <span>Level 2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-300"></div>
          <span>Level 3</span>
        </div>
      </div>
    </div>
  );
}
