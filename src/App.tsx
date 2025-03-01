import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
	return (
		<div className="h-screen flex flex-col">
			<Toolbar />
			<div className="flex-1 overflow-hidden">
				<Canvas />
			</div>
		</div>
	);
	
}

export default App;