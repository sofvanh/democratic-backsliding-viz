import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
import chroma from 'chroma-js';
const rawData: DataItem[] = require('./prod-dataset.json');

const indexColors: { [key: string]: string } = {
  'egaldem': '#FF5733',
  'delibdem': '#33FF57',
  'partipdem': '#3357FF',
  'libdem': '#FF33A6',
  'polyarchy': '#A633FF'
};

const setColors = (data: DataItem[], adjustColor: (color: string) => string) => {
  data.forEach(item => {
    const indexKey = item.id.split('_')[2];
    item.color = adjustColor(indexColors[indexKey]);
  });
  return data;
}

function App() {
  const [worldAverages] = useState<DataItem[]>(setColors(rawData.filter(item => item.id.startsWith('World average')), (color) => chroma(color).alpha(0.5).css()));
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedData, setSelectedData] = useState<DataItem[]>([]);
  const [combinedData, setCombinedData] = useState<DataItem[]>([]);

  const handleCountrySelect = useCallback((feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.NAME;
    setSelectedCountry(countryName);
    const dataForCountry = rawData.filter(item => item.id.startsWith(countryName + '_'));
    const dataWithColors = setColors(dataForCountry, (color) => chroma(color).saturate(1).css());
    setSelectedData(dataWithColors);
  }, [setSelectedCountry, setSelectedData]);

  useEffect(() => {
    setCombinedData([...worldAverages, ...selectedData]);
  }, [worldAverages, selectedData]);

  return (
    <div className="App">
      <header className="App-header">
        Democratic development in {selectedCountry}
        <p style={{ fontSize: '12px' }}>
          Select a country on the map!
        </p>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ height: 400, width: '50%' }}>
            <LineGraph data={combinedData} />
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