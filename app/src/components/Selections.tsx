import { indexNames } from "../indexInfo";

interface Props {
  selectedCountries: string[];
  selectedIndex: string;
  selectedYear: number;
  setSelectedCountries: (countries: string[]) => void;
  setSelectedIndex: (index: string) => void;
  setSelectedYear: (year: number) => void;
}

const Selections = ({ selectedCountries, selectedIndex, selectedYear, setSelectedCountries, setSelectedIndex, setSelectedYear }: Props) => {
  return (
    <div className="Selections Max-width Left Padding">
      <div>
        <b>Country</b>: {selectedCountries.length > 0 && <><b>{selectedCountries.join(', ')}</b> <button onClick={() => setSelectedCountries([])}>x</button></>}
      </div>
      <div>
        <b>Index</b>: {selectedIndex && <><b>{indexNames[selectedIndex]}</b> <button onClick={() => setSelectedIndex('')}>x</button></>}
      </div>
      <div>
        <b>Year</b>: {selectedYear != 2023 && <><b>{selectedYear}</b> <button onClick={() => setSelectedYear(2023)}>x</button></>}
        {selectedYear == 2023 && <>2023</>}
      </div>
    </div>
  );
};

export default Selections;

