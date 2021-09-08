import {useState} from "react";
import isequal from 'lodash.isequal';
import _ from 'lodash';
import {
  doSanityCheck,
  filterBibleList,
  findBookId,
  findItemDefault,
  getBookChapterVerse,
  getBibleList,
  getChapterList,
  getNextItem,
  getPrevItem,
  getVerseList,
  USE_FIRST,
  USE_LAST,
} from "../../common/ReferenceUtils";
import {BOOK_CHAPTER_VERSES} from "../../common/BooksOfTheBible";

/**
 * selection option used by ReferenceSelector components
 * @typedef {Object} SelectionOption
 * @property {string} key - internal key (identifier) for selection
 * @property {string} name - internal name used for matching typed text (e.g. `Mark`)
 * @property {string} value - string to be displayed for selection (e.g. `Mark (mrk)`)
 */

/**
 * custom hook with business logic for BibleReference
 * @param props: {
 *    initialBook: string - book to start with when component is first rendered
 *    initialChapter: string - chapter to start with when component is first rendered
 *    initialVerse: string - verse to start with when component is first rendered
 *    addOBS: bool - when is true - in bibleList we add OBS, default 'false'
 *    onChange: function(bookID: string, chapter: string, verse: string)|undefined - optional callback function that returns new verse reference whenever it changes
 *    onPreChange: function(bookID: string, chapter: string, verse: string)|undefined - optional async callback function that allows app to approve or disapprove navigation.  If function returns false, navigation is rejected.
 * }
 * @return {object}
 * {{
 *    state: {
 *      bookName: string - current book name
 *      bookId: string - current bookId (e.g. 'mrk')
 *      chapter: string - current chapter
 *      verse: string - current verse
 *      bookList: SelectionOption[] - array of current book selection options
 *      chapterList: SelectionOption[] - array of current chapter selection options
 *      verseList: SelectionOption[] - array of current verse selection options
 *    },
 *    actions: {
 *      applyBooksFilter: (function(string[])) - array of keys to use to filter book selections (whitelist)
 *      getFullBookList: (function(): SelectionOption[]) - returns array of current book selection options (unfiltered)
 *      getFilteredBookList: (function(): unknown) - returns array of current book selection options (just options that match current filter)
 *      goToPrevBook: (function()) - method to trigger state change to previous book
 *      goToNextBook: (function()) - method to trigger state change to next book
 *      goToPrevChapter: (function()) - method to trigger state change to previous chapter
 *      goToNextChapter: (function()) - method to trigger state change to next chapter
 *      goToPrevVerse: (function()) - method to trigger state change to previous verse
 *      goToNextVerse: (function()) - method to trigger state change to next verse
 *      goToBookChapterVerse: (function(bookID: string, chapter: string, verse: string)) - method to change state to specific book/chapter/verse
 *      onChangeBook: (function(bookID: string)) - UI callback to change to specific book
 *      onChangeChapter: (function(bookID: string)) - UI callback to change to specific chapter
 *      onChangeVerse: (function(bookID: string)) - UI callback to change to specific verse
 *      setNewBookList: (function(SelectionOption[], bool)) - method to change the full book list to use new options (The second parameter we specify whether to save or clears filters)
 *    }
 * }}
 */
