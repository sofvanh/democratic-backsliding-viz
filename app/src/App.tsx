import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { DataItem } from './types';
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

  const handleCountrySelect = useCallback((feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.NAME;
    setSelectedCountry(countryName);
  }, [setSelectedCountry]);

  useEffect(() => {
    const countryData = selectedCountry ? setColors(rawData.filter(item => item.id.startsWith(selectedCountry + '_')), _ => _) : [];
    let data = [...worldAverages, ...countryData];
    if (selectedIndex) {
      data = data.filter(item => item.id.includes(`_${selectedIndex}`));
    }
    setCombinedData(data);
  }, [worldAverages, selectedIndex, selectedCountry]);

  return (
    <div className="App">
      <header className="App-header">
        <h4>
          Democratic development across the world
        </h4>
        <div style={{ fontSize: '14px', height: '30px', alignContent: 'center' }}>
          {selectedCountry ?
            <>
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
            <ChoroplethMap onCountrySelected={handleCountrySelect} />
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