import { Icon, LinearProgress, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import withReducer from "app/store/withReducer";

import Breadcrumb from "./Breadcrumb";
import FileList from "./FileList/";
import { file_viewers_map } from "./FileManagerAppConfig";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { blacklisted_FileType } from "./FileManagerAppConfig";

import './FileManager.css'
// import DatasetLanding from "./DatasetLanding";
const useStyles = makeStyles(theme => ({
  root                     : {
    backgroundColor: theme.palette.background.default,
  },
  header                     :{
    background     : 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.dark + ' 100%)',
    color          : theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark
  }
}));


function FileManagerApp(props) {
  const dispatch=useDispatch()
  const classes = useStyles(props);

  // const [editContent,setEditContent] = useState(false)
  // const [prompt,setPrompt] = useState(false)
  // const [search,setSearch] = useState("")
  const [fileActions, setFileActions] = useState();
  const [menuItems, setMenuItems] = useState();
  const user = useSelector(({auth}) => auth.user)
  const file_meta = useSelector(({ fileManagerApp }) => fileManagerApp.file_meta);
  const usermeta_updater = useSelector(({ fileManagerApp }) => fileManagerApp.usermeta);
  const file_path = "/" + ((props.match.params && props.match.params.path)?props.match.params.path:"")
  const history =  useHistory()
  let defaultType = ""

  const matches = useMediaQuery("(min-width:600px)");
//   const dataset = {
//     "License": "CC-BY-4.0",
//     "Description": "geographic reference frame for the Richmond (VA) area derived from the data set 'TIGER/Line Shapefile, 2017, 2010 state, Virginia, 2010 Census Block State-based' and the file tl_2017_51_tabblock10.zip provided at https://catalog.data.gov/dataset/tiger-line-shapefile-2017-2010-state-virginia-2010-census-block-state-based and retrieved in January 2023.",
//     "Nodes ": "5",
//     "Edges": "4",
//     "Edge Directionality": "undirected",
//     'Edge Attributed': "FALSE",
//     "Node Attributed": "FALSE",
//     "Weakly Connected": "TRUE",
//     "Estimated Graph Diameter": "4"
// }
  React.useEffect(()=>{
    if (!usermeta_updater || (usermeta_updater && !usermeta_updater.updating)){
      dispatch(Actions.getFileMeta(file_path))
    }
  },[dispatch,file_path, usermeta_updater,usermeta_updater.updating])

  React.useEffect(()=>{
    // console.log("File Meta or Path updated")
    // if (file_meta && !file_meta.isContainer){
      setFileActions()
    // }

    if (file_meta && file_meta.isContainer && history.location.pathname.charAt(history.location.pathname.length-1)!=="/"){
        history.replace(`${history.location.pathname}/`)
    }

  },[file_meta, history,history.location.pathname]);

  if (!file_meta){
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    )
  }

  function navigateHome(evt){
    evt.preventDefault()
    props.history.push("/home")
  }

  function downloadFile(meta) {
    const token = localStorage.getItem("id_token");
    let url;
    let accept = "application/octet-stream" 
    if (meta.container_id && meta.name) {
        url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${meta.container_id}/${meta.name}?${token ? "http_authorization=" + token : ""}&http_accept=application/octet-stream`
    } else {
        url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${meta.id}?${token ? "http_authorization=" + token : ""}&&http_accept=${encodeURIComponent(accept)}`
    }

    let link = document.createElement("a");
    link.href = url;
    link.download = meta.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

  return (
    <div className={`${clsx(classes.root)} flex flex-col w-full h-full`}>
      <div
        className={
          !matches
            ? `w-full flex flex-col justify-between ${clsx(
                classes.header
              )}`
            : `w-full flex flex-col  ${clsx(
                classes.header
              )}`
        }
      >
        <div className="flex flex-row">
          <div className=" text-baseline mt-18 mr-8 py-10" style={{flex: "0 2 auto"}}>
            <Icon
              className="ml-8 text-18 cursor-pointer inline align-top"
              onClick={navigateHome}
            >
              home
            </Icon>
            <Icon className="text-18">chevron_right</Icon>
            <Breadcrumb props={props} path={file_path} meta={file_meta} abc="adfad" className="text-white" />
          </div>
          <div className="flex-grow text-right flex-row text-lg m-0">
            {fileActions}
            {menuItems}
            {!file_meta.isContainer ?
              <IconButton title="Click to Download" className="w-64 h-64" onClick={() => downloadFile(file_meta)}>
                <Icon className="text-white text-4xl">cloud_download</Icon>
              </IconButton>
              :
              ""
            }
          </div>
        </div>

        {/* <div className="pb-10">
          <DatasetLanding dataset={dataset} />
        </div> */}

      </div>
      <div className="flex-grow  m-0 p-0  flex flex-col">
        {((file_meta, file_path) => {
          if (file_meta && file_meta.error) {
            if (file_meta.error === "Forbidden") {
              // console.log("user: ", user);
              const userServiceURL = `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`;
              const sciductID = `${process.env.REACT_APP_SCIDUCT_APP_ID}`;
              var loginURL = userServiceURL + "/authenticate/" + sciductID;
              return (
                <div className="text-lg text-center p-8">
                  {user && (
                    <span>
                      You don't have permission to view this file. Perhaps you
                      need to <a href={loginURL}>login</a>?
                    </span>
                  )}
                  {!user && (
                    <span>
                      There was an error retrieving this file: {file_meta.error}{" "}
                    </span>
                  )}
                </div>
              );
            }
            return (
              <div>
                Oops, there was a problem retrieving this file:&nbsp;
                {file_meta.error}
              </div>
            );
          }
          if (!file_meta || !file_meta.id) {
            return (
              <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">
                  Loading
                </Typography>
                <LinearProgress className="w-xs" color="secondary" />
              </div>
            );
          }

          if(file_meta.type && file_meta.type !== "folder" && !file_viewers_map.hasOwnProperty(file_meta.type) && !file_meta.isContainer){
            if(blacklisted_FileType.includes(file_meta.type)){
              defaultType = "blacklisted"
            }else{
              defaultType = "text"
            }
          }else if(file_meta.type && file_meta.type !== "folder" && !file_viewers_map.hasOwnProperty(file_meta.type) && file_meta.isContainer){
            defaultType = "folder"
          }

          if (file_viewers_map[file_meta.type] || file_viewers_map[defaultType]  ) {
            let Comp;
            if(file_meta.type && file_meta.type !== "folder" && !file_viewers_map.hasOwnProperty(file_meta.type)){
              Comp = file_viewers_map[defaultType] ;
            }else{
              Comp = file_viewers_map[file_meta.type] ;
            }
            return (
              <Comp
                {...props}
                meta={file_meta}
                path={file_path}
                setFileActions={setFileActions}
                setMenuItems={setMenuItems}
              />
            );
          }

          if (file_meta.isContainer) {
            return (
              <FileList
                meta={file_meta}
                path={file_path}
                enableCheckBoxes={true}
                setFileActions={setFileActions}
                setMenuItems={setMenuItems}
              />
            );
          }

          return (
            <div>
              <p>No viewer available for files of this type.</p>
            </div>
          );
        })(file_meta, file_path)}
      </div>
    </div>
  );
}

export default withReducer("fileManagerApp", reducer)(FileManagerApp);
