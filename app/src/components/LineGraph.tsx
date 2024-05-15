import { PointTooltip, PointTooltipProps, ResponsiveLine } from '@nivo/line';
import { DataItem } from '../types';
import { indexNames } from '../indexInfo';

interface Props {
  data: DataItem[],
  selectedYear: number | null,
  onIndexSelected: (index: string) => void,
  onYearSelected: (year: number) => void
}

const LineGraph = ({ data, selectedYear, onIndexSelected, onYearSelected }: Props) => {

  const customTooltip: PointTooltip = ({ point }: PointTooltipProps) => (
    <div style={{
      background: 'white',
      padding: '5px',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        width: '12px',
        height: '12px',
        backgroundColor: point.borderColor,
        display: 'inline-block',
        marginRight: '5px'
      }} ></div>
      {point.id.split('_')[0]} - {indexNames[point.serieId.toString().split('_')[2]]}
      < br />
      {point.data.x.toString()}: <b>{point.data.y.toString()}</b>
    </div>
  );

  const customLayer = ({ xScale, innerHeight }: any) => {
    const x = xScale(selectedYear);
    return (
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={innerHeight}
        stroke="var(--line-color)"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    );
  };

  return (
    <>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'linear', min: 'auto', max: 2025 }}
        yScale={{ type: 'linear', min: 0, max: 1, stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          // TODO Make tickValues dynamic to screen/graph width
          tickValues: [1800, 1825, 1850, 1875, 1900, 1925, 1950, 1975, 2000, 2025],
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
        tooltip={customTooltip}
        onClick={point => {
          onIndexSelected(String(point.serieId).split('_')[2]);
          onYearSelected(Number(point.data.x));
        }}
        layers={['grid', 'markers', 'axes', 'areas', 'lines', 'points', 'slices', 'mesh', 'legends', customLayer]}
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
  )
}

export default LineGraph;