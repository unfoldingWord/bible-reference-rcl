import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from 'prop-types';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const navButtonsStyle = {
  width: '34px',
  height: '44px',
  paddingLeft: '0px',
  paddingRight: '0px',
  marginLeft: '-10px',
  marginRight: '-10px'
}

const narrowIconsStyle = {
  marginLeft: '-8px',
  marginRight: '-8px'
}

export const NAV_TYPES_DOUBLE_PREV = 0;
export const NAV_TYPES_PREV = 1;
export const NAV_TYPES_NEXT = 2;
export const NAV_TYPES_DOUBLE_NEXT = 3;


function getIcon(type) {
  switch (type) {
    case NAV_TYPES_DOUBLE_PREV:
      return (
        <>
          <NavigateBeforeIcon style={narrowIconsStyle}/>
          <NavigateBeforeIcon style={narrowIconsStyle}/>
        </>
      );
    case NAV_TYPES_DOUBLE_NEXT:
      return (
        <>
          <NavigateNextIcon style={narrowIconsStyle}/>
          <NavigateNextIcon style={narrowIconsStyle}/>
        </>
      );
    case NAV_TYPES_PREV:
      return (
        <NavigateBeforeIcon/>
      );
    case NAV_TYPES_NEXT:
    default:
      return (
        <NavigateNextIcon/>
      );
  }
}

export function NavButtons(props) {
  const {
    type,
    style,
    onClick,
    id
  } = props;

  const classes = useStyles();

  const style_ = {...navButtonsStyle, ...style}; // style property will override default style

  // Render the UI for your table
  return (
      <Button variant="text" id={id} size="large" style={style_} onClick={onClick}>
        {getIcon(type)}
      </Button>
  )
}

NavButtons.defaultProps = {
  style: {}
};

NavButtons.propTypes = {
  type: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default NavButtons;
