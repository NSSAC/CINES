import React, {useState, useEffect} from 'react';
import 'react-responsive-modal/styles.css';
import * as Actions from './store/actions';
import { useDispatch } from 'react-redux';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

function Toaster(props){
  const [error, setError] = useState(false);
  const [success, setSuccess]= useState(false);
  var token=localStorage.getItem('id_token')
  var currPath = window.location.pathname.replace("/apps/files","")
  const dispatch = useDispatch();

 
if(error === true)
return (
  <div> {ToastsStore.error("An error occurred. Please try again.")}
  <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
 )
else 
return (
     <div> {ToastsStore.success(`'${props.name}'` + " ")}
     <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
 )
}
export default Toaster;