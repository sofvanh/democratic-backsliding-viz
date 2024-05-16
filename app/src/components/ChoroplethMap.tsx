import { ChoroplethBoundFeature, ResponsiveChoropleth } from '@nivo/geo';
import geojson from '../geojson_features.json';
import { ChoroplethDataItem } from '../types';

interface Props {
  data: ChoroplethDataItem[];
  colors: string[];
  hint: string;
  selectedCountries: string[];
  onCountrySelected: (feature: ChoroplethBoundFeature) => void;
}

const ChoroplethMap = ({ data, colors, hint, selectedCountries, onCountrySelected }: Props) => {

  return (
    <>
      <div className="Hint Left">{hint}</div>
      <div className="Choropleth-map" style={{ height: '100%', width: '100%' }}>
        <ResponsiveChoropleth
          data={data}
          features={geojson.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={colors}
          domain={[0, 1]}
          unknownColor="#666666"
          label="properties.NAME"
          projectionTranslation={[0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          onClick={feature => onCountrySelected(feature)}
          borderWidth={country => selectedCountries.includes(country.label) ? 2 : 0.2}
          legends={[
            {
              anchor: 'bottom-left',
              direction: 'column',
              justify: true,
              translateX: 0,
              translateY: -28,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemTextColor: '#444444',
              symbolSize: 12
            },
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
              data: [
                {
                  id: 'No data',
                  label: 'No data',
                  color: '#666666'
                }
              ]
            }
          ]}
        />
      </div>
    </>
  );
};

export default ChoroplethMap;
