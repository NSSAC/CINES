import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useState } from "react";
import * as Actions from "../store/actions";
import * as ActionsHome from "app/main/apps/job-definition/Job-Definition/file-manager-dialog/store/actions";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse/components/formsy";
import Formsy from "formsy-react";
import { useDispatch } from "react-redux";
import DialogContentText from '@material-ui/core/DialogContentText';
import { toast, ToastContainer } from "material-react-toastify";
import ReactDOM from 'react-dom';
import { FileService } from "node-sciduct";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateFolder = ({

  dialogTargetPath,
  setShowModal,
  showModal,
  handleClose,
  breadcrumbArr,
  isFolderManager
}) => {
  const useStyles = makeStyles({
    inputsize: {
      width: 250,
    },
  });

  const breadcrumb_wrap = {
    width: '100%',
    flexWrap: 'wrap'
  }

  const ellipsis = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '170px',
    cursor: 'default'
  }


  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  // eslint-disable-next-line 
  const classes = useStyles();
  const onCancle = () => {
    setName("");
    handleClose();

  };

  function inputChangedHandler(event) {
    setName(event.target.value);
  }
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function onSubmit() {

    let target = window.location.pathname;
    if (dialogTargetPath) {
      target = dialogTargetPath;
    }
    let targetPath = target.replace("/apps/files", "");
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const fileServiceInstance = new FileService(url, token)
    let metadata = {
      "name": name,
      "type": 'folder'
  }
  return fileServiceInstance.create(targetPath,metadata).then(
      (res) => {
        setSuccess(true)
        setSuccess(false)
        setName("")
        if (isFolderManager === true)
          dispatch(ActionsHome.getHome(targetPath.replace('/home/', '')));
        else
          dispatch(Actions.getFiles(targetPath, "GET_FILES"));
        handleClose()
      },

      (error) => {
        setTimeout(() => {
          setError(true)
          setError(false)
        }, 1000);
       
        if (error.response.message === "File already exists") {
          setErrorMsg("Folder already exists");
        } else if (
          error.response.message ===
          "data.type should be equal to one of the allowed values"
        ) {
          setErrorMsg("Failed (unsupported folder type) ");
        } else {
          setErrorMsg(
            "Unsupported folder name. Special characters '-_.'are allowed"
          );
        }

      }
    );
  }

  function onEntered() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    }

  }

  function onExiting() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
    }
  }


  return (
    <React.Fragment>
      {ReactDOM.createPortal(<div>
        {error === true && <div> {toast.error(errorMsg)}</div>}

        {success === true && <div> {toast.success(`Folder '${name}' created successfully`)}</div>}
        <ToastContainer limit={1} bodyStyle={{ fontSize: "14px" }} position="top-right" />
      </div>, document.getElementById("portal"))}
      <Dialog
        className="w-500"
        open={showModal}
        TransitionComponent={Transition}
        onEntered={onEntered}
        onExiting={onExiting}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">
          {"Create folder"}
        </DialogTitle>
        <DialogContent divider="true">
          <DialogContentText className='mb-0' id="alert-dialog-slide-description">
            {breadcrumbArr ? <span className="flex text-16 sm:text-16" style={breadcrumb_wrap}>
              {breadcrumbArr.map((path, i) => (
                <span key={i} className="flex items-center" >
                  <span title={path} style={ellipsis} >{path} </span>
                  {breadcrumbArr.length - 1 !== i && (
                    <Icon>chevron_right</Icon>
                  )}
                </span>))}
            </span> : null}
          </DialogContentText>
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
                isPositiveInt: function (values, value) {
									return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value);
                },
              }}
              validationError="This is not a valid value"
              required
            />
          </Formsy>
        </DialogContent>

        <DialogActions>
          <Button disabled={!isFormValid} onClick={onSubmit}>
            Create
          </Button>

          <Button onClick={onCancle}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
