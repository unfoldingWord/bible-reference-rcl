import cloneDeep from "lodash.clonedeep";
import { parseReferenceToList } from "bible-reference-range";
import {
  BIBLE_BOOKS,
  BIBLES_ABBRV_INDEX,
  BOOK_CHAPTER_VERSES,
} from "./BooksOfTheBible";

// consts
export const USE_FIRST = Number.NEGATIVE_INFINITY;
export const USE_LAST = Number.POSITIVE_INFINITY;
export const USE_FRONT = "USE_FRONT";

/**
 * get formatted description for book of the bible
 * @param {string} bookID
 * @param {string} bookName
 * @return {string}
 */
export function getFullBookDescription(bookID, bookName) {
  return `${bookName} (${bookID})`;
}

export function findItemIndexDefault(
  options,
  initialSelection,
  defaultIndex = 0
) {
  let found = findKeyInList(options, "key", initialSelection);
  if (found <= 0) {
    found = defaultIndex;
  }
  return found;
}

export function findItemDefault(options, initialSelection, defaultIndex = 0) {
  let found = findItemIndexDefault(options, initialSelection, defaultIndex);
  return options[found];
}

/**
 * takes book list and trims it down to an array that matches bookIDs in filter
 * @param bookList - an array of autocomplete objects where key is the book id
 * @param filter - array of bookIDs to filter - this is a list of bookIDs to keep
 * @return {*}
 */
export function filterBibleList(bookList, filter) {
  let filteredBookList = cloneDeep(bookList);
  if (filter && filter.length) {
    filteredBookList = filteredBookList.filter((item) => {
      const bookID = item.key;
      const found = filter ? filter.indexOf(bookID) : 1;
      return found >= 0;
    });
  }
  return filteredBookList;
}

export function createBibleListItem(bookID, bookName, dropDownDescription) {
  const item = {
    key: bookID,
    name: bookName,
    label: dropDownDescription,
  };
  return item;
}

/**
 * generate the book/chapter/verse list for the bible
 * @param {String[]} filter - if not null, then restrict list of books of the bible down to this list (i.e. it's a whitelist filter)
 * @param {boolean} addOBS - if true, then add OBS as a book
 * @return {Object[]} array of book selections
 */
export function getBibleList(filter = null, addOBS = false) {
  let allBibleBooks;
  if (!addOBS) {
    allBibleBooks = {
      ...BIBLE_BOOKS.oldTestament,
      ...BIBLE_BOOKS.newTestament,
    };
  } else {
    allBibleBooks = {
      ...BIBLE_BOOKS.oldTestament,
      ...BIBLE_BOOKS.newTestament,
      ...BIBLE_BOOKS.obs,
    };
  }
  const bibleBooks = Object.keys(allBibleBooks).map((bookID) => {
    const bookName = allBibleBooks[bookID];
    const dropDownDescription = getFullBookDescription(bookID, bookName);
    const item = createBibleListItem(bookID, bookName, dropDownDescription);
    return item;
  });
  return filterBibleList(bibleBooks, filter);
}

export function getChapterList(bookID, bookChapters = BOOK_CHAPTER_VERSES) {
  const bookInfo = bookChapters[bookID];
  if (bookInfo) {
    const chapters = Object.keys(bookInfo);
    if (chapters && chapters.length) {
      return chapters.map((chapter) => ({
        key: chapter,
        name: chapter,
        label: chapter,
      }));
    }
  }
  return [];
}

/**
 * add verse 'front' to beggining of verse list if not present
 * @param {string[]} verses
 * @param {string} frontMatterStr - add this string before first verse
 * @return {string[]} - updated verse list
 */
function addFrontToVerse(verses, frontMatterStr) {
  const pos = verses.indexOf(frontMatterStr);
  if (pos < 0) {
    // if front not found
    const verses_ = [...verses];
    verses_.unshift(frontMatterStr);
    verses = verses_;
  }
  return verses;
}

/**
 * generate list of verse options for book and chapter
 * @param {String} bookID
 * @param {String | number} chapter
 * @param {Object} bookChapters
 * @param {string} frontMatterStr - if not empty, in verse list we add this string before first verse
 * @return {*|{name: string, label: string, key: string}[]|*[]}
 */
