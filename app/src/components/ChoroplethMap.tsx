import { ChoroplethBoundFeature, ResponsiveChoropleth } from '@nivo/geo';
import worldCountries from '../world_countries.json';

interface Props {
    onCountrySelected: (feature: ChoroplethBoundFeature) => void;
}

const ChoroplethMap = ({ onCountrySelected }: Props) => {
  return (
      <ResponsiveChoropleth
          data={[]}  // Initially, no data is passed
          features={worldCountries.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors="YlOrRd"
          domain={[ 0, 1000000 ]}
          unknownColor="#666666"
          label="properties.name"
          valueFormat=".2s"
          projectionTranslation={[ 0.5, 0.5 ]}
          projectionRotation={[ 0, 0, 0 ]}
          onClick={feature => onCountrySelected(feature)}
          // legends={[
          //     {
          //         anchor: 'bottom-left',
          //         direction: 'column',
          //         justify: true,
          //         translateX: 20,
          //         translateY: -100,
          //         itemsSpacing: 0,
          //         itemWidth: 94,
          //         itemHeight: 18,
          //         itemDirection: 'left-to-right',
          //         itemTextColor: '#444444',
          //         symbolSize: 18,
          //         effects: [
          //             {
          //                 on: 'hover',
          //                 style: {
          //                     itemTextColor: '#000000',
          //                     itemBackground: 'rgba(255, 255, 255, 0.5)'
          //                 }
          //             }
          //         ]
          //     }
          // ]}
      />
  );
};


export default ChoroplethMap;

