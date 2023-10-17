/**
 * @jest-environment jsdom
 */
import React from 'react';
import {act, render, renderHook, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BibleReferenceTest from './utils/BibleReferenceTest';
import { delay } from '../src/common/ReferenceUtils';
import useBibleReference from '../src/components/BibleReference/useBibleReference';

const testResultsDelay = 100;
let state = null;
let actions = null;
const supportedBooks_ ={
  "gen": {
    "1": [
      "16",
      "18"
    ],
    "21": [
      "22",
      "32"
    ],
    "23": [
      "6"
    ],
    "25": [
      "16"
    ],
    "26": [
      "26"
    ],
    "34": [
      "2"
    ],
    "37": [
      "36"
    ],
    "39": [
      "1",
      "21",
      "22",
      "23"
    ],
    "40": [
      "2",
      "3",
      "4",
      "7",
      "9",
      "16",
      "20",
      "21",
      "22",
      "23"
    ],
    "41": [
      "9",
      "10",
      "12"
    ],
    "42": [
      "6"
    ],
    "45": [
      "8",
      "26"
    ],
    "47": [
      "6"
    ],
  },
  "exo": {
    "2": [
      "14"
    ],
    "18": [
      "21",
      "25"
    ],
    "22": [
      "28"
    ],
    "34": [
      "31"
    ]
  },
  "jos": {
    "12": [
      "2",
      "5"
    ],
    "13": [
      "10",
      "12",
      "21"
    ],
    "22": [
      "14",
      "30",
      "32"
    ],
  },
  "1sa": {
    "5": [
      "8",
      "11"
    ],
    "6": [
      "4",
      "12",
      "16",
      "18"
    ],
    "7": [
      "7"
    ],
    "8": [
      "15"
    ],
    "9": [
      "16"
    ],
    "10": [
      "1"
    ],
    "13": [
      "14"
    ],
    "25": [
      "30"
    ],
    "29": [
      "2",
      "6",
      "7"
    ],
  },
  "1ki": {
    "1": [
      "35"
    ],
    "4": [
      "2"
    ],
    "5": [
      "16"
    ],
    "11": [
      "34"
    ],
    "14": [
      "7"
    ],
    "16": [
      "2"
    ],
  },
  "ezr": {
    "1": [
      "8"
    ],
    "4": [
      "9",
      "20"
    ],
    "5": [
      "6"
    ],
    "6": [
      "6"
    ],
    "7": [
      "28"
    ],
    "8": [
      "24",
      "25",
      "29"
    ],
    "9": [
      "1",
      "2"
    ],
    "10": [
      "5",
      "8",
      "14"
    ],
  },
  "neh": {
    "2": [
      "16"
    ],
    "4": [
      "14",
      "19"
    ],
    "5": [
      "7",
      "17"
    ],
    "7": [
      "5"
    ],
    "9": [
      "37"
    ],
    "12": [
      "40"
    ],
    "13": [
      "11"
    ],
  },
  "est": {
    "1": [
      "22"
    ],
  },
  "psa": {
    "119": [
      "133"
    ],
  },
  "pro": {
    "6": [
      "7"
    ],
    "8": [
      "16"
    ],
    "12": [
      "24"
    ],
    "17": [
      "2"
    ],
    "19": [
      "10"
    ],
    "22": [
      "7"
    ],
    "23": [
      "1"
    ],
    "25": [
      "15"
    ],
    "28": [
      "2",
      "15",
      "16"
    ],
    "29": [
      "2",
      "12",
      "26"
    ],
    "31": [
      "4"
    ],
  },
  "ecc": {
    "6": [
      "2"
    ],
    "8": [
      "9"
    ],
  },
  "ezk": {
    "19": [
      "14"
    ],
  },
  "dan": {
    "2": [
      "10"
    ],
  },
  "jol": {
    "2": [
      "17"
    ],
  }
}

describe('testing BibleReference add filtered BCV', () => {
  it('apply supportedBooks', async () => {
    // given
    const bookId = 'exo';
    const chapter = '1';
    const verse = '1';
    const finalBookId = 'gen';
    const finalChapter = '1';
    const finalVerse = '16';
    const expectedResults = [finalBookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    await delay(testResultsDelay)
    const books = Object.keys(supportedBooks_)
    actions.setBookChapterVerses(supportedBooks_)
    await delay(500)

    // then
    verifyFinalState(expectedFinalState, state)
    const newBookList = getKeysFromArray(state.bookList);
    expect(newBookList).toEqual(books);
    const newChapterList = getKeysFromArray(state.chapterList);
    const expectedChapters = Object.keys(supportedBooks_.gen);
    expect(newChapterList).toEqual(expectedChapters);
    const newVerseList = getKeysFromArray(state.verseList);
    const expectedVerses = supportedBooks_.gen['1'];
    expect(newVerseList).toEqual(expectedVerses);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
    actions.goToBookChapterVerse('gen', '23', '1')
  })
});

describe('testing BibleReference without onPreChange', () => {
  it('next verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalVerse = '2';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '25';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '20';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const finalChapter = '1';
    const finalVerse = '25';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalBook = 'mal';
    const finalChapter = '4';
    const finalVerse = '6';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '2';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '2';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalBook = 'mal';
    const finalChapter = '4';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeVerse', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '1';
    const finalVerse = '2';
    const expectedResults = [initialBook, initialChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: initialChapter,
      verse: finalVerse,
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeVerse(finalVerse, initialVerse);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeChapter', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [initialBook, finalChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeChapter(finalChapter, initialChapter);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeBook', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '28';
    const initialVerse = '2';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {
      bookId: finalBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeBook(finalBook, initialBook);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('front matter support', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '28';
    const initialVerse = '2';
    const finalChapter = '2';
    const finalVerse = 'front';
    const expectedResults = [initialBook, finalChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const addChapterFront = true;
    const mockOnChange = jest.fn();

    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      addChapterFront,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeChapter(finalChapter, initialChapter);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('without front matter support', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '28';
    const initialVerse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [initialBook, finalChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const addChapterFront = false;
    const mockOnChange = jest.fn();

    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      addChapterFront,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeChapter(finalChapter, initialChapter);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });
});

describe('testing BibleReference with onPreChange', () => {
  it('next verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalVerse = '2';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '25';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '20';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const finalChapter = '1';
    const finalVerse = '25';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalBook = 'mal';
    const finalChapter = '4';
    const finalVerse = '6';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '2';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '2';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalBook = 'mal';
    const finalChapter = '4';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeVerse', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '1';
    const finalVerse = '2';
    const expectedResults = [initialBook, initialChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: initialChapter,
      verse: finalVerse,
    };
    const preChangeReturn = true;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeVerse(finalVerse, initialVerse);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeChapter', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [initialBook, finalChapter, finalVerse];
    const expectedFinalState = {
      bookId: initialBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const preChangeReturn = true;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeChapter(finalChapter, initialChapter);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeBook', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '28';
    const initialVerse = '2';
    const finalBook = 'mrk';
    const finalChapter = '1';
    const finalVerse = '1';
    const expectedResults = [finalBook, finalChapter, finalVerse];
    // const expectedFinalState = {bookId: finalBook, chapter: finalChapter, verse: finalVerse};
    const expectedFinalState = {
      bookId: finalBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const preChangeReturn = true;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }


    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeBook(finalBook, initialBook);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });
});

describe('testing BibleReference with onPreChange rejected', () => {
  it('next verse - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('next verse with chapter wrap - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '25';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('next verse with book wrap - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '20';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous verse - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous verse with chapter wrap - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous verse with book wrap - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_v')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('next chapter - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('next chapter with verse reset - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('next chapter with book overflow - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '2';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#next_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous chapter - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous chapter with verse reset - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '2';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('previous chapter with book overflow - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    render(wrapper)
    const nextButton = document.querySelector('#prev_c')
    await userEvent.click(nextButton)
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toBeTruthy();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeVerse - rejected', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '1';
    const finalVerse = '1';
    const expectedFinalState = {
      bookId: initialBook,
      chapter: initialChapter,
      verse: finalVerse,
    };
    const preChangeReturn = false;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }


    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeVerse(finalVerse, initialVerse);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeChapter - rejected', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '2';
    const finalChapter = '1';
    const finalVerse = '2';
    const newChapter = '2';
    const expectedFinalState = {
      bookId: initialBook,
      chapter: finalChapter,
      verse: finalVerse,
    };
    const preChangeReturn = false;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeChapter(newChapter);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeBook - rejected', async () => {
    // given
    const initialBook = 'mat';
    const initialChapter = '28';
    const initialVerse = '2';
    const newBook = 'mrk';
    // const expectedFinalState = {initialBook, initialChapter, initialVerse};
    const expectedFinalState = {
      bookId: initialBook,
      chapter: initialChapter,
      verse: initialVerse,
    };
    const preChangeReturn = false;
    const preDelay = 10;
    const onPreChange = async () => {
      await delay(preDelay)
      return preChangeReturn
    };
    const mockOnChange = jest.fn();
    const props = {
      initialBook,
      initialChapter,
      initialVerse,
      onChange: mockOnChange,
      onPreChange,
    }

    // when
    const { result } = renderHook(() => useBibleReference(props))

    act(() => {
      result.current.actions.onChangeBook(newBook, initialBook);
    })

    await delay(testResultsDelay)

    // then
    expect(result.current.state.bookId).toBe(expectedFinalState.bookId)
    expect(result.current.state.chapter).toBe(expectedFinalState.chapter)
    expect(result.current.state.verse).toBe(expectedFinalState.verse)
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });
});

//
// helpers
//


function generateBibleReferenceTest(bookId, chapter, verse) {
  state = null;
  actions = null;
  const mockOnChange = jest.fn();

  const wrapper =
    <BibleReferenceTest
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
      onChange={mockOnChange}
      stateCallback={stateCallback}
    />
  return {
    wrapper,
    mockOnChange
  };
}

function generateBibleReferenceTestWithPreChange(bookId, chapter, verse, preChangeReturn = true, preDelay = 10) {
  state = null;
  actions = null;
  const mockOnChange = jest.fn();
  const onPreChange = async () => {
    await delay(preDelay)
    return preChangeReturn
  };

  const wrapper =
    <BibleReferenceTest
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
      onChange={mockOnChange}
      onPreChange={onPreChange}
      stateCallback={stateCallback}
    />
  return {
    wrapper,
    mockOnChange
  };
}

function verifyFinalState(expected, state) {
  const currentState = {
    bookId: state.bookId,
    chapter: state.chapter,
    verse: state.verse,
  }
  expect(currentState).toEqual(expected)
}

function stateCallback(newState, newActions) {
  state = newState
  actions = newActions
}

function getKeysFromArray(options) {
  return options.map(item => item.key);
}
