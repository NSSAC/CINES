import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { AssignmentReturn } from "@material-ui/icons";
import Formsy from "formsy-react";
import { toast } from "material-react-toastify";
import { FileService } from "node-sciduct";
import React, { useEffect } from "react";
import { useState } from "react";

import { FusePageSimple } from "@fuse";
import { TextFieldFormsy } from "@fuse/components/formsy";

import SelectFileDialog from '../dialogs/SelectFileDialog';

import '../FileManager.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MoveMultiple = ({
  showModal,
  handleClose,
  sourceIDs,
  path,
  selectedCount,
  onMove
}) => {

  const useStyles = makeStyles({
    inputsize: {
      width: 250,
    },
    multilineColor: {
      color: 'white'
    },
    noteStyle: {
      // marginTop: '22px',
      padding: '1px 8px',
      background: 'grey',
      color: 'black',
      fontStyle: 'italic',
      fontSize: 'small',
      fontWeight: 700

    }
  })

  const selectButtonStyle = {
    backgroundColor: '#61dafb',
    fontSize: '12.5px',
    margin: '25px',
    marginBottom: '0',
    padding: '5px',
    color: 'black'
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [destinationPath, setDestinationPath] = useState(decodeURIComponent(path));
  // eslint-disable-next-line 
  const classes = useStyles();
  const onCancel = () => {
    setDestinationPath(path)
    handleClose();
  };

  const moveFiles = async () => {
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const fileServiceInstance = new FileService(url, token)
    let dest = destinationPath
    var requests = sourceIDs.map((item, index) => fileServiceInstance.move(item, dest))
    const responses = await Promise.all(requests);
    const failures = responses.filter((r)=>{ return r instanceof Error })
    const md = { 'failures': failures, 'movedCount': responses.length-failures.length }
    if (failures>0){
      toast.failure(`${failures} files failed to move. ${md.movedCount} files moved to ${dest}`)
    }else{
      toast.success(`${md.movedCount} files moved to ${dest}`)
    }
    // setMoveData(md)
    if (onMove){
      onMove(md)
    }

    if (handleClose){
      handleClose();
    }
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
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

  function showFileManagerDialog() {
    setShowFolderDialog(true);
  }

  function handleFolderClose() {
    setShowFolderDialog(false);
  }

  useEffect(()=>{
    let dest = localStorage.getItem('moveDestPath')
    if(dest !== null){
      setDestinationPath(dest)
    }
  },[])

  return (
    <FusePageSimple
      classes={{ root: 'hideRoot' }}
      header={<React.Fragment>
        {showFolderDialog && <SelectFileDialog
          showModal={showFolderDialog}
          target={destinationPath}
          handleFMClose={handleFolderClose}
          multiple={false}
          onSelect={(p)=>{if (p && p[0]) {setDestinationPath(p[0])}else{setDestinationPath("/")}}}
          fileTypes={["folder"]}
          requireWritePermissions={true}
        />}

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
            {"Move items"}
          </DialogTitle>
          <DialogContent divider="true">
          <div className={classes.noteStyle} style={{marginBottom:'20px'}}>{sourceIDs.length} item(s) selected</div>
            <Formsy
              onValid={enableButton}
              onInvalid={disableButton}
              className="flex flex-col justify-center"
            >

              <div className='flex items-center justify-between'>
                <TextFieldFormsy
                  className={`${classes.inputsize} mt-20`}
                  type="text"
                  multiline
                  id='Destination'
                  name="Destination"
                  label={<span style={{ fontSize: '17px' }}>{'Destination'}</span>}
                  value={destinationPath}
                  inputProps={{
                    className: classes.multilineColor
                  }}
                  autoComplete='off'
                  // onChange={(event) => inputChangedHandler(event)}
                  disabled
                  // onChange={() => (null)}
                  required
                />
                <Button onClick={showFileManagerDialog} style={selectButtonStyle}>
                  &nbsp;Select path
                </Button>
              </div>
            </Formsy>
            <div className={classes.noteStyle} style={{marginTop:'20px'}}>Note- Select path to change the destination</div>
          </DialogContent>

          <DialogActions>
            <Button onClick={moveFiles} startIcon={<AssignmentReturn/>} disabled={!isFormValid || destinationPath === path} variant="contained" size='small' >
              Move
            </Button>

            <Button onClick={onCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>} />
  );
};
