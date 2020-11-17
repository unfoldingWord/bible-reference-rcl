import React, { useState, useEffect } from "react";
import isequal from 'lodash.isequal';
import {
  findItemDefault,
  getBibleList,
  getChapterList,
  getNextItem,
  getPrevItem,
  getVerseList,
  doSanityCheck,
  USE_FIRST,
  USE_LAST
} from "../../common/ReferenceUtils";

const useBibleReference = (options, initialBook, initialChapter, initialVerse, onChange) => {

  const options_ = (options && options.length) ? options : null; // if options is non-empty array then only these books are shown
  const bibleList_ = getBibleList(options_);
  const initialBook_ = doSanityCheck(bibleList_, initialBook); // if not in bible list selects first available book
  const initialChapters_ = getChapterList(initialBook_);
  const initialChapter_ = doSanityCheck(initialChapters_, initialChapter);
  const initialVerses_ = getVerseList(initialBook_, initialChapter_);
  const initialVerse_ = doSanityCheck(initialVerses_, initialVerse);

  const [bookList, setBookList] = useState(bibleList_);
  const [currentBookId, setCurrentBookId] = useState(initialBook_);
  const [chapterList, setChapterList] = useState(initialChapters_);
  const [currentChapter, setCurrentChapter] = useState(initialChapter_);
  const [verseList, setVerseList] = useState(initialVerses_);
  const [currentVerse, setCurrentVerse] = useState(initialVerse_);

  useEffect(() => {
    if (!isequal(bibleList_, bookList)) { // see if items in list have changed
      console.log(`useBibleReference.useEffect() - book list changed`);
      setBookList(bibleList_);
      const bookID = findItemDefault(bibleList_, currentBookId); // do sanity check if book is in list
      if (bookID !== currentBookId) {
        console.log(`useBibleReference.useEffect() - ${currentBookId} is not in list, switching to ${bookID}`);
        goToBookChapterVerse(bookID, USE_FIRST, USE_FIRST); // switch to available book
      }
    }
  },[options_])

  const goToPrevBook = () => {
    console.log(`useBibleReference.onPrevBook() ${currentBookId}`);

    let { key: newBook, overflow } = getPrevItem(bibleList_, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the beginning of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_LAST, USE_LAST);
    }
  };

  const goToNextBook = () => {
    console.log(`useBibleReference.onNextBook() ${currentBookId}`);
    let { key: newBook, overflow } = getNextItem(bibleList_, currentBookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_FIRST, USE_FIRST);
    }
  };

  const doChangeCallback = (bookID, chapter, verse) => {
    try {
      onChange && onChange(bookID, chapter, verse);
    } catch(e) {
      console.error(`useBibleReference.doChangeCallback(${bookID}, ${chapter}, ${verse})\`) - callback failed`, e);
    }
  }

  const goToBookChapterVerse = (bookID, chapter, verse) => {
    console.log(`useBibleReference.setBookChapterVerse(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(bibleList_, bookID);
    const newChapterList = getChapterList(bookID);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    console.log(`useBibleReference.setBookChapterVerse() - sanitized ref: ${bookID}-${chapter}-${verse}`);
    setCurrentBookId(bookID);
    setCurrentChapter(chapter);
    setChapterList(newChapterList)
    setCurrentVerse(verse);
    setVerseList(newVerseList);
    doChangeCallback(bookID, chapter, verse);
  };

  const onChangeBook = (bookID) => {
    console.log(`useBibleReference.onChangeBook(${bookID})`);
    if (bookID) {
      goToBookChapterVerse(bookID, USE_FIRST, USE_FIRST);
    }
  };

  const goToPrevChapter = () => {
    console.log(`useBibleReference.onPrevChapter() ${currentBookId}-${currentChapter}`);

    let { key: newChapter, overflow } = getPrevItem(chapterList, currentChapter);

    if (overflow) {
      console.log(`useBibleReference.onPrevChapter() overflow`);
      goToPrevBook();
    } else {
      goToBookChapterVerse(currentBookId, newChapter, USE_LAST);
    }
  };

  const goToNextChapter = () => {
    console.log(`useBibleReference.onNextChapter() ${currentBookId}-${currentChapter}`);

    let { key: newChapter, overflow } = getNextItem(chapterList, currentChapter);

    if (overflow) {
      console.log(`useBibleReference.onNextChapter() overflow`);
      goToNextBook();
    } else {
      goToBookChapterVerse(currentBookId, newChapter, USE_FIRST);
    }
  };

  const onChangeChapter = (chapter) => {
    console.log(`useBibleReference.onChangeChapter(${chapter})`);

    if (chapter) {
      goToBookChapterVerse(currentBookId, chapter, USE_FIRST);
    }
  };

  const goToPrevVerse = () => {
    console.log(`useBibleReference.onPrevVerse() ${currentBookId}-${currentChapter}-${currentVerse}`);

    let { key: newVerse, overflow } = getPrevItem(verseList, currentVerse);

    if (overflow) {
      goToPrevChapter() // decrement chapter;
    } else {
      onChangeVerse(newVerse);
    }
  };

  const goToNextVerse = () => {
    console.log(`useBibleReference.onNextVerse() ${currentBookId}-${currentChapter}-${currentVerse}`);

    let { key: newVerse, overflow } = getNextItem(verseList, currentVerse);

    if (overflow) {
      goToNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (verse) => {
    console.log(`useBibleReference.onChangeVerse(${verse})`);

    if (verse) {
      verse = doSanityCheck(getVerseList(currentBookId, currentChapter), verse);
      setCurrentVerse(verse);
      doChangeCallback(currentBookId, currentChapter, verse);
    }
  };

  return {
    status: {
      currentBookId,
      currentChapter,
      currentVerse,
      bookList,
      chapterList,
      verseList,
    },
    actions: {
      goToPrevBook,
      goToNextBook,
      goToPrevChapter,
      goToNextChapter,
      goToPrevVerse,
      goToNextVerse,
      goToBookChapterVerse,
      onChangeBook,
      onChangeChapter,
      onChangeVerse
    }
  };
};

export default useBibleReference;

