import {ALL_BIBLE_BOOKS, BOOK_CHAPTER_VERSES} from "./BooksOfTheBible";

// consts
export const USE_FIRST = Number.NEGATIVE_INFINITY;
export const USE_LAST = Number.POSITIVE_INFINITY;

export function getFullBookDescription(bookID) {
  return `${bookID} - ${ALL_BIBLE_BOOKS[bookID]}`;
}

export function getBibleList() {
  return Object.keys(ALL_BIBLE_BOOKS).map( bookID => {
    const label = getFullBookDescription(bookID);
    return {
      key: bookID,
      label
    }
  });
}

export function getChapterList(bookID) {
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

export function getVerseList(bookID, chapter) {
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

export const findKeyInList = (list, key) => {
  return list.findIndex(item => (item.key === key));
}

export const findLabelInList = (list, value) => {
  return list.findIndex(item => (item.label === value));
}

/**
 * make sure key is in list and replace USE_FIRST/USE_FIRST with actual value
 * @param {array} list
 * @param {string|number} key
 * @return {string}
 */
export const doSanityCheck = (list, key) => {
  if (!list.length) {
    console.error(`doSanityCheck() - list is empty for ${key}`);
    return '';
  }

  if (key === USE_FIRST) {
    key = getFirstItem(list);
  } else if (key === USE_LAST) {
    key = getLastItem(list);
  } else {
    const found = findKeyInList(list, key);
    if (found < 0) { // if key not found in list, use key of first entry
      if (list.length) {
        const newKey = list[0].key;
        console.warn(`Attempting to set current value to ${key} which is invalid, falling back to ${newKey}`);
        key = newKey;
      }
    }
  }
  return key;
}

export function getFirstItem(list) {
  let key = '';
  if (list.length) {
    key = list[0].key;
  } else {
    key = '';
  }
  return key;
}

export function getLastItem(list) {
  let key = '';
  if (list.length) {
    key = list[list.length - 1].key;
  } else {
    key = '';
  }
  return key;
}

export const getNextItem = (list, key) => {
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

export const getPrevItem = (list, key) => {
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

