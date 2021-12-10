import React from 'react';
import {Typography } from '@material-ui/core';
import { Icon, Button } from '@material-ui/core';
import saveAs from 'file-saver'
import { FileService } from "node-sciduct";

function OutputFilesPanel(props) {
    console.log("props.files: ", props.files)
    if (!props.files){
        return null
    }
   
    const token = localStorage.getItem('id_token')

    function streamPromise(stream) {
        return new Promise(resolve => {
          const chunks = [];
          stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
          stream.on("end", () => resolve(Buffer.concat(chunks).toString()));
        });
    }

    function downloadFile(file){
        const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
        const token = localStorage.getItem('id_token');
        const filesvc = new FileService(url, token||"")
        return filesvc.get(file.id).then((data)=>{
            streamPromise(data).then((d)=>{
                // console.log("Data to download: ", d)
                saveAs(new Blob([d],{type: "text/plain;charset=utf-8"}),file.name)
            })
        });
    }

    return (
    
        <table className="m-8">
            <tbody>
                <tr><th className="p-8 border-b">Simulation</th></tr>  

                <tr>
                    <td>Output</td>
                    <td>
                        <Icon onClick={()=>{
                            downloadFile(props.files.output)
                        }}>cloud_download</Icon>
                    </td>
                  </tr>
                <tr>
                    <td>Initial States</td>
                    <td>
                        <Icon onClick={()=>{
                            downloadFile(props.files.initial_states)
                        }}>cloud_download</Icon>
                    </td>
                </tr>

                {props.files.analysis && (
                    <React.Fragment>          
                        <tr><th className="p-8 border-b">Analysis Output</th></tr>  
                        {props.files.analysis.map((f,idx)=>{
                            return <tr key={idx}>
                                <td className="text-left">{f.name}</td>
                                <td>
                                    <Icon onClick={()=>{
                                        downloadFile(f)
                                    }}>cloud_download</Icon>
                                </td>
                            </tr>
                        })}
                    </React.Fragment>
                )}
            </tbody>
        </table>


    )
}

export default OutputFilesPanel;


