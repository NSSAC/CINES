import React, { useState } from "react";
import { Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Tabs, Tab } from "@material-ui/core";
import MetadataInfoDialog from "app/main/apps/my-jobs/MetadataDialog";
import {
  InsertDriveFile as FileIcon,
  ListAlt as MetadataIcon,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

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
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDialog, setshowDialog] = useState(false);
  const [standardOut, setStandardOut] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const x = false;
  //const opendialog =Boolean;
  const classes = useStyles();

  const navigateStyle = {
    color: "deepskyblue",
    lineBreak: 'anywhere',
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

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="file-details p-16 sm:p-24">
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
                      <td> {selectedItem.output_name} </td>
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

                {selectedItem.stdout !== "" ? (
                  <tr className="state">
                    <th> Std out</th>
                    {selectedItem.stdout ? (
                      <td onClick={openoutputDialog}>
                        {/* eslint-disable-next-line */}
                        <a className="cursor-pointer">Click here</a>
                      </td>
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                ) : null}

                {selectedItem.stderr !== "" ? (
                  <tr className="state">
                    <th> Std error</th>
                    {selectedItem.stderr ? (
                      <td onClick={openErrorDialog}>
                        {/* eslint-disable-next-line */}
                        <a className="cursor-pointer">Click here</a>
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
                            if ((data[0].includes('inputFile') || data[0].includes('Graph')) && data[0] !== 'output_GraphType') {
                              return (
                                <td style={navigateStyle} onClick={() => navigateFile(data[1])}>{data[1]}</td>
                              )
                            } else if (data[0] === 'rules' || data[0] === 'initial_states_method') {
                              return (
                                <td onClick={() => openDialog(data)}>
                                  {/* eslint-disable-next-line */}
                                  <a className="cursor-pointer">Click here</a>
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
