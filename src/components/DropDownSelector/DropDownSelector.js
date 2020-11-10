import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export function DropDownSelector(props) {
  const {
    selections,
    initial,
    onChange
  } = props;

  const initialSelection = initial || ( selections.length && selections[0].key ) || '';

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newKey) => {
    setAnchorEl(null);
    if (newKey) {
      onChange && onChange(newKey);
    }
  };

  function createMenuItems() {
    return selections.map( item => {
      const text = item.label;
      const key = item.key;
      return (
        <MenuItem onClick={() => handleClose(key)} key={key}>{text}</MenuItem>
      )
    })
  }

  // Render the UI for your table
  return (
      <span>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          { initialSelection }
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          { createMenuItems() }
        </Menu>

      </span>
  )
}

export default DropDownSelector;
