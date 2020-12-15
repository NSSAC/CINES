import { FuseAnimate } from '@fuse/index.js';
import { Button, Fab, Icon, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FileUpload } from '../../file-manager/FileUpload/FileUploadDialog.js';
import  FMPopup  from './file-manager-dialog/FileManagerDialog.js';
import './JobDefinitionForm.css'
import InfoIcon from '@material-ui/icons/Info';

function JobDefinitionForm(props) {
    
    const [showFMDialog, setShowFMDialog] = useState(false);
    const [showDialog, setshowDialog] = useState(false);

    const buttonStyle={
        backgroundColor: 'lightgrey',
        margin: '5px',
        padding: '6px',
        color:'black'
    }

    function showFileManagerDialog() {
        setShowFMDialog(true)
    }

    function handleFMClose() {
        setShowFMDialog(false)
        //  childRef.current.getAlert()
    }

    return (
        <div style={{paddingLeft:'10px'}}>
            <div className="flex" style={{borderBottom:'1px solid black'}}>
                <Typography variant="h6">{props.selectedJob.id}</Typography>
                <Tooltip title={props.selectedJob.description}  placement="right">
                  <div><Icon fontSize='small'>info</Icon></div>
                </Tooltip> 
            </div>
            <FMPopup showModal={showFMDialog} handleFMClose={handleFMClose} props={props}></FMPopup>
            <div>
                <h3 style={{marginTop:'5px'}}><b>Input</b></h3>
             <form>
                <label>
                    Snap graph : 
                    <input type="button" style={buttonStyle}  onClick={showFileManagerDialog} value='&nbsp;Select file'></input>        
                </label>
                <br></br>
                <br></br>
                <input type="submit"  style={buttonStyle} value="Submit" />
                <Link to="/apps/job-definition/"><input type="button"  style={buttonStyle}  value="Cancel" /></Link>

             </form>
            </div>
        </div>
    )
}

export default JobDefinitionForm;