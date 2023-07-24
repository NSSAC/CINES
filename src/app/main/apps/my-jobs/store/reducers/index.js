import {combineReducers} from 'redux';
import myjobs from './myjobs.reducer';
import selectedjobid from './selectedjobid';
import jobDef from './jobDefinitions.reducer';
import childJob from './child.reducer'

const reducer = combineReducers({
    myjobs,
    selectedjobid,
    jobDef,
    childJob
});

export default reducer;
