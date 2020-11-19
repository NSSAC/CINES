import {combineReducers} from 'redux';
import myjobs from './myjobs.reducer';
import selectedjobid from './selectedjobid';

const reducer = combineReducers({
    myjobs,
    selectedjobid,
    
});

export default reducer;
