import React, { useState } from "react";
import { Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Tabs, Tab } from "@material-ui/core";
import MetadataInfoDialog from "app/main/apps/my-jobs/MetadataDialog";
import {
  ListAlt as FileIcon,
  InfoOutlined as MetadataIcon,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    "& th": {
      padding: "16px 0"
    },
    borderCollapse: 'separate',
    borderSpacing: '9px 0'
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

// const HtmlTooltip = withStyles((theme) => ({
//   tooltip: {
//     backgroundColor: "theme.palette.common.black,",
//     color: "white",
//     maxWidth: 350,
//     fontSize: theme.typography.pxToRem(12),
//     border: "1px solid #dadde9",
//   },
// }))(Tooltip);

function DetailSidebarContent(props) {
  const history = useHistory();
  const selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
  const files = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDialog, setshowDialog] = useState(false);
  const [standardOut, setStandardOut] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const x = false;

  //const opendialog =Boolean;
  const classes = useStyles();

  const navigateStyle = {
    color: "#1565C0",
    wordBreak: 'break-all',
    cursor: "pointer",
  };

  const labelEllipsis = {
    textAlign: 'left',
    maxWidth: '100px',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
  const openoutputDialog = () => {
    setshowDialog(true);
    setStandardOut(selectedItem.stdout);
    setHeaderTitle("Output");
  };
  const openErrorDialog = () => {
    setshowDialog(true);
    setStandardOut(selectedItem.stderr);
    setHeaderTitle("Error");
  };

  const openDialog = (data) => {
    setshowDialog(true);
    setStandardOut(data[1]);
    setHeaderTitle(data[0]);
  }

  const handleClose = () => {
    setshowDialog(false);
  };

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  function navigateFile(selectedItem) {
    history.push("/apps/files" + selectedItem + "/");
  }

  if ((files.payload && files.payload.length === 0) || !selectedItem || (Object.keys(selectedItem).length === 0 && selectedItem.constructor === Object))
  {
      return null;
  }



function convertDate(dateX){
    let t = new Date(dateX)
    let date = ('0' + t.getDate()).slice(-2);
    let month = ('0' + (t.getMonth() + 1)).slice(-2);
    let year = t.getFullYear();
    let hours = ('0' + t.getHours()).slice(-2);
    let minutes = ('0' + t.getMinutes()).slice(-2);
    let seconds = ('0' + t.getSeconds()).slice(-2);
    let tempDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    dateX = tempDate
return dateX;
}

function dateList(){
  var allDates = ['creation_date','update_date','completed_date','cancelled_date']

  for(var i=0;i<allDates.length;i++){
    if (selectedItem && selectedItem[allDates[i]]) {
      selectedItem[allDates[i]] = convertDate(selectedItem[allDates[i]])
    }
  }
}

dateList()

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="file-details p-16 sm:p-8">
        {

          <MetadataInfoDialog
            opendialog={showDialog}
            closedialog={handleClose}
            standardout={standardOut}
            headertitle={headerTitle}
          ></MetadataInfoDialog>

        }

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          className="w-full mb-32"
        >
          <Tab
            className="min-w-0"
            icon={<MetadataIcon alt="Metadata" />}
            title="Metadata"
          />
          <Tab
            icon={<FileIcon alt="File Info" />}
            className="min-w-0"
            title="Input File Information"
          />
        </Tabs>
        {selectedTab === 0 && (
          <React.Fragment>
            {
              <div>
                <Typography variant="h6">INFORMATION</Typography>
              </div>
            }
            <table className={clsx(classes.table, "w-full, text-left")}>
              <tbody>
                {selectedItem.input && selectedItem.input.reconstitute ? (
                  <tr>
                    <th> Input</th>
                    {selectedItem.input && selectedItem.input.reconstitute ? (
                      <td> {selectedItem.input.reconstitute} </td>
                    ) : (
                      <td> -</td>
                    )}
                  </tr>
                ) : null}
                {selectedItem.input && selectedItem.input.contactNetwork ? (
                  <tr>
                    <th> Input</th>
                    {selectedItem.input && selectedItem.input.contactNetwork ? (
                      <td> {selectedItem.input.contactNetwork} </td>
                    ) : (
                      <td> -</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.output_name ? (
                  <tr>
                    <th> Output name</th>
                    {selectedItem.output_name ? (
                      <td style={{wordBreak:'break-all'}}> {selectedItem.output_name} </td>
                    ) : (
                      "-"
                    )}
                  </tr>
                ) : null}

                {selectedItem.output ? (
                  <tr>
                    <th> Output data- {x}</th>
                    <td> {String(selectedItem.output.output)} </td>
                  </tr>
                ) : null}

                {selectedItem.output_container ? (
                  <tr>
                    <th> Output Container</th>
                    {selectedItem.output_container ? (
                      // <Link
                      //   to={"/apps/files" + selectedItem.output_container + "/"}
                      // >
                      <td
                        style={navigateStyle}
                        onClick={() => navigateFile(selectedItem.output_container)}
                      >
                        &nbsp;&nbsp;{selectedItem.output_container}{" "}
                      </td>
                    ) : (
                      // </Link>
                      "-"
                    )}
                  </tr>
                ) : null}

                {selectedItem.stdout ? (
                  <tr className="state">
                    <th> Std out</th>
                    {selectedItem.stdout ? (
                      <td onClick={openoutputDialog}>
                        {/* eslint-disable-next-line */}
                        <a style={{color:'#1565C0'}} className="cursor-pointer">Click here</a>
                      </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.stderr ? (
                  <tr className="state">
                    <th> Std error</th>
                    {selectedItem.stderr ? (
                      <td onClick={openErrorDialog}>
                        {/* eslint-disable-next-line */}
                        <a style={{color:'#1565C0'}} className="cursor-pointer">Click here</a>
                      </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.creation_date ? (
                  <tr className="state">
                    <th> Creation date</th>
                    {selectedItem.creation_date ? (
                     <td style={{wordBreak:'break-all'}}> {selectedItem.creation_date.replace(/T|Z/g, '  ').split(".")[0]} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.update_date ? (
                  <tr className="state">
                    <th> Modified date</th>
                    {selectedItem.update_date ? (
                     <td style={{wordBreak:'break-all'}}> {selectedItem.update_date.replace(/T|Z/g, '  ').split(".")[0]} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                 {selectedItem.completed_date ? (
                  <tr className="state">
                    <th>Completed date</th>
                    {selectedItem.completed_date ? (
                     <td style={{wordBreak:'break-all'}}>{selectedItem.completed_date.replace(/T|Z/g, '  ').split(".")[0]} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.cancelled_date ? (
                  <tr className="state">
                    <th>Cancelled date</th>
                    {selectedItem.cancelled_date ? (
                     <td style={{wordBreak:'break-all'}}>{selectedItem.cancelled_date.replace(/T|Z/g, '  ').split(".")[0]} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                 {selectedItem.created_by ? (
                  <tr className="state">
                    <th>Created by</th>
                    {selectedItem.created_by ? (
                     <td style={{wordBreak:'break-all'}}> {selectedItem.created_by} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.exit_code ? (
                  <tr className="state">
                    <th>Exit code</th>
                    {selectedItem.exit_code ? (
                     <td style={{wordBreak:'break-all'}}> {selectedItem.exit_code} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.failure_type ? (
                  <tr className="state">
                    <th>Failure type</th>
                    {selectedItem.failure_type ? (
                     <td style={{wordBreak:'break-all'}}> {selectedItem.failure_type} </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                 {selectedItem.status ? (
                  <tr className="state">
                    <th> Status</th>
                    {selectedItem.status ? (
                      <td onClick={()=>openDialog(['Status',selectedItem.status])}>
                        {/* eslint-disable-next-line */}
                        <a style={{color:'#1565C0'}} className="cursor-pointer">Click here</a>
                      </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

              </tbody>
            </table>
          </React.Fragment>
        )}

        {selectedTab === 1 && selectedItem.input_files && selectedItem.input && (
          <React.Fragment>
            {selectedItem.input_files.length > 0 && <div>
              <Typography variant="h6">INPUT FILE</Typography>
            </div>}
            {selectedItem.input_files.map((data, index) => {
              return (
                <div key={index}>
                  <Typography variant="subtitle1" >
                    {" "}
                    <b>{data.name}</b>{" "}
                  </Typography>
                  <table
                    style={{ marginLeft: "15px", margin: "0px!important" }}
                  >
                    <tbody>
                      <tr>
                        <th>Id:</th>
                        <td>{data.id}</td>
                      </tr>

                      <tr>
                        <th>type:</th>
                        <td>{data.type}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Divider style={{ margin: '8px 0px' }} />
                </div>
              );
            })}
            <div>
              <div>
                <Typography variant="h6">INPUT PARAMETERS</Typography>
              </div>
              <table
                style={{ marginLeft: "15px", margin: "0px!important" }}
              >
                <tbody>
                  {selectedItem && Object.entries(selectedItem.input).filter(data => { if (data[0] !== 'extraObj' && data[0] !== 'dynamic_inputs') return data; return null }).map((data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <th title={data[0]} style={labelEllipsis}>{data[0]}:</th>
                          {(() => {
                            if ((data[0].includes('inputFile') || data[0].toLowerCase().includes('graph') || data[0] === 'csonnet_data_analysis' ||  data[0] === 'csonnet_simulation') && data[0] !== 'output_GraphType') {
                              return (
                                <td style={navigateStyle} onClick={() => navigateFile(data[1])}>{data[1]}</td>
                              )
                            } else if (data[0] === 'rules' || data[0] === 'initial_states_method' || data[0] === 'text_sections' || data[0] === 'plot_types') {
                              return (
                                <td onClick={() => openDialog(data)}>
                                  {/* eslint-disable-next-line */}
                                  <a style={{color:'#1565C0'}} className="cursor-pointer">Click here</a>
                                </td>
                              )
                            } else {
                              return (
                                <td style={{ lineBreak: 'anywhere' }}>{JSON.stringify(data[1])}</td>
                              )
                            }
                          })()}
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
      </div>
    </FuseAnimate>
  );
}

export default DetailSidebarContent;
