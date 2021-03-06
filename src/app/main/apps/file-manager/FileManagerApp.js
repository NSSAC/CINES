import React, { useEffect, useReducer, useRef } from "react";
import {
  ClickAwayListener,
  Tooltip,
  Typography,
  Icon,
  IconButton,
  Input,
  Fab,
} from "@material-ui/core";
import { FuseAnimate, FusePageSimple } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import FileList from "./FileList";
import DetailSidebarHeader from "./DetailSidebarHeader";
import DetailSidebarContent from "./DetailSidebarContent";
import MainSidebarHeader from "./MainSidebarHeader";
import MainSidebarContent from "./MainSidebarContent";
import Breadcrumb from "./Breadcrumb";
import { useState } from "react";
import clsx from "clsx";
import { CreateFolder } from "app/main/apps/file-manager/FileUpload/CreateFolderDialog";
import { FileUpload } from "app/main/apps/file-manager/FileUpload/FileUploadDialog";
import sciductService from "app/services/sciductService/sciductService.js";
import Preview from "./Preview";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FILEUPLOAD_CONFI from "./FileManagerAppConfig"
import './FileManager.css'

function FileManagerApp(props) {
  const [searchbool, setSearchbool] = useState(false);
  const [search, setSearch] = useState("");
  const [editContent, setEditContent] = useState(true);
  // eslint-disable-next-line
  const [preview, setPreview] = useState(true);
  const [showDialog, setshowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [checkFlag, setcheckFlag] = useState(false);
  const [prompt, setPrompt] = useState(true);
  const [isFolder, setIsFolder] = useState(false);
  const [containerFlag, setContainerFlag] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fileTypeArray, setFileTypeArray] = useState([]);
  const history = useHistory();
  // eslint-disable-next-line
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
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

  async function getMetadata(targetMeta) {
    var axios = require("axios");
    if (typeof token === "string") {
      var config = {
        method: "get",
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetMeta}`,
        headers: {
          Accept: "*/*",
          Authorization: token,
        },
      };
    } else {
      config = {
        method: "get",
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetMeta}`,
        headers: {
          Accept: "*/*",
        },
      };
    }
    addData();
    function addData() {
      const request = axios(config);
      request
        .then((response) => {
          let metaData = response.data.writeACL;
          let readPermission = response.data.readACL;
          let ownerId = response.data.owner_id;
          let type = response.data.type;
          let isContainer = response.data.isContainer;
          setContainerFlag(isContainer);
          if (isContainer === true) {
            if (pathEnd !== "/") {
              targetPath = targetPath + "/";
              window.history.replaceState(
                null,
                null,
                props.location.pathname + "/"
              );
              dispatch(Actions.getFiles(targetPath, "GET_FILES"));
            }
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
    dispatch(Actions.getFiles(targetPath, "GET_FILES"));
    setIsFolder(true);
    setcheckFlag(false);
    getMetadata(targetMeta);
    setSearch("");
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
        header: "h-auto min-h-128 sm:h-auto sm:min-h-140",
        sidebarHeader: "h-auto min-h-128 sm:h-auto sm:min-h-140 sidebarHeader1",
        sidebarContent: "sidebarWrapper",
        rightSidebar: "w-320",
        contentWrapper: "FileWrapper",
      }}
      header={
        <div
          className="flex flex-col flex-1 p-8 sm:p-12 relative"
          style={{ width: "100%" }}
        >
          <div className="flex items-center justify-between">
            <div style={{ minWidth: "40%" }}>
              <div className="flex flex-1 items-center justify-between ">
                <div className="flex flex-col">
                  <div className="flex items-center mb-16">
                    <Icon
                      className="text-18  cursor-pointer"
                      color="action"
                      onClick={navigateHome}
                    >
                      home
                    </Icon>
                    <Icon className="text-16" color="action">
                      chevron_right
                    </Icon>
                    <Typography color="textSecondary">File Manager</Typography>
                  </div>
                  <Typography variant="h6">File Manager</Typography>
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
              isFolder &&
              Object.values(files).length !== 0) ||
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
                    </div>
                  </span>
                </FuseAnimate>
              )}
          </div>
          <div className="flex flex-1 items-end">
            {checkFlag && containerFlag && (
              <FuseAnimate
                className="hidden md:flex flex-col"
                animation="transition.expandIn"
                delay={600}
              >
                <Tooltip title="Create folder OR Upload file" aria-label="add">
                  <Fab
                    color="secondary"
                    aria-label="add"
                    size="medium"
                    className="flex flex-col absolute bottom-0 d-none d-sm-block  left-0 ml-16 -mb-12 z-999"
                  >
                    <Icon className="flex flex-col" onClick={handleClick}>
                      add
                    </Icon>
                  </Fab>
                </Tooltip>
              </FuseAnimate>
            )}
            <FuseAnimate delay={200}>
              <div>
                {
                  <Breadcrumb
                    props={props}
                    path={targetPath}
                    className="flex pl-72 text-16 sm:text-16"
                    styles={style}
                  />
                }
              </div>
            </FuseAnimate>
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
            setSearchbool={(p) => setSearchbool(p)}
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
        ((containerFlag && isFolder && Object.values(files).length !== 0) ||
          targetMeta === "") && <DetailSidebarHeader pageLayout={pageLayout} setSearch={(p) => setSearch(p)}/>
      }
      rightSidebarContent={
        ((containerFlag && isFolder && Object.values(files).length !== 0) ||
          targetMeta === "") && (
          <DetailSidebarContent
            pageLayout={pageLayout}
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
