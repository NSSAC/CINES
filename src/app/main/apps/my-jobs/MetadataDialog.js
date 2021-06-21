import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import './MetadataDialog.css';

function MetadataInfoDialog(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const handleCancel = () => {
    props.closedialog()
  };

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
    <Dialog
      style={{ pointerEvents: 'auto' }}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.opendialog}
      scroll='paper'
      onEntered={onEntered}
      onExiting={onExiting}
      {...other}
    >
      <DialogTitle > {props.headertitle}</DialogTitle>
      <DialogContent dividers>
        {typeof (props.standardout) === 'object' ?  <pre>{JSON.stringify(props.standardout, null, 2).replace(/T/g, " ").replace(/Z/g, "")}</pre> : <pre>{props.standardout}</pre>}
      </DialogContent>

      <DialogActions>
        <Button variant='contained' onClick={handleCancel} color="primary">
          Close
        </Button>

      </DialogActions>
    </Dialog>
  );
}
export default MetadataInfoDialog;
