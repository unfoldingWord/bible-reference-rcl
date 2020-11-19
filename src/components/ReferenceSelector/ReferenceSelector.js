import React, { useEffect } from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { findItemDefault, findKeyInList } from "../../common/ReferenceUtils";
import { createFilterOptions } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import PropTypes from "prop-types";
import BibleReference from "../BibleReference/BibleReference";

function defaultStringify(value) {
  if (value == null) {
    return '';
  }

  if (typeof value === 'object') { // find matches either in key or name
    return value.key + value.name;
  }

  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

function compareOption(option, value) {
  let equal = option.key === value.key;
  // if (equal) {
  //   console.log('found exact match', option, value);
  // }
  return equal;
}

function initFilterOptions(matchName) {
  const matchType = matchName ? defaultStringify : (item) => (item.key);

  return createFilterOptions({
    stringify: matchType,
    ignoreCase: true,
  });
}

const PopperMy = function (props) {
  return (<Popper {...props} style={{ width: "fit-content" }} placement='bottom-start' />)
}

export function ReferenceSelector(props) {
  const {
    options,
    initial,
    onChange,
    matchName,
    id,
  } = props;

  const initialSelectionKey = initial || ( options.length && options[0].key ) || '';
  const initialSelectedValue = findItemDefault(options, initialSelectionKey);
  const [selectedValue, setSelectedValue] = React.useState(initialSelectedValue);
  const [textboxValue, setTextboxValue] = React.useState(initialSelectedValue.key);
  console.log(`ReferenceSelector(${id}) - redraw with initial=${initial} initialSelectedValue.key=${initialSelectedValue.key} selectedValue.key=${selectedValue.key} textboxValue=${textboxValue}`);

  const filterOptions = initFilterOptions(matchName);

  useEffect(() => {
    // console.log(`ReferenceSelector.useEffect(${id}) - initial changed to ${initial}`);
    if ((initialSelectionKey !== textboxValue) || (initialSelectionKey !== selectedValue.key)) {
      // console.log(`ReferenceSelector.useEffect(${id}) - previous state values textboxValue=${textboxValue} selectedValue.key=${selectedValue.key}`);
      // console.log(`ReferenceSelector.useEffect(${id}) - updating state`);
      setSelectedValue(initialSelectedValue);
      setTextboxValue(initialSelectedValue.key);
    }
  }, [initial]);

  // Render the UI for your table
  return (
        <Autocomplete
          id={`combo-box-${id}`}
          // autoComplete={true}
          // blurOnSelect={true}
          clearOnBlur
          disableClearable={true}
          disableListWrap
          // disableCloseOnSelect={false}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.key}
          getOptionSelected={compareOption}
          handleHomeEndKeys
          selectOnFocus

          options={options}

          onBlur={() => { // send latest selection to onChange
            let latestValue = null;
            if (textboxValue !== selectedValue.key) { // see if change in textbox contents
              let found = findKeyInList(options, 'key', textboxValue);
              if (found < 0) {
                found = findKeyInList(options, 'name', textboxValue);
              }
              if (found >= 0) { // if this matches an option, then use it
                const selectedValue = options[found];
                setSelectedValue(selectedValue);
                latestValue = selectedValue.key;
                setTextboxValue(latestValue);
                console.log(`ReferenceSelector(${id}).onBlur() - setting to last matched value ${latestValue}`);
              }
            }

            if (!latestValue) { // if different match not found in textbox, use last selected
              latestValue = selectedValue.key;
              console.log(`ReferenceSelector(${id}).onBlur() - setting to last selected value ${latestValue}`);
            }
            onChange && onChange(latestValue);
          }}

          value={selectedValue}
          onChange={(event, newValue) => { // when selected from menu
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
          onInputChange={(event, newInputValue) => { // on typing in text box
            setTextboxValue(newInputValue);
            console.log(`ReferenceSelector(${id}).onInputChange() - new input value ${newInputValue}`);
          }}

          // style={{ width: "fit-content", paddingLeft: 10, paddingRight: 10}}
          style={{ width: "70px", paddingLeft: 10, paddingRight: 10}}
          renderInput={(params) => <TextField {...params} />}
          renderOption={(option) => <Typography noWrap>{option.label}</Typography>}

          PopperComponent={PopperMy}
        />
  )
}

ReferenceSelector.defaultProps = {
  matchName: false,
};

ReferenceSelector.propTypes = {
  options: PropTypes.array.isRequired,
  initial: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  matchName: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default ReferenceSelector;
