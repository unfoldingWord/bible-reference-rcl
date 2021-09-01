import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-17-updated';
import BibleReferenceTest from "./utils/BibleReferenceTest";

configure({ adapter: new Adapter() });

describe('testing BibleReference', () => {
  it('next verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedResults = [bookId, chapter, '2'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '25';
    const expectedResults = [bookId, '2', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '20';
    const expectedResults = ['mrk', '1', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedResults = [bookId, chapter, '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with chapter wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const expectedResults = [bookId, '1', '25'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous verse with book wrap', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedResults = ['mal', '4', '6'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_v');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '1';
    const expectedResults = [bookId, '2', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedResults = [bookId, '2', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('next chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '28';
    const verse = '2';
    const expectedResults = ['mrk', '1', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#next_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '1';
    const expectedResults = [bookId, '1', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with verse reset', async () => {
    // given
    const bookId = 'mat';
    const chapter = '2';
    const verse = '2';
    const expectedResults = [bookId, '1', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });

  it('previous chapter with book overflow', async () => {
    // given
    const bookId = 'mat';
    const chapter = '1';
    const verse = '2';
    const expectedResults = ['mal', '4', '1'];

    // when
    const { wrapper, mockOnChange } = generateBibleReferenceTest(bookId, chapter, verse);
    const nextButton = wrapper.find('#prev_c');
    nextButton.simulate('click');
    await delay(100)

    // then
    expect(nextButton).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(...expectedResults);
  });
});

//
// helpers
//


function generateBibleReferenceTest(bookId, chapter, verse) {

  const mockOnChange = jest.fn();

  const wrapper = shallow(
    <BibleReferenceTest
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
      onChange={mockOnChange}
    />
  );
  return {
    wrapper,
    mockOnChange
  };
}

export function delay(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  )
}
