import React, {useRef} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useState } from "react";
import * as Actions from "./store/actions";
import { makeStyles } from "@material-ui/core/styles";
import { TextFieldFormsy } from "@fuse/components/formsy";
import Formsy from "formsy-react";
import { useDispatch} from "react-redux";
import { toast, ToastContainer } from "material-react-toastify";
import ReactDOM from 'react-dom';
import { FileService } from "node-sciduct";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RenameFile = ({
  showModal,
  handleClose,
  selectedItem
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
  const [errorMsg, setErrorMsg] = useState('An error occured. Please try again');
  const dispatch = useDispatch();
  const [name, setName] = useState(selectedItem.name);
  // eslint-disable-next-line 
  const classes = useStyles();
  const ref = useRef()
  const onCancel = () => {
    setName("");
    handleClose();

  };

  function inputChangedHandler(event) {
    setName(event.target.value.trim());
  }
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function onSubmit() {
    let target = window.location.pathname;
    let targetPath = target.replace("/apps/files", "");
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const fileServiceInstance = new FileService(url, token)
    fileServiceInstance.rename(selectedItem.id, name).then(
      (res) => {
        setSuccess(true)
        setSuccess(false)
        handleClose()
        dispatch(Actions.getFiles(targetPath, "GET_FILES"));
    },

      (error) => {
        setTimeout(() => {
          setError(true)
          setError(false)
        }, 1000);

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
       
        {success === true && <div> {toast.success(`'${selectedItem.name}' renamed to '${name}'`)}</div>}
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
          {"Rename file/folder"}
        </DialogTitle>
        <DialogContent divider="true">
          <Formsy
            onValid={enableButton}
            onInvalid={disableButton}
            className="flex flex-col justify-center"
          >
            <TextFieldFormsy
            inputRef={ref}
              className={classes.inputsize}
              type="text"
              name="name"
              // label="Rename file"
              value={selectedItem.name}
              autoComplete='off'
              on
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
          <Button disabled={!isFormValid || ref.current === null || (ref.current && ref.current.value === selectedItem.name)} onClick={onSubmit}>
            Rename
          </Button>

          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
