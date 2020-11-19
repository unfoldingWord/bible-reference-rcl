import React, { useState, useEffect } from "react";
import isequal from 'lodash.isequal';
import _ from 'lodash';
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
import {BOOK_CHAPTER_VERSES} from "../../common/BooksOfTheBible";

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

  const [bookChapterVerses, setBookChapterVerses] = useState(BOOK_CHAPTER_VERSES);
  const [bookFullList, setFullBookList] = useState(bibleList_);
  const [bookList, setBookList] = useState(bibleList_);
  const [bookId, setBookId] = useState(initialBook_);
  const [bookName, setBookName] = useState(findItemDefault(bookList, initialBook_).name);
  const [chapterList, setChapterList] = useState(initialChapters_);
  const [chapter, setChapter] = useState(initialChapter_);
  const [verseList, setVerseList] = useState(initialVerses_);
  const [verse, setVerse] = useState(initialVerse_);

  const getFilteredBookList = () => {
    return _.cloneDeep(bookList);
  }

  const updateBookList = (newBookList, newBookChapterVerses = bookChapterVerses) => {
    if (!isequal(newBookList, bookList)) {
      setBookList(newBookList);
      const book = findItemDefault(newBookList, bookId); // do sanity check if book is in list
      const bookID = (book && book.key) || '';
      if (bookID !== bookId) {
        console.log(`useBibleReference.updateBookList() - ${bookId} is not in list, switching to ${bookID}`);
        goToBookChapterVerse(bookID, USE_FIRST, USE_FIRST, newBookList, newBookChapterVerses); // switch to available book
      }
    }
  };

  const getFullBookList = () => {
    return _.cloneDeep(bookFullList);
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
      const newBookList_ = _.cloneDeep(newBookList);
      setFullBookList(newBookList_);
      updateBookList(newBookList_);
    }
  };

  const applyBooksFilter = (options) => {
    console.log(`useBibleReference.applyBooksFilter()`);
    const newBookList = filterBibleList(bookFullList, options);
    updateBookList(newBookList);
  };

  const goToPrevBook = () => {
    console.log(`useBibleReference.onPrevBook() ${bookId}`);

    let { key: newBook, overflow } = getPrevItem(bibleList_, bookId);

    if (overflow) {
      // TODO what do we do when we hit the beginning of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_LAST, USE_LAST);
    }
  };

  const goToNextBook = () => {
    console.log(`useBibleReference.onNextBook() ${bookId}`);
    let { key: newBook, overflow } = getNextItem(bibleList_, bookId);

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

  const updateBookId = (newBookID) => {
    if (newBookID !== bookId) {
      setBookId(newBookID);
    }
  }

  const updateBookName = (newBookName) => {
    if (newBookName !== bookName) {
      setBookName(newBookName);
    }
  }

  const updateChapter = (newChapter) => {
    if (newChapter !== chapter) {
      setChapter(newChapter);
    }
  }

  const updateVerse = (newVerse) => {
    if (newVerse !== verse) {
      setVerse(newVerse);
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

  const goToBookChapterVerse = (bookID, chapter, verse, newBibleList = bibleList_, newBookChapterVerses = bookChapterVerses) => {
    console.log(`useBibleReference.setBookChapterVerse(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(newBibleList, bookID);
    const newChapterList = getChapterList(bookID, newBookChapterVerses);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    console.log(`useBibleReference.setBookChapterVerse() - sanitized ref: ${bookID} ${chapter}:${verse}`);
    updateBookId(bookID);
    const book = findItemDefault(newBibleList, bookID);
    updateBookName(book.name);
    updateChapter(chapter);
    updateChapterList(newChapterList);
    updateVerse(verse);
    updateVerseList(newVerseList);
    doChangeCallback(bookID, chapter, verse);
  };

  const onChangeBook = (newBookID) => {
    console.log(`useBibleReference.onChangeBook(${newBookID})`);
    if (newBookID) {
      goToBookChapterVerse(newBookID, USE_FIRST, USE_FIRST);
    }
  };

  const goToPrevChapter = () => {
    console.log(`useBibleReference.onPrevChapter() ${bookId} ${chapter}`);

    let { key: newChapter, overflow } = getPrevItem(chapterList, chapter);

    if (overflow) {
      console.log(`useBibleReference.onPrevChapter() overflow`);
      goToPrevBook();
    } else {
      goToBookChapterVerse(bookId, newChapter, USE_LAST);
    }
  };

  const goToNextChapter = () => {
    console.log(`useBibleReference.onNextChapter() ${bookId} ${chapter}`);

    let { key: newChapter, overflow } = getNextItem(chapterList, chapter);

    if (overflow) {
      console.log(`useBibleReference.onNextChapter() overflow`);
      goToNextBook();
    } else {
      goToBookChapterVerse(bookId, newChapter, USE_FIRST);
    }
  };

  const onChangeChapter = (newChapter) => {
    console.log(`useBibleReference.onChangeChapter(${newChapter})`);

    if (newChapter) {
      goToBookChapterVerse(bookId, newChapter, USE_FIRST);
    }
  };

  const goToPrevVerse = () => {
    console.log(`useBibleReference.onPrevVerse() ${bookId} ${chapter}:${verse}`);

    let { key: newVerse, overflow } = getPrevItem(verseList, verse);

    if (overflow) {
      goToPrevChapter() // decrement chapter;
    } else {
      onChangeVerse(newVerse);
    }
  };

  const goToNextVerse = () => {
    console.log(`useBibleReference.onNextVerse() ${bookId} ${chapter}:${verse}`);

    let { key: newVerse, overflow } = getNextItem(verseList, verse);

    if (overflow) {
      goToNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (newVerse) => {
    console.log(`useBibleReference.onChangeVerse(${newVerse})`);

    if (newVerse) {
      newVerse = doSanityCheck(getVerseList(bookId, chapter), newVerse);
      updateVerse(newVerse);
      doChangeCallback(bookId, chapter, newVerse);
    }
  };

  return {
    state: {
      bookName,
      bookId,
      chapter,
      verse,
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

