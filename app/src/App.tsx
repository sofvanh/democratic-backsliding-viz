import React, { useState } from 'react';
import './App.css';
import { DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
const rawData: DataItem[] = require('./prod-dataset.json');

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedData, setSelectedData] = useState<DataItem[]>([]);

  const handleCountrySelect = (feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.name;
    setSelectedCountry(countryName);
    const dataForCountry = rawData.filter(item => item.id.startsWith(countryName));
    setSelectedData(dataForCountry);
  };

  return (
    <div className="App">
      <header className="App-header">
          Democratic development in {selectedCountry}
          <p style={{fontSize: '12px'}}>
            Select a country on the map!
          </p>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ height: 400, width: '50%' }}>
            <LineGraph data={selectedData} />
          </div>
          <div style={{ height: 400, width: '50%' }}>
            <ChoroplethMap onCountrySelected={handleCountrySelect} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;