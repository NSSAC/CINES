import React, { useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextFieldFormsy } from "@fuse/components/formsy";
import Formsy from "formsy-react";
import { toast  } from "material-react-toastify";
import { FileService } from "node-sciduct";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RenameFile = ({showModal, handleClose, target,onRename}) => {
  const useStyles = makeStyles({
    inputsize: {
      width: 250,
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const [name, setName] = useState(target.name);
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
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const fileServiceInstance = new FileService(url, token)
    fileServiceInstance.rename(target.id, name).then(
      (res) => {
        toast.success(`'${target.name}' renamed to '${name}'`)
        handleClose()
        if (onRename){
          onRename(target.id,name)
        }
      },

      (error) => {
        toast.error(`An error occured while trying to rename ${target.name}: ${error}`)
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

  useEffect(() => {
    setTimeout(() => {
      ref.current && ref.current.focus()
    }, 1000);
  })

  return (
    <React.Fragment>
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
          {"Rename file / folder"}
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
              value={target.name}
              autoComplete='off'
              on
              onChange={(event) => inputChangedHandler(event)}
              validations={{
                isPositiveInt: function (values, value) {
                  return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value) && value.trim() !== '';
                },
              }}
              validationError="This is not a valid value"
              required
            />
          </Formsy>
        </DialogContent>

        <DialogActions>
          <Button disabled={!isFormValid || ref.current === null || (ref.current && ref.current.value === target.name)} onClick={onSubmit}>
            Rename
          </Button>

          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
