import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ChoroplethDataItem, DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
import chroma from 'chroma-js';
import { indexColors } from './indexInfo';
import IndexInfoBox from './components/IndexInfoBox';
const rawData: DataItem[] = require('./prod-dataset.json');


const setColors = (data: DataItem[], adjustColor: (color: string) => string) => {
  data.forEach(item => {
    const indexKey = item.id.split('_')[2];
    item.color = adjustColor(indexColors[indexKey]);
  });
  return data;
}

function App() {
  const [worldAverages] = useState<DataItem[]>(setColors(rawData.filter(item => item.id.startsWith('World average')), (color) => chroma(color).alpha(0.5).css()));
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [combinedData, setCombinedData] = useState<DataItem[]>([]);
  const [choroplethData, setChoroplethData] = useState<ChoroplethDataItem[]>([]);
  const [choroplethColors, setChoroplethColors] = useState<string[]>([]);

  const handleCountrySelect = useCallback((feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.NAME;
    setSelectedCountry(countryName);
  }, [setSelectedCountry]);

  const generateColors = useCallback((targetColor: string) => {
    const lightColor = chroma(targetColor).brighten(2).hex();
    return chroma.scale([lightColor, targetColor]).mode('lab').colors(5);
  }, []);

  useEffect(() => {
    const countryData = selectedCountry ? setColors(rawData.filter(item => item.id.startsWith(selectedCountry + '_')), _ => _) : [];
    let data = [...worldAverages, ...countryData];
    if (selectedIndex) {
      data = data.filter(item => item.id.includes(`_${selectedIndex}`));
    }
    setCombinedData(data);
  }, [worldAverages, selectedIndex, selectedCountry]);

  useEffect(() => {
    if (!selectedIndex) {
      setChoroplethData([]);
      setChoroplethColors(['#ffffff']);
      return;
    }
    const data: ChoroplethDataItem[] = rawData
      .filter(item => item.id.endsWith(`_${selectedIndex}`))
      .map(item => ({
        id: item.ISO,
        value: item.data.find(dataPoint => dataPoint.x === 2023)!.y
      }));
    setChoroplethData(data);
    setChoroplethColors(generateColors(indexColors[selectedIndex]));
  }, [selectedIndex, generateColors]);

  return (
    <div className="App">
      <header className="App-header">
        <h4>
          Democratic development across the world
        </h4>
        <div style={{ fontSize: '14px', height: '30px', alignContent: 'center' }}>
          {selectedCountry ?
            <>
              {/* TODO Say 'no data' if the selected country's not in the dataset */}
              Selected: <b>{selectedCountry}</b> <button onClick={() => setSelectedCountry('')}>
                x
              </button>
            </> :
            'Select a country on the map to see its data.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ height: 400, width: '50%' }}>
            <LineGraph data={combinedData} onIndexSelected={(index) => setSelectedIndex(index)} />
          </div>
          <div style={{ height: 400, width: '50%' }}>
            <ChoroplethMap data={choroplethData} colors={choroplethColors} onCountrySelected={handleCountrySelect} />
          </div>
        </div>
        <IndexInfoBox
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex('')}
        />
      </header>
    </div>
  );
}

export default App;