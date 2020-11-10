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

  const onChangeBook = (bookID) => {
    if (bookID) {
      setCurrentBookId(bookID);
      const chapters = getChapterList(bookID);
      setChapterList(chapters);
      const newChapter = chapters[0].key;
      onChangeChapter(newChapter);
    }
  };

  const onChangeChapter = (chapter) => {
    if (chapter) {
      setCurrentChapter(chapter);
      const verses = getVerseList(currentBookId, chapter);
      setVerseList(verses);
      const newVerse = verses[0].key;
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (verse) => {
    if (verse) {
      setCurrentVerse(verse);
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
