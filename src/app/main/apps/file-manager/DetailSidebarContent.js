import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavigationPrompt from "react-router-navigation-prompt";
import { confirmAlert } from "react-confirm-alert";
import { ToastContainer, toast } from "material-react-toastify";
import JSONTree from "react-json-tree";
import ReactDOM from "react-dom";

import instance from "app/services/sciductService/sciductService.js";
import { isEqual } from "lodash";
import { FileService } from "node-sciduct";

import { FuseAnimate } from "@fuse";
import {
  Typography,
  Tabs,
  Tab,
  Icon,
  IconButton,
  Fab,
} from "@material-ui/core";
import {
  InsertDriveFile as FileIcon,
  ListAlt as MetadataIcon,
  History as ProvenanceIcon,
  Share as ShareIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import Switch from "@mui/material/Switch";
import Paper from "@material-ui/core/Paper";
import Chip from "@mui/material/Chip";
import Tooltip from "@material-ui/core/Tooltip";

import clsx from "clsx";
import filesize from "filesize";
import * as Actions from "./store/actions";

import { JsonEditor as Editor } from "./jsoneditor-react/es";
import FMInstance from "./FileManagerService";

import "./FileManager.css";
import "./Confirm-alert.css";
import "material-react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles({
  table: {
    "& th": {
      padding: "16px 0",
    },
  },
  typeIcon: {
    "&.folder:before": {
      content: "'folder'",
      color: "#FFB300",
    },
    "&.document:before": {
      content: "'insert_drive_file'",
      color: "#1565C0",
    },
    "&.spreadsheet:before": {
      content: "'insert_chart'",
      color: "#4CAF50",
    },
  },
});

