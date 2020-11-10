import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ALL_BIBLE_BOOKS } from '../../common/BooksOfTheBible';

export function BibleReference() {

  function createBibleList() {
    return Object.keys(ALL_BIBLE_BOOKS).map( bookID => {
      const text = `${bookID} - ${ALL_BIBLE_BOOKS[bookID]}`;
      return (
        <ListItem button>
          <ListItemText primary={text} />
        </ListItem>
      )
    })
  }

  // Render the UI for your table
  return (
      <div>
        <List component="nav" aria-label="main book navigation">
          { createBibleList() }
        </List>
    </div>
  )
}

export default BibleReference;
