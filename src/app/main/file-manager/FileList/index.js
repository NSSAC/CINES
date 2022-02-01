import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import withReducer from "app/store/withReducer";
// import { confirmAlert } from 'react-confirm-alert';

import { Hidden, Icon, IconButton, LinearProgress, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AssignmentReturn, CloudDownload, Edit, Delete } from "@material-ui/icons";

import { saveAs } from "file-saver";
import filesize from "filesize";
import moment from "moment";

import reducer from "./store/reducers";
import FileDetailPanel from "./FileDetailPanel";
import FileListHeader from "./FileListHeader";
import FileRow from "./FileRow";
import * as Actions from "./store/actions";

import confirmAlert from "../dialogs/ConfirmDelete";
import CreateFolder from "../dialogs/CreateFolderDialog";
import FileUpload from "../dialogs/FileUpload/FileUploadDialog";
import { MoveMultiple } from "../dialogs/MoveMultiple";
import { RenameFile } from "../dialogs/RenameFile";
import * as Perms from "../permissions";
import FILEUPLOAD_CONFIG from "../FileManagerAppConfig";
import { ModifyPermissions } from "../panel/ModifyPermissions";
import "../FileManager.css";

function FileList(props) {
  const tableRef = React.createRef();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const files = useSelector(({ FileListApp }) => FileListApp.files);
  const filtered_files = useSelector(
    ({ FileListApp }) => FileListApp.filtered_files
  );
  const file_removal = useSelector(
    ({ FileListApp }) => FileListApp.file_removal
  );
  const uploader = useSelector(({ fileManagerApp }) => fileManagerApp.uploader);
  const usermeta_updater = useSelector(
    ({ fileManagerApp }) => fileManagerApp.usermeta
  );
  const [selected, setSelected] = useState({});
  const [sort, setSort] = useState(
    localStorage.getItem("file_manager_sort")
      ? JSON.parse(localStorage.getItem("file_manager_sort"))
      : [{ attr: "update_date", dir: "desc" }]
  );
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showMoveFiles, setShowMoveFiles] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [totalFileCount, setTotalFileCount] = useState(0);
  const [active_selection, setActiveSelection] = useState(false);
  const [containerActions, setContainerActions] = useState();
  const [fileActions, setFileActions] = useState();
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(false);
  const [menuClick, setMenuClick] = useState(null);
  const [menuItems, setMenuItems] = useState();

  var uploadableTypes = FILEUPLOAD_CONFIG.fileTypes;
  const _files = filtered_files ? filtered_files.filtered : files;
  const curFilter = filtered_files ? filtered_files.filter : false;
  const matches = useMediaQuery("(min-width:600px)");
  const menuOpen = Boolean(menuClick);

  const selectedIds = Object.keys(selected).filter((id) => {
    return selected[id];
  });

  if (_files && _files.length > 0 && sort && sort.length > 0) {
    var attr = sort[0].attr;
    var dir = sort[0].dir === "asc" ? [1, -1] : [-1, 1];
    _files.sort((a, b) => {
      if (a.size === undefined) {
        a.size = null;
      }
      if (a.size === undefined) {
        a.size = null;
      }
      if (a[attr] > b[attr]) return dir[0];
      if (a[attr] < b[attr]) return dir[1];
      return 0;
    });
  }

  // React.useEffect(()=>{
  //     // if (history.location.pathname.charAt(history.location.pathname.length-1)!=="/"){
  //     //     history.replace(`${history.location.pathname}/`)
  //     // }
  //     setSelected({})
  // },[history,history.location.pathname])
  // console.log("AUTH: ", user)

  React.useEffect(() => {
    if (file_removal && file_removal.removal_completed) {
      setShowNotification(
        `File removal completed.  ${file_removal.files_removed} files deleted.`
      );
      setSelected({});
      dispatch(Actions.getFiles(props.path));
    }
  }, [dispatch, props.path, file_removal, showNotification]);

  React.useEffect(() => {
    if (!usermeta_updater || (usermeta_updater && !usermeta_updater.updating)) {
      setSelected({});
      dispatch(Actions.getFiles(props.path));
    }
  }, [dispatch, props.path, usermeta_updater, usermeta_updater.updating]);

  React.useEffect(() => {
    if (uploader.recent && uploader.recent.length > 0) {
      dispatch(Actions.getFiles(props.path));
    }
  }, [dispatch, uploader.recent, props.path]);

  const table_columns = [
    {
      label: "Name",
      attr: "name",
      sortable: true,
      headerClass: "",
      cellClass: "",
      formatter: (val, obj) => {
        return (
          <Link style={{ color: "#1565C0" }} title={val} to={val}>
            {val}
          </Link>
        );
        // return <span style={{color: `#1565C0`}} className="cursor-pointer" onClick={(evt)=>{
        //     evt.preventDefault();
        //     dispatch(Actions.clearFiles())
        //     history.push(val)}}>{val}
        // </span>
        // return <a href={val}>{val}</a>
      },
    },
    {
      label: "Type",
      attr: "type",
      sortable: true,
      headerClass: "hidden sm:table-cell",
      cellClass: "hidden sm:table-cell wordBreak",
    },
    {
      label: "Owner",
      attr: "owner_id",
      sortable: true,
      headerClass: "hidden md:table-cell",
      cellClass: "hidden md:table-cell wordBreak",
    },
    {
      label: "Size",
      attr: "size",
      sortable: true,
      headerClass: "hidden sm:table-cell",
      cellClass: "hidden sm:table-cell wordBreak",
      formatter: (val, obj) => {
        if (!val && val !== 0) {
          return "-";
        } else {
          return filesize(val);
        }
      },
    },
    {
      label: "Last Update",
      attr: "update_date",
      sortable: true,
      headerClass: "hidden md:table-cell",
      cellClass: "hidden md:table-cell wordBreak",
      formatter: (val, obj) => {
        return moment.utc(val).local().fromNow();
      },
    },
  ];

  const listScrollToTop = () => {
    if(tableRef.current) tableRef.current.scrollIntoView();
  }

  const handleMenuClick = (event) => {
    setMenuClick(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuClick(null);
  }

  React.useEffect(() => {
    function refreshFolder() {
      setRefreshFlag(true);
      dispatch(Actions.getFiles(props.path));
    }

    function openUploader() {
      setShowFileUpload(true);
    }

    function openCreateFolder() {
      setShowCreateFolder(true);
    }
    const canWrite = Perms.canWriteFile(props.meta, user);

    setContainerActions(
      <React.Fragment>
        <Tooltip title="Refresh Folder Listing" aria-label="add">
          <IconButton className="w-64 h-64" onClick={refreshFolder}>
            <Icon className="text-white text-4xl">refresh</Icon>
          </IconButton>
        </Tooltip>
        {canWrite && (
          <Tooltip title="Create a new folder" aria-label="add">
            <IconButton className="w-64 h-64" onClick={openCreateFolder}>
              <Icon className="text-white text-4xl">create_new_folder</Icon>
            </IconButton>
          </Tooltip>
        )}
        {canWrite && (
          <Tooltip title="Upload files" aria-label="add">
            <IconButton className="w-64 h-64" onClick={openUploader}>
              <Icon className="text-white text-4xl">cloud_upload</Icon>
            </IconButton>
          </Tooltip>
        )}
        {canWrite && !matches && selectedIds.length > 0 && (
          // && selectedIds.length > 0
          <IconButton className="w-64 h-64" onClick={handleMenuClick}>
            <Icon className="text-white text-4xl">menu</Icon>
          </IconButton>
        )}
      </React.Fragment>
    );
  }, [dispatch, props.path, showSearch, props.meta, user, matches, selectedIds.length]);

  React.useEffect(() => {
    if (files) {
      setTotalFileCount(
        filtered_files ? filtered_files.filtered.length : files.length
      );
    }
    // setSelected({})
  }, [files, filtered_files]);

  React.useEffect(() => {
    dispatch(Actions.getFiles(props.path));
    dispatch(Actions.filterFiles(files, false));
    setShowSearch(false);
    setSelected({});
    listScrollToTop();
    return(() => setRefreshFlag(false))
  }, [dispatch,props.path,refreshFlag]);

  // function confirmAndDelete(selectedIds){
  //     confirmAlert({
  //         title: 'Confirm',
  //         message: `Are you sure you want to delete the selected files?`,
  //         buttons: [
  //           {
  //             label: 'No',
  //             onClick: (null)
  //           },
  //           {
  //             label: 'Yes',
  //             onClick: () => { dispatch(Actions.deleteFiles(selectedIds))}
  //           }
  //         ],
  //         closeOnClickOutside: false
  //     })
  // }
  React.useEffect(() => {
    var selectedIds = Object.keys(selected).filter((id) => {
      return selected[id];
    });

    function openMoveFiles() {
      setShowMoveFiles(true);
    }
    const _files = filtered_files ? filtered_files.filtered : files;
    function downloadFiles() {
      const token = localStorage.getItem("id_token");
      _files
        .filter((f) => selectedIds.indexOf(f.id) >= 0)
        .forEach((f) => {
          if (f.container_id && f.name) {
            console.log(`download ${f.name}`);
            saveAs(
              `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${
                f.container_id
              }/${f.name}?${
                token ? "http_authorization=" + token : ""
              }&http_accept=application/octet-stream`,
              f.name
            );
          } else {
            saveAs(
              `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${f.id}?${
                token ? "http_authorization=" + token : ""
              }}&http_accept=application/octet-stream`,
              f.name
            );
          }
        });
    }

    function confirmAndDelete(selectedIds, files) {
      const selFiles = selectedIds
        .map((id) => {
          var found;
          if (
            files.some((f) => {
              if (f.id === id) {
                found = f;
                return true;
              }
              return false;
            })
          ) {
            return found;
          } else {
            return false;
          }
        })
        .filter((f) => !!f);

      if (selFiles.length !== selectedIds.length) {
        console.warn(
          "Unexpected SelectedIDs !== selFiles.length",
          selectedIds,
          selFiles
        );
      }
      confirmAlert({
        title: "Confirm",
        files: selFiles,
        onConfirm: (ids) => {
          dispatch(Actions.deleteFiles(ids));
        },
        closeOnClickOutside: false,
      });
    }

    if (_files && _files.length > 0 && selectedIds.length === 1) {
      var asel;
      _files.some((f) => {
        if (f.id === selectedIds[0]) {
          asel = f;
          return true;
        }
        return false;
      });
      const canWrite = Perms.canWriteFile(asel, user);
      const canDownload = Perms.canDownloadFile(asel, user);
      setActiveSelection(asel);
      setShowDetailPanel(true);
      if(matches) {
        setFileActions(
          <React.Fragment>
            {canDownload && (
              <Tooltip title="Download selected file(s)" aria-label="add">
                <IconButton className="w-64 h-64" onClick={downloadFiles}>
                  <Icon className="text-white text-4xl">cloud_download</Icon>
                </IconButton>
              </Tooltip>
            )}
            {canWrite && (
              <Tooltip title="Rename file or folder" aria-label="add">
                <IconButton
                  className="w-64 h-64"
                  onClick={() => setShowRenameDialog(true)}
                >
                  <Icon className="text-white text-4xl">edit</Icon>
                </IconButton>
              </Tooltip>
            )}
            {canWrite && (
              <Tooltip title="Move file or folder" aria-label="add">
                <IconButton className="w-64 h-64" onClick={openMoveFiles}>
                  <Icon className=" text-white text-4xl" color="primary">
                    assignment_return
                  </Icon>
                </IconButton>
              </Tooltip>
            )}
            {canWrite && (
              <Tooltip title="Delete selected file or folder" aria-label="add">
                <IconButton
                  className="w-64 h-64"
                  onClick={() => {
                    confirmAndDelete(selectedIds, _files);
                  }}
                >
                  <Icon className="text-white text-4xl">delete</Icon>
                </IconButton>
              </Tooltip>
            )}
          </React.Fragment>
        );
      } else {
        setMenuItems(
          <Menu
            anchorEl={menuClick}
            id="menu"
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 100,
                  height: 100,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={downloadFiles}>
              {canDownload && (
                <><CloudDownload/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Download</span></>
              )}
            </MenuItem>
            <MenuItem onClick={() => setShowRenameDialog(true)}>
              {canWrite && (
                <><Edit/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Rename</span></>
              )}
            </MenuItem>
            <MenuItem onClick={openMoveFiles}>
              {canWrite && (
                <><AssignmentReturn/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Move</span></>
              )}
            </MenuItem>
            <MenuItem onClick={() => {confirmAndDelete(selectedIds, _files);}}>
              {canWrite && (
                <><Delete/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Delete</span></>
              )}
            </MenuItem>
          </Menu>
        );
      }
    } else if (selectedIds.length > 1) {
      const sf = _files.filter((f) => {
        return selectedIds.indexOf(f.id) >= 0;
      });
      const canDownload = Perms.canDownloadFiles(sf, user);
      const canWrite = Perms.canWriteFiles(sf, user);
      setShowDetailPanel(false);
      if(matches) {
        setFileActions(
          <React.Fragment>
            {canDownload && (
              <Tooltip title="Download selected file(s)" aria-label="add">
                <IconButton className="w-64 h-64" onClick={downloadFiles}>
                  <Icon className="text-white text-4xl">cloud_download</Icon>
                </IconButton>
              </Tooltip>
            )}
            {canWrite && (
              <Tooltip title="Move file or folder" aria-label="add">
                <IconButton className="w-64 h-64" onClick={openMoveFiles}>
                  <Icon className=" text-white text-4xl" color="primary">assignment_return</Icon>
                </IconButton>
              </Tooltip>
            )}
            {canWrite && (
              <Tooltip title="Delete selected files or folders" aria-label="add">
                <IconButton className="w-64 h-64" onClick={() => {confirmAndDelete(selectedIds, _files);}}>
                  <Icon className="text-white text-4xl">delete</Icon>
                </IconButton>
              </Tooltip>
            )}
          </React.Fragment>
        );
      } else {
        setMenuItems(
          <Menu
            anchorEl={menuClick}
            id="menu"
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 100,
                  height: 100,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={downloadFiles}>
              {canDownload && (
                <><CloudDownload/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Download</span></>
              )}
            </MenuItem>
            <MenuItem onClick={openMoveFiles}>
              {canWrite && (
                <><AssignmentReturn/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Move</span></>
              )}
            </MenuItem>
            <MenuItem onClick={() => {confirmAndDelete(selectedIds, _files);}}>
              {canWrite && (
                <><Delete/>&nbsp;&nbsp;<span style={{"fontSize":"18px"}}>Delete</span></>
              )}
            </MenuItem>
          </Menu>
        );
      }
    } else {
      setShowDetailPanel(false);
      setActiveSelection(false);
      setFileActions();
    }
  }, [dispatch, selected, props, files, filtered_files, user, matches, menuClick, menuOpen]);

  React.useEffect(() => {
    if (props.setFileActions) {
      function onClickSearch() {
        setShowSearch(true);
      }

      if (showSearch) {
        function onSearchChange(evt) {
          setSelected({});
          dispatch(Actions.filterFiles(files, evt.target.value));
        }

        function clearFilter(evt) {
          if (!curFilter) {
            setShowSearch(false);
          } else {
            dispatch(Actions.filterFiles(files, false));
          }
        }

        function onSearchBlur(evt) {
          if (!curFilter) {
            setShowSearch(false);
          }
        }

        props.setFileActions(
          <div className="w-full flex p-0 m-0">
            <div className="flex-grow"></div>
            {showSearch && (
              <div className="flex-shrink flex flex-row h-32 p-1 mt-16 bg-white align-middle rounded ">
                <input
                  className="flex-shrink min-w-min rounded p-0 bg-white align-middle text-black text-lg"
                  type="text"
                  placeholder="Search for files and folders"
                  value={curFilter ? curFilter : ""}
                  onChange={onSearchChange}
                  onBlur={onSearchBlur}
                  autoFocus={true}
                />
                <Tooltip title="Clear filter" aria-label="add">
                  <Icon
                    className="text-black text-xl  w-24 h-32 m-0 pt-4 align-bottom flex-initial"
                    onClick={clearFilter}
                  >
                    close
                  </Icon>
                </Tooltip>
              </div>
            )}
            <div>
              {containerActions}
              {fileActions}
            </div>
          </div>
        );
      } else {
        if(matches) {
          props.setFileActions(
            <React.Fragment>
              <Tooltip title="Search for files in this folder" aria-label="add">
                <IconButton className="w-64 h-64" onClick={onClickSearch}>
                  <Icon className="text-white text-4xl">search</Icon>
                </IconButton>
              </Tooltip>
              {containerActions}
              {fileActions}
            </React.Fragment>
          );
        } else {
          function onSearchChange(evt) {
            setSelected({});
            dispatch(Actions.filterFiles(files, evt.target.value));
          }

          function clearFilter(evt) {
            if (!curFilter) {
              setShowSearch(false);
            } else {
              dispatch(Actions.filterFiles(files, false));
            }
          }

          function onSearchBlur(evt) {
            if (!curFilter) {
              setShowSearch(false);
            }
          }

          props.setFileActions(
            <React.Fragment classname="flex flex-col">
              <div className="flex-shrink flex flex-row justify-between h-32 p-1 mt-16 ml-16 mr-16 bg-white align-middle rounded ">
                <input
                  className="flex-shrink min-w-min rounded p-0 bg-white align-middle text-black text-lg"
                  style={{width:"100%"}}
                  type="text"
                  placeholder="Search for files and folders"
                  value={curFilter ? curFilter : ""}
                  onChange={onSearchChange}
                  onBlur={onSearchBlur}
                  autoFocus={true}
                />
                <Tooltip title="Clear filter" aria-label="add">
                  <Icon
                    className="text-black text-xl  w-24 h-32 m-0 pt-4 align-bottom flex-initial"
                    onClick={clearFilter}
                  >
                    close
                  </Icon>
                </Tooltip>
              </div>
              <div>
                {containerActions}
                {fileActions}
              </div>
            </React.Fragment>
          );
        }
      }
    }
  }, [containerActions, fileActions, props, showSearch, dispatch, files, filtered_files, curFilter, matches]);

  React.useEffect(() => {
    if(props.setMenuItems) {
      props.setMenuItems(menuItems);
    }
  },[menuItems, props])

  function findRow(node) {
    if (node.tagName === "TR") {
      return node;
    }
    if (!node.parentNode) {
      return false;
    }
    const parent = node.parentNode;
    if (parent.tagName === "TR") {
      return parent;
    }
    return findRow(parent);
  }

  function toggleSelected(id, clear) {
    var sel = {};
    if (!clear) {
      sel = { ...selected };
    } else {
      sel[id] = selected[id];
    }
    if (typeof sel[id] === "undefined") {
      sel[id] = true;
    } else {
      sel[id] = !sel[id];
    }
    setSelected(sel);
  }

  function toggleAll() {
    var selectedIds = Object.keys(selected).filter((id) => {
      return selected[id];
    });
    if (selectedIds.length > 0) {
      setSelected({});
    } else {
      var s = {};
      files.forEach((f) => {
        s[f.id] = true;
      });
      setSelected(s);
    }
  }

  function closePermissionsDialog() {
    setShowPermissionsDialog(false);
    // setTimeout(() => {
    //   OnRefresh();
    // }, 1000);
  }

  function onClickRow(evt) {
    var clear =
      !evt.metaKey &&
      !evt.ctrlKey &&
      evt.target.getAttribute("type") !== "checkbox";
    var row = findRow(evt.target);
    if (row && row.id) {
      toggleSelected(row.id, clear);
    }
  }

  function onDragEnter(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = [];
    if (e.dataTransfer.items) {
      Array.from(e.dataTransfer.items).forEach((item, i) => {
        if (item.kind === "file") {
          let file = item.getAsFile();
          let tempObj = {};
          tempObj.type =
            uploadableTypes.indexOf(file.name.split(".").pop()) !== -1 &&
            file.name.split(".").pop();
          tempObj.fileName = file.name;
          tempObj["contents"] = file;
          droppedFiles.push(tempObj);
        }
      });
      setDroppedFiles(droppedFiles);
      setShowFileUpload(true);
      //after the droppedFiles array has been passed
      //to the uplaoder we can clear the local dropped state reference
      setTimeout(() => {
        setDroppedFiles(false);
      }, 500);
    }
  }

  function refreshFolder() {
    dispatch(Actions.getFiles(props.path));
  }
  
  if (_files && _files.length >= 0) {
    return (
      <div className="overflow-auto w-full h-full">
        <div className="flex w-full h-full">
          <div
            className="flex-row flex-grow h-full w-full overflow-auto"
            onDragEnter={(e) => onDragEnter(e)}
            onDragOver={(e) => onDragOver(e)}
            onDragLeave={(e) => onDragLeave(e)}
            onDrop={(e) => handleDrop(e)}
          >
            <Table stickyHeader className="fileTableStyle  max-h-full" ref={tableRef}>
              <FileListHeader
                checked={totalFileCount!==0 && selectedIds.length === totalFileCount}
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < totalFileCount
                }
                table_columns={table_columns}
                sort={sort}
                onSort={(sort) => {
                  setSort(sort);
                  localStorage.setItem(
                    "file_manager_sort",
                    JSON.stringify(sort)
                  );
                }}
                toggleAll={toggleAll}
                enableCheckBoxes={totalFileCount!==0 && (props.enableCheckBoxes || false)}
              />
               <ModifyPermissions
                showModal={showPermissionsDialog}
                selectedVal={props.meta}
                props={props}
                selected = {active_selection}
                onModify={refreshFolder}
                handleClose={closePermissionsDialog}
              />
              {_files.length > 0 && (
                <TableBody onClick={onClickRow}>
                  {_files &&
                    _files.map((f) => (
                      <FileRow
                        enableCheckBoxes={props.enableCheckBoxes || false}
                        key={f.id}
                        table_columns={table_columns}
                        selected={selected[f.id] || false}
                        meta={f}
                      />
                    ))}
                </TableBody>
              )}
              {_files.length === 0 && (
                <TableBody onClick={onClickRow}>
                  <TableRow>
                    <TableCell
                      colSpan={20}
                      className="text-center text-lg font-semibold"
                    >
                      {filtered_files ? (
                        <span>No matching files</span>
                      ) : (
                        <span>Empty Folder</span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>
          {showDetailPanel && (
            <Hidden mdDown>
              <div className="flex flex-row flex-initial min-w-min md:w-1/3 h-full">
                <div
                  className="flex-row w-1 flex-initial"
                  style={{ background: "#999" }}
                ></div>
                <div className="flex-row flex-grow w-full h-full ">
                  {selectedIds && selectedIds.length > 1 && (
                    <div> {selectedIds.length} files selected.</div>
                  )}
                  {selectedIds && selectedIds.length === 1 && (
                    <FileDetailPanel showPermissionsDialog={(p) => {
                      setShowPermissionsDialog(p);
                    }} meta={{ ...active_selection }} />
                 )}
                </div>
              </div>
            </Hidden>
          )}
        </div>
        {showFileUpload && (
          <FileUpload
            showModal={showFileUpload}
            props={props}
            path={props.path}
            dropped={droppedFiles || false}
            handleClose={() => {
              setShowFileUpload(false);
            }}
            setSelected={setSelected}
          />
        )}
        {showCreateFolder && (
          <CreateFolder
            showModal={showCreateFolder}
            props={props}
            targetPath={props.path}
            handleClose={() => {
              setShowCreateFolder(false);
            }}
            onCreate={refreshFolder}
            setSelected={setSelected}
          />
        )}
        {showMoveFiles && (
          <MoveMultiple
            showModal={showMoveFiles}
            sourceIDs={selectedIds}
            props={props}
            path={props.path}
            handleClose={() => {
              setShowMoveFiles(false);
            }}
            onMove={refreshFolder}
          />
        )}
        {showRenameDialog && (
          <RenameFile
            showModal={showRenameDialog}
            props={props}
            target={active_selection}
            onRename={refreshFolder}
            handleClose={() => {
              setShowRenameDialog(false);
            }}
          />
        )}{" "}
      </div>
    );
  } else if (_files && _files.length === 0) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center mt-40"
        onDragEnter={(e) => onDragEnter(e)}
        onDragOver={(e) => onDragOver(e)}
        onDragLeave={(e) => onDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        <Typography className="text-20 mt-16" color="textPrimary">
          Folder is empty
        </Typography>
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">
          Loading
        </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );
  }
}
export default withReducer("FileListApp", reducer)(FileList);
