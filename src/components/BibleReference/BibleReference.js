import React from 'react';
import PropTypes from 'prop-types';
import ReferenceSelector from '../ReferenceSelector'
import NavButtons, {
  NAV_TYPES_DOUBLE_NEXT,
  NAV_TYPES_DOUBLE_PREV,
  NAV_TYPES_NEXT,
  NAV_TYPES_PREV
} from "../NavButtons/NavButtons";
import {removeKeys} from "../../common/ReferenceUtils";

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
  const childrenStyle = removeKeys(style, ['background']); // remove the background for children styles - it will be inherited by default and making it explicit creates havoc

  // Render the UI for your table
  return (
      <div style={style_}>

        <NavButtons id="prev_ch" onClick={goToPrevChapter} type={NAV_TYPES_DOUBLE_PREV} style={childrenStyle} />

        <NavButtons id="prev_v" onClick={goToPrevVerse} type={NAV_TYPES_PREV} style={childrenStyle} />

        <ReferenceSelector
          id="bible"
          matchName={true}
          options={bookList}
          initial={bookId}
          onChange={onChangeBook}
          style={childrenStyle}
        />

        <ReferenceSelector
          id="chapter"
          options={chapterList}
          initial={chapter}
          onChange={onChangeChapter}
          style={childrenStyle}
        />

        <div style={chapterVerseSeparatorStyle}>:</div>

        <ReferenceSelector
          id="verse"
          options={verseList}
          initial={verse}
          onChange={onChangeVerse}
          style={childrenStyle}
        />

        <NavButtons id="next_v" onClick={goToNextVerse} type={NAV_TYPES_NEXT} style={childrenStyle} />

        <NavButtons id="next_ch" onClick={goToNextChapter} type={NAV_TYPES_DOUBLE_NEXT} style={childrenStyle} />

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
