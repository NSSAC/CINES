import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useState} from 'react';
import * as Actions from '../store/actions';

import {
	TextFieldFormsy
} from '@fuse/components/formsy';
import Formsy from "formsy-react";

import axios from 'axios';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateFolder = ({ allFilesType,fileTypes, setUploadFile, dialogTargetPath, setShowModal, showModal, handleClose, breadcrumbArr }) => {
  
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
 const [name , setName] = useState("")
  const onCancle = () => {
    handleClose()
    if (dialogTargetPath)
      setShowModal(true);
  }

  function inputChangedHandler(event)
  {
     setName(event.target.value)
  }
  function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
    }


function onSubmit(){
    const userToken = localStorage.getItem('id_token')
    let target = window.location.pathname;
   
    let targetPath = target.replace("/apps/files", "")
    return axios({
        method: 'post',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetPath}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,

        },
        data: {
          "name": name,
          "type": 'folder'
        },
      }).then(res => {
        dispatch(Actions.getFiles(targetPath, 'GET_FILES'));
      },

        (error) => {
          if (error.response.data.message === "File already exists") {
           //progressStatus("Failed (Folder already exist) 0",);
          }

          else if (error.response.data.message === "data.type should be equal to one of the allowed values") {
            //progressStatus("Failed (unsupported file type) 0", );
          }
          else {
            //progressStatus("Failed (unsupported file name only '-_.'are allowed) 0",);
          }
        }
      )
    };

   
  return (
    <React.Fragment>
      <Dialog className="w-500"
        open={showModal}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">{"Create Folder"}</DialogTitle>
        <DialogContent divider="true">
        <Formsy
               
                onValid={enableButton}
                onInvalid={disableButton}
                className="flex flex-col justify-center"
            >
                <TextFieldFormsy
                    className="mb-16"
                    type="text"
                    name="name"
                    label="Enter folder name"
                    value={name}
                    onChange={(event) => inputChangedHandler(event)}
                    validations={{
                        minLength: 1
                    }}
                    validationErrors={{
                        minLength: 'Min character length is 1'
                    }}
                    required
                />

          
        <DialogActions>     
        <Button 
              disabled={!isFormValid}
              onClick ={onSubmit}
        >
            Create  
          </Button>

          <Button onClick={onCancle}>
            Close
          </Button>
        </DialogActions>
        
                </Formsy>
          {/* <input className={classes.input} ref={fileInput} type="file" multiple onChange={onChangeHandler} />
          <button className={classes.customeButton} onClick={openFileDialog} type="button" >Choose File</button> */}
        </DialogContent>

      </Dialog>
    </React.Fragment>
  );
}
