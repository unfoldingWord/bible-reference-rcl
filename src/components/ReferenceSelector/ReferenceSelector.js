import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {findKeyInList, findLabelInList} from "../../common/ReferenceUtils";
import {createFilterOptions} from "@material-ui/lab";

function findItem(options, initialSelection) {
  let found = findKeyInList(options, initialSelection);
  if (found <= 0) {
    found = 0
  }
  return found;
}

// function defaultStringify(value) {
//   if (value == null) {
//     return '';
//   }
//
//   if (typeof value === 'string') {
//     return value;
//   }
//
//   if (typeof value === 'object') {
//     return value.key;
//   }
//
//   return JSON.stringify(value);
// }

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: option => option.key, // tried defaultStringify
  trim: true,
});

// function compareOption(option, value) {
//   const equal = option.key === value.key;
//   // if (equal) {
//   //   console.log('found match', option, value);
//   // }
//   return equal;
// };

export function ReferenceSelector(props) {
  const {
    options,
    initial,
    onChange,
    name,
  } = props;

  const initialSelection = initial || ( options.length && options[0].key ) || '';
  let found = findItem(options, initialSelection);
  let initialValue = options[found];
  const [value, setValue] = React.useState(initialValue);

  console.log(`redraw with initial=${initial} found=${found} value.key=${value.key}`);

  // Render the UI for your table
  return (
        <Autocomplete
          id={`combo-box-${name}`}
          blurOnSelect={true}
          autoComplete={true}
          onBlur={() => {
            console.log(`onBlur() - setting to ${value.key}`)
            onChange && onChange(value.key)
          }}
          filterOptions={filterOptions}
          disableClearable={true}
          value={value}
          onChange={(event, newValue) => {
            if (newValue) {
              console.log(`onChange() - setting to ${newValue.key}`);
              setValue(newValue);
            } else {
              console.log(`onChange() - invalid setting ${newValue}`);
            }
          }}
          onInputChange={(event, newInputValue) => {
            let found = findKeyInList(options, newInputValue);
            if (found < 0) { // see if this is a label
              found = findLabelInList(options, newInputValue);
            }
            if (found >= 0) {
              const option = options[found];
              setValue(option);
              console.log(`onInputChange() - found match for ${newInputValue} = ${option.key}`);
            } else {
              console.log(`onInputChange() - match not found ${newInputValue}`);
            }
          }}
          options={options}
          // getOptionSelected={compareOption}
          getOptionLabel={(option) => option.key}
          style={{ width: "fit-content", paddingLeft: 10, paddingRight: 10}}
          renderInput={(params) => <TextField {...params} />}
        />
  )
}

export default ReferenceSelector;
