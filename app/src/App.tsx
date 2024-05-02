import React from 'react';
import './App.css';
import { ResponsiveLine } from '@nivo/line';
import rawData from './prod-dataset.json';

function App() {

  const filteredData = rawData.filter(serie => serie.id.startsWith('Afghanistan'));

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ height: 400, width: 800 }}>
          Democratic development in Afghanistan
          <ResponsiveLine
            data={filteredData}
            margin={{ top: 50, right: 170, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              // TODO Make tickValues dynamic to screen/graph width
              tickValues: [1800, 1825, 1850, 1875, 1900, 1925, 1950, 1975, 2000],
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Year',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Score',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'nivo' }}
            pointSize={1}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            enableGridX={false}
            enableGridY={false}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 170,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 160,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </header>
    </div>
  );
}

export default App;