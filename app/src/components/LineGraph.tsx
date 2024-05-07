import { ResponsiveLine } from '@nivo/line';
import { DataItem } from '../types';

interface Props {
  data: DataItem[],
  onIndexSelected: (index: string) => void
}

const LineGraph = ({ data, onIndexSelected }: Props) =>
  <>
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
      xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
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
      colors={line => line.color}
      pointSize={1}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={0}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      enableGridX={false}
      enableGridY={false}
      onClick={serie => onIndexSelected(String(serie.serieId).split('_')[2])}
      legends={[
        {
          data: data,
          anchor: 'top-left',
          direction: 'column',
          justify: false,
          translateX: 10,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 160,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          onClick: serie => onIndexSelected(String(serie.id).split('_')[2]),
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
  </>

export default LineGraph;