import React, { useState } from 'react';
import {Icon, IconButton, Tooltip} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {useSelector} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import "../file-manager/Confirm-alert.css";
import CancelJob from './CancelJob';

function DetailSidebarHeader(props)
{

    const selectedItem = useSelector(({myJobsApp}) => myJobsApp.selectedjobid);
    const [cancelJob, setCancelJob] = useState(false);
    var stateFlag = false;

    if ( !selectedItem )
    {
        return null;
    }

    function onCancel(item) {
        localStorage.setItem("cancel_id",item.id)
        confirmAlert({
          title: 'Confirm',
          message: `Are you sure you want to cancel job ${item.id}?`,
          buttons: [
            { 
              label: 'No',
              onClick: (null)
            },
            {
              label: 'Yes',
              onClick: () => onAccept()
            }
          ],
          closeOnClickOutside: false
        })
      }

      function onAccept() {
        setCancelJob(true)
      }

      function onRerun(item) {
        var target = window.location.pathname.replace('my-jobs','job-definition') + item.job_definition.split('@')[0];
        props.history.push({
          pathname: target,
          state: { inputData: item }
      });
        localStorage.setItem('resubmitJob',JSON.stringify(item))

      }

      function checkstate(){
        var stateArr = ['Completed', 'Failed', 'Cancelled']
        stateArr.map(state=>{
          if(selectedItem.state === state)
            stateFlag = true
            return null;
          })
      }

      checkstate()


    return (
        <div className="flex flex-col justify-between h-full p-4 sm:p-12">
             <div className="toolbar flex align-center justify-end h-48">
             { cancelJob?<CancelJob id={selectedItem.id} setCancelJob={(p)=> setCancelJob(p)} ></CancelJob>:null}
               {!stateFlag && <FuseAnimate animation="transition.expandIn" delay={200}>
                  <Tooltip title="Cancel job" placement="bottom">
                    <IconButton onClick={()=>onCancel(selectedItem)} >
                        <Icon >cancel_presentation</Icon>
                    </IconButton>
                  </Tooltip>
                </FuseAnimate>}

                <FuseAnimate animation="transition.expandIn" delay={200}>
                  <Tooltip title="Resubmit job" placement="bottom">
                    <IconButton onClick={()=>onRerun(selectedItem)} >
                        <Icon >autorenew</Icon>
                    </IconButton>
                  </Tooltip>
                </FuseAnimate>
                </div>
        </div>
    );
}

export default React.memo(DetailSidebarHeader);
