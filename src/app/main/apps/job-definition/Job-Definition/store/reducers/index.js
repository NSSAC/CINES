import { combineReducers } from 'redux';

import all_job_definitions from './all_job_definitions.reducer';
import job_definition from './job_definition.reducer';
import selectedjobid from './selectedjobid.reducer';

const reducer = combineReducers({
    all_job_definitions,
    selectedjobid,
    job_definition    
});

export default reducer;
