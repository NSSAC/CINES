import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import filesize from 'filesize';

const useStyles = makeStyles({
    table: {
        '& th': {
            padding: '16px 0'
        }
    },
    typeIcon: {
        '&.folder:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.document:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.spreadsheet:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        }
    }
});


function FileInformationPanel(props) {
    const classes = useStyles();

    return (
        <div className="flex-grow w-full flex flex-col h-full">

            <table className={clsx(classes.table, "w-full text-left p-2")}>

                <tbody>
                    <tr className="id">
                        <th>Name</th>
                        <td title={props.meta.name}>{props.meta.name}</td>
                    </tr>
                    <tr className="id">
                        <th>Id</th>
                        <td title={props.meta.id}>{props.meta.id}</td>
                    </tr>
                    <tr className="state">
                        <th>State</th>
                        <td title={props.meta.state}>{props.meta.state}</td>
                    </tr>
                    <tr className="type">
                        <th>Type</th>
                        <td title={props.meta.type}>{props.meta.type}</td>
                    </tr>

                    <tr className="owner">
                        <th>Creation</th>
                        <td title={props.meta.creation_date} >{props.meta.creation_date}</td>
                    </tr>


                    <tr className="owner">
                        <th>Updated</th>
                        <td title={props.meta.update_date} >{props.meta.update_date}</td>
                    </tr>

                    <tr className="size">
                        <th>Size</th>
                        <td title={props.meta.size}>{(!props.meta.size && (props.meta.size !== 0)) ? '-' : filesize(props.meta.size)}</td>
                    </tr>


                    <tr className="MD5">
                        <th>MD5</th>
                        <td className="overlfow-ellipsis">{props.meta.hash}</td>
                    </tr>
                </tbody>
            </table>

        </div>    
    )

}

export default FileInformationPanel;


