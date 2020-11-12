import React, {useEffect} from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {findKeyInList, findLabelInList} from "../../common/ReferenceUtils";
import {createFilterOptions} from "@material-ui/lab";

function findItemIndexDefault(options, initialSelection, defaultIndex = 0) {
  let found = findKeyInList(options, initialSelection);
  if (found <= 0) {
    found = 0
  }
  return found;
}

function findItemDefault(options, initialSelection, defaultIndex = 0) {
  let found = findItemIndexDefault(options, initialSelection, defaultIndex);
  return options[found];
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
  // stringify: option => option.key, // tried defaultStringify
  // trim: true,
});

function compareOption(option, value) {
  let equal = option.key === value.key;
  if (equal) {
    console.log('found exact match', option, value);
  }
  return equal;
}

export function ReferenceSelector(props) {
  const {
    options,
    initial,
    onChange,
    id,
  } = props;

  const initialSelectionKey = initial || ( options.length && options[0].key ) || '';
  const initialSelectedValue = findItemDefault(options, initialSelectionKey);
  const [selectedValue, setSelectedValue] = React.useState(initialSelectedValue);
  const [textboxValue, setTextboxValue] = React.useState(initialSelectedValue.key);
  console.log(`ReferenceSelector(${id}) - redraw with initial=${initial} initialSelectedValue.key=${initialSelectedValue.key} selectedValue.key=${selectedValue.key} textboxValue=${textboxValue}`);

  useEffect(() => {
    console.log(`ReferenceSelector.useEffect(${id}) - initial changed to ${initial}`);
    if ((initialSelectionKey !== textboxValue) || (initialSelectionKey !== selectedValue.key)) {
      console.log(`ReferenceSelector.useEffect(${id}) - previous state values textboxValue=${textboxValue} selectedValue.key=${selectedValue.key}`);
      console.log(`ReferenceSelector.useEffect(${id}) - updating state`);
      setSelectedValue(initialSelectedValue);
      setTextboxValue(initialSelectedValue.key);
    }
  }, [initial]);

  // Render the UI for your table
  return (
        <Autocomplete
          id={`combo-box-${name}`}
          // autoComplete={true}
          // blurOnSelect={true}
          disableClearable={true}
          // disableCloseOnSelect={false}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.key}
          // getOptionSelected={compareOption}

          options={options}

          onBlur={() => { // send latest selection to onChange
            let latestValue = null;
            if (textboxValue !== selectedValue.key) { // see if change in textbox contents
              let found = findKeyInList(options, textboxValue);
              if (found >= 0) { // if this matches an option, then use it
                const selectedValue = options[found];
                setSelectedValue(selectedValue);
                latestValue = selectedValue.key;
                console.log(`ReferenceSelector(${id}).onBlur() - setting to last matched value ${latestValue}`);
              }
            }

            if (!textboxValue) { // if different match not found in textbox, use last selected
              latestValue = selectedValue.key;
              console.log(`ReferenceSelector(${id}).onBlur() - setting to last selected value ${latestValue}`);
            }
            onChange && onChange(latestValue);
          }}

          value={selectedValue}
          onChange={(event, newValue) => {
            if (newValue) {
              const newKey = newValue['key'];
              console.log(`ReferenceSelector(${id}).onChange() - setting to ${newKey}`);
              setSelectedValue(newValue);
              setTextboxValue(newKey);
              onChange && onChange(newKey);
            } else {
              console.log(`ReferenceSelector(${id}).onChange() - invalid setting ${newValue}`);
            }
          }}

          inputValue={textboxValue}
          onInputChange={(event, newInputValue) => {
            setTextboxValue(newInputValue);
            console.log(`ReferenceSelector(${id}).onInputChange() - new input value ${newInputValue}`);
          }}

          // style={{ width: "fit-content", paddingLeft: 10, paddingRight: 10}}
          style={{ width: "70px", paddingLeft: 10, paddingRight: 10}}
          renderInput={(params) => <TextField {...params} />}
        />
  )
}

export default ReferenceSelector;
