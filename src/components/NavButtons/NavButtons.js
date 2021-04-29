import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const navButtonsStyle = {
  width: '34px',
  height: '44px',
  paddingLeft: '0px',
  paddingRight: '0px',
  marginLeft: '-7px',
  marginRight: '-7px'
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

export function NavButtons({
  id,
  type,
  style,
  title,
  onClick,
}) {
  const style_ = { ...navButtonsStyle, ...style }; // style property will override default style

  return (
      <Button variant="text" id={id} size="large" style={style_} onClick={onClick} title={title}>
        {getIcon(type)}
      </Button>
  )
}

NavButtons.defaultProps = {
  style: {}
};

NavButtons.propTypes = {
  type: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default NavButtons;
