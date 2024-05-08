import chroma from 'chroma-js';
import { indexColors, indexDescriptions, indexNames } from '../indexInfo';

interface Props {
  selectedIndex: string;
  onClose: () => void;
}

const IndexInfoBox = ({ selectedIndex, onClose }: Props) => {
  return (
    <>
      {selectedIndex &&
        <div style={{ backgroundColor: chroma(indexColors[selectedIndex]).alpha(0.3).css(), padding: '10px', margin: '10px', width: '80%' }}>
          <b>{indexNames[selectedIndex]} democracy index</b>
          <p style={{ fontSize: '12px' }}>
            {indexDescriptions[selectedIndex]}
          </p>
          <button onClick={onClose}>
            Close
          </button>
        </div>
      }
    </>
  );
};

export default IndexInfoBox;

