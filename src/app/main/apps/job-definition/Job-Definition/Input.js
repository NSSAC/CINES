import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@material-ui/core';
import './Input.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import SelectFileDialog from 'app/main/file-manager/dialogs/SelectFileDialog';

import {
	RadioGroupFormsy,
	SelectFormsy,
	TextFieldFormsy
} from '@fuse/components/formsy';
import { FusePageSimple } from '@fuse';
import ReactTooltip from 'react-tooltip';

export const Input = (props) => {
	let inputElement = null;
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
	var typeFlag = 0;
	if (props.formData[1].value !== undefined && fileChosenPath !== '') {
		props.formData[1].value = fileChosenPath
	}

	if (props.formData[1].value !== undefined && folderChosenPath !== '') {
		props.formData[1].value = folderChosenPath
	}

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

	switch (props.formData[1].type) {
		case "integer":
			if (props.formData[1].required) {
				inputElement = (
					<TextFieldFormsy
						className="my-16 inputStyle"
						type="text"
						name={props.formData[0]}
						style={{ width: "18px" }}
						value= {String(props.formData[1].value) }
						label={props.formData[0]}
						onBlur={props.changed}
						validations={{
							isPositiveInt: function (values, value) {
								if (props.formData[0] === "SampleEdges" || props.formData[0] === "SampleNodes" || props.formData[0] === "NApprox")
									return (RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) || RegExp(/^(?:[-]?(?:1))$/).test(value));
								else
									return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value);
							},
						}}
						validationError="This is not a valid value"
						autoComplete="off"
						required
					/>
				);
			} else {
				inputElement = (
					<TextFieldFormsy
						className="my-16 inputStyle"
						type="text"
						name={props.formData[0]}
						style={{ width: "18px" }}
						value= {String(props.formData[1].value) }
						label={props.formData[0]}
						onBlur={props.changed}
						validations={{
							isPositiveInt: function (values, value) {
								if (props.formData[0] === "SampleEdges" || props.formData[0] === "SampleNodes" || props.formData[0] === "NApprox")
									return (RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) || RegExp(/^(?:[-]?(?:1))$/).test(value));
								else
									return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value);
							},
						}}
						validationError="This is not a valid value"
						autoComplete="off"
					/>
				);
			}
			typeFlag = 1;
			break;

		case "number":
			if (props.formData[1].required) {
				inputElement = (
					<TextFieldFormsy
						className="my-16 inputStyle"
						type="text"
						name={props.formData[0]}
						style={{ width: "18px" }}
						value= {String(props.formData[1].value) }
						label={props.formData[0]}
						onBlur={props.changed}
						validations={{
							isPositiveInt: function (values, value) {
								return RegExp(/^(?:[0-9]\d*)?(?:\.\d+)?$/).test(value);
							},
						}}
						validationError="This is not a valid value"
						autoComplete="off"
						required
					/>
				);
			} else {
				inputElement = (
					<TextFieldFormsy
						className="my-16 inputStyle"
						type="text"
						name={props.formData[0]}
						style={{ width: "18px" }}
						value= {String(props.formData[1].value)}
						label={props.formData[0]}
						onBlur={props.changed}
						validations={{
							isPositiveInt: function (values, value) {
								return RegExp(/^(?:[0-9]\d*)?(?:\.\d+)?$/).test(value);
							},
						}}
						validationError="This is not a valid value"
						autoComplete="off"
					/>
				);
			}
			typeFlag = 1;
			break;

		case "string":
			if (props.formData[1].required || props.formData[0]=== 'output_name') {
				if (props.formData[1].enum) {
					inputElement = (
						<SelectFormsy
							className="my-16 inputStyle"
							name={props.formData[0]}
							label= {[props.formData[0], <span key={1} style={{color: 'red'}}>{'*'}</span>]}
							value= {props.formData[1].value}
							onChange={props.changed}
							required
						>
							{props.formData[1].enum.map((item) => {
								return (
									<MenuItem key={item} value={item}>
										{item}
									</MenuItem>
								);
							})}
						</SelectFormsy>
					);
				} else {
					inputElement = (
						<TextFieldFormsy
							className="my-16 inputStyle"
							type="text"
							name={props.formData[0]}
							style={{ width: "18px" }}
							value={props.formData[1].value}
							label={props.formData[0]}
							onBlur={props.changed}
							validations={{
								isPositiveInt: function (values, value) {
									return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value);
								},
							}}
							validationError="This is not a valid value"
							autoComplete="off"
							required
						/>
					);
				}
			} else {
				if (props.formData[1].enum) {
					inputElement = (
						<SelectFormsy
							className="my-16 inputStyle"
							name={props.formData[0]}
							label= {[props.formData[0], <span key={1} style={{color: 'red'}}>{'*'}</span>]}
							value={props.formData[1].value}
							onChange={props.changed}
						>
							{props.formData[1].enum.map((item) => {
								return (
									<MenuItem key={item} value={item}>
										{item}
									</MenuItem>
								);
							})}
						</SelectFormsy>
					);
				} else {
					inputElement = (
						<TextFieldFormsy
							className="my-16 inputStyle"
							type="text"
							name={props.formData[0]}
							style={{ width: "18px" }}
							value={props.formData[1].value}
							label={props.formData[0]}
							onBlur={props.changed}
							validations={{
								isPositiveInt: function (values, value) {
									return RegExp(/^[^-\s]/).test(value);
								},
							}}
							validationError="This is not a valid value"
							autoComplete="off"
						/>
					);
				}
			}
			typeFlag = 1;
			break;

		case "boolean":
			if (props.formData[1].required) {
				inputElement = (
					<RadioGroupFormsy
						className="my-16 inputStyle"
						name={props.formData[0]}
						label={props.formData[0]}
						value={String(props.formData[1].value)}
						onChange={props.changed}
						required
					>
						<FormControlLabel
							value="true"
							control={<Radio color="primary" />}
							label="True"
						/>
						<FormControlLabel
							value="false"
							control={<Radio color="primary" />}
							label="False"
						/>
					</RadioGroupFormsy>
				);
			} else {
				inputElement = (
					<RadioGroupFormsy
						className="my-16 inputStyle"
						name={props.formData[0]}
						label={props.formData[0]}
						value={String(props.formData[1].value)}
						onChange={props.changed}
					>
						<FormControlLabel
							value="true"
							control={<Radio color="primary" />}
							label="True"
						/>
						<FormControlLabel
							value="false"
							control={<Radio color="primary" />}
							label="False"
						/>
					</RadioGroupFormsy>
				);
			}
			typeFlag = 1;
			break;

		default:
			inputElement = (
				<div className="selectedFile">
					<label className="my-32 ">
						{props.formData[1].formLabel}{props.formData[1].required !== false && <span style={{ color: 'red' }}>&nbsp;*</span>}-
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
							type="text"
							name={props.formData[0]}
							style={{ width: '18px' }}
							value={props.formData[1].value}
							label={props.formData[0]}
							onBlur={props.changed}
						/> :
						<TextFieldFormsy
							id={props.formData[1].formLabel}
							className="my-16 hidden"
							type="text"
							name={props.formData[0]}
							style={{ width: '18px' }}
							value={props.formData[1].value}
							label={props.formData[0]}
							onBlur={props.changed}
							required
						/>}
					</label>
					{
					  props.formData[1].outputFlag ? (
					    <div className={`folderPath ${folderChosenPath === "" ? "" : "pathBreak"}`}>
					      {folderChosenPath === "" ? (
					        "No folder specified"
					      ) : (
					        <b onBlur={props.changed}>{folderChosenPath}</b>
					      )}
					    </div>
					  ) : (
					    <div className={`folderPath ${fileChosenPath === "" ? "" : "pathBreak"}`}>
					      {fileChosenPath === "" ? (
					        "No file chosen"
					      ) : (
					        <b onBlur={props.changed}>{fileChosenPath}</b>
					      )}
					    </div>
					  )
					}

				</div>
			);
	}
	useEffect(() => {
		if (fileChosenPath || folderChosenPath) {
			document.getElementById(props.formData[1].formLabel).value = 1;
		}

		if(props.formData[1].value !== "" && props.formData[1].outputFlag === false && typeFlag === 0){
			let validateFileType = window.checkInputFiles
			if(validateFileType){
				validateFileType.forEach((ele) => {
					if(ele.filePath === props.formData[1].value && ele.name === props.formData[1].name){
						if(props.formData[1].types.includes(ele.type)){
							setFileChosenPath(props.formData[1].value)
						}else{
							setFileChosenPath("")
						}
					}else{
						setFileChosenPath(props.formData[1].value)
					}
				})
			}else{
				setFileChosenPath(props.formData[1].value)
			}
		  }

		  if(props.formData[1].value !== "" && props.formData[1].outputFlag === true && typeFlag === 0){
			setFolderChosenPath(props.formData[1].value)
		  }

 },[fileChosenPath, folderChosenPath, props.formData, typeFlag])



	if(props.formData[0]==='extraObj')
	 return null;

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
						setFileChosenPath={(p) => setFileChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>} */}

					{/* {showFolderDialog && <FolderPopup
						showModal={showFolderDialog}
						handleFMClose={handleFolderClose}
						folderPath={folderChosenPath}
						setFolderPath={(p) => setFolderChosenPath(p)}
						fileTypes={props.formData[1].types}
						props={props}
					/>} */}

					{showFMDialog && <SelectFileDialog
						showModal={showFMDialog}
						target={fileChosenPath}
						handleFMClose={handleFMClose}
						multiple={false} 
						onSelect={(p)=>{
							if (p && p[0]) {
								setFileChosenPath(p[0])
							}
						}}
						title="Select File"
						fileTypes={props.formData[1].types}
						labelName={props.formData[1].name}
						requireWritePermissions={false}
						props={props}
					/>}


					{showFolderDialog && <SelectFileDialog
						showModal={showFolderDialog}
						target={folderChosenPath}
						handleFMClose={handleFolderClose}
						multiple={false}
						title="Select Output Location"
						onSelect={(p)=>{if (p && p[0]) {setFolderChosenPath(p[0])}else{setFolderChosenPath("/")}}}
						fileTypes={["folder"]}//{props.formData[1].types}
						requireWritePermissions={true}
					/>}
				</div>
			}
			content={
				<div className="flex content">
					{inputElement}
					{props.formData[1].description &&
						(typeFlag === 0 ? <span className='infoIcon' data-tip={props.formData[1].description}>
							<Icon  fontSize="small">info</Icon>
						</span> :
						<span style={{ marginTop: '38px' }}  data-tip={props.formData[1].description}>
							<Icon  fontSize="small">info</Icon>
						</span>
						)}{' '}
					<ReactTooltip eventOff="scroll" isCapture = {true} scrollHide = {true} clickable={true} className='toolTip' place='top' effect='solid'/>
				</div>

			}
		/>
	);
};

