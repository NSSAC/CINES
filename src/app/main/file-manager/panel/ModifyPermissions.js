/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
import React, { Fragment, useEffect, useState, useRef } from "react";
import { FileService, UserService } from "node-sciduct";

import { Fab, Icon, TextField, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Person as PersonIcon } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

import Formsy from "formsy-react";
import { CheckboxFormsy } from "@fuse/components/formsy";
import "../FileManager.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ModifyPermissions = ({ showModal, handleClose, onModify, selected, setPermissionLoading }) => {
  // var targetPath = props.location.pathname.replace("/apps/files", "");
  const ref = useRef();
  const [, setIsFormValid] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchFlag, setSearchFlag] = useState(true);
  const [addFlag, setAddFlag] = useState(false);
  const [submitPermClick, setSubmitPermClick] = useState(false);
  const [usersData] = useState({
    errorArr: [],
    successCount: 0,
    flag: false,
  });
  
  var path = window.location.pathname.replace("/files", "");
  var token = localStorage.getItem("id_token");

  const handleAddField = () => {
    setSearchFlag(true);
    setAddFlag(false);
    setSearchResults([]);
  };

  const handleRemoveFields = (index) => {
    const values = [...users];
    values.splice(index, 1);
    setUsers(values);
    setAddFlag(false);
    setSearchFlag(true);
  };

  const handleCheckbox = (perm, index) => {
    const values = [...users];
    values[index][perm] = !values[index][perm];
    setUsers(values);
    // console.log(values);
  };

  const reset = (closeArg) => {
    setUsers(users.slice(0, 1));
    setAddFlag(false);
    setSearchFlag(true);
    if (closeArg !== null) handleClose();
  };

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  const handleChange = (event) => setSearchValue(event.target.value);

  // function OnRefresh() {
  //   onModify()
  // }

  function addUser(event, value) {
    const values = [...users];
    values.push({
      id: value.id,
      name: value.id,
      readACL: selected.readACL.indexOf(value.id) !== -1 ? true : false,
      computeACL:
        selected.computeACL.indexOf(value.id) !== -1 ? true : false,
      writeACL: selected.writeACL.indexOf(value.id) !== -1 ? true : false,
    });
    setUsers(values);
    setSearchFlag(false);
    setAddFlag(true);
  }

  const permApiExec = (user) => {
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`;
    const fileServiceInstance = new FileService(url, token);
    let newError = [];
    var perm = [];
    if (
      selected.readACL.indexOf(user.id) !== -1 ||
      selected.writeACL.indexOf(user.id) !== -1 ||
      selected.computeACL.indexOf(user.id) !== -1
    ) {
      perm = ["read", "compute", "write"];
      return fileServiceInstance
        .revoke(path + selected.name, perm, user.id, false)
        .then(() => {
          perm = [];
          if (user.readACL === true) perm.push("read");
          if (user.computeACL === true) perm.push("compute");
          if (user.writeACL === true) perm.push("write");
          fileServiceInstance
            .grant(path + selected.name, perm, user.id, false)
        })
        .catch((error) => {
          newError = newError.concat(usersData.errorArr);
          newError.push(user);
        });
    } else {
      if (user.readACL === true) perm.push("read");
      if (user.computeACL === true) perm.push("compute");
      if (user.writeACL === true) perm.push("write");
      return fileServiceInstance
        .grant(path + selected.name, perm, user.id, false)
        .catch((error) => {
          newError = newError.concat(usersData.errorArr);
          newError.push(user);
        });
    }
  };

  const onSubmit = async () => {
    setSubmitPermClick(true);
    setPermissionLoading(true);
    for await (const user of users) {
      await permApiExec(user);
    }
    reset("close");
    setSubmitPermClick(false);
  }

  function onEntered() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
    }
  }

  function onExiting() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = "auto";
      document.body.style.position = "relative";
    }
  }

  useEffect(() => {
    if(searchValue !== "") {
      const url = `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}/`;
      const userServiceInstance = new UserService(url, token);
      Promise.all([userServiceInstance.queryUsers(`or(eq(id,re:${searchValue}),eq(name,re:${searchValue}))&limit(5)`), userServiceInstance.queryTeams(`or(eq(id,re:${searchValue}),eq(name,re:${searchValue}))&limit(5)`)])
        .then(([responseUsers, responseTeams]) => {
          // if(responseTeams.length===0)
          // otherResponse=[{id: "nssac", first_name: "nssac", last_name: "nssac", organization: "persistent"},{id: "epihiper", first_name: "epihiper", last_name: "epihiper", organization: "persistent"}]
          responseTeams.length = Math.min(5-responseUsers.length, responseTeams.length)
          setSearchResults([...responseUsers, ...responseTeams]);
      })
    }
  }, [searchValue]);

  useEffect(() => {
    ref.current && ref.current.focus();
  }, [addFlag]);

  useEffect(() => {
    setUsers([]);
  }, [selected]);

  useEffect(() => {
    selected &&
      users.length === 0 &&
      users.push({
        id: "All users",
        name: "All users",
        readACL:
          selected.readACL.indexOf("All users") !== -1 ? true : false,
        computeACL:
          selected.computeACL.indexOf("All users") !== -1 ? true : false,
        writeACL:
          selected.writeACL.indexOf("All users") !== -1 ? true : false,
      });
  }, [selected, users]);

  return (
    <React.Fragment>
      <Dialog
        classsearchvalue="w-500"
        open={showModal}
        TransitionComponent={Transition}
        onEntered={onEntered}
        onExiting={onExiting}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">
          {"Set Permissions"}
        </DialogTitle>
        <DialogContent divider="true">
          <div style={{ display: "flex" }}>
            <Formsy
              onValid={enableButton}
              onInvalid={disableButton}
              className="flex flex-col justify-center"
            >
              {users.map((user, index) => (
                <div className="usersPermission" key={index}>
                  {user.id !== "All users" && (
                    <button
                      // className="btn btn-link mt-48"
                      type="button"
                      style={{ float: "right" }}
                      title="Delete user"
                      onClick={() => handleRemoveFields(index)}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                  <h3>
                    <Fragment>
                      {user.id === "All users" ? (
                        <PersonIcon className="person_icon" />
                      ) : (
                        <PersonIcon className="person_icon" />
                      )}
                      &nbsp;{user.name}
                    </Fragment>
                  </h3>
                  <div style={{ display: "inline-block" }}>
                    <CheckboxFormsy
                      type="checkbox"
                      name="readACL"
                      label="Read ACL"
                      value={user.readACL}
                      onChange={() => handleCheckbox("readACL", index)}
                    ></CheckboxFormsy>
                    <CheckboxFormsy
                      type="checkbox"
                      name="writeACL"
                      label="Write ACL"
                      value={user.writeACL}
                      onChange={() => handleCheckbox("writeACL", index)}
                    ></CheckboxFormsy>
                    <CheckboxFormsy
                      type="checkbox"
                      name="computeACL"
                      label="Compute ACL"
                      value={user.computeACL}
                      onChange={() => handleCheckbox("computeACL", index)}
                    ></CheckboxFormsy>
                  </div>
                </div>
              ))}
            </Formsy>
            {addFlag && (
              <Tooltip title="Add user" aria-label="add">
                <Fab
                  color="secondary"
                  aria-label="add"
                  size="small"
                  className="ml-20 mb-12"
                  style={{ alignSelf: "flex-end", marginLeft: "20px" }}
                >
                  <Icon className="flex flex-col" onClick={handleAddField}>
                    add
                  </Icon>
                </Fab>
              </Tooltip>
            )}
          </div>
          {searchFlag && (
            <Autocomplete
              className='m-5'
              autoHighlight
              id="tags-outlined"
              disabled={submitPermClick}
              onChange={(event, value) => addUser(event, value)}
              options={searchResults.filter(
                (x) => users.map((user) => user.id).indexOf(x.id) === -1
              )}
              renderOption={(option) => {
                return (
                  <Fragment>
                    <PersonIcon className="person_icon" />
                    &nbsp;{option.id}
                  </Fragment>
                );
              }}
              getOptionLabel={(option) => option.id}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  variant="standard"
                  type="text"
                  searchvalue="user"
                  label="Search by user / teams"
                  value=""
                  disabled={submitPermClick}
                  onChange={(e) => handleChange(e)}
                />
              )}
            ></Autocomplete>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onSubmit}
            disabled={users.length === 0 || submitPermClick}
            variant="contained"
            color="default"
          >
            Add
          </Button>
          <Button
            onClick={() => reset(null)}
            disabled={users.length === 0}
            variant="contained"
            color="default"
          >
            Reset
          </Button>
          <Button onClick={() => reset("close")}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
