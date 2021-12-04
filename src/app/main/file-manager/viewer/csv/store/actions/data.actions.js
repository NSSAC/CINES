import axios from "axios"
import Papa from 'papaparse'

export const GET_DATA = '[TextViewer] GET_DATA';
export const GET_DATA_FAILED = '[TextViewer] GET_DATA_FAILED';


export function getData(id,options) {
    const token = localStorage.getItem('id_token');
    options = options || {}

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

            Papa.parse(response.data, {
                delimiter: "",
                delimitersToGuess: [',', '\t', '|', ';',' ','  ', Papa.RECORD_SEP, Papa.UNIT_SEP],
                newline: "\n",
                comments: "#",
                header: false,
                skipEmptyLines: true,
                complete: (parsed)=>{
                    dispatch({
                        type: GET_DATA,
                        payload: {
                            raw: response.data,
                            parsed
                        }
                    })
                },

            });

        }).catch((err)=>{
            dispatch({
                type: GET_DATA_FAILED,
                payload: err
            })
        })
    }
}