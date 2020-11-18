import React from 'react';
import Button from '@material-ui/core/Button';
import ReferenceSelector from '../ReferenceSelector'

export function BibleReference(props) {
  const {
    status: {
      currentBookId,
      currentChapter,
      currentVerse,
      bookList,
      chapterList,
      verseList,
    },
    actions: {
      goToPrevBook,
      goToNextBook,
      goToPrevChapter,
      goToNextChapter,
      goToPrevVerse,
      goToNextVerse,
      goToBookChapterVerse,
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
          initial={currentBookId}
          onChange={onChangeBook}
        />

        <ReferenceSelector
          id="chapter"
          options={chapterList}
          initial={currentChapter}
          onChange={onChangeChapter}
        />

        <ReferenceSelector
          id="verse"
          options={verseList}
          initial={currentVerse}
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

export default BibleReference;
