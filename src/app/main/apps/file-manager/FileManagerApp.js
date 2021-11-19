import { ClickAwayListener, Hidden, Icon, IconButton, Input, Tooltip } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { FuseAnimate, FusePageSimple } from "@fuse";
import { CreateFolder } from "app/main/apps/file-manager/FileUpload/CreateFolderDialog";
import { FileUpload } from "app/main/apps/file-manager/FileUpload/FileUploadDialog";
import sciductService from "app/services/sciductService/sciductService.js";
import withReducer from "app/store/withReducer";

import Breadcrumb from "./Breadcrumb";
import DetailSidebarContent from "./DetailSidebarContent";
import DetailSidebarHeader from "./DetailSidebarHeader";
import FileList from "./FileList";
import FILEUPLOAD_CONFI from "./FileManagerAppConfig"
import FMInstance from './FileManagerService'
import MainSidebarContent from "./MainSidebarContent";
import MainSidebarHeader from "./MainSidebarHeader";
import Preview from "./Preview";
import { RenameFile } from "./RenameFile";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";

import './FileManager.css'

function FileManagerApp(props) {
  const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
  const selectedFile = useSelector(({ fileManagerApp }) => files[fileManagerApp.selectedItemId]);
  const [searchbool, setSearchbool] = useState(false);
  const [search, setSearch] = useState("");
  const [editContent, setEditContent] = useState(true);
  // eslint-disable-next-line
  const [preview, setPreview] = useState(true);
  const [showDialog, setshowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [checkFlag, setcheckFlag] = useState(false);
  const [prompt, setPrompt] = useState(true);
  const [isFolder, setIsFolder] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [containerFlag, setContainerFlag] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fileTypeArray, setFileTypeArray] = useState([]);
  const history = useHistory();
  // eslint-disable-next-line
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  var path = window.location.pathname;
  var pathEnd = path.charAt(path.length - 1);
  var token = localStorage.getItem("id_token");
  let tokenData = [];
  if (token !== null) tokenData = sciductService.getTokenData().teams;
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  var targetPath = props.location.pathname.replace("/apps/files", "");
  var targetMeta = targetPath;
  if (pathEnd === "/")
    targetMeta = targetPath.slice(0, -1).replace("/apps/files", "");

  const style = {
    width: "100%",
    flexWrap: "wrap",
    wordBreak: "break-all",
  };

  function navigateHome() {
    history.push("/home/");
  }

  function showSearch() {
    setSearchbool(true);
    document.addEventListener("keydown", escFunction, false);
  }

  function showFileUploadDialog() {
    axios({
      method: "get",
      url: "https://sciduct.bii.virginia.edu/fs/type/?limit(1000)",
      headers: {
        Accept: "*/*",
        "Access-Control-Allow-Origin": "* ",
      },
    }).then((res) => {
      if (res.data) {
        var responseData = res.data;
        for (let i = 0; i < responseData.length; i++) {
          if (!FILEUPLOAD_CONFI.fileTypeToBeRemoved.includes(responseData[i].id))
            fileTypeArray.push(responseData[i].id);
        }
        setFileTypeArray(fileTypeArray);
      }
    });
    setAnchorEl(null);
    setshowDialog(true);
  }

  function showCreateFolderDialog() {
    setAnchorEl(null);
    setShowCreateDialog(true);
  }

  function handleClose() {
    setFileTypeArray([]);
    setshowDialog(false);
  }

  function closeCreateFolderDialog() {
    setShowCreateDialog(false);
  }

  function closeRenameFolderDialog() {
    setShowRenameDialog(false);
  }

  function hideSearch() {
    setSearchbool(false);
    setSearch("");
    document.removeEventListener("keydown", escFunction, false);
  }

  function escFunction(event) {
    if (event.keyCode === 27) {
      hideSearch();
    }
  }

  function handleClickAway() {
    // setSearchbool(false);
    document.removeEventListener("keydown", escFunction, false);
  }

  function OnRefresh() {
    if (targetPath.charAt(targetPath.length - 1) !== "/")
      targetPath = targetPath + "/";
    dispatch(Actions.getFiles(targetPath, "GET_FILES"));
    setSearch('')
    setSearchbool(false)
  }

   function getMetadata(targetMeta) {
    var axios = require("axios");
    var config = FMInstance.metaDataConfig(targetMeta)

    addData();
    async function addData() {
      const request = axios(config);
      request.then((response) => {
        let metaData = response.data.writeACL;
        let readPermission = response.data.readACL;
        let ownerId = response.data.owner_id;
        let type = response.data.type;
        let isContainer = response.data.isContainer;
        setContainerFlag(isContainer);
        if (isContainer === true || targetMeta === '') {
          if (pathEnd !== "/") {
            targetPath = targetPath + "/";
            window.history.replaceState(
              null,
              null,
              props.location.pathname + "/"
            );
          }
          dispatch(Actions.getFiles(targetPath, "GET_FILES"));
          setIsFolder(true);
        } else {
          localStorage.setItem("nodeType", response.data.type);
          localStorage.setItem("nodeId", response.data.id);
          localStorage.setItem("nodeSize", response.data.size);
          localStorage.setItem("nodeName", response.data.name);
          forceUpdate();
        }
        if (metaData !== undefined)
          checkPermission(metaData, ownerId, type, readPermission);
      })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
              setContainerFlag("error-404");
              setIsFolder(false);
              dispatch(Actions.setSelectedItem(null))
          }
          else if (error.response) {
            setContainerFlag("error-unknown");
          }
        });
    }
  }

  const checkPermission = (metaData, ownerId, type, readPermission) => {
    let fileMetaDate = metaData;
    if (sciductService.getTokenData().sub === ownerId) {
      localStorage.setItem("readPermission", "true");
      setcheckFlag(true);
    }
    else if (sciductService.getTokenData().roles.indexOf('superadmin') !== -1) {
      localStorage.setItem("readPermission", "true");
      setcheckFlag(true);
    } else {
      tokenData.forEach((element) => {
        fileMetaDate.forEach((item) => {
          if (item.includes(element)) {
            setcheckFlag(true);
            localStorage.setItem("readPermission", "true");
          }
        });
      });
    }

    if (checkFlag === false) {
      tokenData.forEach((element) => {
        readPermission.forEach((item) => {
          if (item.includes(element)) {
            localStorage.setItem("readPermission", "true");
          }
        });
      });
    }
  };

  useEffect(() => {
    getMetadata(targetMeta);
    setIsFolder(true);
    setcheckFlag(false);
    setSearch("");
    localStorage.removeItem('moveDestPath')
    // eslint-disable-next-line
  }, [dispatch, props, props.location, props.history]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  var type = localStorage.getItem("nodeType");
  var id = localStorage.getItem("nodeId");
  var size = localStorage.getItem("nodeSize");
  var name = localStorage.getItem("nodeName");
  var readPermission = localStorage.getItem("readPermission");
  return (
    <FusePageSimple
      classes={{
        root: "bg-red",
        content: 'overflowContentFiles',
        header: "h-auto min-h-112 overflow ",
        sidebarHeader: "h-auto min-h-112 overflow sidebarHeader1",
        sidebarContent: "sidebarWrapper",
        rightSidebar: "sidebarStyle",
        contentWrapper: "FileWrapper",
      }}
      header={
        <div
          className="flex flex-col flex-1 p-8"
          style={{ width: "100%" }}
        >
          <div className="flex items-center justify-between">
            <div style={{ minWidth: "40%" }}>
              <div className="flex flex-1 items-center justify-between ">
                <div className="flex flex-col align-middle">
                  <div className="flex items-center mb-16 align-middle" style={{"marginTop": "30px"}}>
                    <Icon
                      className="text-18 cursor-pointer"
                      color="action"
                      onClick={navigateHome}
                    >
                      home
                    </Icon>
                    <Icon className="text-18" color="action">
                      chevron_right
                    </Icon>
                    <Breadcrumb
                    props={props}
                    path={targetPath}
                    className="flex"
                    styles={style}
                  />
                  </div>
                  {/* <Typography variant="h6">File Manager</Typography> */}
                </div>
              </div>
            </div>
            <div>
              <FileUpload
                showModal={showDialog}
                props={props}
                handleClose={handleClose}
                allFilesType={fileTypeArray}
              />
            </div>
            <div>
              <CreateFolder
                showModal={showCreateDialog}
                props={props}
                handleClose={closeCreateFolderDialog}
                allFilesType={fileTypeArray}
              />
            </div>
            <div>
              <RenameFile
                showModal={showRenameDialog}
                selectedItem={selectedItem}
                props={props}
                handleClose={closeRenameFolderDialog}
              />
            </div>

            <div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={showCreateFolderDialog}>
                  Create folder
                </MenuItem>
                <MenuItem onClick={showFileUploadDialog}>Upload file</MenuItem>
              </Menu>
            </div>
            {((containerFlag &&
              isFolder) ||
              targetMeta === "") && (
                <FuseAnimate animation="transition.expandIn" delay={200}>
                  <span>
                    <div className={clsx("flex", props.className)}>
                      <Tooltip title="Click to search" placement="bottom">
                        <div onClick={showSearch}>
                          <IconButton className="w-64 h-64">
                            <Icon>search</Icon>
                          </IconButton>{" "}
                        </div>
                      </Tooltip>
                      {searchbool && (
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div>
                            <div className="flex items-end ">
                              <Input
                                placeholder="&nbsp;Search"
                                className="flex flex-1 mb-8"
                                value={search}
                                inputProps={{
                                  "aria-label": "Search",
                                }}
                                onChange={(event) =>
                                  setSearch(event.target.value)
                                }
                                autoFocus
                              />
                              <Tooltip
                                title="Click to clear and hide the search box"
                                placement="bottom"
                              >
                                <IconButton
                                  onClick={hideSearch}
                                  className="mx-8 mt-8"
                                >
                                  <Icon>close</Icon>
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </ClickAwayListener>
                      )}
                                  {checkFlag && containerFlag && (
                      <div>

                        <Tooltip title="Create folder OR Upload file" aria-label="add">
                          <IconButton className="w-64 h-64" onClick={handleClick}>
                            <Icon>
                              add
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                      <div>
                        <Tooltip title="Click to Refresh" placement="bottom">
                          <IconButton className="w-64 h-64" onClick={() => OnRefresh()}>
                            <Icon >refresh</Icon>
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </span>
                </FuseAnimate>
              )}
          </div>
        </div>
      }
      content={
        containerFlag === true ||
          containerFlag === undefined ||
          id === null ||
          isFolder ? (
          <FileList
            isFolder={isFolder}
            containerFlag={containerFlag}
            targetMeta={targetMeta}
            pageLayout={pageLayout}
            prompt={prompt}
            setPrompt={(p) => setPrompt(p)}
            editContent={editContent}
            setEditContent={(p) => setEditContent(p)}
            search={search}
            setPreview={(p) => setPreview(p)}
          />
        ) : (
          <Preview
            type={type}
            fileId={id}
            size={size}
            perm={readPermission}
            name={name}
          ></Preview>
        )
      }
      leftSidebarVariant="temporary"
      leftSidebarHeader={<MainSidebarHeader />}
      leftSidebarContent={<MainSidebarContent />}
      rightSidebarHeader={
        // ((containerFlag && isFolder && Object.values(files).length !== 0) ||
        //   targetMeta === "") &&
        selectedFile && <Hidden smDown><DetailSidebarHeader pageLayout={pageLayout} isContainer={containerFlag === true || containerFlag === undefined || id === null ? true : false}
          setSelectedItem={(p) => { setSelectedItem(p) }} showRenameDialog={(p) => { setShowRenameDialog(p) }} /></Hidden>
      }
      rightSidebarContent={
        // ((containerFlag && isFolder && Object.values(files).length !== 0) ||
        //   targetMeta === "") && 
        selectedFile && (
          <DetailSidebarContent
            pageLayout={pageLayout}
            isContainer={containerFlag === true || containerFlag === undefined || id === null ? true : false}
            setPrompt={(p) => setPrompt(p)}
            editContent={editContent}
            setEditContent={(p) => setEditContent(p)}
          />
        )
      }
      ref={pageLayout}
      innerScroll
    />
  );
}

export default withReducer("fileManagerApp", reducer)(FileManagerApp);
