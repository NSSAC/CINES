import axios from "axios"
import Papa from 'papaparse'

export const GET_DATA = '[DistributionViewer] GET_DATA';
export const GET_DATA_FAILED = '[DistributionViewer] GET_DATA_FAILED';
export const PARSED_DATA = '[DistributionViewer] PARSED_DATA';
export function parseData(data){
    return (dispatch) =>{
        Papa.parse(data, {
            delimiter: "",
            delimitersToGuess: [',', '\t', '|', ';',' ','  ', Papa.RECORD_SEP, Papa.UNIT_SEP],
            newline: "\n",
            comments: "#",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (parsed)=>{
                parsed.data = parsed.data.map(p=>{
                    return {
                        category: p[0],
                        count: p[1]
                    }
                })
                dispatch({
                    type: PARSED_DATA,
                    payload: parsed
                });
            }
        });
    }
}

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