import React, { useState, useRef } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { NodeData } from '../types/canvas';

interface NodeProps {
    node: NodeData;
    connecting: string | null;
    setConnecting: (id: string | null) => void;
}

const Node: React.FC<NodeProps> = ({ node, connecting, setConnecting }) => {
    const {
        selectNode,
        selectedNode,
        updateNodePosition,
        updateNodeContent,
        removeNode,
        addEdge
    } = useCanvasStore();

    const nodeRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ x: node.position.x, y: node.position.y });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    
        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = position.x;
        const initialY = position.y;
    
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            setPosition({ x: initialX + dx, y: initialY + dy });
        };
    
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            updateNodePosition(node.id, position);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (connecting) {
            console.log(`Connecting ${connecting} → ${node.id}`);
            if (connecting !== node.id) {
                addEdge(connecting, node.id);
            }
            setConnecting(null);
        } else {
            setConnecting(node.id);
        }
    };

    return (
        <div
            ref={nodeRef}
            id={node.id}
            className={`absolute bg-white rounded-md shadow-md border-2 p-2 cursor-move ${selectedNode === node.id ? 'border-blue-500' : 'border-gray-300'}`}
            style={{ left: position.x, top: position.y, width: node.width, height: node.height }}
            onMouseDown={handleMouseDown}>
            <textarea
                className="w-full h-full resize-none border-none outline-none"
                value={node.content}
                onChange={(e) => updateNodeContent(node.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute top-0 right-0 flex">
                <button
                    className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-1"
                    onClick={handleNodeClick}
                >
                    →
                </button>
                <button
                    className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Node;
