import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ChoroplethDataItem, DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
import chroma from 'chroma-js';
import { indexColors, indexNames } from './indexInfo';
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
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [combinedData, setCombinedData] = useState<DataItem[]>([]);
  const [choroplethData, setChoroplethData] = useState<ChoroplethDataItem[]>([]);
  const [choroplethColors, setChoroplethColors] = useState<string[]>([]);

  const handleCountrySelect = useCallback((feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.NAME;
    setSelectedCountry(countryName);
  }, [setSelectedCountry]);

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
  }, [setSelectedYear]);

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
      .filter(item => item.id.endsWith(`_${selectedIndex}`) && item.data.some(dataPoint => dataPoint.x === selectedYear))
      .map(item => ({
        id: item.ISO,
        value: item.data.find(dataPoint => dataPoint.x === selectedYear)?.y || (() => { console.error('No data found for year:', selectedYear); return 0; })()
      }));
    setChoroplethData(data);
    setChoroplethColors(generateColors(indexColors[selectedIndex]));
  }, [selectedIndex, selectedYear, generateColors]);

  return (
    <div className="App">
      <div className="App-content">
        <header className="App-header">
          <h4>
            Democratic development across the world
          </h4>
        </header>
        <div style={{ fontSize: '14px', height: '30px', alignContent: 'center' }}>
          {selectedCountry || selectedIndex ?
            <>
              {/* TODO Say 'no data' if the selected country's not in the dataset */}
              Selected:
              {selectedCountry && <><b>{selectedCountry}</b> <button onClick={() => setSelectedCountry('')}>x</button></>}
              {" "}
              {selectedIndex && <><b>{indexNames[selectedIndex]}</b> <button onClick={() => setSelectedIndex('')}>x</button></>}
              {" "}
              {selectedIndex && <><b>{selectedYear}</b> <button onClick={() => setSelectedYear(2023)}>x</button></>}
            </> :
            'Select a country, democracy index, or data point to see more detailed data.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ height: 400, width: '50%' }}>
            <LineGraph data={combinedData} onIndexSelected={setSelectedIndex} onYearSelected={handleYearSelect} />
          </div>
          <div style={{ height: 400, width: '50%' }}>
            <ChoroplethMap data={choroplethData} colors={choroplethColors} selectedCountry={selectedCountry} onCountrySelected={handleCountrySelect} />
          </div>
        </div>
        <IndexInfoBox
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex('')}
        />
      </div>
    </div>
  );
}

export default App;