export function getVerseList(
  bookID,
  chapter,
  bookChapters = BOOK_CHAPTER_VERSES,
  frontMatterStr = false
) {
  const bookInfo = bookChapters[bookID];
  if (bookInfo) {
    let verses = bookInfo[chapter];
    if (Array.isArray(verses)) {
      // support array of verses and front matter
      if (frontMatterStr) {
        verses = addFrontToVerse(verses, frontMatterStr);
      }
      const verseList = verses.map((i) => {
        const verse = `${i}`;
        return {
          key: verse,
          name: verse,
          label: verse,
        };
      });
      return verseList;
    } else if (verses) {
      if (typeof verses === "string") {
        verses = Number.parseInt(verses);
      }
      if (verses >= 0) {
        verses = Array.from({ length: verses }, (x, i) => {
          return `${i + 1}`;
        });
        if (frontMatterStr) {
          verses = addFrontToVerse(verses, frontMatterStr);
        }
        const verseList = verses.map((verse) => {
          return {
            key: verse,
            name: verse,
            label: verse,
          };
        });
        return verseList;
      }
    }
  }
  return [];
}

export const findKeyInList = (list, key, value) => {
  if (value && list) {
    const valueLC = value.toString().toLowerCase();
    return list.findIndex(
      (item) => (item[key] || "").toString().toLowerCase() === valueLC
    );
  }
  return -1; // not found
};

/**
 * make sure key is in list and replace USE_FIRST/USE_FIRST with actual value
 * @param {array} list
 * @param {string|number} key
 * @return {string}
 */
export const doSanityCheck = (list, key) => {
  if (!list.length) {
    console.error(`doSanityCheck() - list is empty for ${key}`);
    return "";
  }

  if (key === USE_FIRST) {
    key = getFirstItem(list);
  } else if (key === USE_LAST) {
    key = getLastItem(list);
  } else {
    const found = findKeyInList(list, "key", key);
    if (found < 0) {
      // if key not found in list, use key of first entry
      if (list?.length) {
        const newKey = list[0].key;
        console.warn(
          `Attempting to set current value to ${key} which is invalid, falling back to ${newKey}`
        );
        key = newKey;
      }
    }
  }
  return key;
};

export const doSanityCheckVerse = (list, key, frontKey) => {
  if (!list.length) {
    console.error(`doSanityCheck() - list is empty for ${key}`);
    return "";
  }

  if (key === USE_FRONT) {
    key = getFirstItem(list);
  } else if (key === USE_FIRST) {
    key = getFirstItem(list);
    if (frontKey && key === frontKey) {
      key = getItemN(list, 1);
    }
  } else if (key === USE_LAST) {
    key = getLastItem(list);
  } else {
    const found = findKeyInList(list, "key", key);
    if (found < 0) {
      // if key not found in list, use key of first entry
      if (list?.length) {
        const newKey = list[0].key;
        console.warn(
          `Attempting to set current value to ${key} which is invalid, falling back to ${newKey}`
        );
        key = newKey;
      }
    }
  }
  return key;
};

export function getItemN(list, n) {
  let key = "";
  if (list.length > n) {
    key = list[n].key;
  } else {
    key = "";
  }
  return key;
}

export function getFirstItem(list) {
  let key = "";
  if (list.length) {
    key = list[0].key;
  } else {
    key = "";
  }
  return key;
}

export function getLastItem(list) {
  let key = "";
  if (list.length) {
    key = list[list.length - 1].key;
  } else {
    key = "";
  }
  return key;
}

export const getNextItem = (list, key) => {
  let overflow = false;
  const found = findKeyInList(list, "key", key);
  if (found < 0) {
    // if key not found in list, use key of first entry
    key = getFirstItem(list, key);
  } else if (found >= list.length - 1) {
    // if we hit the limit
    overflow = true;
  } else {
    const newItem = list[found + 1];
    key = newItem.key;
  }
  return { key, overflow };
};

export const getPrevItem = (list, key) => {
  let overflow = false;
  const found = findKeyInList(list, "key", key);
  if (found < 0) {
    // if key not found in list, use key of first entry
    key = getFirstItem(list, key);
  } else if (found <= 0) {
    // if we hit the limit
    overflow = true;
  } else {
    const newItem = list[found - 1];
    key = newItem.key;
  }
  return { key, overflow };
};

/**
 * make clone of object and remove keys in remove
 * @param {object} object
 * @param {array} remove
 * @return {object}
 */
export function removeKeys(object, remove) {
  let newObject = cloneDeep(object);
  for (const key of remove) {
    if (key) {
      if (newObject.hasOwnProperty(key)) {
        delete newObject[key];
      }
    }
  }
  return newObject;
}