function DetailSidebarContent(props) {
  var { targetPath } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [metaBool, setMetaBool] = useState(false);
  const [UsermetaSuccess, setUsermetaSuccess] = useState(false);
  const [UsermetaError, setUsermetaError] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [switchchecked, setSwitchChecked] = useState(false);
  const [readACLchipData, setReadACLChipData] = useState([]);
  const [writeACLchipData, setWriteACLChipData] = useState([]);
  const [computeACLchipData, setComputeACLChipData] = useState([]);
  const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
  const selectedItem = useSelector(
    ({ fileManagerApp }) => files[fileManagerApp.selectedItemId]
  );
  var token = localStorage.getItem("id_token");
  var path = window.location.pathname.replace("/apps/files", "");
  var lastPath = localStorage.getItem("editMetaPath");
  var editItem = localStorage.getItem("editItem");
  var currName = localStorage.getItem("tempName");
  var canWrite = false;
  var modifiedUsermeta = "";
  var checked = localStorage.getItem("checked");
  var selectedCount = localStorage.getItem("selectedCount");
  var tokenData = instance.getTokenData();
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`;
  const fileServiceInstance = new FileService(url, token);

  useEffect(() => {
    if (document.getElementsByClassName("jsoneditor-mode-form").length > 0) {
      document.getElementsByClassName("jsoneditor")[0].scrollIntoView();
    }
  });

  const tableStyle = {
    overflow: "hidden",
    maxWidth: "220px",
    textOverflow: "ellipsis",
    display: "block",
    whiteSpace: "nowrap",
  };

  const add_icon = {
    top: "185px",
    margin: "0 15px 0 225px",
    position: "absolute",
  };

  var styleEditor = {
    style: {
      width: "fit-content",
    },
  };

  if (editItem && selectedItem && !props.editContent && path === lastPath) {
    if (editItem !== selectedItem.id) {
      confirmAlert({
        title: "Confirm",
        message: "Are you sure you want to leave without saving the changes?",
        buttons: [
          {
            label: "No",
            onClick: () => OnConfirm(),
          },
          {
            label: "Yes",
            onClick: () => OnCancelClick(),
          },
        ],
        closeOnClickOutside: false,
      });
    }
  }

  // if(!props.editContent){
  // window.onbeforeunload = function(event) {
  //     event.returnValue = "Write something clever here..";
  //   }
  // }

  useEffect(() => {
    if (selectedItem) {
      setSwitchChecked(selectedItem.public);
      var readACL = changeACLOrder(selectedItem.readACL);
      var computeACL = changeACLOrder(selectedItem.computeACL);
      var writeACL = changeACLOrder(selectedItem.writeACL);

      setReadACLChipData(readACL);
      setWriteACLChipData(writeACL);
      setComputeACLChipData(computeACL);
    }
  }, [selectedItem]);

  function changeACLOrder(ACL) {
    var filteredACL = ACL.filter((item) => item !== "*").sort();
    filteredACL.unshift("All users");
    var returnACL = ACL.indexOf("*") !== -1 ? filteredACL : ACL.sort();
    return returnACL;
  }

  if (selectedItem) {
    modifiedUsermeta = selectedItem.usermeta;
  }

  if (!selectedItem) {
    return null;
  }

  function OnModeChange() {
    if (document.getElementsByClassName("jsoneditor-mode-tree").length > 0) {
      document.getElementsByClassName("jsoneditor")[0].scrollIntoView();
      document.getElementsByClassName(
        "jsoneditor-button jsoneditor-contextmenu-button"
      )[0].hidden = true;
    }
    if (document.getElementsByClassName("jsoneditor-mode-form").length > 0) {
      document.getElementsByClassName("jsoneditor")[0].scrollIntoView();
    }
  }

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  function handleUsermetaChange(value) {
    modifiedUsermeta = value;
    localStorage.setItem("tempMeta", JSON.stringify(modifiedUsermeta));
    localStorage.setItem("tempName", selectedItem.name);
  }

  function OnEditClick() {
    localStorage.setItem("editItem", selectedItem.id);
    var path = window.location.pathname.replace("/apps/files", "");
    localStorage.setItem("editMetaPath", path);
    props.setEditContent(false);
  }

  function OnSaveClick() {
    diffInMeta(selectedItem.usermeta, modifiedUsermeta);
    props.setEditContent(true);
  }

  function OnCancelClick() {
    props.setPrompt(false);
    props.setEditContent(true);
    setTimeout(() => {
      props.pageLayout.current && props.pageLayout.current.toggleRightSidebar();
    }, 1000);
  }

  function OnConfirm() {
    props.setPrompt(false);
    setMetaBool(true);
    dispatch(Actions.setSelectedItem(editItem));
  }

  function addPermissions() {
    props.showPermissionsDialog(true);
  }

  const diffInMeta = (obj1, obj2) => {
    if (metaBool && currName === selectedItem.name) {
      var updatedMeta = JSON.parse(localStorage.getItem("tempMeta"));
      obj2 = updatedMeta;
    }
    var changedObj = {};
    var newObj = {};
    var removedKeys = [];

    if (Object.is(obj1, obj2) || obj1 === {}) {
      changedObj = undefined;
      newObj = undefined;
      removedKeys = [];
    } else {
      let ChangedKeys = Object.keys(obj2).filter((x) =>
        Object.keys(obj1).includes(x)
      );
      ChangedKeys.forEach((x) => {
        if (!isEqual(obj2[x], obj1[x])) {
          changedObj[x] = obj2[x];
        }
      });

      let newKeys = Object.keys(obj2).filter(
        (x) => !Object.keys(obj1).includes(x)
      );
      newKeys.forEach((x) => (newObj[x] = obj2[x]));

      removedKeys = Object.keys(obj1).filter(
        (x) => !Object.keys(obj2).includes(x)
      );
    }

    // Object.keys(changedObj).forEach(x=>{if(typeof(JSON.parse(changedObj[x])) == "object")(
    //     changedObj[x] = JSON.parse(changedObj[x]))})

    StoreData(changedObj, newObj, removedKeys);
  };
  const StoreData = (changedObj, newObj, removedKeys) => {
    var data = [];

    if (changedObj !== undefined && changedObj !== {}) {
      Object.keys(changedObj).forEach((x) => {
        var obj = {};
        obj["op"] = "replace";
        obj["path"] = `/usermeta/${x}`;
        obj["value"] = changedObj[x];

        data.push(obj);
      });
    }

    if (newObj !== undefined && newObj !== {}) {
      Object.keys(newObj)
        .filter((x) => x !== "")
        .forEach((x) => {
          var obj = {};
          obj["op"] = "add";
          obj["path"] = `/usermeta/${x}`;
          obj["value"] = newObj[x];

          data.push(obj);
        });
    }

    if (removedKeys.length > 0) {
      removedKeys.forEach((key) => {
        var obj = {};
        obj["op"] = "remove";
        obj["path"] = `/usermeta/${key}`;
        data.push(obj);
      });
    }
    usermetaApi(data);
  };

  const usermetaApi = (data) => {
    var axios = require("axios");

    if (data.length > 0) {
      var config = FMInstance.editUsermetaConfig(path, selectedItem.name, data);

      axios(config)
        .then((response) => {
          dispatch(Actions.getFiles(path, "GET_FILES"));
          sessionStorage.setItem("sortedFiles", true);
          setUsermetaSuccess(true);
          setTimeout(() => {
            setUsermetaSuccess(false);
          }, 0);
        })
        .catch(function (error) {
          setUsermetaError(true);
          if (error.response)
            setErrorMsg(
              `${error.response.status}-${error.response.statusText} error occured. Please try again`
            );
          else setErrorMsg("An internal error occured. Please try again");
          setTimeout(() => {
            setUsermetaError(false);
          }, 0);
        });
    }
  };

  if (token !== null) {
    for (var team in tokenData.teams) {
      for (var writeRights in selectedItem.writeACL) {
        if (team === writeRights) {
          canWrite = true;
          break;
        }
      }
    }

    if (tokenData.sub === selectedItem.owner_id) {
      canWrite = true;
    }

    if (tokenData.roles && tokenData.roles.indexOf("superadmin") !== -1) {
      canWrite = true;
    }
  }

  const handleSwitchChange = (event) => {
    let switchValue = event.target.checked;
    setSwitchChecked(switchValue);
    if (switchValue) {
      fileServiceInstance.set(path + selectedItem.name, ["public", true]);
    } else {
      fileServiceInstance.unset(path + selectedItem.name, "public");
    }
  };

  function OnRefresh() {
    if (targetPath.charAt(targetPath.length - 1) !== "/")
      targetPath = targetPath + "/";
    dispatch(Actions.getFiles(targetPath, "GET_FILES"));
  }

  const handleReadACLChipDelete = (chipToDelete) => () => {
    setReadACLChipData((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
    fileServiceInstance.revoke(
      path + selectedItem.name,
      ["read"],
      chipToDelete,
      false
    );
    setTimeout(() => {
      OnRefresh();
    }, 1000);
  };

  const handleWriteACLChipDelete = (chipToDelete) => () => {
    setWriteACLChipData((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
    fileServiceInstance.revoke(
      path + selectedItem.name,
      ["write"],
      chipToDelete,
      false
    );
    setTimeout(() => {
      OnRefresh();
    }, 1000);
  };

  const handleComputeACLChipDelete = (chipToDelete) => () => {
    setComputeACLChipData((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
    fileServiceInstance.revoke(
      path + selectedItem.name,
      ["compute"],
      chipToDelete,
      false
    );
    setTimeout(() => {
      OnRefresh();
    }, 1000);
  };

  if (checked !== "true")
    return (
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="file-details p-16 sm:p-24">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            className="w-full mb-32"
          >
            <Tab
              icon={<FileIcon alt="File Info" />}
              className="min-w-0"
              title="File Information"
            />
            <Tab
              className="min-w-0"
              icon={<MetadataIcon alt="Metadata" />}
              title="Metadata"
            />
            <Tab
              className="min-w-0"
              icon={<ProvenanceIcon alt="File Provenance" />}
              title="File Provenance"
            />
            <Tab
              className="min-w-0"
              icon={<ShareIcon alt="Sharing Permissions" />}
              title="Sharing Permissions"
            />
          </Tabs>

          {selectedTab === 0 && (
            <React.Fragment>
              <div>
                <Typography variant="h6">INFORMATION</Typography>
              </div>
              <table className={clsx(classes.table, "w-full, text-left")}>
                <tbody>
                  <tr className="id">
                    <th>Id</th>
                    <td title={selectedItem.id}>{selectedItem.id}</td>
                  </tr>
                  <tr className="state">
                    <th>State</th>
                    <td title={selectedItem.state}>{selectedItem.state}</td>
                  </tr>
                  <tr className="type">
                    <th>Type</th>
                    <td title={selectedItem.type}>{selectedItem.type}</td>
                  </tr>

                  <tr className="size">
                    <th>Size</th>
                    <td title={selectedItem.size}>
                      {!selectedItem.size && selectedItem.size !== 0
                        ? "-"
                        : filesize(selectedItem.size)}
                    </td>
                  </tr>
                  <tr className="owner">
                    <th>Owner&nbsp;&nbsp;</th>
                    <td title={selectedItem.owner_id}>
                      {selectedItem.owner_id}
                    </td>
                  </tr>

                  <tr className="MD5">
                    <th>MD5</th>
                    <td>
                      {" "}
                      {
                        <div style={tableStyle} title={selectedItem.hash}>
                          {selectedItem.hash}
                        </div>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )}

          {selectedTab === 1 && (
            <div style={{ width: "max-content" }}>
              <div>
                <Typography variant="h6">DISCOVERED META</Typography>
              </div>
              <JSONTree
                data={selectedItem.autometa}
                hideRoot={true}
                theme={{
                  tree: {
                    backgroundColor: "#F7F7F7",
                    paddingRight: "10px",
                    marginLeft: "-15px",
                  },
                  label: {
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
                //  labelRenderer={([key]) => <div style={{whiteSpace: 'nowrap'}}>{key}</div>}
                // valueRenderer={(raw) => <div>{raw}</div>}
              />
              <div>
                <Typography variant="h6" style={{ display: "inline-flex" }}>
                  USER META
                </Typography>
                {canWrite && props.editContent && (
                  <Tooltip title="Edit" placement="top">
                    <IconButton onClick={OnEditClick}>
                      <Icon>edit</Icon>
                    </IconButton>
                  </Tooltip>
                )}
                {!props.editContent && (
                  <Tooltip title="Save changes" placement="top">
                    <IconButton onClick={OnSaveClick}>
                      <Icon>save</Icon>
                    </IconButton>
                  </Tooltip>
                )}
                {!props.editContent && (
                  <Tooltip title="Cancel" placement="top">
                    <IconButton onClick={OnCancelClick}>
                      <Icon>cancel</Icon>
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              {/* <div> */}
              {props.editContent && (
                <JSONTree
                  data={selectedItem.usermeta}
                  hideRoot={true}
                  theme={{
                    tree: {
                      backgroundColor: "#F7F7F7",
                    },
                    label: {
                      color: "black",
                      fontSize: "14px",
                      fontWeight: "bold",
                    },
                  }}
                />
              )}
              {!props.editContent && (
                <Editor
                  htmlElementProps={styleEditor}
                  mode={Editor.modes.form}
                  value={selectedItem.usermeta}
                  name={selectedItem.name}
                  search={true}
                  allowedModes={[Editor.modes.form, Editor.modes.tree]}
                  history={true}
                  limitDragging={true}
                  enableSort={false}
                  enableTransform={false}
                  onModeChange={OnModeChange}
                  onChange={handleUsermetaChange}
                />
              )}
              {/* </div> */}
            </div>
          )}

          <NavigationPrompt
            when={(crntLocation, nextLocation) => !props.editContent}
            afterCancel={OnConfirm}
            afterConfirm={OnCancelClick}
          >
            {({ onConfirm, onCancel }) =>
              confirmAlert({
                title: "Confirm",
                message:
                  "Are you sure you want to leave without saving the changes?",
                buttons: [
                  {
                    label: "No",
                    onClick: onCancel,
                  },
                  {
                    label: "Yes",
                    onClick: onConfirm,
                  },
                ],
                closeOnClickOutside: false,
              })
            }
          </NavigationPrompt>

          {UsermetaSuccess &&
            currName === selectedItem.name &&
            props.editContent &&
            ReactDOM.createPortal(
              <div>
                {" "}
                {toast.success(
                  `'${selectedItem.name}' Usermeta modified successfully`
                )}
                <ToastContainer
                  limit={1}
                  bodyStyle={{ fontSize: "14px" }}
                  position="top-right"
                />
              </div>,
              document.getElementById("portal")
            )}

          {UsermetaError &&
            ReactDOM.createPortal(
              <div>
                {" "}
                {toast.error(errorMsg)}
                <ToastContainer
                  limit={1}
                  bodyStyle={{ fontSize: "14px" }}
                  position="top-right"
                />
              </div>,
              document.getElementById("portal")
            )}

          {selectedTab === 2 && (
            <React.Fragment>
              <div>
                <Typography variant="h6">PROVENANCE</Typography>
              </div>
              {selectedItem.provenance ? (
                <JSONTree
                  data={selectedItem.provenance}
                  hideRoot={true}
                  theme={{
                    tree: {
                      backgroundColor: "#F7F7F7",
                    },
                    label: {
                      color: "black",
                      fontSize: "14px",
                      fontWeight: "bold",
                    },
                  }}
                />
              ) : null}
            </React.Fragment>
          )}

          {selectedTab === 3 && (
            <React.Fragment>
              <table className={clsx(classes.table, "w-full, text-left")}>
                <tbody>
                  <tr className="owner">
                    <th>Owner</th>
                    <td title={selectedItem.owner_id}>
                      {selectedItem.owner_id}
                    </td>
                  </tr>
                  <tr className="public">
                    <th>Public</th>
                    <td title={selectedItem.public.toString()}>
                      {tokenData.sub === selectedItem.owner_id ? (
                        <Switch
                          checked={switchchecked}
                          onChange={handleSwitchChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      ) : (
                        selectedItem.public.toString()
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {tokenData.sub === selectedItem.owner_id ? (
                <>
                  <hr
                    style={{
                      borderTop: "1px solid #122230",
                      borderBottom: "0px",
                    }}
                  />
                  <div>
                    <Tooltip title="Manage permissions" aria-label="add">
                      <Fab
                        style={add_icon}
                        color="secondary"
                        aria-label="add"
                        size="small"
                        className="flex flex-col absolute bottom-0 d-none d-sm-block  left-0 ml-16 -mb-12 z-999"
                      >
                        <Icon
                          className="flex flex-col"
                          onClick={addPermissions}
                        >
                          add
                        </Icon>
                      </Fab>
                    </Tooltip>
                  </div>
                  <br />
                </>
              ) : (
                <></>
              )}

              <table className={clsx(classes.table, "w-full, text-left")}>
                <tbody>
                  <tr className="readacl">
                    <th>Read ACL</th>
                    <td title={selectedItem.readACL.join(", ")}>
                      <Paper elevation={0}>
                        {readACLchipData.map((data) => {
                          let icon;
                          if (data.startsWith("#")) {
                            icon = <GroupIcon />;
                          } else {
                            icon = <PersonIcon className="person_icon" />;
                          }
                          return (
                            <Chip
                              key={data}
                              classes={{ label: "labelChip" }}
                              label={
                                data.startsWith("#") ? data.slice(1) : data
                              }
                              size="small"
                              variant="outlined"
                              icon={icon}
                              onDelete={
                                tokenData.sub === selectedItem.owner_id &&
                                handleReadACLChipDelete(data)
                              }
                            />
                          );
                        })}
                      </Paper>
                      {readACLchipData.length > 1 && <br />}
                    </td>
                  </tr>

                  <tr className="writeacl">
                    <th>Write ACL</th>
                    <td title={selectedItem.writeACL.join(", ")}>
                      <Paper elevation={0}>
                        {writeACLchipData.map((data) => {
                          let icon;
                          if (data.startsWith("#")) {
                            icon = <GroupIcon />;
                          } else {
                            icon = <PersonIcon className="person_icon" />;
                          }
                          return (
                            <Chip
                              key={data}
                              classes={{ label: "labelChip" }}
                              label={
                                data.startsWith("#") ? data.slice(1) : data
                              }
                              size="small"
                              variant="outlined"
                              icon={icon}
                              onDelete={
                                tokenData.sub === selectedItem.owner_id &&
                                handleWriteACLChipDelete(data)
                              }
                            />
                          );
                        })}
                      </Paper>
                      {writeACLchipData.length > 1 && <br />}
                    </td>
                  </tr>
                  <tr className="computeacl">
                    <th>Compute ACL</th>
                    <td title={selectedItem.computeACL.join(", ")}>
                      <Paper elevation={0}>
                        {computeACLchipData.map((data) => {
                          let icon;
                          if (data.startsWith("#")) {
                            icon = <GroupIcon />;
                          } else {
                            icon = <PersonIcon className="person_icon" />;
                          }
                          return (
                            <Chip
                              key={data}
                              classes={{ label: "labelChip" }}
                              label={
                                data.startsWith("#") ? data.slice(1) : data
                              }
                              size="small"
                              variant="outlined"
                              icon={icon}
                              onDelete={
                                tokenData.sub === selectedItem.owner_id &&
                                handleComputeACLChipDelete(data)
                              }
                            />
                          );
                        })}
                      </Paper>
                    </td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )}
        </div>
      </FuseAnimate>
    );
  else
    return (
      <Typography
        style={{ padding: "12px", fontSize: "16px", fontWeight: "600" }}
      >
        {selectedCount} item(s) selected
      </Typography>
    );
}

export default DetailSidebarContent;
