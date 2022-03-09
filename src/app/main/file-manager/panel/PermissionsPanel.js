import React, { useEffect, useState } from "react";

import { LinearProgress, CircularProgress, Typography,Paper,Tooltip,Icon,Fab,Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import instance from "app/services/sciductService/sciductService.js";
import { FileService } from "node-sciduct";
import { Group as GroupIcon, Person as PersonIcon } from "@material-ui/icons";
import Chip from "@mui/material/Chip";
import FormControlLabel from '@mui/material/FormControlLabel';
import "../FileManager.css";

const useStyles = makeStyles({
  table: {
    "& th": {
      padding: "16px 0px",
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

function PermissionsPanel(props) {
  const classes = useStyles();
  var tokenData = instance.getTokenData();
  const [switchchecked, setSwitchChecked] = useState(false);
  const [readACLchipData, setReadACLChipData] = useState([]);
  const [writeACLchipData, setWriteACLChipData] = useState([]);
  const [computeACLchipData, setComputeACLChipData] = useState([]);
  const [switchChangeFlag, setSwitchChangeFlag] = useState(false);

  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`;
  var token = localStorage.getItem("id_token");
  var path = window.location.pathname.replace("/files", "");
  const fileServiceInstance = new FileService(url, token);

  useEffect(() => {
    if (Object.keys(props.meta).length !== 0) {
      setSwitchChecked(props.meta.public);
      var readACL = changeACLOrder(props.meta.readACL);
      var writeACL = changeACLOrder(props.meta.writeACL);
      var computeACL = changeACLOrder(props.meta.computeACL);

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

  function OnRefresh() {
    return props.onModify();
  }

 function addPermissions() {
   props.showPermissionsDialog(true);
  }

  const handleSwitchChange = (event) => {
    setSwitchChangeFlag(true);
    let switchValue = event.target.checked;
    if (switchValue) {
      fileServiceInstance.set(path + props.meta.name, ["public", true]);
    } else {
      fileServiceInstance.unset(path + props.meta.name, "public");
    }
    OnRefresh().then(()=> {
      setSwitchChecked(switchValue);
      setSwitchChangeFlag(false);
    });
  };

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
  };

  return (
    <div>
      {Object.keys(props.meta).length !== 0 ? (
        <div className="flex-grow w-full flex flex-col h-full">
        <table className={clsx(classes.table, "w-full, text-left")}>
          <tbody>
            <tr className="owner">
              <th>Owner</th>
              <td title={props.meta.owner_id}>{props.meta.owner_id}</td>
            </tr>
            <tr className="public">
              <th>Public</th>
              <td title={props.meta.public.toString()}>
                {tokenData.sub === props.meta.owner_id ? (
                  <FormControlLabel 
                    control={<Switch checked={switchchecked} onChange={handleSwitchChange} inputProps={{ "aria-label": "controlled" }}/>}
                    label={switchChangeFlag ? <CircularProgress size={20} color="secondary"/> : <CircularProgress size={20} variant="determinate" value={0}/>}
                  />  
                ) : (
                  props.meta.public.toString()
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {tokenData.sub === props.meta.owner_id ? (
          <div className="buttonHr">
            <hr />
            {/* <div> */}
            <Tooltip title="Manage permissions" aria-label="add">
              <Fab
                // style={add_icon}
                color="secondary"
                aria-label="add"
                size="small"
                // className="flex flex-col absolute bottom-0 d-none d-sm-block  left-0 ml-16 -mb-12 z-999"
              >
                <Icon className="flex flex-col" onClick={addPermissions}>
                  add
                </Icon>
              </Fab>
            </Tooltip>
            <hr
              style={{
                flex: "none",
                width: "45px",
              }}
            />
            {/* </div> */}
            <br />
          </div>
        ) : (
          <></>
        )}

        {props.permissionLoadFlag ? (
          <div className="flex flex-1 flex-col items-center mt-40">
            <Typography className="text-20 mt-16" color="textPrimary">
              Loading
            </Typography>
            <LinearProgress className="w-xs" color="secondary" />
          </div>
        ) : (
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
                          label={data.startsWith("#") ? data.slice(1) : data}
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
                          label={data.startsWith("#") ? data.slice(1) : data}
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
                          label={data.startsWith("#") ? data.slice(1) : data}
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
        )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center mt-40">
            <Typography className="text-20 mt-16" color="textPrimary">
              Loading
            </Typography>
            <LinearProgress className="w-xs" color="secondary" />
        </div>
      )}
    </div>
  );
}

export default PermissionsPanel;
