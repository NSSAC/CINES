import { FuseAnimate, FusePageSimple } from '@fuse/index.js';
import { Button, Fab, Icon, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FileUpload } from '../../file-manager/FileUpload/FileUploadDialog.js';
import  FMPopup  from './file-manager-dialog/FileManagerDialog.js';
import './JobDefinitionForm.css'

function JobDefinitionForm(props) {
    
    const [showFMDialog, setShowFMDialog] = useState(false);
    const [showDialog, setshowDialog] = useState(false);
    const [fileChosen, setFileChosen] = useState("");


    const selectButtonStyle={
        backgroundColor: '#61dafb',
        fontSize: 'inherit',
        margin: '5px',
        padding: '6px',
        color:'black'
    }

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

    const onFormCancel = () => {
        localStorage.removeItem('selectedJobDefinition')
    }

    return (
        <FusePageSimple
        classes={{
            root: "bg-red",  
            header: "headerDisplay"
        }}

        header={
            <FMPopup showModal={showFMDialog} setShowModal={(p)=>setShowFMDialog(p)} handleFMClose={handleFMClose} setFileChosen={(p)=>setFileChosen(p)} props={props}></FMPopup>
        }

        content={
        <div style={{paddingLeft:'10px'}}>
            <div className="flex" style={{borderBottom:'1px solid black'}}>
                <Typography variant="h6">{props.selectedJob.id}</Typography>
                <Tooltip title={<h4>{props.selectedJob.description}</h4>}  placement="right">
                  <div style={{marginLeft:'3px'}}><Icon fontSize='small'>info</Icon></div>
                </Tooltip> 
            </div>
            <div>
                  <h3 style={{marginTop:'5px'}}><b>Input</b></h3>
             <form>
                <label>
                    Snap graph : 
                    <input type="button" style={selectButtonStyle}  onClick={showFileManagerDialog} value='&nbsp;Select file'></input>        
                </label>
                <span>{fileChosen == ""?"No file chosen":<b>{fileChosen}</b>}</span>
                <br></br>
                <br></br>
                <label>
                    srcColId:
                    <input class="formText" type="text" name="name" />
                </label>
                <br></br>
                <br></br>
                <label>
                    destColId:
                    <input class="formText" type="text" name="name" />
                </label>
                <br></br>
                <br></br>
                <input type="submit"  style={buttonStyle} value="SUBMIT" />
                <Link to="/apps/job-definition/"><input type="button"  style={buttonStyle} onClick={onFormCancel}  value="CANCEL" /></Link>

             </form>
            </div>
        </div>}/>
    )
}

export default JobDefinitionForm;