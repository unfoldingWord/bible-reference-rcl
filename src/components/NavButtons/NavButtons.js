import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from 'prop-types';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

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
  marginLeft: '-7px',
  marginRight: '-7px'
}

const mirrorIconsStyle = {
  transform: 'scaleX(-1)'
}

export const NAV_TYPES_DOUBLE_PREV = 0;
export const NAV_TYPES_PREV = 1;
export const NAV_TYPES_NEXT = 2;
export const NAV_TYPES_DOUBLE_NEXT = 3;

function getIcon(type) {
  switch (type) {
    case NAV_TYPES_DOUBLE_PREV:
      return (
        <FastRewindIcon />
      );
    case NAV_TYPES_DOUBLE_NEXT:
      return (
        <FastForwardIcon/>
      );
    case NAV_TYPES_PREV:
      return (
        <PlayArrowIcon style={mirrorIconsStyle}/>
      );
    case NAV_TYPES_NEXT:
    default:
      return (
        <PlayArrowIcon/>
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
