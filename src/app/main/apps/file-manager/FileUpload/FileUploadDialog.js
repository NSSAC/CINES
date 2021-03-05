import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FuseAnimate } from '@fuse';
import { Icon, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuTableCell from "./MenuTableCell";
import FILEUPLOAD_CONFIG from "./FileUploadconfig";
import * as Actions from '../store/actions';
import './FileUpload.css'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const FileUpload = ({ fileTypes, setUploadFile, dialogTargetPath, setShowModal, showModal, handleClose, breadcrumbArr }) => {
  const useStyles = makeStyles({
    table: {
      minWidth: 450,
    },
    customeButton: {
      alignSelf: 'baseline',
      border: '2px solid ',
      color: 'black',
      backgroundColor: 'white',
      width: '100px',
      height: '31px',

    },
    input: {
      padding: 10,
      display: "none",
    },
    typeIcon: {
      '&.clear:before': {
        content: "'clear'",
        color: 'white'
      },
      '&:before': {
        content: "'clear'",
        color: '#1565C0'
      }
    }

  });

  var fileData = [];
  var fileTypeArray = FILEUPLOAD_CONFIG.fileType
  if (dialogTargetPath) {
    fileTypeArray = fileTypes
  }
  const [initialUploadFile, setUploadedfiles] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const classes = useStyles();
  const dispatch = useDispatch();
  const fileInput = useRef();
  var vaildTypeFileArray = [];
  // const [uploading, setUploading] = useState(false);

  const ellipsis = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '170px',
    cursor: 'default'
  }

  const breadcrumb_wrap = {
    width: '100%',
    flexWrap: 'wrap'
  }

  const [isDrag, setDrag] = useState(false);
  const onChangeHandler = (event) => {

    fileData = []
    setUploadedfiles([...fileData]);
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let fileDataObject = {};
      fileDataObject.type = event.target.files[i].name.split('.').pop();
      if(fileTypeArray.length === 1)
         fileDataObject.type = fileTypeArray[0];
      fileDataObject.fileName = event.target.files[i].name;
      fileDataObject.size = event.target.files[i].size;
      fileDataObject.id = i;
      fileDataObject.status = "-";
      fileDataObject['contents'] = event.target.files[i];
      fileData.push(fileDataObject);

    }
    setUploadedfiles([...fileData]);
    setDisableButton(false);
  }

  const progressStatus = (status, id) => {
    var fileList = []
    initialUploadFile.forEach(item => {
      if (item.id === id) {
        if (status !== 100) {
          if (initialUploadFile[id].status !== "Uploading-Failed (file already exist) 0%") {
            if (initialUploadFile[id].status !== "Uploading-Failed (unsupported file name only '-_.'are allowed) 0%") {
              item.status = "Uploading-" + status + "%";
              fileList.push(item);
            }
          }
          else {
            item.status = initialUploadFile[id].status;
          }
        }
        else {
          if (initialUploadFile[id].status !== "Uploading-Failed (file already exist) 0%") {
            if (initialUploadFile[id].status !== "Uploading-Failed (unsupported file name only '-_.'are allowed) 0%") {
              item.status = "Uploaded successfully";
              fileList.push(item);
            }
          }
        }
      }
      else {
        fileList.push(item);
      }
    })
    setUploadedfiles([...fileList]);
    setDisableButton(true);

    let count = 0;
    let target = window.location.pathname;
    let targetPath = target.replace("/apps/files", "");

    if (dialogTargetPath) {
      targetPath = dialogTargetPath;
    }

    initialUploadFile.forEach(item => {

      if (item.status === "Uploaded successfully" || item.status === "Uploading-Failed (file already exist) 0%" || item.status === "Uploading-Failed (unsupported file type) 0%" || item.status === "Uploading-Failed (unsupported file name only '-_.'are allowed) 0%") {
        count++
        if (count === initialUploadFile.length) {
          dispatch(Actions.getFiles(targetPath, 'GET_FILES'));
        }
      }
    })
  }

  const onCancle = () => {
    let fileData1 = [];
    setUploadedfiles([...fileData1]);
    handleClose()
    if (dialogTargetPath)
      setShowModal(true);
  }

  const OnUploadAndSubmit = () => {
    OnUpload()
  }

  const OnUpload = () => {
    setDisableButton(true);
    CreateFolderFile(initialUploadFile);
  }

  const deleteIndividual = (index => {

    initialUploadFile.splice(index, 1);

    setUploadedfiles([...initialUploadFile]);

  })
  const CreateFolderFile = (initialUploadFile, targetPath) => {

    initialUploadFile.forEach(items => {
      if (fileTypeArray.includes(items.type)) {
        vaildTypeFileArray.push(items);
      }

    })
    const userToken = localStorage.getItem('id_token')
    initialUploadFile.forEach(element => {

      let fileName = element.fileName;
      let type = element.type;

      let target = window.location.pathname;
      let id = element.id;
      let targetPath = target.replace("/apps/files", "")
      if (dialogTargetPath)
        targetPath = dialogTargetPath;

      return axios({
        method: 'post',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${targetPath}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,

        },
        data: {
          "name": fileName,
          "type": type
        },
      }).then(res => {
        writeContent();
      },

        (error) => {
          if (error.response.data.message === "File already exists") {
            progressStatus("Failed (file already exist) 0", id);
          }

          else if (error.response.data.message === "data.type should be equal to one of the allowed values") {
            progressStatus("Failed (unsupported file type) 0", id);
          }
          else {
            progressStatus("Failed (unsupported file name only '-_.'are allowed) 0", id);
          }
        }
      )
    });
  }

  const writeContent = () => {

    const userToken = localStorage.getItem('id_token')

    vaildTypeFileArray.forEach(element => {

      let fileName = element.fileName;
      let content = element.contents;
      let target = window.location.pathname;
      let id = element.id;
      let targetPath = target.replace("/apps/files", "")
      if (dialogTargetPath)
        targetPath = dialogTargetPath;

      axios({
        method: 'put',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${targetPath}${fileName}`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '* ',
          'Authorization': userToken,

        },
        data: content,
        onUploadProgress: (progress) => {
          const percentage = Math.floor(progress.loaded * 100 / progress.total)
          progressStatus(percentage, id);
        }
      }).then(res => {
        if (dialogTargetPath) {
          setUploadFile(element.fileName);
          setUploadedfiles([]);
          handleClose();
        }
      },
        (error) => { }
      )
    });
  }

  const handleStatus = (id) => (e) => {
    initialUploadFile[id].type = e.target.value;
    setUploadedfiles([...initialUploadFile]);

  }
  const openFileDialog = () => {
    fileInput.current.value=''
    fileInput.current.click();
  };
  const handleDragOver = e => {
    e.preventDefault();
    setDrag(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setDrag(false);
  };



  const handleDrop = e => {
    e.preventDefault();
    const draggedFiles = [];
    if ((!dialogTargetPath && e.dataTransfer.items) || (dialogTargetPath && e.dataTransfer.items.length === 1)) {
      Array.from(e.dataTransfer.items).forEach((item, i) => {

        if (item.kind === "file") {

          let file = item.getAsFile();
          let tempObj = {};
          tempObj.type = file.name.split('.').pop();
          tempObj.fileName = file.name;
          tempObj.id = i;
          tempObj.status = "-";
          tempObj['contents'] = file;
          draggedFiles.push(tempObj);
        }
      });

      setUploadedfiles([...draggedFiles]);
      setDisableButton(false);
    }

    setDrag(false);
  };



  return (
    <React.Fragment>
      <Dialog className="w-500"
        open={showModal}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" divider="true">{"File Upload (Click or Drag and Drop)"}</DialogTitle>
        <DialogContent divider="true">
          <DialogContentText className='mb-0' id="alert-dialog-slide-description">
            {breadcrumbArr?<span className="flex text-16 sm:text-16" style={breadcrumb_wrap}>
              {breadcrumbArr.map((path, i) => (
                <span key={i} className="flex items-center" >
                  <span  title={path} style={ellipsis} >{path} </span>
                  {breadcrumbArr.length - 1 !== i && (
                    <Icon>chevron_right</Icon>
                  )}
                </span>))}
            </span>:null}
          </DialogContentText>
          {/* <input className={classes.input} ref={fileInput} type="file" multiple onChange={onChangeHandler} />
          <button className={classes.customeButton} onClick={openFileDialog} type="button" >Choose File</button> */}
        </DialogContent>


        <div className={`file-upload-container ${isDrag ? "drag" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {dialogTargetPath ? <input className={classes.input} ref={fileInput} type="file" onChange={onChangeHandler} /> :
            <input className={classes.input} ref={fileInput} type="file" multiple onChange={onChangeHandler} />}
          <button className={classes.customeButton} onClick={openFileDialog} type="button" >Choose File</button>

          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell className="hidden sm:table-cell">Type</TableCell>
                  <TableCell className="hidden sm:table-cell">Status</TableCell>

                  {initialUploadFile.length === 0 ? null : <TableCell className=" p-0 text-center">
                    Remove
          </TableCell>}
                  <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>

                </TableRow>
              </TableHead>

              <TableBody className="max-w-100 w-100 p-0 text-center">
                {initialUploadFile.length === 0 ?
                  <TableRow className="cursor-pointer">
                    <TableCell className="max-w-30 w-30 p-0 text-center"> </TableCell>
                    <TableCell className="hidden sm:table-cell">No file selected</TableCell>
                    <TableCell className="hidden sm:table-cell">--</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">--</TableCell>
                    <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>

                  </TableRow> :
                  initialUploadFile.map((node, index) => {
                    return (
                      <TableRow
                        key={node.id}
                        className="cursor-pointer" >

                        <TableCell className="max-w-30 w-30 p-0 text-center"> </TableCell>
                        <TableCell style={{ wordBreak: 'break-all' }} className=" max-w-30 w-30 p-0 hidden sm:table-cell">{node.fileName}</TableCell>
                        {fileTypeArray.length > 1 ?
                          <MenuTableCell
                            value={node.type}
                            onChange={handleStatus(node.id)}
                          >
                            {

                              fileTypeArray.map((item) => {
                                return (
                                  <MenuItem key={item} value={item}>{item}</MenuItem>
                                )

                              })
                            }
                          </MenuTableCell> :
                          <TableCell className=" hidden sm:table-cell">{fileTypeArray[0]}</TableCell>}
                        <TableCell className=" hidden sm:table-cell">{node.status}
                        </TableCell>
                        <TableCell className=" hidden sm:table-cell">
                          <Button
                            variant="contained"
                            ////size="small"
                            color="secondary"
                            className={classes.button}
                            disabled={disableButton}
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteIndividual(index)}             >
                            Remove
                                     </Button>
                        </TableCell>
                        <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </FuseAnimate>


        </div>


        <DialogActions>
          {dialogTargetPath ?
            <Button onClick={OnUploadAndSubmit} variant="contained"
              color="default"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
              disabled={initialUploadFile.length === 0 || disableButton} >
              Upload and Submit
          </Button> :
            <Button onClick={OnUpload} variant="contained"
              color="default"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
              disabled={initialUploadFile.length === 0 || disableButton} >
              Upload
          </Button>
          }

          <Button onClick={onCancle}>
            Close
          </Button>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
