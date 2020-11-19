import React, { useState, useEffect } from "react";
import isequal from 'lodash.isequal';
import {
  createBibleListItem,
  filterBibleList,
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

const useBibleReference = (props) => {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    onChange
  } = props || {};

  const bibleList_ = getBibleList();
  const initialBook_ = doSanityCheck(bibleList_, initialBook); // if not in bible list selects first available book
  const initialChapters_ = getChapterList(initialBook_);
  const initialChapter_ = doSanityCheck(initialChapters_, initialChapter);
  const initialVerses_ = getVerseList(initialBook_, initialChapter_);
  const initialVerse_ = doSanityCheck(initialVerses_, initialVerse);

  const [bookFullList, setFullBookList] = useState(bibleList_);
  const [bookList, setBookList] = useState(bibleList_);
  const [currentBookId, setCurrentBookId] = useState(initialBook_);
  const [chapterList, setChapterList] = useState(initialChapters_);
  const [currentChapter, setCurrentChapter] = useState(initialChapter_);
  const [verseList, setVerseList] = useState(initialVerses_);
  const [currentVerse, setCurrentVerse] = useState(initialVerse_);

  const getFilteredBookList = () => {
    return bookList;
  }

  const updateBookList = (newBookList) => {
    if (!isequal(newBookList, bookList)) {
      setBookList(newBookList);
      const book = findItemDefault(newBookList, currentBookId); // do sanity check if book is in list
      const bookID = (book && book.key) || '';
      if (bookID !== currentBookId) {
        console.log(`useBibleReference.updateBookList() - ${currentBookId} is not in list, switching to ${bookID}`);
        goToBookChapterVerse(bookID, USE_FIRST, USE_FIRST, newBookList); // switch to available book
      }
    }
  };

  const getFullBookList = () => {
    return bookFullList;
  }

  // const addToBookList = (bookId, bookName, dropDownDescription, addToEnd) => {
  //   const item = createBibleListItem(bookId, bookName, dropDownDescription);
  //   const newFullBookList = bookFullList;
  //   if (addToEnd) {
  //     newFullBookList
  //   }
  // }

  const setNewBookList = (newBookList) => {
    if (!isequal(newBookList, bookFullList)) {
      console.log(`useBibleReference.setNewBookList()`);
      setFullBookList(newBookList);
      updateBookList(newBookList);
    }
  };

  const applyBooksFilter = (options) => {
    console.log(`useBibleReference.applyBooksFilter()`);
    const newBookList = filterBibleList(bookFullList, options);
    updateBookList(newBookList);
  };

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

  const updateBookId = (bookID) => {
    if (bookID !== currentBookId) {
      setCurrentBookId(bookID);
    }
  }

  const updateChapter = (chapter) => {
    if (chapter !== currentChapter) {
      setCurrentChapter(chapter);
    }
  }

  const updateVerse = (verse) => {
    if (verse !== currentVerse) {
      setCurrentVerse(verse);
    }
  }

  const updateChapterList = (newChapterList) => {
    if (!isequal(newChapterList, chapterList)) {
      setChapterList(newChapterList);
    }
  }

  const updateVerseList = (newVerseList) => {
    if (!isequal(newVerseList, verseList)) {
      setVerseList(newVerseList);
    }
  }

  const goToBookChapterVerse = (bookID, chapter, verse, bibleList = bibleList_) => {
    console.log(`useBibleReference.setBookChapterVerse(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(bibleList, bookID);
    const newChapterList = getChapterList(bookID);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    console.log(`useBibleReference.setBookChapterVerse() - sanitized ref: ${bookID} ${chapter}:${verse}`);
    updateBookId(bookID);
    updateChapter(chapter);
    updateChapterList(newChapterList);
    updateVerse(verse);
    updateVerseList(newVerseList);
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
      updateVerse(verse);
      doChangeCallback(currentBookId, currentChapter, verse);
    }
  };

  return {
    state: {
      currentBookId,
      currentChapter,
      currentVerse,
      bookList,
      chapterList,
      verseList,
    },
    actions: {
      applyBooksFilter,
      getFilteredBookList,
      getFullBookList,
      goToPrevBook,
      goToNextBook,
      goToPrevChapter,
      goToNextChapter,
      goToPrevVerse,
      goToNextVerse,
      goToBookChapterVerse,
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      setNewBookList
    }
  };
};

export default useBibleReference;

