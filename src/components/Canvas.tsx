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
        depth = 0
    ) => {
        if (typeof jsonData !== "object") return;
    
        const keys = Object.keys(jsonData);
        const verticalSpacing = 120;
        const horizontalSpacing = 250;
        const MIN_LEFT_PADDING = 50;
        const MIN_TOP_PADDING = 120;
    
        keys.forEach((key, i) => {
            const id = `${parentId || "root"}-${key}`;
    
            // Calculate position:
            // x increases per depth level,
            // y is offset by the level and index of this node.
            const nodePosition = {
                x: MIN_LEFT_PADDING + depth * horizontalSpacing,
                y: MIN_TOP_PADDING + depth * 50 + i * verticalSpacing,
            };
    
            addNode(key, nodePosition, id);
    
            if (parentId && parentId !== id) {
                addEdge(parentId, id);
            }
            setConnecting(parentId ? null : id);
    
            if (typeof jsonData[key] === "object" && jsonData[key] !== null) {
                processJsonToGraph(jsonData[key], id, depth + 1);
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
            className="w-full h-full bg-gray-100 relative"
            onClick={handleCanvasClick}
            style={{ 
                minHeight: '1000px',
                minWidth: '1500px',
                overflow: 'auto',
                padding: '20px' 
            }}>

            <div className="sticky top-0 z-10 bg-gray-100 pb-4">
                <input
                    type="file"
                    accept="application/json"
                    onChange={handleFileUpload}
                    className="mb-2"
                />
            </div>

            
            <div 
                id="canvas" 
                className="relative w-full border" 
                style={{ minHeight: "600px", paddingTop: '50px' }}>
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