import { FileService } from 'node-sciduct';

export const GET_HOME = 'GET_HOME';

export function getHome(path)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const fileServiceInstance = new FileService(url, token)

    return (dispatch) =>
        fileServiceInstance.list(path).then((response) =>
            dispatch({
                type   : GET_HOME,
                payload: response,
            })
        );

}
