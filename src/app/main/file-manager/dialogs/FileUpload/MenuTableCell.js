import React from "react";
import { TableCell, withStyles, Select } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/core/internal/svg-icons/ArrowDropDown";

const styles = {
  selectinput: {
    "&:focus": {
      backgroundColor: "unset"
    }
  }
};

function MenuTableCell(props) {
  const { classes, value, children, ...others } = props;

  return (
    <TableCell>
      <Select
        disableUnderline
        classes={{ root: classes.selectinput }}
        IconComponent={ArrowDropDownIcon}
        value={value}
        placeholder="Select File Type"
        displayEmpty
        MenuProps={{
          popoverprops: {
            anchorOrigin: {
              horizontal: "center",
              vertical: "bottom"
            },
            transformOrigin: {
              horizontal: "center",
              vertical: "top"
            }
          }
        }}
        {...others}
      >
    
        {children}
      </Select>
    </TableCell>
  );
}

export default withStyles(styles)(MenuTableCell);
