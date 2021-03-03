import React, { useEffect } from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { findItemDefault, findKeyInList } from "../../common/ReferenceUtils";
import { createFilterOptions } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import PropTypes from "prop-types";
import isequal from "lodash.isequal";
import { withStyles } from '@material-ui/core/styles';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'yellow',
      },
    },
  },
})(TextField);

const autoCompleteDefaultStyle = {
  height: "12px",
  width: "80px",
  fontFamily: "Noto Sans",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0",
  lineHeight: "12px",
  textAlign: "center",
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingTop: "4px",
}

const defaultPopperWidthMultiplier = 1.25; // accommodates width of vertical scrollbar so text is not cropped

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
  const equal = option.key === value.key;
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

function applyStylesToInput(params, styles) {
  if (params) {
    if (!params.inputProps) {
      params.inputProps = {}
    }
    let newStyles = styles;
    if (params.inputProps.style) {
      newStyles = { ...params.inputProps.style, ...styles};
    }
    params.inputProps.style = newStyles;
  }
  return params;
}

export function ReferenceSelector(props) {
  const {
    id,
    style,
    options,
    initial,
    onChange,
    matchName,
    inputProps,
    usePopperWidth,
  } = props;

  const initialSelectionKey = initial || ( options.length && options[0].key ) || '';
  const initialSelectedValue = findItemDefault(options, initialSelectionKey);
  const [selectedValue, setSelectedValue] = React.useState(initialSelectedValue);
  const [textboxValue, setTextboxValue] = React.useState(initialSelectedValue.key);
  const [selectionOptions, setSelectionOptions] = React.useState(options);

  const filterOptions = initFilterOptions(matchName);
  const style_ = { ...autoCompleteDefaultStyle, ...style}; // style property will override default style

  useEffect(() => {
    if (!isequal(options, selectionOptions)) {
      // console.log(`ReferenceSelector.useEffect(${id}) - options changed`);
      setSelectionOptions(options);
    }
    if ((initialSelectionKey !== textboxValue) || (initialSelectionKey !== selectedValue.key)) {
      // console.log(`ReferenceSelector.useEffect(${id}) - initial changed to ${initial}`);
      setSelectedValue(initialSelectedValue);
      setTextboxValue(initialSelectedValue.key);
    }
  }, [initial, options]);

  function PopperMy(props) {
    const popperProps = {...props};
    popperProps['placement'] = 'bottom-start';
    const width = popperProps.style?.width; // get current width (from parent)
    if (usePopperWidth ) { // use popper width setting passed as property
      popperProps.style.width = usePopperWidth ;
    } else if (typeof width === 'number') {
      // add width for vertical scrollbar, since some browsers will truncate width to accommodate scrollbar when it is shown
      popperProps.style.width = Math.round(width * defaultPopperWidthMultiplier) + 'px';
    }
    return (<Popper {...popperProps} />)
  }

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
            // console.log(`ReferenceSelector(${id}).onBlur() - setting to last matched value ${latestValue}`);
          }
        }

        if (!latestValue) { // if different match not found in textbox, use last selected
          latestValue = selectedValue.key;
          // console.log(`ReferenceSelector(${id}).onBlur() - setting to last selected value ${latestValue}`);
        }
        onChange && onChange(latestValue);
      }}
      options={selectionOptions}
      selectOnFocus
      style={style_}

      value={selectedValue}
      onChange={(event, newValue) => { // when selected from menu
        if (newValue) {
          const newKey = newValue['key'];
          // console.log(`ReferenceSelector(${id}).onChange() - setting to ${newKey}`);
          setSelectedValue(newValue);
          setTextboxValue(newKey);
          onChange && onChange(newKey);
        } else {
          console.error(`ReferenceSelector(${id}).onChange() - invalid setting ${newValue}`);
        }
      }}

      inputValue={textboxValue}
      onInputChange={(event, newInputValue) => { // on typing in text box
        setTextboxValue(newInputValue);
        // console.log(`ReferenceSelector(${id}).onInputChange() - new input value ${newInputValue}`);
      }}

      renderInput={(params) => {
        console.log({inputProps})
        // params.inputProps = { ...params.inputProps, className: `${params.inputProps.className} ${inputProps.classes.underline}` }
        console.log({inputProps: params.inputProps})

        return (
          <TextField
            { ...applyStylesToInput(params, style)}
            // InputProps={{className: inputProps.classes.underline}}
            InputProps={{
                classes: inputProps.classes
              }}
          />
        )
      }}
      renderOption={(option) => <Typography noWrap>{option.label}</Typography>}

      PopperComponent={PopperMy}
    />
  )
}

ReferenceSelector.defaultProps = {
  matchName: false,
  style: {}
};

/**
 * selection option used by ReferenceSelector components
 * @typedef {Object} SelectionOption
 * @property {string} key - internal key (identifier) for selection
 * @property {string} name - internal name used for matching typed text (e.g. `Mark`)
 * @property {string} value - string to be displayed for selection (e.g. `Mark (mrk)`)
 */

ReferenceSelector.propTypes = {
  /** SelectionOption[] - array of current selectable options */
  options: PropTypes.array.isRequired,
  /** selection item (by key) to preselect */
  initial: PropTypes.string.isRequired,
  /** function(key: string) - call back for when selected item changed */
  onChange: PropTypes.func.isRequired,
  /** if true the text input will be matched against either key or name, otherwise will match key only */
  matchName: PropTypes.bool,
  /** identifier for this ReferenceSelector instance */
  id: PropTypes.string.isRequired,
  /** custom styles to use, defaults to {} */
  style: PropTypes.object,
  /** used to set width of Popper **/
  usePopperWidth: PropTypes.string,
};

export default ReferenceSelector;
