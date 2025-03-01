import React, { useEffect, useState } from 'react';
import Xarrow from 'react-xarrows';
import { useCanvasStore } from '../store/canvasStore';
import Node from './Node';
import { Position } from '../types/canvas';
import { nanoid } from 'nanoid';

const Canvas: React.FC = () => {
    const { canvas, addEdge, addNode, loadCanvas } = useCanvasStore();
    const [connecting, setConnecting] = useState<string | null>(null);
    // const [renderKey, setRenderKey] = useState(0);

    // useEffect(() => {
    //     setRenderKey((prev) => prev + 1); // Force re-render
    // }, [canvas.nodes, canvas.edges]);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                processJsonToGraph(jsonData);
            } catch (error) {
                console.error("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const processJsonToGraph = (
        jsonData: any, 
        parentId: string | null = null, 
        depth = 0, 
        previousNodePosition: number = 100, 
        index = 0
    ) => {
        if (typeof jsonData !== "object") return;
        const baseX = 100 + depth * 200;
        const baseY = 100 + index * 100;

        Object.entries(jsonData).forEach(([key, value], i) => {
            const id = `${parentId || "root"}-${key}`;
            const nodeY = previousNodePosition;
            addNode(key, { x: baseX, y: (baseY + i * nodeY) }, id);

            if (parentId) {
                console.log(`Connecting ${parentId} → ${id}`);
                if (parentId !== id) {
                    addEdge(parentId, id);
                }
                setConnecting(null);
            } else {
                setConnecting(id);
            }

            if (typeof value === "object") {
                processJsonToGraph(value, id, depth + 1, nodeY + 120, i);
            }
        });
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only add node if clicking directly on canvas, not on a node
        if ((e.target as HTMLElement).id === 'canvas') {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const position: Position = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };

            addNode('basic', position, nanoid());
        }
    };

    return (
        <div
            id="canvas"
            className="w-full h-full bg-gray-100 relative overflow-hidden"
            onClick={handleCanvasClick}
            style={{ minHeight: '600px', overflow: 'scroll' }}>

            <input type="file" accept="application/json" onChange={handleFileUpload} className="mb-2" />

            
            <div id="canvas" className="relative w-full h-[600px] border" style={{ minHeight: "600px" }}>
                {canvas.nodes.map((node) => (
                    <Node
                        key={node.id}
                        node={node}
                        connecting={connecting}
                        setConnecting={setConnecting}
                    />
                ))}


                {canvas.edges.map((edge) => (
                    edge.source && edge.target ? (<Xarrow
                        key={edge.id}
                        start={edge.source}
                        end={edge.target}
                        color="#888"
                        strokeWidth={2}
                        path="smooth"
                        curveness={0.5}
                        showHead={true}
                        animateDrawing={true}
                        labels={{ middle: edge.label || '' }}
                    />) : null
                ))}
            </div>
        </div>
    );
};

export default Canvas;