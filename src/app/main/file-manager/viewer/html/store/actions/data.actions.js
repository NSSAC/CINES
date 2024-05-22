import axios from "axios"
export const GET_DATA = '[HtmlViewer] GET_DATA';
export const GET_DATA_FAILED = '[HtmlViewer] GET_DATA_FAILED';

export function getData(id) {
    const token = localStorage.getItem('id_token');
    if (id.charAt(0)==="/"){
        id = id.substr(1)
    }
    const headers = {'Accept': 'application/octet-stream'}
    if (token){
        headers.authorization = token
    }

    const request = axios.request({
        method: 'get',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
        headers: headers
    })
    
    return (dispatch)=>{
        request.then((response) =>{
            dispatch({
                type: GET_DATA,
                payload: response.data
            })
        }).catch((err)=>{
            dispatch({
                type: GET_DATA_FAILED,
                payload: err
            })
        })
    }
}