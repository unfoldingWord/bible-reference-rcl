import {
  findBookId,
  getBibleList,
  getBookChapterVerse,
  normalizeRef,
  zeroAdjustLength
} from "../src/common/ReferenceUtils";

const fullBibleList = getBibleList()

describe('testing bibleVerseMatcher', () => {
  // iterate through tests in table and verify results
  test.each`
  testData    | expected
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
`('match of "testData" should return $expected', ({ testData, expected }) => {
    const results = getBookChapterVerse(testData)
    validateResults('bibleVerseMatcher', results, expected, testData);
  });
});

describe('testing findBookId', () => {
  // iterate through tests in table and verify results
  test.each`
  testData   | expected
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
`('match of "testData" should return $expected', ({ testData, expected }) => {
    const results = findBookId(fullBibleList, testData)
    validateResults('findBookId', results, expected, testData);
  });
});

describe('testing zeroAdjustLength with length 3', () => {
  test.each`
  testData  | expected
  ${0}      | ${'000'}
  ${'0'}    | ${'000'}
  ${'00'}   | ${'000'}
  ${'000'}  | ${'000'}
  ${'0001'} | ${'0001'}
  ${'0-'}   | ${'000-'}
  ${'0001-0002'} | ${'0001-0002'}
  ${'1-2'}  | ${'001-2'}
  ${'front-2'}  | ${'front-2'}
  ${''}     | ${'000'}
  ${null}   | ${'null'}
  ${undefined}  | ${'undefined'}
`('zeroAdjustLength of "$testData" should return $expected', ({ testData, expected }) => {
    const results = zeroAdjustLength(testData, 3)
    validateResults('zeroAdjustLength', results, expected, testData);
  });
})

describe('testing normalizeRef', () => {
  test.each`
  testData  | expected
  ${'gen 1:2'}     | ${'001_001_002'}
  ${'psa 1:2'}     | ${'019_001_002'}
  ${'PSA 101:102'} | ${'019_101_102'}
  ${'MAT 5'}       | ${'041_005_undefined'}
  ${'OBS'}    | ${'100'}
  ${'obs'}    | ${'100'}
  ${'RATS'}   | ${'rats'}
  ${'0'}   | ${'000'}
  ${''}     | ${''}
  ${null}   | ${'null'}
  ${undefined}  | ${'undefined'}
`('normalizeRef of "$testData" should return $expected', ({ testData, expected }) => {
    const results = normalizeRef(testData)
    validateResults('zeroAdjustLength', results, expected, testData);
  });
})


//
// helpers
//

function validateResults(tag, results, expected, testData) {
  if (JSON.stringify(results) !== JSON.stringify(expected)) {
    console.error(`Failure - test of ${tag}('${testData}'): result ${JSON.stringify(results)} !== ${JSON.stringify(expected)} expected`)
  }
  expect(results).toEqual(expected);
}
