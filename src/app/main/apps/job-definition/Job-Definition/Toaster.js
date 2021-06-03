import React from 'react';
import 'react-responsive-modal/styles.css';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';

function Toaster(props) {

  return (
    ReactDOM.createPortal(<div>
       {props.success === false && toast.error(props.errorMsg)}
       {props.success === true && toast.success(`'${props.id}' job submitted successfully`)}
      <ToastContainer limit={1} bodyStyle={{fontSize:"14px"}} position="top-right" />
    </div>, document.getElementById("portal"))

  )

}
export default Toaster;