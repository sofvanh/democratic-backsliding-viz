import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ChoroplethDataItem, DataItem } from './types';
import LineGraph from './components/LineGraph';
import ChoroplethMap from './components/ChoroplethMap';
import { ChoroplethBoundFeature } from '@nivo/geo';
import chroma from 'chroma-js';
import { indexColors, indexNames } from './indexInfo';
import Selections from './components/Selections';
const rawData: DataItem[] = require('./prod-dataset.json');
const countryAverageData: DataItem[] = require('./prod-dataset-country-averages.json');


const setColors = (data: DataItem[], adjustColor: (color: string) => string) => {
  const newData = data.map(item => {
    const indexKey = item.id.split('_')[2];
    return { ...item, color: adjustColor(indexColors[indexKey]) };
  });
  return newData;
}

function App() {
  const [worldAverages] = useState<DataItem[]>(setColors(rawData.filter(item => item.id.startsWith('World average')), (color) => chroma(color).alpha(0.5).css()));
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [allCountries] = useState<string[]>(Array.from(new Set(rawData.map(item => item.id.split('_')[0]).filter(country => country !== 'World average'))));
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [combinedData, setCombinedData] = useState<DataItem[]>([]);
  const [choroplethData, setChoroplethData] = useState<ChoroplethDataItem[]>([]);
  const [choroplethColors, setChoroplethColors] = useState<string[]>([]);

  const handleCountrySelect = useCallback((feature: ChoroplethBoundFeature) => {
    const object: any = feature; // It seems that the typing of the library is outdated
    const countryName = object.properties.NAME;
    if (selectedCountries.includes(countryName)) {
      setSelectedCountries(selectedCountries.filter(country => country !== countryName));
    } else {
      setSelectedCountries([...selectedCountries, countryName]);
    }
  }, [selectedCountries]);

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
  }, [setSelectedYear]);

  const generateColors = useCallback((targetColor: string) => {
    const lightColor = chroma(targetColor).brighten(2).hex();
    return chroma.scale([lightColor, targetColor]).mode('lab').colors(5);
  }, []);

  useEffect(() => {
    let data = worldAverages;
    const selectedCountriesData = selectedCountries.length > 0
      ? rawData.filter(item => selectedCountries.some(country => item.id.startsWith(country + '_')))
      : [];
    for (let i = 0; i < selectedCountriesData.length; i += 5) {
      const countryData = selectedCountriesData.slice(i, i + 5);
      const order = i / 5;
      data = [...data, ...setColors(countryData, (color) => chroma(color).brighten(order).css())];
    }
    if (selectedIndex) {
      data = data.filter(item => item.id.includes(`_${selectedIndex}`));
    }
    setCombinedData(data);
  }, [worldAverages, selectedIndex, selectedCountries]);

  useEffect(() => {
    const dataset = selectedIndex === '' ? countryAverageData : rawData;
    const index = selectedIndex === '' ? 'overall' : selectedIndex;

    const indexDataForYear = dataset.filter(dataItem => dataItem.id.endsWith(`_${index}`) && dataItem.data.some(dataPoint => dataPoint.x === selectedYear));
    const mappedData = indexDataForYear.map(dataItem => ({
      id: dataItem.ISO,
      value: dataItem.data.find(dataPoint => dataPoint.x === selectedYear)?.y || -1
    }));
    const filteredData = mappedData.filter(dataItem => dataItem.value !== -1);

    setChoroplethData(filteredData);
    setChoroplethColors(generateColors(indexColors[index]));
  }, [selectedIndex, selectedYear, generateColors]);

  return (
    <>
      <header className="App-header Centered">
        <h1 className="Left Max-width Padding-0-20">
          Democratic development across the world
        </h1>
      </header>
      <div className="App-content Centered">
        <Selections
          selectedCountries={selectedCountries}
          allCountries={allCountries}
          selectedIndex={selectedIndex}
          selectedYear={selectedYear}
          setSelectedCountries={setSelectedCountries}
          setSelectedIndex={setSelectedIndex}
          setSelectedYear={setSelectedYear}
        />
        <div className="Max-width" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ height: 400, width: '50%' }}>
            <LineGraph data={combinedData} selectedYear={selectedYear} onIndexSelected={setSelectedIndex} onYearSelected={handleYearSelect} />
          </div>
          <div style={{ height: 400, width: '50%' }}>
            <ChoroplethMap
              data={choroplethData}
              colors={choroplethColors}
              hint={`Showing: ${selectedIndex === '' ? 'Averages over all indices' : `${indexNames[selectedIndex]} democracy index`}, ${selectedYear}`}
              selectedCountries={selectedCountries}
              onCountrySelected={handleCountrySelect} />
          </div>
        </div>
        <div className="Descriptions Left Max-width Padding-0-20">
          <h4>Democracy indices explained</h4>
          <p>The indices are five <i>high-level democratic indices</i>, aggregating data from lower-level indices to describe the state of democracy in a country over time across five key democratic principles. Source: <a href="https://v-dem.net/">Varieties of Democracy (V-Dem)</a>.</p>
          <p className="Border" style={{ borderColor: indexColors['polyarchy'] }}><b>Electoral</b>: Elections are trustworthy and fair.</p>
          <p className="Border" style={{ borderColor: indexColors['libdem'] }}><b>Liberal</b>: Individual and minority rights are protected against the tyranny of the state and majority. The government's power is regulated through constitutional laws, strong rule of law, an independent judiciary, and effective checks and balances.</p>
          <p className="Border" style={{ borderColor: indexColors['partipdem'] }}><b>Participatory</b>: Citizens are active participators in all political processes, electoral and non-electoral.</p>
          <p className="Border" style={{ borderColor: indexColors['delibdem'] }}><b>Deliberative</b>: Decisions are reached through public reasoning focused on the common good and not through e.g. emotional appeals, solidary attachments, parochial interests, or coercion.</p>
          <p className="Border" style={{ borderColor: indexColors['egaldem'] }}><b>Egalitarian</b>: All social groups and individuals have the same rights and freedoms and equal access to resources and power.</p>
        </div>
      </div>
    </>
  );
}

export default App;