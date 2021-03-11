import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useState } from "react";
import * as Actions from "../store/actions";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse/components/formsy";
import Formsy from "formsy-react";
import axios from "axios";
import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateFolder = ({
  allFilesType,
  fileTypes,
  setUploadFile,
  dialogTargetPath,
  setShowModal,
  showModal,
  handleClose,
  breadcrumbArr,
}) => {
  const useStyles = makeStyles({
    inputsize: {
      width: 250,
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [ message,setMessage] = useState("");
// eslint-disable-next-line 
  const [flag ,setFlag] =useState(true);
  const classes = useStyles();
  const onCancle = () => {
    handleClose();
    if (dialogTargetPath) setShowModal(true);
  };

  function inputChangedHandler(event) {
    setStatus("")
    setMessage("")
    setName(event.target.value);
  }
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function onSubmit() {
   
    const userToken = localStorage.getItem("id_token");
    let target = window.location.pathname;
    let targetPath = target.replace("/apps/files", "");
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetPath}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      data: {
        name: name,
        type: "folder",
      },
    }).then(
      (res) => {
        let folderName =name
        setFlag(true)
        setName("")
        progressStatus("Folder " + folderName  +  " created successfully",true );
        dispatch(Actions.getFiles(targetPath, "GET_FILES"));
     
      },

      (error) => {
        setFlag(false)
        if (error.response.data.message === "File already exists") {
          progressStatus("Folder already exists " ,false);
        } else if (
          error.response.data.message ===
          "data.type should be equal to one of the allowed values"
        ) {
          progressStatus("Failed (unsupported folder type) ",false);
        } else {
          progressStatus(
            "Unsupported folder name. Special characters '-_.'are allowed" ,false
          );
        }
     
      }
    );
  }

  function progressStatus(message ,status) {
    setMessage(message);
    setStatus(status)
  }
  return (
    <React.Fragment>
      <Dialog
        className="w-500"
        open={showModal}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">
          {"Create Folder"}
        </DialogTitle>
        <DialogContent divider="true">
          <Formsy
            onValid={enableButton}
            onInvalid={disableButton}
            className="flex flex-col justify-center"
          >
            <TextFieldFormsy
              className={classes.inputsize}
              type="text"
              name="name"
              label="Enter folder name"
              value={name}
              autoComplete='off'
              onChange={(event) => inputChangedHandler(event)}
              validations={{
                minLength: 1,
              }}
              validationErrors={{
                minLength: "Min character length is 1",
              }}
              required
            />
          </Formsy>

          <div>
            { status ?
              <p style={{marginTop:12}}>
              {message}
              <Icon>check_circle</Icon>
            </p>:<p style={{marginTop:12}}>
              {message}
            
            </p>
            }
          </div>
        </DialogContent>

        <DialogActions>
          <Button disabled={!isFormValid } onClick={onSubmit}>
            Create
          </Button>

          <Button onClick={onCancle}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
