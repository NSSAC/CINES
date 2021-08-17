import React, { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "material-react-toastify";
import ReactDOM from 'react-dom';
import { FileService } from "node-sciduct";
import { FusePageSimple } from "@fuse";
import FolderPopup from './file-manager-dialog/FolderManagerDialog.js';
import * as Actions from './store/actions';
import './FileManager.css'
import { AssignmentReturn} from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MoveMultiple = ({
  showModal,
  handleClose,
  selectedItems,
  selectedCount,
  setMoveAll
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

  var path = window.location.pathname.replace("/apps/files", "")
  const [isFormValid, setIsFormValid] = useState(false);
  const [moveData, setMoveData] = useState({ 'errorArr': [], 'movedCount': 0 });
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [destinationPath, setDestinationPath] = useState(path);
  const dispatch = useDispatch();
  // eslint-disable-next-line 
  const classes = useStyles();
  const onCancel = () => {
    setDestinationPath(path)
    handleClose();
  };

  const onMove = async () => {
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const fileServiceInstance = new FileService(url, token)
    let src = window.location.pathname.replace("/apps/files", "");
    let dest = destinationPath
    localStorage.setItem('moveDestPath',dest)

    let newError = [];
    var tempCount = 0
    var requests = selectedItems.map((item, index) => fileServiceInstance.move(src + item.name, dest).then(response => {
      tempCount = tempCount + 1
    })
      .catch(error => {
        newError = newError.concat(moveData.errorArr);
        newError.push(item)
      }))

    await Promise.all(requests);
    setMoveData({ 'errorArr': newError, 'movedCount': tempCount })
    setMoveAll(false)
    dispatch(Actions.getFiles(path, "GET_FILES"));
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
        {ReactDOM.createPortal(<div>
          {moveData.movedCount !== 0 && <div> {toast.success(`${moveData.movedCount} item(s) moved successfully`)}</div>}
          {moveData.errorArr.length > 0 && moveData.errorArr.map(errorItem => <div key={errorItem.id}> {toast.error(`An error occured while moving '${errorItem.name}'`)}</div>)}
          <ToastContainer bodyStyle={{ fontSize: "14px" }} position="top-right" />
        </div>, document.getElementById("portal"))}
        {showFolderDialog && <FolderPopup
          showModal={showFolderDialog}
          handleFMClose={handleFolderClose}
          folderPath={destinationPath}
          setFolderPath={(p) => setDestinationPath(p)}
          fileTypes={["folder", "epihiper_multicell_analysis", "epihiperOutput"]}
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
          <div className={classes.noteStyle} style={{marginBottom:'20px'}}>{selectedCount} item(s) selected</div>
            <Formsy
              onValid={enableButton}
              onInvalid={disableButton}
              className="flex flex-col justify-center"
            >
              <TextFieldFormsy
                className={classes.inputsize}
                type="text"
                name="Source"
                label={<span style={{ fontSize: '17px' }}>{'Source'}</span>}
                value={path}
                autoComplete='off'
                disabled
                required
              />

              <div className='flex items-center justify-between'>
                <TextFieldFormsy
                  className={`${classes.inputsize} mt-20`}
                  type="text"
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
            <Button onClick={onMove} startIcon={<AssignmentReturn/>} disabled={!isFormValid || destinationPath === path} variant="contained" size='small' >
              Move
            </Button>

            <Button onClick={onCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>} />
  );
};
