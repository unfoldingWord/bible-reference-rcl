import React from 'react';
import Button from '@material-ui/core/Button';
import ReferenceSelector from '../ReferenceSelector'
import {
  getBibleList,
  getChapterList,
  getNextItem,
  getPrevItem,
  getVerseList,
  doSanityCheck,
  USE_FIRST,
  USE_LAST
} from "../../common/ReferenceUtils";

export const bibleList = getBibleList();

export function BibleReference() {
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
      setBookChapterVerse(newBook, USE_LAST, USE_LAST);
    }
  };

  const onNextBook = () => {
    let { key: newBook, overflow } = getNextItem(bibleList, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?
    } else {
      setBookChapterVerse(newBook, USE_FIRST, USE_FIRST);
    }
  };

  const setBookChapterVerse = (bookID, chapter, verse) => {
    bookID = doSanityCheck(bibleList, bookID);
    const newChapterList = getChapterList(bookID);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    setCurrentBookId(bookID);
    setCurrentChapter(chapter);
    setChapterList(newChapterList)
    setCurrentVerse(verse);
    setVerseList(newVerseList)
  };

  const onChangeBook = (bookID) => {
    if (bookID) {
      setBookChapterVerse(bookID, USE_FIRST, USE_FIRST);
    }
  };

  const onPrevChapter = () => {
    let { key: newChapter, overflow } = getPrevItem(chapterList, currentChapter);

    if (overflow) {
      onPrevBook();
    } else {
      setBookChapterVerse(currentBookId, newChapter, USE_LAST);
    }
  };

  const onNextChapter = () => {
    let { key: newChapter, overflow } = getNextItem(chapterList, currentChapter);

    if (overflow) {
      onNextBook();
    } else {
      setBookChapterVerse(currentBookId, newChapter, USE_FIRST);
    }
  };

  const onChangeChapter = (chapter) => {
    if (chapter) {
      setBookChapterVerse(currentBookId, chapter, USE_FIRST);
    }
  };

  const onPrevVerse = () => {
    let { key: newVerse, overflow } = getPrevItem(verseList, currentVerse);

    if (overflow) {
      onPrevChapter() // decrement chapter;
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onNextVerse = () => {
    let { key: newVerse, overflow } = getNextItem(verseList, currentVerse);

    if (overflow) {
      onNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (verse) => {
    if (verse) {
      verse = doSanityCheck(getVerseList(currentBookId, currentChapter), verse);
      setCurrentVerse(verse);
    }
  };

  // Render the UI for your table
  return (
      <div style={{display: 'flex', alignItems:'top'}}>

        <Button variant="text" id="prev_ch" onClick={onPrevChapter}>
          {"<<"}
        </Button>

        <Button variant="text" id="prev_v" onClick={onPrevVerse}>
          {"<"}
        </Button>

        <ReferenceSelector
          name="bible"
          options={bibleList}
          initial={currentBookId}
          onChange={onChangeBook}
        />

        <ReferenceSelector
          name="chapter"
          options={chapterList}
          initial={currentChapter}
          onChange={onChangeChapter}
        />

        <ReferenceSelector
          name="verse"
          options={verseList}
          initial={currentVerse}
          onChange={onChangeVerse}
        />

        <Button variant="text" id="next_v" onClick={onNextVerse}>
          {">"}
        </Button>

        <Button variant="text" id="next_ch" onClick={onNextChapter}>
          {">>"}
        </Button>

      </div>
  )
}

export default BibleReference;
