## Annotation Bible Reference Sandbox

This component is for navigating bible references

```js
import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import useBibleReference from './useBibleReference';
import BibleReference from './BibleReference';

const supportedBooks = null; // if empty array or null then all books available
// const supportedBooks = [ 'mat', 'mrk', 'mal', '1ti', '2ti']; // if non-empty array then only these books are shown
const initialBook="mal";
const initialChapter="2";
const initialVerse="3";

function onChange(bookId, chapter, verse) {
  console.log(`\n### Reference changed to ${bookId} - ${chapter}:${verse}\n\n`);
}

const { state, actions } = useBibleReference(
    {
        initialBook,
        initialChapter,
        initialVerse,
        onChange
    }
);

useEffect(() => {
  actions.applyBooksFilter(supportedBooks);
}, []); // just apply the first time in this demo

<div>
    <br/><br/>

    <BibleReference
      status={state}
      actions={actions}
    />

    <br/><br/>

    <Card variant="outlined">
      <CardContent>
        <Typography color="textPrimary" gutterBottom>
        {`State Example for bible-reference-rcl:`}
        </Typography>
        <br/>
        <Typography style={{marginLeft: "50px"}} color="textPrimary" gutterBottom>
        {`Book Name: ${state.bookName}`}
        </Typography>
        <Typography style={{marginLeft: "50px"}} color="textPrimary" gutterBottom>
        {`Current Location: ${state.bookId} ${state.chapter}:${state.verse}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography color="textPrimary">
        {`Action Examples:`}
        </Typography>
        <br/>
        <Button
            variant="outlined"
            id="prev_v"
            onClick={actions.goToPrevVerse}>
          {"Previous Verse"}
        </Button>

        <Button
            variant="outlined"
            id="next_v"
            onClick={actions.goToNextVerse}>
          {"Next Verse"}
        </Button>

        <Button
            variant="outlined"
            id="prev_b"
            onClick={actions.goToPrevBook}>
          {"Previous Book"}
        </Button>

        <Button
            variant="outlined"
            id="next_b"
            onClick={actions.goToNextBook}>
          {"Next Book"}
        </Button>
      </CardActions>
    </Card>

</div>
```
