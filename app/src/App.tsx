import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ChoroplethDataItem, DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
import chroma from 'chroma-js';
import { indexColors, indexNames } from './indexInfo';
const rawData: DataItem[] = require('./prod-dataset.json');
const countryAverageData: DataItem[] = require('./prod-dataset-country-averages.json');


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
    const dataset = selectedIndex === '' ? countryAverageData : rawData;
    const index = selectedIndex === '' ? 'overall' : selectedIndex;
    const data: ChoroplethDataItem[] = dataset
      .filter(item => item.id.endsWith(`_${index}`) && item.data.some(dataPoint => dataPoint.x === selectedYear))
      .map(item => ({
        id: item.ISO,
        value: item.data.find(dataPoint => dataPoint.x === selectedYear)?.y || (() => { console.error('No data found for year:', selectedYear); return 0; })()
      }));
    setChoroplethData(data);
    setChoroplethColors(generateColors(indexColors[index]));
  }, [selectedIndex, selectedYear, generateColors]);

  return (
    <>
      <header className="App-header Centered">
        <h1>
          Democratic development across the world
        </h1>
      </header>
      <body className="App-content Centered">
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
        <div className="Centered">
          <h4>Democracy indices explained</h4>
          <p>The indices are five <i>high-level democratic indices</i>, aggregating data from lower-level indices to describe the state of democracy in a country over time across five key democratic principles. Source: <a href="https://v-dem.net/">Varieties of Democracy (V-Dem)</a>.</p>
          <p className="Border" style={{ borderColor: indexColors['polyarchy'] }}><b>Electoral</b>: Elections are trustworthy and fair.</p>
          <p className="Border" style={{ borderColor: indexColors['libdem'] }}><b>Liberal</b>: Individual and minority rights are protected against the tyranny of the state and majority. The government's power is regulated through constitutional laws, strong rule of law, an independent judiciary, and effective checks and balances.</p>
          <p className="Border" style={{ borderColor: indexColors['partipdem'] }}><b>Participatory</b>: Citizens are active participators in all political processes, electoral and non-electoral.</p>
          <p className="Border" style={{ borderColor: indexColors['delibdem'] }}><b>Deliberative</b>: Decisions are reached through public reasoning focused on the common good and not through e.g. emotional appeals, solidary attachments, parochial interests, or coercion.</p>
          <p className="Border" style={{ borderColor: indexColors['egaldem'] }}><b>Egalitarian</b>: All social groups and individuals have the same rights and freedoms and equal access to resources and power.</p>
        </div>
      </body>
    </>
  );
}

export default App;