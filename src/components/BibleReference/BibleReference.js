import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ALL_BIBLE_BOOKS } from '../../common/BooksOfTheBible';
import DropDownSelector from '../DropDownSelector'

function getFullBookDescription(bookID) {
  return `${bookID} - ${ALL_BIBLE_BOOKS[bookID]}`;
}

const bibleList = Object.keys(ALL_BIBLE_BOOKS).map( bookID => {
  const label = getFullBookDescription(bookID);
  return {
    key: bookID,
    label
  }
});

export function BibleReference(props) {
//   const { classes } = props;

  let initialBook = 'gen';
  const [currentBookId, setCurrentBookId] = React.useState(initialBook);

  const onChangeBook = (bookID) => {
    if (bookID) {
      setCurrentBookId(bookID);
    }
  };

  // Render the UI for your table
  return (
      <div>
        <Button variant="text" key="prev_ch">
          {"<<"}
        </Button>

        <Button variant="text" key="prev_v">
          {"<"}
        </Button>

        <DropDownSelector
          selections ={bibleList}
          initial={initialBook}
          onChange={onChangeBook}
        />

        <Button variant="text" key="next_v">
          {">"}
        </Button>

        <Button variant="text" key="next_ch">
          {">>"}
        </Button>

      </div>
  )
}

export default BibleReference;
