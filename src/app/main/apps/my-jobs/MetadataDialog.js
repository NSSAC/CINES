import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import './MetadataDialog.css';

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

function MetadataInfoDialog(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);

  const handleCancel = () => {
    props.closeDialog()
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.openDialog}
      {...other}
    >
      <DialogTitle > {props.headerTitle}</DialogTitle>
      <DialogContent dividers>
        <pre>{props.standardOut}</pre>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Close
        </Button>

      </DialogActions>
    </Dialog>
  );
}
export default MetadataInfoDialog;
