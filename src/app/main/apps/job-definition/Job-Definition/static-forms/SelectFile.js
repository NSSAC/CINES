import { Button, Icon } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { FusePageSimple } from '@fuse';
import { TextFieldFormsy } from '@fuse/components/formsy';

// import FMPopup from '../file-manager-dialog/FileManagerDialog.js';
// import FolderPopup from '../file-manager-dialog/FolderManagerDialog.js';
import SelectFileDialog from 'app/main/file-manager/dialogs/SelectFileDialog/'
import './SelectFile.css';

export const Input = (props) => {

	const selectButtonStyle = {
		backgroundColor: '#61dafb',
		fontSize: 'inherit',
		margin: '5px',
		padding: '6px',
		color: 'black'
	};


	const [showFMDialog, setShowFMDialog] = useState(false);
	const [showFolderDialog, setShowFolderDialog] = useState(false);
	const [folderChosenPath, setFolderChosenPath] = useState('');
	const [fileChosenPath, setFileChosenPath] = useState('');

	if (props.formData[1].value !== undefined && fileChosenPath !== '') {
		props.formData[1].value = fileChosenPath
	}

	if (props.formData[1].value !== undefined && folderChosenPath !== '') {
		props.formData[1].value = folderChosenPath
	}

	let inputElement = (
		<div className="selectedFile">
		<label className="my-32">
				{props.formData[1].formLabel}{props.formData[1].required !== false && (<span style={{color:'red'}}>&nbsp;*</span>)}-
                   {props.formData[1].outputFlag ?
					<Button onClick={showFolderManagerDialog} style={selectButtonStyle}>
						&nbsp;Select path
                            </Button> :
					<Button onClick={showFileManagerDialog} style={selectButtonStyle}>
						&nbsp;Select file
                            </Button>}
				{props.formData[1].required === false ? <TextFieldFormsy
					id={props.formData[1].formLabel}
					className="my-16 hidden"
					type="number"
					name={props.formData[0]}
					style={{ width: '18px' }}
					value={props.formData[1].value}
					label={props.formData[0]}
					onChange={ props.changed }
				/> :
				<TextFieldFormsy
					id={props.formData[1].formLabel}
					className="my-16 hidden"
					type="number"
					name={props.formData[0]}
					style={{ width: '18px' }}
					value={props.formData[1].value}
					label={props.formData[0]}
					onChange={ props.changed }
					required
				/>}
			</label>
			{props.formData[1].outputFlag ? <div className={`folderPath ${props.formData[1].value === '' ? '' : 'pathBreak'}`}>{props.formData[1].value === '' ? 'No folder specified' : <b onChange={props.changed} >{props.formData[1].value}</b>}</div>
				: <div className={`folderPath ${props.formData[1].value === '' ? '' : 'pathBreak'}`}>{props.formData[1].value === '' ? 'No file chosen' : <b onChange={props.changed} >{props.formData[1].value}</b>}</div>}
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

	function chooseFile(f){
		if (f && f[0]){

			
			setFileChosenPath(f[0])
			if (props.changed){
				props.changed({target: {value: f[0]}})
			}
		}
	}

	function chooseFolder(f){
		if (f && f[0]){
			setFolderChosenPath(f[0])
			if (props.changed){
				props.changed({target: {value: f[0]}})
			}
		}
	}

	// function chooseFolder(f){
	// 	setFileChosenPath(p)
	// 	props.changed(evt)
	// }

	useEffect(() => {
		if (fileChosenPath || folderChosenPath) {
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
					{/* {showFMDialog && <FMPopup
						showModal={showFMDialog}
						setShowModal={(p) => setShowFMDialog(p)}
						handleFMClose={handleFMClose}
						fileChosenPath={fileChosenPath}
						setFileChosen={chooseFile}
						setFileChosenPath={ chooseFile }
						fileTypes={props.formData[1].types}
						props={props}
					/>} */}

					{/* {showFolderDialog && <FolderPopup
						showModal={showFolderDialog}
						handleFMClose={handleFolderClose}
						folderPath={folderChosenPath}
						setFolderPath={chooseFolder}
						fileTypes={props.formData[1].types}
						props={props}
					/>} */}

					{showFMDialog && <SelectFileDialog
						showModal={showFMDialog}
						target={fileChosenPath}
						handleFMClose={handleFMClose}
						multiple={false} 
						onSelect={chooseFile}
						title="Select File"
						fileTypes={props.formData[1].types}
						requireWritePermissions={false}
						props={props}
					/>}


					{showFolderDialog && <SelectFileDialog
						showModal={showFolderDialog}
						target={folderChosenPath}
						handleFMClose={handleFolderClose}
						multiple={false}
						title="Select Output Location"
						onSelect={chooseFolder}
						fileTypes={["folder"]}//{props.formData[1].types}
						requireWritePermissions={true}
					/>}
				</div>
			}
			content={
				<div className="flex content">
					{inputElement}
					{props.formData[1].description && (
							<span className='infoIcon' data-tip={props.formData[1].description}>
								<Icon fontSize="small">info</Icon>
							</span>
					)}{' '}
					<ReactTooltip clickable={true} isCapture = {true} scrollHide = {true} className='toolTip' place='top' effect='solid' />
				</div>
			}
		/>
	);
};

