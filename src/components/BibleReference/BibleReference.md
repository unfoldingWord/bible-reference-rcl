## Annotation Bible Reference Sandbox

This component is for navigating bible references

```js
import React, { useState, useEffect } from 'react';
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

<BibleReference
  status={status}
  actions={actions}
/>
```
