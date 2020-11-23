import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ReferenceSelector from '../ReferenceSelector'
import NavButtons from "../NavButtons/NavButtons";

const bibleRefDefaultStyle = {
  fontFamily: 'Noto Sans',
  fontSize: '12px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'top',
  marginLeft: '10px',
  marginRight: '10px',
  paddingTop: '2px',
  paddingBottom: '2px',
};

const navButtonsStyle = {
  width: '44px',
  height: '44px'
}

const chapterVerseSeparatorStyle = {
  paddingTop: "10px",
  paddingRight: "2px",
  fontWeight: "900",
  fontSize: "14px"
};

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
    },
    style,
  } = props;

  const style_ = {...bibleRefDefaultStyle, ...style}; // style property will override default style

  // Render the UI for your table
  return (
      <div style={style_}>

        <NavButtons id="prev_ch" onClick={goToPrevChapter} label={"<<"}/>

        <NavButtons id="prev_v" onClick={goToPrevVerse} label={"<"}/>

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

        <div style={chapterVerseSeparatorStyle}>:</div>

        <ReferenceSelector
          id="verse"
          options={verseList}
          initial={verse}
          onChange={onChangeVerse}
        />

        <NavButtons id="next_v" onClick={goToNextVerse} label={">"}/>

        <NavButtons id="next_ch" onClick={goToNextChapter} label={">>"}/>

      </div>
  )
}

BibleReference.defaultProps = {
  style: {}
};

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
  }),
  style: PropTypes.object.isRequired,
};

export default BibleReference;
