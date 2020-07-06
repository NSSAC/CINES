import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import  './Idledialog.css'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const IdleTimeOutDialog = ({showModal, handleClose, handleLogout, remainingTime}) => {
  //const [open, setOpen] = React.useState(false);


  return (
    <div>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"You Have Been Idle!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          You Will Get Timed Out. You want to stay?.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
          <Button onClick={handleClose} color="primary">
            Stay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
