import React, {useEffect} from 'react';
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

export function BibleReference(props) {
  const {
    options,
    onChange,
    defaultBook,
    defaultChapter,
    defaultVerse,
  } = props;

  const options_ = (options && options.length) ? options : null; // if options is non-empty array then only these books are shown
  const bibleList = getBibleList(options_);
  const initialBook = doSanityCheck(bibleList, defaultBook); // if not in bible list selects first available book
  const initialChapters = getChapterList(initialBook);
  const initialChapter = doSanityCheck(initialChapters, defaultChapter);
  const initialVerses = getVerseList(initialBook, initialChapter);
  const initialVerse = doSanityCheck(initialVerses, defaultVerse);
  const [currentBookId, setCurrentBookId] = React.useState(initialBook);
  const [chapterList, setChapterList] = React.useState(initialChapters);
  const [currentChapter, setCurrentChapter] = React.useState(initialChapter);
  const [verseList, setVerseList] = React.useState(initialVerses);
  const [currentVerse, setCurrentVerse] = React.useState(initialVerse);

  const onPrevBook = () => {
    console.log(`BibleReference.onPrevBook() ${currentBookId}`);

    let { key: newBook, overflow } = getPrevItem(bibleList, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the beginning of the bible?
    } else {
      setBookChapterVerse(newBook, USE_LAST, USE_LAST);
    }
  };

  const onNextBook = () => {
    console.log(`BibleReference.onNextBook() ${currentBookId}`);
    let { key: newBook, overflow } = getNextItem(bibleList, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?
    } else {
      setBookChapterVerse(newBook, USE_FIRST, USE_FIRST);
    }
  };

  function doChangeCallback(bookID, chapter, verse) {
    try {
      onChange && onChange(bookID, chapter, verse);
    } catch(e) {
      console.error(`BibleReference(${bookID}, ${chapter}, ${verse})\`) - callback failed`, e);
    }
  }

  const setBookChapterVerse = (bookID, chapter, verse) => {
    console.log(`BibleReference.setBookChapterVerse(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(bibleList, bookID);
    const newChapterList = getChapterList(bookID);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    console.log(`BibleReference.setBookChapterVerse() - sanitized ref: ${bookID}-${chapter}-${verse}`);
    setCurrentBookId(bookID);
    setCurrentChapter(chapter);
    setChapterList(newChapterList)
    setCurrentVerse(verse);
    setVerseList(newVerseList);
    doChangeCallback(bookID, chapter, verse);
  };

  const onChangeBook = (bookID) => {
    console.log(`BibleReference.onChangeBook(${bookID})`);
    if (bookID) {
      setBookChapterVerse(bookID, USE_FIRST, USE_FIRST);
    }
  };

  const onPrevChapter = () => {
    console.log(`BibleReference.onPrevChapter() ${currentBookId}-${currentChapter}`);

    let { key: newChapter, overflow } = getPrevItem(chapterList, currentChapter);

    if (overflow) {
      console.log(`BibleReference.onPrevChapter() overflow`);
      onPrevBook();
    } else {
      setBookChapterVerse(currentBookId, newChapter, USE_LAST);
    }
  };

  const onNextChapter = () => {
    console.log(`BibleReference.onNextChapter() ${currentBookId}-${currentChapter}`);

    let { key: newChapter, overflow } = getNextItem(chapterList, currentChapter);

    if (overflow) {
      console.log(`BibleReference.onNextChapter() overflow`);
      onNextBook();
    } else {
      setBookChapterVerse(currentBookId, newChapter, USE_FIRST);
    }
  };

  const onChangeChapter = (chapter) => {
    console.log(`BibleReference.onChangeChapter(${chapter})`);

    if (chapter) {
      setBookChapterVerse(currentBookId, chapter, USE_FIRST);
    }
  };

  const onPrevVerse = () => {
    console.log(`BibleReference.onPrevVerse() ${currentBookId}-${currentChapter}-${currentVerse}`);

    let { key: newVerse, overflow } = getPrevItem(verseList, currentVerse);

    if (overflow) {
      onPrevChapter() // decrement chapter;
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onNextVerse = () => {
    console.log(`BibleReference.onNextVerse() ${currentBookId}-${currentChapter}-${currentVerse}`);

    let { key: newVerse, overflow } = getNextItem(verseList, currentVerse);

    if (overflow) {
      onNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (verse) => {
    console.log(`BibleReference.onChangeVerse(${verse})`);

    if (verse) {
      verse = doSanityCheck(getVerseList(currentBookId, currentChapter), verse);
      setCurrentVerse(verse);
      doChangeCallback(currentBookId, currentChapter, verse);
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
          id="bible"
          options={bibleList}
          initial={currentBookId}
          onChange={onChangeBook}
        />

        <ReferenceSelector
          id="chapter"
          options={chapterList}
          initial={currentChapter}
          onChange={onChangeChapter}
        />

        <ReferenceSelector
          id="verse"
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
