import { ResponsiveLine } from '@nivo/line';
import { DataItem } from '../types';

// TODO Move this (also find prettier colors)
const indexColors: { [key: string]: string } = {
    'egaldem': '#FF5733',
    'delibdem': '#33FF57',
    'partipdem': '#3357FF',
    'libdem': '#FF33A6',
    'polyarchy': '#A633FF'
};

interface Props {
    worldAverages: DataItem[]
    data: DataItem[]
}

const LineGraph = ({ worldAverages, data }: Props) => {

    const getColor = (line: any) => {
        const id: string = line.id;
        const baseColor = indexColors[id.split('_')[2]];
        if (!id.startsWith("World average") || data.length == 0) {
            return baseColor;
        }

        const opacity = 0.25; // Lower opacity
        return `${baseColor}${Math.floor(opacity * 255).toString(16)}`;
    }

    return (
        <>
            <ResponsiveLine
                data={worldAverages.concat(data)}
                margin={{ top: 50, right: 170, bottom: 50, left: 60 }}
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
                colors={line => getColor(line)}
                pointSize={1}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={0}
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
        </>
    )
}

export default LineGraph;