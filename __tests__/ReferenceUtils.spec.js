import {findBookId, getBibleList, getBookChapterVerse} from "../src/common/ReferenceUtils";

const fullBibleList = getBibleList()

describe('testing bibleVerseMatcher', () => {
  // iterate through tests in table and verify results
  test.each`
  text        | expected
  ${'mat'}    | ${null}
  ${'mat '}   | ${null}
  ${'mat 11'} | ${{"bookId": "mat", "c": "11", "v": "1"}}
  ${' mat 33:22 '}  | ${{"bookId": "mat", "c": "33", "v": "22"}}
  ${' mat  33:22 '} | ${{"bookId": "mat", "c": "33", "v": "22"}}
  ${'Mark 19'}    | ${{"bookId": "Mark", "c": "19", "v": "1"}}
  ${'100'}        | ${null}
  ${'100:100'}    | ${null}
  ${' 100:100'}   | ${null}
  ${'100: 100'}   | ${null}
  ${'2ki 15:203'} | ${{"bookId": "2ki", "c": "15", "v": "203"}}
  ${'2ki: 203'}   | ${null}
  ${'ki2: 20:19'} | ${null}
  ${''} | ${null}
  ${null} | ${null}
  ${undefined} | ${null}
`('match of "$text" should return $expected', ({ text, expected }) => {
    const results = getBookChapterVerse(text)
    validateResults('bibleVerseMatcher', results, expected, text);
  });
});

describe('testing findBookId', () => {
  // iterate through tests in table and verify results
  test.each`
  text       | expected
  ${'mt'}    | ${null}
  ${'mat'}   | ${'mat'}
  ${'mat '}  | ${'mat'}
  ${' mat '} | ${'mat'}
  ${'MAT '}  | ${'mat'}
  ${'Mark'}  | ${'mrk'}
  ${'MARK'}  | ${'mrk'}
  ${'2ki'}   | ${'2ki'}
  ${'2 ki'}  | ${null}
  ${'3jn'}   | ${'3jn'}
  ${'32jn'}  | ${null}
  ${''}  | ${null}
  ${null}  | ${null}
  ${undefined}  | ${null}
`('match of "$text" should return $expected', ({ text, expected }) => {
    const results = findBookId(fullBibleList, text)
    validateResults('findBookId', results, expected, text);
  });
});

//
// helpers
//

function validateResults(tag, results, expected, text) {
  if (JSON.stringify(results) !== JSON.stringify(expected)) {
    console.error(`Failure - test of ${tag}('${text}'): result ${JSON.stringify(results)} !== ${JSON.stringify(expected)} expected`)
  }
  expect(results).toEqual(expected);
}
