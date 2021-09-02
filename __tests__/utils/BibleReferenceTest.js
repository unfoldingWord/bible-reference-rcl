import React from 'react'
import PropTypes from 'prop-types'
import BibleReference, { useBibleReference } from "../../src";
import {Button, Card, CardActions, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

BibleReferenceTest.propTypes = {
  /** current bookId (e.g. 'mrk') */
  initialBook: PropTypes.string.isRequired,
  /** current chapter */
  initialChapter: PropTypes.string.isRequired,
  /** current verse */
  initialVerse: PropTypes.string.isRequired,
  /** onChange callback */
  onChange: PropTypes.func
}

export function BibleReferenceTest(props) {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    onChange,
    onPreChange,
    stateCallback,
  } = props;
  const style = {}; // use defaults

  const initial =
    {
      initialBook,
      initialChapter,
      initialVerse,
      onChange,
      onPreChange,
    };

  const {state, actions} = useBibleReference(initial);

  stateCallback && stateCallback(state, actions) // update calling program with latest state and actions

  return(
    <div>
      <br/>
      <br/>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <BibleReference
          status={state}
          actions={actions}
          style={style}
        />
      </div>

      <br/>
      <br/>

      <Card variant="outlined">
        <CardContent>
          <Typography
            style={{fontWeight: "bold"}}
            color="textPrimary"
            display="inline"
          >
            {`bible-reference-rcl`}
          </Typography>
          <Typography color="textPrimary" display="inline">
            {`\u00A0component is shown above ^^^`}
          </Typography>
          <br/>
          <br/>
          <Typography
            style={{fontWeight: "bold"}}
            color="textPrimary"
            display="inline"
          >
            {`bible-reference-rcl`}
          </Typography>
          <Typography color="textPrimary" gutterBottom display="inline">
            {`\u00A0state examples below (dynamically updated as reference changes):`}
          </Typography>
          <br/>
          <br/>
          <Typography
            style={{marginLeft: "50px"}}
            color="textPrimary"
            gutterBottom
            display="inline"
          >
            {`Book Name:\u00A0`}
          </Typography>
          <Typography
            style={{fontWeight: "bold"}}
            color="textPrimary"
            gutterBottom
            display="inline"
          >
            {`${state.bookName}`}
          </Typography>
          <br/>
          <Typography
            style={{marginLeft: "50px"}}
            color="textPrimary"
            gutterBottom
            display="inline"
          >
            {`Current Location:\u00A0`}
          </Typography>
          <Typography
            style={{fontWeight: "bold"}}
            color="textPrimary"
            gutterBottom
            display="inline"
          >
            {`${state.bookId} ${state.chapter}:${state.verse}`}
          </Typography>
        </CardContent>

        <CardActions>
          <Typography color="textPrimary">
            {`action examples that are using API to change the current reference:`}
          </Typography>

          <Button
            variant="outlined"
            id="prev_v"
            onClick={actions.goToPrevVerse}
          >
            {"Previous Verse"}
          </Button>

          <Button
            variant="outlined"
            id="next_v"
            onClick={actions.goToNextVerse}
          >
            {"Next Verse"}
          </Button>

          <Button variant="outlined" id="prev_c" onClick={actions.goToPrevChapter}>
            {"Previous Chapter"}
          </Button>

          <Button variant="outlined" id="next_c" onClick={actions.goToNextChapter}>
            {"Next Chapter"}
          </Button>
        </CardActions>
      </Card>

    </div>
  )

}

export default BibleReferenceTest
