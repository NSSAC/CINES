import React, { Fragment, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Formsy from "formsy-react";
import {useSelector } from "react-redux";
import { toast, ToastContainer } from "material-react-toastify";
import ReactDOM from 'react-dom';
import { FileService, UserService } from "node-sciduct";
import { Autocomplete } from "@material-ui/lab";
import { Fab, Icon, TextField, Tooltip } from "@material-ui/core";
import { CheckboxFormsy } from "@fuse/components/formsy";
import DeleteIcon from '@material-ui/icons/Delete';
import { Person as PersonIcon, Group as GroupIcon } from '@material-ui/icons';
import './FileManager.css'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ModifyPermissions = ({
    showModal,
    handleClose,
    selectedVal
}) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchFlag, setSearchFlag] = useState(true);
    const [addFlag, setAddFlag] = useState(false);
    const [usersData, setUsersData] = useState({
        errorArr: [],
        successCount: 0,
        flag: false,
      });
    const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
    const selectedItem = useSelector(
        ({ fileManagerApp }) => files[fileManagerApp.selectedItemId]
    );
    var path = window.location.pathname.replace("/apps/files", "");
    // eslint-disable-next-line 
    var token = localStorage.getItem("id_token")

    const handleAddField = () => {
        setSearchFlag(true)
        setAddFlag(false)
    };

    const handleRemoveFields = index => {
        const values = [...users];
        values.splice(index, 1);
        setUsers(values);
        setAddFlag(false)
        setSearchFlag(true)
    };

    const handleCheckbox = (perm, index) => {
        const values = [...users];
        values[index][perm] = !values[index][perm];
        setUsers(values);
        console.log(values)
    };

    const reset = (closeArg) => {
        setUsers(users.slice(0,1))
        setAddFlag(false)
        setSearchFlag(true)
        if (closeArg !== null)
            handleClose()
    }

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    const handleChange = (event) => setSearchValue(event.target.value);

    function addUser(event, value) {
        const values = [...users];
        values.push({
            id: value.id,
            name: value.id,
            readACL: selectedItem.readACL.indexOf(value.id) !== -1 ? true : false,
            computeACL: selectedItem.computeACL.indexOf(value.id) !== -1 ? true : false,
            writeACL: selectedItem.writeACL.indexOf(value.id) !== -1 ? true : false
        });
        setUsers(values);
        console.log(values)
        setSearchFlag(false)
        setAddFlag(true)
    }

    function onSubmit() {
        const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
        const fileServiceInstance = new FileService(url, token);
        let newError = [];
        var tempCount = 0;
        var allNewUsers = users.map(user => {
            var perm = []
            if (selectedItem.readACL.indexOf(user.id) !== -1 || selectedItem.writeACL.indexOf(user.id) !== -1 || selectedItem.computeACL.indexOf(user.id) !== -1) {
                perm = ['read', 'compute', 'write']
                fileServiceInstance.revoke(
                    path + selectedItem.name,
                    perm,
                    user.id,
                    false
                ).then(
                    (() => {
                        perm = []
                        if (user.readACL === true)
                            perm.push('read')
                        if (user.computeACL === true)
                            perm.push('compute')
                        if (user.writeACL === true)
                            perm.push('write')
                        fileServiceInstance.grant(
                            path + selectedItem.name,
                            perm,
                            user.id,
                            false
                        ).then((response) => {
                            tempCount = tempCount + 1;
                          })
                          
                    }
                    )).catch((error) => {
                        newError = newError.concat(usersData.errorArr);
                        newError.push(user);
                      })
            }
            else {
                if (user.readACL === true)
                    perm.push('read')
                if (user.computeACL === true)
                    perm.push('compute')
                if (user.writeACL === true)
                    perm.push('write')
                fileServiceInstance.grant(
                    path + selectedItem.name,
                    perm,
                    user.id,
                    false
                ).then((response) => {
                    tempCount = tempCount + 1;
                  }).catch((error) => {
                    newError = newError.concat(usersData.errorArr);
                    newError.push(user);
                  })
            }
        })

        return Promise.all(allNewUsers).then(() => {
            reset('close')
        })
    }

    function onEntered() {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
        }

    }

    function onExiting() {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'relative';
        }
    }

    useEffect(() => {
        const url = `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}/`
        const userServiceInstance = new UserService(url, token)
        userServiceInstance.queryUsers(`or(eq(id,re:${searchValue}),eq(first_name,${searchValue}),eq(name,${searchValue}))&limit(5)`)
            .then(response => {
                setSearchResults(response)
            })

    }, [searchValue])

    useEffect(()=>{
        selectedItem && users.length === 0 && users.push({
            id: '*',
            name: 'All users',
            readACL: selectedItem.readACL.indexOf('*') !== -1 ? true : false,
            computeACL: selectedItem.computeACL.indexOf('*') !== -1 ? true : false,
            writeACL: selectedItem.writeACL.indexOf('*') !== -1 ? true : false
        })
    },[selectedItem])

    return (
        <React.Fragment>
          <Dialog
                classsearchValue="w-500"
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
                    <div style={{ display: 'flex' }}>
                        <Formsy
                            onValid={enableButton}
                            onInvalid={disableButton}
                            className="flex flex-col justify-center"
                        >
                           
                            {users.map((user, index) =>

                                <div className='usersPermission'>
                                    {user.id !== '*' && <button
                                        // className="btn btn-link mt-48"
                                        type="button"
                                        style={{ float: 'right' }}
                                        title='Delete user'
                                        onClick={() => handleRemoveFields(index)}
                                    >
                                        <DeleteIcon />
                                    </button>}
                                    <h3><Fragment>
                                    {user.id === '*' ? <PersonIcon className="person_icon" /> : <PersonIcon className="person_icon" />}
                                        &nbsp;{user.name}
                                    </Fragment></h3>
                                    <div style={{ display: 'inline-block' }}>
                                        <CheckboxFormsy
                                            type="checkbox"
                                            name="readACL"
                                            label="Read ACL"
                                            value={user.readACL}
                                            onChange={() => handleCheckbox('readACL', index)}
                                        >
                                        </CheckboxFormsy>
                                        <CheckboxFormsy
                                            type="checkbox"
                                            name="computeACL"
                                            label="Compute ACL"
                                            value={user.computeACL}
                                            onChange={() => handleCheckbox('computeACL', index)}
                                        >
                                        </CheckboxFormsy>
                                        <CheckboxFormsy
                                            type="checkbox"
                                            name="writeACL"
                                            label="Write ACL"
                                            value={user.writeACL}
                                            onChange={() => handleCheckbox('writeACL', index)}
                                        >
                                        </CheckboxFormsy>
                                    </div>
                                </div>)}

                        </Formsy>
                        {addFlag && <Tooltip title="Add user" aria-label="add">
                            <Fab
                                color="secondary"
                                aria-label="add"
                                size="small"
                                className="ml-20 mb-12"
                                style={{ alignSelf: 'flex-end', marginLeft: '20px' }}
                            >
                                <Icon
                                    className="flex flex-col"
                                    onClick={handleAddField}
                                >
                                    add
                                </Icon>
                            </Fab>
                        </Tooltip>}
                    </div>
                    {searchFlag &&
                        <Autocomplete
                            autoHighlight
                            id="tags-outlined"
                            onChange={(event, value) => addUser(event, value)}
                            options={searchResults.filter(x=>(users.map(user=>user.id)).indexOf(x.id) === -1)}
                            renderOption={(option) => {
                                return (<Fragment>
                                    <PersonIcon className="person_icon" />
                                    &nbsp;{option.id}
                                </Fragment>)
                            }}
                            getOptionLabel={(option) => option.id}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    type="text"
                                    searchValue="user"
                                    label="Search by user / teams"
                                    value=''
                                    onChange={(e) => handleChange(e)}
                                />
                            )}>
                        </Autocomplete>}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onSubmit}
                        disabled={users.length === 0}
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
                    <Button onClick={() => reset('close')}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
