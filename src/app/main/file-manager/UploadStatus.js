import React from "react";
// import { Icon, LinearProgress, Typography } from "@material-ui/core";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";



function UploadStatus(props) {
    const dispatch = useDispatch()
    const uploader = useSelector(({ fileManagerApp }) => fileManagerApp.uploader);
    React.useEffect(() => {
        if (!uploader) {
            dispatch(Actions.getUploaderStatus())
        }
    }, [dispatch, uploader])
    //   if (!uploader){
    //       return null
    //   }
  
    return (
        <div>
            {uploader && (uploader.activeCount>0) && uploader.queue && (uploader.queue.length>0)&& (<span>Uploading: <span>{uploader.total_progress}</span></span>)}
        </div>
    )
}


export default withReducer("fileManagerApp", reducer)(UploadStatus);
