import React from 'react';
import Button from "@material-ui/core/Button";
import { confirmAlert } from 'react-confirm-alert';
import '../Confirm-alert.css';

export default (props) => {
    if (!props.files){
        return null
    }
    var files = props.files;

    const selectedIDs = props.files.map((f) => {
        return f.id
    })

    return confirmAlert({
        ...props,
        customUI: ({ onClose }) => {
            return (
                <div className={`${props.className || ""} text-lg bg-white border-4 border-gray-400 rounded p-8`}>
                    <div className="flex flex-col">
                        <div className="flex-initial">
                            <h1 className="font">Are you sure?</h1>
                        </div>
                        <div className="flex-grow">
                            {(files.length === 1) && (
                                <React.Fragment>
                                    {(files[0].type === "folder") && (
                                        <p>Delete '{files[0].name}' and all of its contents?</p>
                                    )}
                                    {(files[0].type !== "folder") && (
                                        <p>Delete '{files[0].name}'?</p>
                                    )}
                                </React.Fragment>
                            )}
                            {(files.length > 1) && (
                                <React.Fragment>
                                    <p>Delete {files.length} files?</p>
                                    <ul class="list-disc m-8 pl-8">
                                        {files.map((f)=>{
                                            return (
                                                <li>
                                                    <span className="font-semibold">{f.name}</span>
                                                    {(f.type==="folder") && (
                                                        <span> <span className="font-bold">AND</span> it's contents </span>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </React.Fragment>
                            )}
                            {props.message}
                        </div>
                        <div className="flex-initial items-right text-right p-16">
                            <Button style={{'marginRight': '8px'}} onClick={onClose} variant="contained" color="primary" size="large">No</Button>
                            <Button style={{'marginRight': '8px'}}  variant="contained" color="primary" size="large"
                                onClick={() => {
                                    props.onConfirm(selectedIDs)
                                    onClose()
                                }}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>

                </div>
            );
        }
    });
}