import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ReferenceSelector from '../ReferenceSelector'

export function BibleReference(props) {
  const {
    status: {
      bookId,
      chapter,
      verse,
      bookList,
      chapterList,
      verseList,
    },
    actions: {
      goToPrevChapter,
      goToNextChapter,
      goToPrevVerse,
      goToNextVerse,
      onChangeBook,
      onChangeChapter,
      onChangeVerse
    }
  } = props;

  // Render the UI for your table
  return (
      <div style={{display: 'flex', alignItems:'top'}}>

        <Button variant="text" id="prev_ch" onClick={goToPrevChapter}>
          {"<<"}
        </Button>

        <Button variant="text" id="prev_v" onClick={goToPrevVerse}>
          {"<"}
        </Button>

        <ReferenceSelector
          id="bible"
          matchName={true}
          options={bookList}
          initial={bookId}
          onChange={onChangeBook}
        />

        <ReferenceSelector
          id="chapter"
          options={chapterList}
          initial={chapter}
          onChange={onChangeChapter}
        />

        <ReferenceSelector
          id="verse"
          options={verseList}
          initial={verse}
          onChange={onChangeVerse}
        />

        <Button variant="text" id="next_v" onClick={goToNextVerse}>
          {">"}
        </Button>

        <Button variant="text" id="next_ch" onClick={goToNextChapter}>
          {">>"}
        </Button>

      </div>
  )
}

BibleReference.propTypes = {
  status: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    chapter: PropTypes.string.isRequired,
    verse: PropTypes.string.isRequired,
    bookList: PropTypes.array.isRequired,
    chapterList: PropTypes.array.isRequired,
    verseList: PropTypes.array.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    goToPrevChapter: PropTypes.func.isRequired,
    goToNextChapter: PropTypes.func.isRequired,
    goToPrevVerse: PropTypes.func.isRequired,
    goToNextVerse: PropTypes.func.isRequired,
    onChangeBook: PropTypes.func.isRequired,
    onChangeChapter: PropTypes.func.isRequired,
    onChangeVerse: PropTypes.func.isRequired,
  })
};

export default BibleReference;
