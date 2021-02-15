import React from 'react';
import 'react-responsive-modal/styles.css';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
function Toaster(props){
 
if(props.success === false){
  return (
    <div> {ToastsStore.error("An error occurred. Please try again.")}
    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
   )
}

else {
 
  return (
    <div> {ToastsStore.success(`'${props.id}'` + " job submitted successfully")}
    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
    
)
}

}
export default Toaster;