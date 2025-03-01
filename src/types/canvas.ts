export interface Position {
    x: number;
    y: number;
}

export interface NodeData {
    id: string;
    position: Position;
    type: string;
    content: string;
    width: number;
    height: number;
}

export interface EdgeData {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface CanvasData {
    nodes: NodeData[];
    edges: EdgeData[];
}