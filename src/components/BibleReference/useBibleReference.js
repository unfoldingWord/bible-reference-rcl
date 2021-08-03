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
 *    onChange: function(bookID: string, chapter: string, verse: string)|undefined - optional callback function that returns new verse reference whenever it changes
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
 *      onChangeBook: (function(bookID: string)) - method to change to specific book
 *      onChangeChapter: (function(bookID: string)) - method to change to specific chapter
 *      onChangeVerse: (function(bookID: string)) - method to change to specific verse
 *      setNewBookList: (function(SelectionOption[])) - method to change the full book list to use new options (clears any filter)
 *    }
 * }}
 */
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
        goToBookChapterVerse(bookID, USE_FIRST, USE_FIRST, newBookList, newBookChapterVerses); // switch to available book
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
      goToBookChapterVerse(newBook, USE_LAST, selectVerse);
    }
  };

  const goToNextBook = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onNextBook() ${bookId}`);
    let { key: newBook, overflow } = getNextItem(bookList, bookId);

    if (overflow) {
      // TODO what do we do when we hit the end of the bible?
    } else {
      goToBookChapterVerse(newBook, USE_FIRST, selectVerse);
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
    // console.log(`useBibleReference.setBookChapterVerse(${bookID}, ${chapter}, ${verse})`);
    bookID = doSanityCheck(newBibleList, bookID);
    const newChapterList = getChapterList(bookID, newBookChapterVerses);
    chapter = doSanityCheck(newChapterList, chapter);
    const newVerseList = getVerseList(bookID, chapter);
    verse = doSanityCheck(newVerseList, verse);
    // console.log(`useBibleReference.setBookChapterVerse() - sanitized ref: ${bookID} ${chapter}:${verse}`);
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
    // console.log(`useBibleReference.onChangeBook(${newBookID})`);
    if (newBookID) {
      goToBookChapterVerse(newBookID, USE_FIRST, USE_FIRST);
    }
  };

  const goToPrevChapter = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onPrevChapter() ${bookId} ${chapter}`);
    let { key: newChapter, overflow } = getPrevItem(chapterList, chapter);

    if (overflow) {
      // console.log(`useBibleReference.onPrevChapter() overflow`);
      goToPrevBook(event, selectVerse);
    } else {
      goToBookChapterVerse(bookId, newChapter, selectVerse);
    }
  };

  const goToNextChapter = (event=null, selectVerse=USE_FIRST) => {
    // console.log(`useBibleReference.onNextChapter() ${bookId} ${chapter}`);
    let { key: newChapter, overflow } = getNextItem(chapterList, chapter);

    if (overflow) {
      // console.log(`useBibleReference.onNextChapter() overflow`);
      goToNextBook(event, selectVerse);
    } else {
      goToBookChapterVerse(bookId, newChapter, selectVerse);
    }
  };

  const onChangeChapter = (newChapter) => {
    // console.log(`useBibleReference.onChangeChapter(${newChapter})`);
    if (newChapter) {
      goToBookChapterVerse(bookId, newChapter, USE_FIRST);
    }
  };

  const goToPrevVerse = () => {
    // console.log(`useBibleReference.onPrevVerse() ${bookId} ${chapter}:${verse}`);
    let { key: newVerse, overflow } = getPrevItem(verseList, verse);

    if (overflow) {
      goToPrevChapter(null, USE_LAST) // decrement chapter;
    } else {
      onChangeVerse(newVerse);
    }
  };

  const goToNextVerse = () => {
    // console.log(`useBibleReference.onNextVerse() ${bookId} ${chapter}:${verse}`);
    let { key: newVerse, overflow } = getNextItem(verseList, verse);

    if (overflow) {
      goToNextChapter() // increment chapter
    } else {
      onChangeVerse(newVerse);
    }
  };

  const onChangeVerse = (newVerse) => {
    // console.log(`useBibleReference.onChangeVerse(${newVerse})`);
    if (newVerse) {
      newVerse = doSanityCheck(getVerseList(bookId, chapter), newVerse);
      updateVerse(newVerse);
      doChangeCallback(bookId, chapter, newVerse);
    }
  };

  /**
   * match text for bible references such as `mat 1:1`
   * @param text - to search for bible references
   * @param id - string identifier for reference doing matching
   * @return {{bookId: string, c: string, v: string, id: string}} returns object if match found
   */
  const bibleVerseMatcher = (text, id) => {
    console.log(`useBibleReference.bibleVerseMatcher(${text})`)
    if (text) {
      const results = getBookChapterVerse(text)
      if (results) {
        let {bookId, c, v} = results
        bookId = findBookId(bookList, bookId)
        if (bookId) {
          // we found a valid reference - go to it
          goToBookChapterVerse(bookId, c, v)
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

