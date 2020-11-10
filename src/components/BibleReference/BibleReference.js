import React from 'react';
import Button from '@material-ui/core/Button';
import { ALL_BIBLE_BOOKS, BOOK_CHAPTER_VERSES } from '../../common/BooksOfTheBible';
import DropDownSelector from '../DropDownSelector'

function getFullBookDescription(bookID) {
  return `${bookID.toUpperCase()} - ${ALL_BIBLE_BOOKS[bookID]}`;
}

const bibleList = Object.keys(ALL_BIBLE_BOOKS).map( bookID => {
  const label = getFullBookDescription(bookID);
  return {
    key: bookID,
    label
  }
});

function getChapterList(bookID) {
  const bookInfo = BOOK_CHAPTER_VERSES[bookID];
  if (bookInfo) {
    const chapters = Object.keys(bookInfo);
    if (chapters && chapters.length) {
      return chapters.map(chapter => ({
        key: chapter,
        label: chapter,
      }));
    }
  }
  return [];
}

function getVerseList(bookID, chapter) {
  const bookInfo = BOOK_CHAPTER_VERSES[bookID];
  if (bookInfo) {
    let verses = bookInfo[chapter];
    if (verses) {
      if (typeof verses === 'string') {
        verses = Number.parseInt(verses);
      }
      if (verses >= 0) {
        const verseList = Array.from({length: verses}, (x, i) => {
          const verse = `${i+1}`;
          return {
            key: verse,
            label: verse,
          };
        });
        return verseList;
      }
    }
  }
  return [];
}

const findKeyInList = (list, key) => {
  return list.findIndex(item => (item.key === key));
}

const sanityCheck = (list, key) => {
  const found = findKeyInList(list, key);
  if (found < 0) { // if key not found in list, use key of first entry
    if (list.length) {
      const newKey = list[0].key;
      console.log(`Attempting to set current value to ${key} which is invalid, falling back to ${newKey}`);
      key = newKey;
    }
  }
  return key;
}

function getFirstItem(list) {
  let key = '';
  if (list.length) {
    key = list[0].key;
  } else {
    key = '';
  }
  return key;
}

function getLastItem(list) {
  let key = '';
  if (list.length) {
    key = list[list.length - 1].key;
  } else {
    key = '';
  }
  return key;
}

const getNextItem = (list, key) => {
  let overflow = false;
  const found = findKeyInList(list, key);
  if (found < 0) { // if key not found in list, use key of first entry
    key = getFirstItem(list, key);
  } else if (found >= list.length - 1) { // if we hit the limit
    overflow = true;
  } else {
    const newItem = list[found + 1];
    key = newItem.key;
  }
  return { key, overflow };
}

const getPrevItem = (list, key) => {
  let overflow = false;
  const found = findKeyInList(list, key);
  if (found < 0) { // if key not found in list, use key of first entry
    key = getFirstItem(list, key);
  } else if (found <= 0) { // if we hit the limit
    overflow = true;
  } else {
    const newItem = list[found - 1];
    key = newItem.key;
  }
  return { key, overflow };
}

export function BibleReference(props) {
//   const { classes } = props;

  const initialBook = 'eph';
  const initialChapter = '1';
  const initialVerse = '1';
  const initialChapters = getChapterList(initialBook);
  const initialVerses = getVerseList(initialBook, initialVerse);
  const [currentBookId, setCurrentBookId] = React.useState(initialBook);
  const [chapterList, setChapterList] = React.useState(initialChapters);
  const [currentChapter, setCurrentChapter] = React.useState(initialChapter);
  const [verseList, setVerseList] = React.useState(initialVerses);
  const [currentVerse, setCurrentVerse] = React.useState(initialVerse);

  const onPrevBook = () => {
    let { key: newBook, overflow } = getPrevItem(bibleList, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the beginning of the bible?
    } else {
      onChangeBook(newBook);
    }
    return newBook;
  };

  const onNextBook = () => {
    let { key: newBook, overflow } = getNextItem(bibleList, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?

    } else {
      onChangeBook(newBook);
    }
    return newBook;
  };

  const onChangeBook = (bookID) => {
    if (bookID) {
      bookID = sanityCheck(bibleList, bookID);
      setCurrentBookId(bookID);
      const chapters = getChapterList(bookID);
      setChapterList(chapters);
      const newChapter = chapters[0].key;
      onChangeChapter(newChapter);
    }
  };

  const onPrevChapter = () => {
    let { key: newChapter, overflow } = getPrevItem(chapterList, currentChapter);

    if (overflow) {
      const newBook = onPrevBook();
      newChapter = getLastItem(getChapterList(newBook));
      setCurrentChapter(newChapter);
    } else {
      onChangeChapter(newChapter);
    }
    return newChapter;
  };

  const onNextChapter = () => {
    let { key: newChapter, overflow } = getNextItem(chapterList, currentChapter);

    if (overflow) {
      const newBook = onNextBook();
      newChapter = getFirstItem(getChapterList(newBook));
      setCurrentChapter(newChapter);
    } else {
      onChangeChapter(newChapter);
    }
    return newChapter;
  };

  const onChangeChapter = (chapter) => {
    if (chapter) {
      chapter = sanityCheck(getChapterList(currentBookId), chapter);
      setCurrentChapter(chapter);
      const verses = getVerseList(currentBookId, chapter);
      setVerseList(verses);
      const newVerse = verses[0].key;
      onChangeVerse(newVerse);
    }
  };

  const onPrevVerse = () => {
    let { key: newVerse, overflow } = getPrevItem(verseList, currentVerse);

    if (overflow) {
      const newChapter = onPrevChapter() // decrement chapter;
      newVerse = getLastItem(getVerseList(currentBookId, newChapter));
      setCurrentVerse(newVerse);
    } else {
      onChangeVerse(newVerse);
    }
    return newVerse;
  };

  const onNextVerse = () => {
    let { key: newVerse, overflow } = getNextItem(verseList, currentVerse);

    if (overflow) {
      const newChapter = onNextChapter() // increment chapter
      newVerse = getFirstItem(getVerseList(currentBookId, newChapter));
      setCurrentVerse(newVerse);
    } else {
      onChangeVerse(newVerse);
    }
    return newVerse;
  };

  const onChangeVerse = (verse) => {
    if (verse) {
      verse = sanityCheck(getVerseList(currentBookId, currentChapter), verse);
      setCurrentVerse(verse);
    }
  };

  // Render the UI for your table
  return (
      <div>
        <Button variant="text" key="prev_ch" onClick={onPrevChapter}>
          {"<<"}
        </Button>

        <Button variant="text" key="prev_v" onClick={onPrevVerse}>
          {"<"}
        </Button>

        <DropDownSelector
          selections ={bibleList}
          initial={currentBookId}
          onChange={onChangeBook}
        />

        <DropDownSelector
          selections ={chapterList}
          initial={currentChapter}
          onChange={onChangeChapter}
        />

        <DropDownSelector
          selections ={verseList}
          initial={currentVerse}
          onChange={onChangeVerse}
        />

        <Button variant="text" key="next_v" onClick={onNextVerse}>
          {">"}
        </Button>

        <Button variant="text" key="next_ch" onClick={onNextChapter}>
          {">>"}
        </Button>

      </div>
  )
}

export default BibleReference;