/**
 * split text such as `5:2` into chapter and verse
 * @param ch_vs
 * @return {{c: string, v: string}}
 */
function findChapterVerse(ch_vs) {
  console.log(`findChapterVerse - checking ch:vs - (${ch_vs})`);
  let c, v;
  const found = ch_vs.match(/^(\d+)(:(\d+))?$/);
  if (found) {
    console.log(`findChapterVerse - found - (${JSON.stringify(found)})`);
  }
  if (found?.length > 1) {
    c = found[1];
    v = (found.length > 3 && found[3]) || "1";
    console.log(`findChapterVerse - found (${c}:${v})`);
  }
  return { c, v };
}

/**
 * extract bible references from text such as `mat 1:2` or `Mark 3:4`
 * @param text - to search for bible references
 * @return {{bookId: string, c: string, v: string}} returns bible reference
 */
export function getBookChapterVerse(text) {
  console.log(`getBookChapterVerse(${text})`);
  if (text) {
    const text_ = text.trim();
    const parts = text_.split(" ").filter((item) => item.length);
    if (parts.length === 2) {
      const ch_vs = parts[1];
      const { c, v } = findChapterVerse(ch_vs);
      if (c && v) {
        const bookId = parts[0];
        const found = bookId.match(/^[\d]?([^\d\W]+)$/i); // make sure book name is just word with no numbers or punctuation (may optionally have a leading digit)
        console.log(
          `getBookChapterVerse(${text}) book=${bookId}, found=${JSON.stringify(
            found
          )}`
        );
        if (found) {
          return { bookId, c, v };
        }
      }
    }
  }
  return null;
}

/**
 * search through book IDs and names to find the bookId that matches (case insensitive matching)
 * @param bookOptions - list of supported books
 * @param book - book Id or name to match
 * @return {null|string}
 */
export function findBookId(bookOptions, book) {
  if (book) {
    const book_ = book.trim().toLowerCase();
    for (const item of bookOptions) {
      if (
        book_ === item.key.toLowerCase() ||
        book_ === item.name.toLowerCase()
      ) {
        return item.key;
      }
    }
  }
  return null;
}

/**
 * add delay for UI to update
 * @param {number} ms
 * @return {Promise<unknown>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * left pad numStr with zeros to meet minimum width.  For example '1' becomes '001' when len is 3
 * @param {string} numStr - text to pad
 * @param {number} len - minimum length for returned string
 * @return {string}  - zero padded string For example '001', when numStr is '1' and len is 3
 */
export function zeroAdjustLength(numStr, len) {
  let _numStr = typeof numStr === "string" ? numStr : `${numStr}`; // make sure in string format
  let parts = _numStr?.split("-");
  _numStr = parts[0];

  while (_numStr.length < len) {
    _numStr = "0" + _numStr;
  }
  parts[0] = _numStr;
  return parts.join("-");
}

/**
 * separate book and C:V from reference (e.g. `gen 1:1` will return {bookId: 'gen', ref: '1:1}
 * @param {string} ref - in format such as `gen 1:1`
 * @return {{cvRef: string, bookId: string}}
 */
export function splitBookAndRef(ref) {
  const _ref = typeof ref === "string" ? ref : `${ref}`; // make sure in string format
  let [bookId, cvRef] = (_ref || "").trim().split(" ");
  bookId = bookId.toLowerCase();
  return { bookId, cvRef };
}

/**
 * extract chapter and verse from C:V
 * @param {string} cvRef - in format such as `1:1`
 * @return {{chapter: *, verse: *}}
 */
export function splitChapterVerse(cvRef) {
  const _ref = typeof cvRef === "string" ? cvRef : `${cvRef}`; // make sure in string format
  const [chapter, verse] = _ref.split(":");
  return { chapter, verse };
}

/**
 * normalize bible references for sort comparison
 * @param ref - such as `gen 1:1`
 * @return {null|string}
 */
export function normalizeRef(ref) {
  const _ref = typeof ref === "string" ? ref : `${ref}`; // make sure in string format
  const { bookId, cvRef } = splitBookAndRef(_ref);

  if (bookId) {
    const bookNum = zeroAdjustLength(BIBLES_ABBRV_INDEX[bookId] || bookId, 3);

    if (cvRef) {
      let { chapter, verse } = splitChapterVerse(cvRef);

      if (chapter) {
        chapter = zeroAdjustLength(chapter, 3);
        if (verse) {
          verse = zeroAdjustLength(verse, 3);
        }
        return `${bookNum}_${chapter}_${verse}`;
      }
    }

    return bookNum;
  }
  return ref;
}

