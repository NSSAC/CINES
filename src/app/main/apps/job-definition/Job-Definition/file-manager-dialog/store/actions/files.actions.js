import { FileService } from "node-sciduct";

export const GET_FILES = 'GET_FILES';
export const DELETE_FILE = 'DELETE_FILE';

export function getFiles(path, type, id)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const fileServiceInstance = new FileService(url, token)

    return (dispatch) =>
        fileServiceInstance.list(path).then((response) =>
            dispatch({
                type   : type,
                payload: response,
                delete_id: id
            })
        );

}
