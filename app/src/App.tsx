import React from 'react';
import './App.css';
import { DataItem } from './types';
import LineGraph from './components/LineGraph';
const rawData: DataItem[] = require('./prod-dataset.json');

function App() {

  const filteredData = rawData.filter(serie => serie.id.startsWith('Afghanistan'));

  return (
    <div className="App">
      <header className="App-header">
          Democratic development in Afghanistan
        <div style={{ height: 400, width: 800 }}>
          <LineGraph data={filteredData} />
        </div>
      </header>
    </div>
  );
}

export default App;