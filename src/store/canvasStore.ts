import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { CanvasData, NodeData, EdgeData, Position } from '../types/canvas';

interface CanvasStore {
    canvas: CanvasData;
    selectedNode: string | null;

    // Actions
    addNode: (nodeType: string, position: Position, nodeId: string) => void;
    updateNodePosition: (id: string, position: Position) => void;
    updateNodeContent: (id: string, content: string) => void;
    removeNode: (id: string) => void;
    addEdge: (source: string, target: string) => void;
    removeEdge: (id: string) => void;
    selectNode: (id: string | null) => void;
    loadCanvas: (data: CanvasData) => void;
    exportCanvas: () => CanvasData;
}

const defaultNode = {
    width: 150,
    height: 80,
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
    canvas: {
        nodes: [],
        edges: [],
    },
    selectedNode: null,

    addNode: (nodeType, position, nodeId = "") => set((state) => {
        const id = nodeId ? nodeId : nanoid();
        const newNode: NodeData = {
            id,
            type: nodeType,
            content: `New ${nodeType}`,
            position,
            ...defaultNode,
        };

        return {
            canvas: {
                ...state.canvas,
                nodes: [...state.canvas.nodes, newNode],
            }
        };
    }),

    updateNodePosition: (id, position) => set((state) => ({
        canvas: {
            ...state.canvas,
            nodes: state.canvas.nodes.map((node) =>
                node.id === id ? { ...node, position } : node
            ),
        }
    })),

    updateNodeContent: (id, content) => set((state) => ({
        canvas: {
            ...state.canvas,
            nodes: state.canvas.nodes.map((node) =>
                node.id === id ? { ...node, content } : node
            ),
        }
    })),

    removeNode: (id) => set((state) => ({
        canvas: {
            nodes: state.canvas.nodes.filter((node) => node.id !== id),
            edges: state.canvas.edges.filter(
                (edge) => edge.source !== id && edge.target !== id
            ),
        },
        selectedNode: state.selectedNode === id ? null : state.selectedNode,
    })),

    addEdge: (source, target) => set((state) => {
        console.log("Adding Edge: ", { source, target });
        const id = `edge-${source}-${target}`;
        const edgeExists = state.canvas.edges.some(
            (edge) => edge.source === source && edge.target === target
        );

        if (edgeExists || source === target) return state;

        const newEdge: EdgeData = {
            id,
            source,
            target,
        };
        console.log("New Edge Added:", newEdge);
        console.log("Nodes:", state.canvas.nodes);
        console.log("Edges:", state.canvas.edges);
        return {
            canvas: {
                ...state.canvas,
                edges: [...state.canvas.edges, newEdge],
            }
        };
    }),

    removeEdge: (id) => set((state) => ({
        canvas: {
            ...state.canvas,
            edges: state.canvas.edges.filter((edge) => edge.id !== id),
        }
    })),

    selectNode: (id) => set({ selectedNode: id }),

    loadCanvas: (data) => set({ canvas: data }),

    exportCanvas: () => get().canvas,
}));