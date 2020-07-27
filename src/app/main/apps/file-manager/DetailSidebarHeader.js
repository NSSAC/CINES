import React from 'react';
import {Icon, IconButton, Typography, Tooltip} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {useSelector} from 'react-redux';
import moment from 'moment';

function DetailSidebarHeader(props)
{
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);

    const tableStyle={
        overflow: 'hidden',
        maxWidth: '280px',
        textOverflow: 'ellipsis',
        display:'block',
        whiteSpace: 'nowrap'
    }

    if ( !selectedItem )
    {
        return null;
    }
      
    return (
        <div className="flex flex-col justify-between h-full p-4 sm:p-12">

            <div className="toolbar flex align-center justify-end">
                <FuseAnimate animation="transition.expandIn" delay={200}>
                  <Tooltip title="Click to Delete" placement="bottom">
                    <IconButton>
                        <Icon>delete</Icon>
                    </IconButton>
                  </Tooltip>
                </FuseAnimate>
                <FuseAnimate animation="transition.expandIn" delay={200}>
                <Tooltip title="Click to Download" placement="bottom">
                    <IconButton>
                     <Icon>cloud_download</Icon>
                    </IconButton>
                 </Tooltip>
                </FuseAnimate>
               
            </div>

            <div className="p-12">
                <FuseAnimate delay={200}>
                    <Typography variant="subtitle1" className="mb-8">
                        <span style={tableStyle}>{selectedItem.name}</span></Typography>
                </FuseAnimate>
                <FuseAnimate delay={300}>
                    <Typography variant="caption" className="">
                        <span>Updated</span>
                        <span>: {moment(selectedItem.update_date).fromNow()}</span>
                    </Typography>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default DetailSidebarHeader;