const useBibleReference = (props) => {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    onChange,
    onPreChange,
    addOBS,
  } = props || {};

  const bibleList_ = getBibleList(null, addOBS);
  const initialBook_ = doSanityCheck(bibleList_, initialBook); // if not in bible list selects first available book
  const initialChapters_ = getChapterList(initialBook_);
  const initialChapter_ = doSanityCheck(initialChapters_, initialChapter);
  const initialVerses_ = getVerseList(initialBook_, initialChapter_);
  const initialVerse_ = doSanityCheck(initialVerses_, initialVerse);

  const [bookChapterVerses, setBookChapterVerses_] = useState(BOOK_CHAPTER_VERSES);
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
        console.log(`useBibleReference.updateBookList() - ${bookId} is not in list, switching to ${bookID} (first book in list)`);
        goToBookChapterVerse_(bookID, USE_FIRST, USE_FIRST, newBookList, newBookChapterVerses); // switch to available book
      }
    }
  };

  const getFullBookList = () => {
    return _.cloneDeep(bookFullList);
  }

  /**
   * update chapter list And Verse Counts for books.  It only updates book IDs passed.
   * @param bookChapterVerses - an object of book IDs that contains chapters that contain the verse counts (see BOOK_CHAPTER_VERSES for example)
   */
  const setBookChapterVerses = (bookChapterVerses) => {
    if (bookChapterVerses) {
      const newBCV = { ...BOOK_CHAPTER_VERSES, ...bookChapterVerses }
      setBookChapterVerses_(newBCV)
    }
  };

  /**
   * replace list of supported books shown to user
   * @param newBookList - an array of autocomplete objects where `key` is the book id and `label` is the localized string displayed to the user
   * @param {bool} saveFilter - If 'true' - then we apply the current filter
   */
  const setNewBookList = (newBookList, saveFilter = false) => {
    if (!isequal(newBookList, bookFullList)) {
      console.log(`useBibleReference.setNewBookList()`);
      const newBookList_ = _.cloneDeep(newBookList);
      setFullBookList(newBookList_);
      if (saveFilter) {
        applyBooksFilter(bookList.map((el) => el.key));
      } else {
        updateBookList(newBookList_);
      }
    }
  };

  /**
   * takes the full bible book list and trims it down to an array that matches bookIDs in filter
   * @param filter - array of bookIDs to filter - this is a list of bookIDs to keep
   */
  const applyBooksFilter = (filter) => {
    console.log(`useBibleReference.applyBooksFilter(${JSON.stringify(filter)})`);
    const newBookList = filterBibleList(bookFullList, filter);
    if (newBookList?.length) { // sanity check, only apply filter if list is not empty
      updateBookList(newBookList);
    }
  };

  const goToPrevBook = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onPrevBook() ${bookId}`);
    let { key: newBook, overflow } = getPrevItem(bookList, bookId);

    if (overflow) {
      // TODO what do we do when we hit the beginning of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_LAST, selectVerse, false);
    }
  };

  const goToNextBook = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onNextBook() ${bookId}`);
    let { key: newBook, overflow } = getNextItem(bookList, bookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_FIRST, selectVerse, false);
    }
  };

  /**
   * Handle onChange callback
   * @param {string} bookID
   * @param {string} chapter
   * @param {string} verse
   */
  const doChangeCallback = (bookID, chapter, verse) => {
    try {
      onChange && onChange(bookID, chapter, verse);
    } catch(e) {
      console.error(`useBibleReference.doChangeCallback(${bookID}, ${chapter}, ${verse})\`) - callback failed`, e);
    }
  }

  /**
   * handle async onPreChange callback if defined
   * @param {string} bookID
   * @param {string} chapter
   * @param {string} verse
   * @return {Promise<boolean>}
   */
  const doPreValidation = async (bookID, chapter, verse) => {
    let okToContinue = true
    if (onPreChange) { // only do pre-validation if we have callback function
      try {
        okToContinue = await onPreChange(bookID, chapter, verse)
      } catch(e) {
        console.error(`useBibleReference.doPreValidation(${bookID}, ${chapter}, ${verse})\`) - callback failed, don't block`, e);
        okToContinue = true
      }

      // console.log('useBibleReference.doPreValidation: onPreChange returned', okToContinue)
    }
    return okToContinue
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

  /**
   * directly changes to new reference without calling onPreChange
   * @param {string} bookID
   * @param {string} chapter
   * @param {string} verse
   * @param {array} newBibleList - optional list of bibles to select from
   * @param {object} newBookChapterVerses - optional map of chapters and verses per book
   * @private
   */
  const goToBookChapterVerse_ = (bookID, chapter, verse, newBibleList = bibleList_, newBookChapterVerses = bookChapterVerses) => {
    // console.log(`useBibleReference.gotoBookChapterVerse_(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(newBibleList, bookID);
    const newChapterList = getChapterList(bookID, newBookChapterVerses);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    // console.log(`useBibleReference.gotoBookChapterVerse_() - sanitized ref: ${bookID} ${chapter}:${verse}`);
    updateBookId(bookID);
    const book = findItemDefault(newBibleList, bookID);
    updateBookName(book.name);
    updateChapter(chapter);
    updateChapterList(newChapterList);
    updateVerse(verse);
    updateVerseList(newVerseList);
    doChangeCallback(bookID, chapter, verse);
  }

  /**
   * goes to new reference after onPreChange callback
   * @param {string} bookID
   * @param {string} chapter
   * @param {string} verse
   * @param {boolean} initializing - if true then we are initializing and don't call onPreChange, defaults to true
   * @param {array} newBibleList - optional list of bibles to select from
   * @param {object} newBookChapterVerses - optional map of chapters and verses per book
   */
  const goToBookChapterVerse = (bookID, chapter, verse, initializing = true,
                                newBibleList = bibleList_, newBookChapterVerses = bookChapterVerses) => {
    if (initializing) {
      goToBookChapterVerse_(bookID, chapter, verse, newBibleList, newBookChapterVerses);
    } else {
      doPreValidation(bookID, chapter, verse).then(okToContinue => {
        if (okToContinue) {
          goToBookChapterVerse_(bookID, chapter, verse, newBibleList, newBookChapterVerses);
        }
      })
    }
  };

  const onChangeBook = async (newBookID, oldBookId) => {
    // console.log(`useBibleReference.onChangeBook(${newBookID},${oldBookId})`);
    if (newBookID && oldBookId && (newBookID !== bookId)) {
      // console.log(`useBibleReference.onChangeBook - waiting`);
      const okToContinue = await doPreValidation(newBookID, USE_FIRST, USE_FIRST)
      // console.log(`useBibleReference.onChangeBook - wait complete`, okToContinue);
      if (okToContinue) {
        goToBookChapterVerse_(newBookID, USE_FIRST, USE_FIRST);
      }
      return okToContinue
    }
    return true
  };

  const goToPrevChapter = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onPrevChapter() ${bookId} ${chapter}`);
    let { key: newChapter, overflow } = getPrevItem(chapterList, chapter);

    if (overflow) {
      // console.log(`useBibleReference.onPrevChapter() overflow`);
      goToPrevBook(event, selectVerse);
    } else {
      goToBookChapterVerse(bookId, newChapter, selectVerse, false);
    }
  };

  const goToNextChapter = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onNextChapter() ${bookId} ${chapter}`);
    let { key: newChapter, overflow } = getNextItem(chapterList, chapter);

    if (overflow) {
      // console.log(`useBibleReference.onNextChapter() overflow`);
      goToNextBook(event, selectVerse);
    } else {
      goToBookChapterVerse(bookId, newChapter, selectVerse, false);
    }
  };

  const onChangeChapter = async (newChapter, oldChapter) => {
    // console.log(`useBibleReference.onChangeChapter(${newChapter}, ${oldChapter})`);
    if (newChapter && oldChapter && (newChapter !== chapter)) {
      // console.log(`useBibleReference.onChangeChapter - waiting`);
      const okToContinue = await doPreValidation(bookId, newChapter, USE_FIRST)
      // console.log(`useBibleReference.onChangeChapter - wait complete`, okToContinue);
      if (okToContinue) {
        goToBookChapterVerse_(bookId, newChapter, USE_FIRST);
      }
      return okToContinue
    }
    return true
  };

  const goToPrevVerse = () => {
    // console.log(`useBibleReference.onPrevVerse() ${bookId} ${chapter}:${verse}`);
    let { key: newVerse, overflow } = getPrevItem(verseList, verse);

    if (overflow) {
      goToPrevChapter(null, USE_LAST) // decrement chapter;
    } else {
      onChangeVerse(newVerse, verse);
    }
  };

  const goToNextVerse = () => {
    // console.log(`useBibleReference.onNextVerse() ${bookId} ${chapter}:${verse}`);
    let { key: newVerse, overflow } = getNextItem(verseList, verse);

    if (overflow) {
      goToNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse, verse);
    }
  };

  const onChangeVerse = async (newVerse, oldVerse) => {
    // console.log(`useBibleReference.onChangeVerse(${newVerse}, ${oldVerse})`);
    if (newVerse && oldVerse && (newVerse !== verse)) {
      // console.log(`useBibleReference.onChangeVerse - waiting`);
      const okToContinue = await doPreValidation(bookId, chapter, newVerse)
      // console.log(`useBibleReference.onChangeVerse - wait complete`, okToContinue);
      if (okToContinue) {
        newVerse = doSanityCheck(getVerseList(bookId, chapter), newVerse);
        updateVerse(newVerse);
        doChangeCallback(bookId, chapter, newVerse);
      }
      return okToContinue
    }
    return true
  };

  /**
   * match text for bible references such as `mat 1:1`
   * @param text - to search for bible references
   * @param id - string identifier for reference doing matching
   * @return {{bookId: string, c: string, v: string, id: string}} returns object if match found
   */
  const bibleVerseMatcher = (text, id) => {
    // console.log(`useBibleReference.bibleVerseMatcher(${text})`)
    if (text) {
      const results = getBookChapterVerse(text)
      if (results) {
        let {bookId, c, v} = results
        bookId = findBookId(bookList, bookId)
        if (bookId) {
          // we found a valid reference - go to it
          goToBookChapterVerse(bookId, c, v, false)
          return {bookId, c, v, id}
        }
      }
    }
    return null
  }

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
      setNewBookList,
      setBookChapterVerses,
      bibleVerseMatcher,
    }
  };
};

export default useBibleReference;

