import React from 'react';
import { Grid } from "@material-ui/core";


function DatasetLanding({ dataset }) {
  return (
    <div>
      <ul style={{paddingLeft:"40px", paddingRight:"40px"}}>
        {Object.entries(dataset).map(([key, value]) => (
          <li key={key}>
            <Grid container direction="row" alignItems="center">
              <Grid item md={3}>
                <strong>{key}:</strong>
              </Grid>
              <Grid item md={9}>
                {value}
              </Grid>
            </Grid>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DatasetLanding;