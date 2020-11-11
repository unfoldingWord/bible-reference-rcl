import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {findKeyInList, findLabelInList} from "../../common/ReferenceUtils";

function findItem(options, initialSelection) {
  let found = findKeyInList(options, initialSelection);
  if (found <= 0) {
    found = 0
  }
  return found;
}

export function ReferenceSelector(props) {
  const {
    options,
    initial,
    onChange,
    name,
  } = props;

  const initialSelection = initial || ( options.length && options[0].key ) || '';
  let found = findItem(options, initialSelection);
  const [value, setValue] = React.useState(options[found]);
  const [inputValue, setInputValue] = React.useState(initialSelection);

  // Render the UI for your table
  return (
        <Autocomplete
          id={`combo-box-${name}`}
          value={value}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue(newValue);
              setInputValue(newValue.key);
              onChange && onChange(newValue.key);
            }
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (newInputValue !== inputValue) { // see if changed
              let found = findLabelInList(options, newInputValue);
              if (found < 0) { // see if this is a key
                found = findKeyInList(options, newInputValue);
              }
              if (found >= 0) {
                const option = options[found];
                setValue(option);
                setInputValue(option.key);
                onChange && onChange(option.key);
              } else {
                setInputValue(newInputValue);
              }
            }
          }}
          options={options}
          getOptionLabel={(option) => option.label}
          style={{ width: "fit-content", paddingLeft: 10, paddingRight: 10}}
          renderInput={(params) => <TextField {...params} />}
        />
  )
}

export default ReferenceSelector;
