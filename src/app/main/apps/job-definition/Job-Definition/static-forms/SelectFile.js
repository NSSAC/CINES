import React, { useState, useEffect } from 'react';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import './SelectFile.css';
import FMPopup from '../file-manager-dialog/FileManagerDialog.js';
import FolderPopup from '../file-manager-dialog/FolderManagerDialog.js';
import {
	SelectFormsy,
	TextFieldFormsy
} from '@fuse/components/formsy';
import { FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import FolderManagerDialog from '../file-manager-dialog/FolderManagerDialog.js';

export const Input = (props) => {

	const selectButtonStyle = {
		backgroundColor: '#61dafb',
		fontSize: 'inherit',
		margin: '5px',
		padding: '6px',
		color: 'black'
	};


	const dispatch = useDispatch()
	const [showFMDialog, setShowFMDialog] = useState(false);
	const [showFolderDialog, setShowFolderDialog] = useState(false);
	const [fileChosen, setFileChosen] = useState('');
	const [folderChosenPath, setFolderChosenPath] = useState('');
	const [fileChosenPath, setFileChosenPath] = useState('');

	if (props.formData[1].value !== undefined && fileChosenPath !== '') {
		props.formData[1].value = fileChosenPath
	}

	if (props.formData[1].value !== undefined && folderChosenPath !== '') {
		props.formData[1].value = folderChosenPath
	}

	let inputElement = (
		<div className="my-32" >
			<label className="my-32">
				{props.formData[1].formLabel}*-
                   {props.formData[1].outputFlag ?
					<Button onClick={showFolderManagerDialog} style={selectButtonStyle}>
						&nbsp;Select path
                            </Button> :
					<Button onClick={showFileManagerDialog} style={selectButtonStyle}>
						&nbsp;Select file
                            </Button>}
				<TextFieldFormsy
					id={props.formData[1].formLabel}
					className="my-16 hidden"
					type="number"
					name="SrcColId"
					style={{ width: '18px' }}
					value={props.formData[1].value}
					label={props.formData[0]}
					onChange={props.changed}
					required
				/>
			</label>
			{props.formData[1].outputFlag ? <span className="my-32 folderPath">{folderChosenPath == '' ? 'No folder specified' : <b onChange={props.changed} >{folderChosenPath}</b>}</span>
				: <span className="my-32 folderPath">{fileChosen == '' ? 'No file chosen' : <b onChange={props.changed} >{fileChosen}</b>}</span>}
		</div>
	);

	function showFileManagerDialog() {
		setShowFMDialog(true);
	}

	function showFolderManagerDialog() {
		setShowFolderDialog(true);
	}

	function handleFMClose() {
		setShowFMDialog(false);
	}

	function handleFolderClose() {
		setShowFolderDialog(false);
	}


	useEffect(() => {
		if (fileChosen || folderChosenPath) {
			document.getElementById(props.formData[1].formLabel).value = 1;
		}
	})

	return (
		<FusePageSimple
			classes={{
				root: 'root',
				header: 'headerDisplay'
			}}
			header={
				<div>
					{props.formData[1].type==undefined && <FMPopup
						showModal={showFMDialog}
						setShowModal={(p) => setShowFMDialog(p)}
						handleFMClose={handleFMClose}
						fileChosenPath={fileChosenPath}
						setFileChosen={(p) => setFileChosen(p)}
						setFileChosenPath={(p) => setFileChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>}

					{showFolderDialog && <FolderPopup
						showModal={showFolderDialog}
						handleFMClose={handleFolderClose}
						folderPath={folderChosenPath}
						setFolderPath={(p) => setFolderChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>}
				</div>
			}
			content={
				<div className="flex content">
					{inputElement}
					{props.formData[1].description && (
						<Tooltip title={<h4>{props.formData[1].description}</h4>} placement="right">
							<span style={{ marginTop: '38px' }}>
								<Icon fontSize="small">info</Icon>
							</span>
						</Tooltip>
					)}{' '}
				</div>
			}
		/>
	);
};

