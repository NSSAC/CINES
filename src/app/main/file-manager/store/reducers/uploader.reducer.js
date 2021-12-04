import * as Actions from '../actions';
import {toast} from "material-react-toastify"

const initialState = {
    queue: [],
    completed:[],
    activeCount: 0, 
    activeTotal: 0, 
    activeLoaded: 0, 
    completedCount:0, 
    completedTotal:0,
    total_progress: 0
}

function notify(file){
    if (file.failed){
        toast.error(`Upload failed for ${file.fileName} : ${file.error}`,{autoClose:false})
    }else if (file.completed) {
        toast.success(`Upload completed for ${file.fileName}`)
    }
}

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.UPLOADS_ADDED:
            return {
                ...state,
                queue: action.payload
            }
        case Actions.UPLOAD_PROGRESS:
            var data = {activeCount: 0, activeTotal: 0, activeLoaded: 0, completedCount:0, completedTotal:0, failed:0}
            state.queue.forEach((f)=>{
                data.activeCount++
                data.activeTotal += f.total
                data.activeLoaded += f.loaded
            })
            state.completed.forEach((f)=>{
                if (f.failed){
                    data.failed++
                }else {
                    data.completedCount++
                    data.completedTotal += f.total
                }
            })
            return {
                ...state,
                ...data,
                total_progress: (data.activeCount>0)?Math.floor((data.activeLoaded)/(data.activeTotal)*100):0
            }
        case Actions.UPLOAD_COMPLETED:
            // toast.success("File upload complete", action.payload)
            action.payload.recent.forEach(notify)

            return {
                ...state,
                ...action.payload           
            }
        case Actions.UPLOAD_FAILED:
            // toast.success("File upload complete", action.payload)
            action.payload.recent.forEach(notify)
            return {
                ...state,
                ...action.payload           
            }
        case Actions.VALIDATION_RESULTS:
            return {
                ...state,
                validated: action.payload
            }
        default:
            return state;
    }
};

export default reducer;