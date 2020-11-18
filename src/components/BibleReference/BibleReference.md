## Annotation Bible Reference Sandbox

This component is for navigating bible references

```js
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import useBibleReference from './useBibleReference';
import BibleReference from './BibleReference';

const options = null; // if empty array or null then all books available
// const options = [ 'mat', 'mrk', 'mal', '1ti', '2ti']; // if non-empty array then only these books are shown
const initialBook="mal";
const initialChapter="2";
const initialVerse="3";

function onChange(bookId, chapter, verse) {
  console.log(`\n### Reference changed to ${bookId} - ${chapter}:${verse}\n\n`);
}

const { status, actions } = useBibleReference(options, initialBook, initialChapter, initialVerse, onChange);

<div>

    <BibleReference
      status={status}
      actions={actions}
    />
    <br/><hr/><br/>
    <div>
        <TextField
            variant={"outlined"}
            style={{ width: "250px" }}
            value={`Current Location: ${status.currentBookId} ${status.currentChapter}:${status.currentVerse}`} />

        <br/><br/>

        <Button
            variant="outlined"
            id="prev_v"
            style={{ marginRight: "20px" }}
            onClick={actions.goToPrevVerse}>
          {"Previous Verse"}
        </Button>

        <Button
            variant="outlined"
            id="next_v"
            onClick={actions.goToNextVerse}>
          {"Next Verse"}
        </Button>

        <br/><br/>

        <Button
            variant="outlined"
            id="prev_b"
            style={{ marginRight: "20px" }}
            onClick={actions.goToPrevBook}>
          {"Previous Book"}
        </Button>

        <Button
            variant="outlined"
            id="next_b"
            onClick={actions.goToNextBook}>
          {"Next Book"}
        </Button>

    </div>
</div>
```
