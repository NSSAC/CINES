import { Icon, IconButton, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useSelector } from 'react-redux';

import { FuseAnimate } from '@fuse';

import CancelJob from './CancelJob';

import "../file-manager/Confirm-alert.css";

function DetailSidebarHeader(props)
{
    const files = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
    const selectedItem = useSelector(({myJobsApp}) => myJobsApp.selectedjobid);
    const [cancelJob, setCancelJob] = useState(false);
    var stateFlag = false;

    if ((files.payload && files.payload.length === 0) || !selectedItem || (Object.keys(selectedItem).length === 0 && selectedItem.constructor === Object))
    {
        return null;
    }

    function onCancel(item) {
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
        var parts = item.job_definition.split("@")
        
        var target = window.location.pathname.replace(`my-jobs/${item.id}`,'job-definition/').replace('my-jobs','job-definition') + parts[0];
        props.history.push({
          pathname: target,
          search: "?version=" + parts[1],
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

if((Object.values(files).length !== 0))
    return (
        <div className="flex flex-col justify-between h-full p-4 sm:p-12">
             <div className="toolbar flex align-center justify-end h-48">
             { cancelJob?<CancelJob  pageLayout={props.pageLayout} id={selectedItem.id} setCancelJob={(p)=> setCancelJob(p)} ></CancelJob>:null}
               {selectedItem.job_definition && !stateFlag && <FuseAnimate animation="transition.expandIn" delay={200}>
                  <Tooltip title="Cancel job" placement="bottom">
                    <IconButton onClick={()=>onCancel(selectedItem)} >
                        <Icon >cancel_presentation</Icon>
                    </IconButton>
                  </Tooltip>
                </FuseAnimate>}

                {selectedItem.job_definition && <FuseAnimate animation="transition.expandIn" delay={200}>
                  <Tooltip title="Resubmit job" placement="bottom">
                    <IconButton onClick={()=>onRerun(selectedItem)} >
                        <Icon >autorenew</Icon>
                    </IconButton>
                  </Tooltip>
                </FuseAnimate>}
                </div>
        </div>
    );
    else return null;
}

export default React.memo(DetailSidebarHeader);
