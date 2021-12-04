import React from 'react';


import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';


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

function PermissionsPanel(props) {
    const classes = useStyles();

    return (
        <div className="flex-grow w-full flex flex-col h-full">
            <table className={clsx(classes.table, "w-full, text-left")}>
                <tbody>
                    <tr className="owner">
                        <th>Owner</th>
                        <td title={props.meta.owner_id}>{props.meta.owner_id}</td>
                    </tr>
                    <tr className="public">
                        <th>Public</th>
                        <td title={props.meta.public.toString()}>{props.meta.public.toString()}</td>
                    </tr>
                    <tr className="readacl">
                        <th>Read ACL</th>
                        <td title={props.meta.readACL.join(", ")}>{props.meta.readACL.join(", ")}</td>
                    </tr>
                    <tr className="writeacl">
                        <th>Write ACL</th>
                        <td title={props.meta.writeACL.join(", ")}>{props.meta.writeACL.join(", ")}</td>
                    </tr>
                    <tr className="writeacl">
                        <th>Compute ACL</th>
                        <td title={props.meta.computeACL.join(", ")}>{props.meta.computeACL.join(", ")}</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>    
    )

}

export default PermissionsPanel;


