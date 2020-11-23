import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from 'prop-types';

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
  paddingRight: '0px'
}

export function NavButtons(props) {
  const {
    label,
    style,
    onClick,
    id
  } = props;

  const classes = useStyles();

  const style_ = {...navButtonsStyle, ...style}; // style property will override default style

  // Render the UI for your table
  return (
      <Button variant="text" id={id} size="small" style={style_} onClick={onClick}>
        {label}
      </Button>
  )
}

NavButtons.defaultProps = {
  style: {}
};

NavButtons.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default NavButtons;
