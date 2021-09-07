import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-17-updated';
import BibleReferenceTest from "./utils/BibleReferenceTest";
import { delay } from "../src/common/ReferenceUtils";

configure({ adapter: new Adapter() });
const testResultsDelay = 50;
let state = null;
let actions = null;

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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeVerse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalVerse = '2';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeVerse(finalVerse, verse);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeChapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeChapter(finalChapter, chapter);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeBook', async () => {
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
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeBook(finalBook, bookId);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeVerse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalVerse = '2';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse: finalVerse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeVerse(finalVerse, verse);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeChapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter: finalChapter, verse: finalVerse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeChapter(finalChapter, chapter);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('onChangeBook', async () => {
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
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse);
    actions.onChangeBook(finalBook, bookId);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
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
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeVerse - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const finalVerse = '2';
    const expectedResults = [bookId, chapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    actions.onChangeVerse(finalVerse);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeChapter - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const finalChapter = '2';
    const finalVerse = '1';
    const expectedResults = [bookId, finalChapter, finalVerse];
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    actions.onChangeChapter(finalChapter);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('onChangeBook - rejected', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '2';
    const newBook = 'mrk';
    const expectedFinalState = {bookId, chapter, verse};

    // when
    const { mockOnChange } = generateBibleReferenceTestWithPreChange(bookId, chapter, verse, false);
    actions.onChangeBook(newBook);
    await delay(testResultsDelay)

    // then
    verifyFinalState(expectedFinalState, state)
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

  const wrapper = shallow(
    <BibleReferenceTest
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
      onChange={mockOnChange}
      stateCallback={stateCallback}
    />
  );
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

  const wrapper = shallow(
    <BibleReferenceTest
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
      onChange={mockOnChange}
      onPreChange={onPreChange}
      stateCallback={stateCallback}
    />
  );
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
