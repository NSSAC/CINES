import FMInstance from '../../FileManagerService'
export const GET_FILES = 'GET_FILES';
export const DELETE_FILE = 'DELETE_FILE';

export function getFiles(path, type, id)
{
            
    var axios = require('axios');
    if (path[0]==="/") {
      path=path.substr(1)
    }

    var config = FMInstance.getFilesConfig(path)

    const request = axios(config)

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : type,
                payload: response.data,
                delete_id: id
            })
        );

}
