import { Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import * as Actions from "./store/actions";
import { confirmAlert } from 'react-confirm-alert';
import { useDispatch, useSelector } from "react-redux";
import { FuseAnimate } from '@fuse';
import instance from 'app/services/sciductService/sciductService.js'

import DeleteFile from './DeleteFile'
import Download from './Download'

import './Confirm-alert.css'
import 'react-responsive-modal/styles.css';

function DetailSidebarHeader(props) {
  const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
  const selectedItem = useSelector(({ fileManagerApp }) => files[fileManagerApp.selectedItemId]);
  var token = localStorage.getItem('id_token')
  var delete_id = localStorage.getItem("delete_id")
  const [download, setDownload] = useState(false);
  const [deleteFile, setDeleteFile] = useState(false);
  const dispatch = useDispatch();
  var targetPath = window.location.pathname.replace("/apps/files", "");
  var canRead = false;
  var canDelete = false;
  var isFile = true;

  const tableStyle = {
    overflow: 'hidden',
    maxWidth: '280px',
    textOverflow: 'ellipsis',
    display: 'block',
    whiteSpace: 'nowrap'
  }

  if (!selectedItem) {
    return null;
  }

  if (selectedItem.type === "folder" || selectedItem.type === "epihiperOutput" || selectedItem.type === "epihiper_multicell_analysis") {
    isFile = false;
  }

  function OnRefresh() {
    dispatch(Actions.getFiles(targetPath, "GET_FILES"));
  }

  function OnDelete(item) {
    localStorage.setItem("delete_id", item.id)
    confirmAlert({
      title: 'Confirm',
      message: `Are you sure you want to delete ${item.name}?`,
      buttons: [
        {
          label: 'No',
          onClick: (null)
        },
        {
          label: 'Yes',
          onClick: () => setDeleteFile(true)
        }
      ],
      closeOnClickOutside: false
    })
  };

  if (selectedItem.public === true)
    canRead = true;

  if (token !== null) {
    var tokenData = instance.getTokenData()
    for (var team in tokenData.teams) {
      for (var readRights in selectedItem.readACL) {
        if (team === readRights) {
          canRead = true
          break;
        }
      }
      for (readRights in selectedItem.writeACL) {
        if (team === readRights) {
          canRead = true
          break;
        }
      }
    }
    if (tokenData.sub === selectedItem.owner_id) {
      canRead = true;
      canDelete = true;
    }
    if (tokenData.roles && tokenData.roles.indexOf('superadmin') !== -1) {
      canRead = true;
      canDelete = true;
    }
  }

  return (
    <div className="flex flex-col justify-between h-full p-4 sm:p-12">
      <div className="toolbar flex align-center justify-end h-48">
        {<FuseAnimate animation="transition.expandIn" delay={200}>
          <Tooltip title="Click to Refresh" placement="bottom">
            <IconButton onClick={() => OnRefresh()}>
              <Icon >refresh</Icon>
            </IconButton>
          </Tooltip>
        </FuseAnimate>}
        {canDelete && <FuseAnimate animation="transition.expandIn" delay={200}>
          <Tooltip title="Click to Delete" placement="bottom">
            <IconButton onClick={() => OnDelete(selectedItem)}>
              <Icon >delete</Icon>
              {(delete_id === selectedItem.id) && deleteFile ? <DeleteFile pageLayout={props.pageLayout} setDeleteFile={(p) => setDeleteFile(p)} name={selectedItem.name} size={selectedItem.size} fileId={selectedItem.id} type={selectedItem.type}></DeleteFile> : null}
            </IconButton>
          </Tooltip>
        </FuseAnimate>}
        {isFile && canRead && <FuseAnimate animation="transition.expandIn" delay={200}>
          <Tooltip title="Click to Download" placement="bottom">
            <IconButton onClick={() => setDownload(true)}>
              <Icon>cloud_download</Icon>
              {download ? <Download setDownload={(p) => setDownload(p)} name={selectedItem.name} size={selectedItem.size} fileId={selectedItem.id} type={selectedItem.type}></Download> : null}
            </IconButton>
          </Tooltip>
        </FuseAnimate>}
      </div>

      <div>
        <FuseAnimate delay={200}>
          <Typography variant="subtitle1" className="mb-8">
            <span style={tableStyle}>{selectedItem.name}</span></Typography>
        </FuseAnimate>
        <FuseAnimate delay={300}>
          <Typography variant="caption" className="">
            <span>Updated</span>
            <span>: {moment.utc(selectedItem.update_date).local().fromNow()}</span>
          </Typography>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default DetailSidebarHeader;
