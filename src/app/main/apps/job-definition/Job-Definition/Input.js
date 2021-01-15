import React, { useState, useEffect } from 'react';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import './Input.css';
import FMPopup from './file-manager-dialog/FileManagerDialog.js';
import * as Actions from './file-manager-dialog/store/actions';
import FolderPopup from './file-manager-dialog/FolderManagerDialog.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import {
	CheckboxFormsy,
	FuseChipSelectFormsy,
	RadioGroupFormsy,
	SelectFormsy,
	TextFieldFormsy
} from '@fuse/components/formsy';
import { FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import FolderManagerDialog from './file-manager-dialog/FolderManagerDialog.js';

export const Input = (props) => {
	let inputElement = null;
	//  const inputClasses = [classes.InputElement];
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

	// if (props.invalid && props.shouldValidate && props.touched) {
	//     inputClasses.push(classes.Invalid);
	// }
	function showFileManagerDialog() {
		setShowFMDialog(true);
	}

	function showFolderManagerDialog() {
		// dispatch(Actions.getFiles('/home/', 'GET_FILES'))
		setShowFolderDialog(true);
	}

	function handleFMClose() {
		setShowFMDialog(false);
		//  childRef.current.getAlert()
	}

	function handleFolderClose() {
		setShowFolderDialog(false);
		//  childRef.current.getAlert()
	}

	switch (props.formData[1].type) {
		case 'integer':
			inputElement = (
				<TextFieldFormsy
					className="my-16 inputStyle"
					type="number"
					name="SrcColId"
					style={{ width: '18px' }}
					value={props.formData[1].value}
					label={props.formData[0]}
					onChange={props.changed}
                    validations={{ isPositiveInt: function (values, value) {
						return RegExp(/^(?:[+]?(?:0|[1-9]\d*))$/).test(value)
					  }}}
		            validationError="This is not a valid value"
		  
					required

				/>
			);
			break;
		case ('string'):
			if (props.formData[1].enum) {
				inputElement = (
					<SelectFormsy
						className="my-16 inputStyle"
						name="related"
						label={props.formData[0]}
						value={props.formData[1].value}
						onChange={props.changed}
						required
					>
						{
							props.formData[1].enum.map((item) => {
								return (
									<MenuItem key={item} value={item}>{item}</MenuItem>
								)
							})
						}
					</SelectFormsy>
				);
			}
			else {
				inputElement = (
					<TextFieldFormsy
						className="my-16 inputStyle"
						type="text"
						name="SrcColId"
						style={{ width: '18px' }}
						value={props.formData[1].value}
						label={props.formData[0]}
						onChange={props.changed}
                        autoComplete="off"
						required

					/>
				);
			}

			break;

		case 'boolean':
			inputElement = (
				<RadioGroupFormsy
					className="my-16 inputStyle"
					name="gender"
					label={props.formData[0]}
					value={props.formData[1].value}
					onChange={props.changed}
					required
				>
					<FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
					<FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

				</RadioGroupFormsy>
			);
			break;

		default:
			inputElement = (
				<div className="my-32" >
					<label className="my-32 ">
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
					{props.formData[1].outputFlag ? <span className="my-32 ">{folderChosenPath == '' ? 'No folder specified' : <b className="folderPath" onChange={props.changed} >{folderChosenPath}</b>}</span>
						: <span className="my-32 ">{fileChosen == '' ? 'No file chosen' : <b onChange={props.changed} >{fileChosen}</b>}</span>}
				</div>
			);
	}
	useEffect(() => {
		if (fileChosen || folderChosenPath) {
			document.getElementById(props.formData[1].formLabel).value = 1;
		}
	})

	//   useEffect(() => {
    //     dispatch(Actions.getFiles('/home/', 'GET_FILES'))
    // },[showFolderDialog])

	return (
		<FusePageSimple
			classes={{
				root: 'root',
				header: 'headerDisplay'
			}}
			header={
				<div>
					<FMPopup
						showModal={showFMDialog}
						setShowModal={(p) => setShowFMDialog(p)}
						handleFMClose={handleFMClose}
						setFileChosen={(p) => setFileChosen(p)}
						setFileChosenPath={(p) => setFileChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>

					<FolderPopup
						showModal={showFolderDialog}
						handleFMClose={handleFolderClose}
						folderPath={folderChosenPath}
						setFolderPath={(p) => setFolderChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>
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

// export default input;
