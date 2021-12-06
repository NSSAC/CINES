import React, { useRef } from "react";
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
import * as Actions from "../store/actions";
import reducer from "../store/reducers"
import withReducer from "app/store/withReducer";
import { useDispatch, useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  inputsize: {
    width: 250,
  },
});


export const EditFileProperty = (props) => {
  const dispatch = useDispatch()
  const [value,setValue] = useState(props.value)
  const [property,setProperty] = useState(props.property)
  const [isFormValid, setIsFormValid] = useState(false);
  const usermeta = useSelector(({ fileManagerApp }) => fileManagerApp.usermeta);
  // eslint-disable-next-line 
  const classes = useStyles();
  const ref = useRef()

  React.useEffect(()=>{
    setProperty(props.property)
  },[props.property])

  // React.useEffect(()=>{
  //   setValue(props.value)
  // },[props.value])
  React.useEffect(()=>{
    console.log("EditFile props: ", props)
  },[props])

  React.useEffect(()=>{
    if (usermeta && (usermeta.success===true) && props.handleClose){
      dispatch(Actions.resetUsermetaEditor())
      props.handleClose()
    }
  },[dispatch,props, usermeta,usermeta.success])

  const onCancel = () => {
    dispatch(Actions.resetUsermetaEditor())
    if (props.handleClose){
      props.handleClose();
    }
  };

  function onPropertyValueChanged(event) {
    console.log("Property Value Changed", event.target.value)
    setValue(event.target.value)
  }

  function onPropertyNameChanged(event) {
    console.log("Property Name Changed", event.target.value)
    setProperty(event.target.value)
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function onSubmit() {
    console.log(`onSubmit ${property} ${value}`)
    dispatch(Actions.setUserMeta(props.file,property,value))
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
  console.log("props.value: ", props.value, "value: ", value)
  const hasChanged = props.value !== value
  // useEffect(() => {
  //   setTimeout(() => {
  //     ref.current && ref.current.focus()
  //   }, 1000);
  // })

  return (

      <Dialog
        className="w-500"
        open={true}
        TransitionComponent={Transition}
        onEntered={onEntered}
        onExiting={onExiting}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">
          {!props.property && <span>Add Property</span>}
          {props.property && <span>Edit Value</span>}
        </DialogTitle>
        <DialogContent divider="true">
          <Formsy
            onValid={enableButton}
            onInvalid={disableButton}
            className="flex flex-col justify-center"
          >
            <TextFieldFormsy
              inputRef={ref}
              className={`${classes.inputsize} m-8`}
              variant="outlined"
              type="text"
              name="property"
              // label="Rename file"
              value={props.property}
              disabled={!!props.property}
              placeholder="Property Name"
              autoComplete='off'
              on
              onChange={(event) => onPropertyNameChanged(event)}
              validations={{
                isPositiveInt: function (values, value) {
                  if (!value) { return false}
                  return RegExp(/^([0-9]|[a-zA-Z]|[_\-\s])+$/).test(value) && value.trim() !== '';
                },
              }}
              validationError="This is not a valid value"
              required
            />
            <TextFieldFormsy
              inputRef={ref}
              className={`${classes.inputsize} m-8`}
              variant="outlined"
              placeholder="Value"
              type="text"
              name="value"
              // label="Rename file"
              value={props.value}
              autoComplete='off'
              on
              onChange={(event) => onPropertyValueChanged(event)}
              validationError="This is not a valid value"
            />
          </Formsy>
        </DialogContent>

        <DialogActions>
          <Button disabled={!isFormValid || (usermeta&&usermeta.updating) || !hasChanged} onClick={onSubmit}>
            {props.property?"Save":"Add Property"}
          </Button>

          <Button onClick={onCancel}>{hasChanged?"Cancel":"Close"}</Button>
        </DialogActions>
      </Dialog>

  );
};
export default withReducer("fileManagerApp", reducer)(EditFileProperty);