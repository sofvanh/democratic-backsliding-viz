import { ChoroplethBoundFeature, ResponsiveChoropleth } from '@nivo/geo';
import geojson from '../geojson_features.json';
import { ChoroplethDataItem } from '../types';

interface Props {
  data: ChoroplethDataItem[];
  colors: string[];
  onCountrySelected: (feature: ChoroplethBoundFeature) => void;
}

const ChoroplethMap = ({ data, colors, onCountrySelected }: Props) => {
  return (
    <ResponsiveChoropleth
      data={data}
      features={geojson.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors={colors}
      domain={[0, 1]}
      unknownColor="#666666"
      label="properties.NAME"
      valueFormat=".2s"
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      onClick={feature => {
        console.log(feature)
        onCountrySelected(feature)
      }}
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          justify: true,
          translateX: 0,
          translateY: -10,
          itemsSpacing: 0,
          itemWidth: 94,
          itemHeight: 18,
          itemDirection: 'left-to-right',
          itemTextColor: '#444444',
          symbolSize: 12,
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000000',
                itemBackground: 'rgba(255, 255, 255, 0.5)'
              }
            }
          ]
        }
      ]}
    />
  );
};


export default ChoroplethMap;

