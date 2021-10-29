import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import * as Actions from "./store/actions";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom";
import { FileService } from "node-sciduct";

function DeleteMultiple(props) {
  const [deleteData, setDeleteData] = useState({
    errorArr: [],
    deletedCount: 0,
    flag: false,
  });
  var currPath = window.location.pathname.replace("/apps/files", "");
  const dispatch = useDispatch();
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`;
  const token = localStorage.getItem("id_token");
  const fileServiceInstance = new FileService(url, token);
  const { setDeleteAll } = props;

  useEffect(() => {
    DeleteData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    deleteData.flag === true && setDeleteAll(false);
  }, [deleteData.flag, setDeleteAll]);

  function DeleteData() {
    // setDeleteId(props.fileId)
    let newError = [];
    var tempCount = 0;
    var requests = props.selectedItems.map((item, index) =>
      fileServiceInstance
        .remove(item.id, true)
        .then((response) => {
          tempCount = tempCount + 1;
        })
        .catch((error) => {
          newError = newError.concat(deleteData.errorArr);
          newError.push(item);
        })
    );

    return Promise.all(requests).then(() => {
      setDeleteData({
        errorArr: newError,
        deletedCount: tempCount,
        flag: true,
      });
      // setFlag(true)
      dispatch(Actions.getFiles(currPath, "GET_FILES"));
    });
  }

  if (deleteData.flag === true)
    return ReactDOM.createPortal(
      <div>
        {deleteData.deletedCount !== 0 && (
          <div>
            {" "}
            {toast.success(
              `${deleteData.deletedCount} item(s) deleted successfully`
            )}
          </div>
        )}
        {deleteData.errorArr.length > 0 &&
          deleteData.errorArr.map((errorItem) => (
            <div key={errorItem.id}>
              {" "}
              {toast.error(
                `An error occured while deleting '${errorItem.name}'`
              )}
            </div>
          ))}
        <ToastContainer
          limit={1}
          bodyStyle={{ fontSize: "14px" }}
          position="top-right"
        />
      </div>,
      document.getElementById("portal")
    );
  else return null;
}
export default DeleteMultiple;
