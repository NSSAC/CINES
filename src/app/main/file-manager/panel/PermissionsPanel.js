import React, { useEffect, useState } from 'react';


import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import instance from "app/services/sciductService/sciductService.js";
import { Switch } from '@material-ui/core';
import { FileService } from 'node-sciduct';
import { useDispatch } from 'react-redux';
import * as Actions from "../store/actions";
import {
  Icon,
  Fab,
} from "@material-ui/core";
import {
  Group as GroupIcon,
  Person as PersonIcon,
} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Chip from "@mui/material/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import '../FileManager.css'

const useStyles = makeStyles({
  table: {
    '& th': {
      padding: '16px 0px'
    }
  },
  typeIcon: {
    '&.folder:before': {
      content: "'folder'",
      color: '#FFB300'
    },
    '&.document:before': {
      content: "'insert_drive_file'",
      color: '#1565C0'
    },
    '&.spreadsheet:before': {
      content: "'insert_chart'",
      color: '#4CAF50'
    }
  }
});

function PermissionsPanel(props) {
  const classes = useStyles();
  var targetPath = props.meta.name;
  const dispatch = useDispatch();
  var tokenData = instance.getTokenData();
  const [switchchecked, setSwitchChecked] = useState(false);
  const [readACLchipData, setReadACLChipData] = useState([]);
  const [writeACLchipData, setWriteACLChipData] = useState([]);
  const [computeACLchipData, setComputeACLChipData] = useState([]);
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`;
  const fileServiceInstance = new FileService(url, token);
  var token = localStorage.getItem("id_token");
  var path = window.location.pathname.replace("/files", "");

  const add_icon = {
    top: "185px",
    margin: "0 15px 0 225px",
    position: "absolute",
  };

  useEffect(() => {
    if (props.meta) {
      setSwitchChecked(props.meta.public);
      var readACL = changeACLOrder(props.meta.readACL);
      var computeACL = changeACLOrder(props.meta.computeACL);
      var writeACL = changeACLOrder(props.meta.writeACL);

      setReadACLChipData(readACL);
      setWriteACLChipData(writeACL);
      setComputeACLChipData(computeACL);
    }
  }, [props.meta]);

  function changeACLOrder(ACL) {
    var filteredACL = ACL.filter((item) => item !== "All users").sort();
    filteredACL.unshift("All users");
    var returnACL = ACL.indexOf("All users") !== -1 ? filteredACL : ACL.sort();
    return returnACL;
  }

  function addPermissions() {
    props.showPermissionsDialog(true);
  }

  const handleSwitchChange = (event) => {
    let switchValue = event.target.checked;
    setSwitchChecked(switchValue);
    if (switchValue) {
      fileServiceInstance.set(path + props.meta.name, ["public", true]);
    } else {
      fileServiceInstance.unset(path + props.meta.name, "public");
    }
    setTimeout(() => {
      OnRefresh();
    }, 1000);
  };

  function OnRefresh() {
    if (path.charAt(path.length - 1) !== "/")
      path = path + "/";
    dispatch(Actions.getFiles(path, "GET_FILES"));
  }

  const handleReadACLChipDelete = (chipToDelete) => () => {
    setReadACLChipData((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
    fileServiceInstance.revoke(
      path + props.meta.name,
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
      path + props.meta.name,
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
      path + props.meta.name,
      ["compute"],
      chipToDelete,
      false
    );
    setTimeout(() => {
      OnRefresh();
    }, 1000);
  };


  return (
    <div className="flex-grow w-full flex flex-col h-full">
      <table className={clsx(classes.table, "w-full, text-left")}>
        <tbody>
          <tr className="owner">
            <th>Owner</th>
            <td title={props.meta.owner_id}>
              {props.meta.owner_id}
            </td>
          </tr>
          <tr className="public">
            <th>Public</th>
            <td title={props.meta.public.toString()}>
              {tokenData.sub === props.meta.owner_id ? (
                <Switch
                  checked={switchchecked}
                  onChange={handleSwitchChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              ) : (
                props.meta.public.toString()
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {tokenData.sub === props.meta.owner_id ? (
        <div className='buttonHr'>
          <hr

          />
          {/* <div> */}
          <Tooltip title="Manage permissions" aria-label="add">
            <Fab
              // style={add_icon}
              color="secondary"
              aria-label="add"
              size="small"
            // className="flex flex-col absolute bottom-0 d-none d-sm-block  left-0 ml-16 -mb-12 z-999"
            >
              <Icon
                className="flex flex-col"
                onClick={addPermissions}
              >
                add
              </Icon>
            </Fab>
          </Tooltip>
          <hr
            style={{
              flex: 'none',
              width: '45px'
            }}
          />
          {/* </div> */}
          <br />
        </div>
      ) : (
        <></>
      )}

      <table className={clsx(classes.table, "w-full, text-left")}>
        <tbody>
          <tr className="readacl">
            <th>Read ACL</th>
            <td title={props.meta.readACL.join(", ")}>
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
                        tokenData.sub === props.meta.owner_id &&
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
            <td title={props.meta.writeACL.join(", ")}>
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
                        tokenData.sub === props.meta.owner_id &&
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
            <td title={props.meta.computeACL.join(", ")}>
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
                        tokenData.sub === props.meta.owner_id &&
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
    </div>
  )

}

export default PermissionsPanel;