/**
 * sort function that sorts in bible reference order rather than alphabetically
 * @param a
 * @param b
 * @return {number}
 */
export function bibleRefSort(a, b) {
  // sorts by true book/chapter/verse order
  const akey = normalizeRef(a);
  const bkey = normalizeRef(b);
  // eslint-disable-next-line no-nested-ternary
  return akey < bkey ? -1 : akey > bkey ? 1 : 0;
}

/**
 * take list of book/chapter/verses and create a structured object used by bible-reference-rcl
 * @param refs - list in format such as ['gen 1:1', ...]
 * @return {{}} - structure such as {gen: {1: ['1', '2', ...]}}}
 */
export function convertRefsToSupportedBooks(refs) {
  const supportedBooks = {};

  for (const ref of refs) {
    const { bookId, cvRef } = splitBookAndRef(ref);
    let chapters = supportedBooks[bookId];

    if (!chapters) {
      // if we don't yet have book then add
      chapters = {};
      supportedBooks[bookId] = chapters;
    }

    const { chapter, verse } = splitChapterVerse(cvRef);
    let verses = chapters[chapter];

    if (!verses) {
      verses = [];
      chapters[chapter] = verses;
    }

    if (!verses.includes(verse)) {
      verses.push(verse);
    }
  }

  return supportedBooks;
}

/**
 * Checks if a reference string is within the specified book.
 *
 * @param {string} refString - The reference string to be checked.
 * @param {string} bookId - The identifier of the book.
 * @param {Object} bookChapterVerses - An object representing the number of verses in each chapter of each book. Defaults to a constant `BOOK_CHAPTER_VERSES`.
 * @returns {boolean} - Returns true if all references in the string are within the specified book, false otherwise.
 *
 * @example
 * isRefInBook("3:16-18", "Jhn"); // returns true
 */
export function isRefInBook(
  refString,
  bookId,
  bookChapterVerses = BOOK_CHAPTER_VERSES
) {
  if (typeof refString !== "string" || typeof bookId !== "string") {
    throw new Error("Invalid input types for refString or bookId");
  }

  const referenceList = parseReferenceToList(refString);
  if (!referenceList?.length) {
    throw new Error("Input reference is invalid!");
  }

  return referenceList.every((refObj) =>
    isRefObjectInBook(refObj, bookId, bookChapterVerses)
  );
}

/**
 * Helper function to determine if a reference object is within a specified book.
 *
 * @param {Object} refObj - The reference object to check. Should contain chapter and verse details.
 * @param {string} bookId - The identifier of the book.
 * @param {Object} bookChapterVerses - An object representing the number of verses in each chapter of each book.
 * @returns {boolean} - Returns true if the reference object is within the specified book, false otherwise.
 *
 * @example
 * isRefObjectInBook({ chapter: 3, verse: 16 }, "Jhn", bookChapterVerses); // returns true
 */
function isRefObjectInBook(refObj, bookId, bookChapterVerses) {
  const { chapter, verse, endChapter, endVerse } = refObj;

  if (!!endVerse && !!endChapter) {
    return (
      isChapterVerseInBook(bookId, chapter, verse, bookChapterVerses) &&
      isChapterVerseInBook(bookId, endChapter, endVerse, bookChapterVerses)
    );
  } else if (!!endVerse) {
    return (
      isChapterVerseInBook(bookId, chapter, verse, bookChapterVerses) &&
      isChapterVerseInBook(bookId, chapter, endVerse, bookChapterVerses)
    );
  } else {
    return isChapterVerseInBook(bookId, chapter, verse, bookChapterVerses);
  }
}

/**
 * Determines if a specific chapter and verse is in the specified book.
 *
 * @param {string} bookId - The identifier of the book.
 * @param {number} chapter - The chapter number to check.
 * @param {number} verse - The verse number to check.
 * @param {Object} bookChapterVerses - An object representing the number of verses in each chapter of each book.
 * @returns {boolean} - Returns true if the chapter and verse are in the specified book, false otherwise.
 *
 * @example
 * isChapterVerseInBook("Jhn", 3, 16, bookChapterVerses); // returns true
 */
function isChapterVerseInBook(bookId, chapter, verse, bookChapterVerses) {
  return (
    bookChapterVerses[bookId]?.[chapter] &&
    bookChapterVerses[bookId][chapter] >= verse
  );
}
