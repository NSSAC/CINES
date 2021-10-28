import { Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useSelector } from "react-redux";
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
  var canRead = false;
  var canDelete = false;
  var isFile = true;
  var checked = localStorage.getItem('checked')

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

  function editFilename(node) {
    props.showRenameDialog(true)
    props.setSelectedItem(node)
  }

  function OnDelete(item) {
    localStorage.setItem("delete_id", item.id)
    item.type !== 'folder' && confirmAlert({
      title: 'Confirm',
      message: `Are you sure you want to delete the file '${item.name}'?`,
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

    item.type === 'folder' && confirmAlert({
      title: 'Confirm',
      message: `Are you sure you want to recursively delete the folder '${item.name}'?`,
      buttons: [
        {
          label: 'No',
          onClick: () => (null)
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
    <div className="flex flex-col justify-evenly h-full pt-8">
      <div className="toolbar align-center items-center text-center h-48">
        {canDelete && (
          <Tooltip title="Rename file/folder" placement="top">
            <IconButton className="w-64 h-64" disabled={checked === 'true'} id="editBtn" onClick={() => editFilename(selectedItem)}>
              <Icon fontSize='small'>edit</Icon>
            </IconButton>
          </Tooltip>
        )}
        {canDelete && props.isContainer && (
          <Tooltip title="Click to Delete" placement="bottom">
            <IconButton className="w-64 h-64" disabled={checked === 'true'} onClick={() => OnDelete(selectedItem)}>
              <Icon >delete</Icon>
              {(delete_id === selectedItem.id) && deleteFile ? <DeleteFile pageLayout={props.pageLayout} setDeleteFile={(p) => setDeleteFile(p)} name={selectedItem.name} size={selectedItem.size} fileId={selectedItem.id} type={selectedItem.type}></DeleteFile> : null}
            </IconButton>
          </Tooltip>
       )}
        {isFile && canRead && (
          <Tooltip title="Click to Download" placement="bottom">
            <IconButton className="w-64 h-64" disabled={checked === 'true'} onClick={() => setDownload(true)}>
              <Icon>cloud_download</Icon>
              {download ? <Download setDownload={(p) => setDownload(p)} name={selectedItem.name} size={selectedItem.size} fileId={selectedItem.id} type={selectedItem.type}></Download> : null}
            </IconButton>
          </Tooltip>
        )}
      </div>

      {checked !== 'true' && <div>
        <FuseAnimate delay={200}>
          <Tooltip title={selectedItem.name} placement="bottom">
            <div className="w-full text-center m-0 p-2">

              <Typography variant="subtitle2" className="p-0 mr-0 m-0 mt-10">
                <span>{selectedItem.name}</span>
              </Typography>
            </div>
          </Tooltip>
        </FuseAnimate>

      </div>}
    </div>
  );
}

export default DetailSidebarHeader;
