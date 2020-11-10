import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ALL_BIBLE_BOOKS } from '../../common/BooksOfTheBible';

export function DropDownSelector(props) {
  const {
    selections,
    initial,
    onChange
  } = props;

  const initialSelection = initial || ( selections.length && selections[0].key ) || '';

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentSelection, setCurrentSelection] = React.useState(initialSelection);

  const handleClick = (event, ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (bookID) => {
    setAnchorEl(null);
    if (bookID) {
      setCurrentSelection(bookID);
      onChange(bookID);
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
          {currentSelection}
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
