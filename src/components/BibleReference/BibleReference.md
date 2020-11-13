## Annotation Bible Reference Sandbox

This component is for navigating bible references

```js
import React, { useState, useEffect } from 'react';
import BibleReference from './BibleReference';

// const options = null; // if empty array or null then all books available
const options = [ 'mat', 'mrk', 'mal', '1ti', '2ti']; // if non-empty array then only these books are shown
<BibleReference options={options}/>
```
