import React from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { CanvasData } from '../types/canvas';

const Toolbar: React.FC = () => {
    const { loadCanvas, exportCanvas } = useCanvasStore();

    const handleExport = () => {
        const canvasData = exportCanvas();
        const dataStr = JSON.stringify(canvasData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string) as CanvasData;
                loadCanvas(json);
            } catch (err) {
                console.error('Failed to parse JSON file', err);
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-gray-800 text-white p-4 flex items-center space-x-4">
            <h1 className="text-xl font-bold">JSON Canvas</h1>

            <div className="flex-1"></div>

            <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleExport}>
                Export Canvas
            </button>

            <label className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 cursor-pointer">
                Import Canvas
                <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                />
            </label>
        </div>
    );
};

export default Toolbar;