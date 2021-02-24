import React, { useState } from "react";
import {
  withStyles,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {Tabs, Tab} from "@material-ui/core";
import MetadataInfoDialog from "app/main/apps/my-jobs/MetadataDialog";
import {
  InsertDriveFile as FileIcon,
  ListAlt as MetadataIcon,
} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
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
  const files = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
  const selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
  console.log(selectedItem);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDialog, setshowDialog] = useState(false);
  const [standardOut, setStandardOut] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const x =false;

  const classes = useStyles();

  const openoutputDialog = () => {
    setshowDialog(true);
    setStandardOut(selectedItem.standard_out);
    setHeaderTitle("Output");
  };
  const openErrorDialog = () => {
    setshowDialog(true);
    setStandardOut(selectedItem.standard_err);
    setHeaderTitle("Error");
  };

  const handleClose = () => {
    setshowDialog(false);
  };

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }
  return (
    <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="file-details p-16 sm:p-24">
        {
          <div>
            <MetadataInfoDialog
              openDialog={showDialog}
              closeDialog={handleClose}
              standardOut={standardOut}
              headerTitle={headerTitle}
            ></MetadataInfoDialog>
          </div>
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

                 {selectedItem.output_data ? (
                  <tr>
                    <th> Output data- {x}</th>
                    <td> {String(selectedItem.output_data.output)} </td>
                  </tr>
                ) : null}

                {selectedItem.output_container ? (
                  <tr>
                    <th> Output Container</th>
                    {selectedItem.output_container ? (
                      <Link
                        to={"/apps/files" + selectedItem.output_container + "/"}
                      >
                        <td style={{ overflowWrap: "anywhere" }}>
                          {selectedItem.output_container}{" "}
                        </td>
                      </Link>
                    ) : (
                      "-"
                    )}
                  </tr>
                ) : null}

                <tr className="state">
                  <th> Std out</th>
                  {selectedItem.standard_out ? (
                    <td onClick={openoutputDialog}>
                      <a className="cursor-pointer">Click here</a>
                    </td>
                  ) : (
                    <td>-</td>
                  )}
                </tr>
                <tr className="state">
                  <th> Std error</th>
                  {selectedItem.standard_err ? (
                    <td onClick={openErrorDialog}>
                      <a className="cursor-pointer">Click here</a>
                    </td>
                  ) : (
                    <td>-</td>
                  )}
                </tr>
              </tbody>
            </table>
          </React.Fragment>
        )}

        {selectedTab === 1 && (
          <React.Fragment>
            <div>
              <Typography variant="h5">Input File</Typography>
            </div>
            {selectedItem.input_files.map((data) => {
              return (
                <div>
                  <Typography variant="h6" gutterBottom>
                    {" "}
                    {data.name}{" "}
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
                  <Divider />
                </div>
              );
            })}
          </React.Fragment>
        )}
      </div>
    </FuseAnimate>
  );
}

export default DetailSidebarContent;
