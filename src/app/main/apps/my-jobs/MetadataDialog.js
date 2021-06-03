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

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.opendialog}
      {...other}
    >
      <DialogTitle > {props.headertitle}</DialogTitle>
      <DialogContent dividers>
        {typeof(props.standardout) === 'object' ? Object.values(props.standardout).map(a=><pre>{JSON.stringify(a)}</pre>) : <pre>{props.standardout}</pre>}
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
