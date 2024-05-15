import { useState } from "react";
import { indexNames } from "../indexInfo";

const CountryButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  return (
    <div className="Country-button Horizontal">
      {children}<button onClick={onClick}>x</button>
    </div>
  );
};

interface Props {
  selectedCountries: string[];
  allCountries: string[];
  selectedIndex: string;
  selectedYear: number;
  setSelectedCountries: (countries: string[]) => void;
  setSelectedIndex: (index: string) => void;
  setSelectedYear: (year: number) => void;
}

const Selections = ({ selectedCountries, allCountries, selectedIndex, selectedYear, setSelectedCountries, setSelectedIndex, setSelectedYear }: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredCountries = allCountries.filter(country =>
    country.toLowerCase().includes(searchInput.toLowerCase()) && !selectedCountries.includes(country)
  );

  const addCountry = (country: string) => {
    setSelectedCountries([...selectedCountries, country]);
    setSearchInput('');
    setIsInputFocused(false);
  };

  return (
    <div className="Selections Max-width Left Padding-0-20">
      <div className="Horizontal">
        <b>Country</b>:
        {selectedCountries.length == 0 && <div className="Hint">&nbsp;Select countries on the map to see data</div>}
        {selectedCountries.map((country, index) => (
          <CountryButton key={index} onClick={() => setSelectedCountries(selectedCountries.filter(c => c !== country))}>
            {country}
          </CountryButton>
        ))}
        {selectedCountries.length > 0 && <button onClick={() => setSelectedCountries([])}>Clear All</button>}
      </div>
      <div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
          placeholder="Search for a country"
        />
        {isInputFocused &&
          <div className="Popup">
            {filteredCountries.map((country, index) => (
              <div key={index}>
                <button
                  onClick={() => addCountry(country)}
                  style={{
                    width: '100%',
                    height: '2em',
                    margin: '2px 0px',
                    textAlign: 'left'
                  }}
                >
                  {country}
                </button>
                <br />
              </div>
            ))}
          </div>
        }
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

