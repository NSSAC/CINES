import React, { useState, useEffect } from 'react';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import './Input.css';
import FMPopup from './file-manager-dialog/FileManagerDialog.js';
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

	const [ showFMDialog, setShowFMDialog ] = useState(false);
	const [ fileChosen, setFileChosen ] = useState('');
	const [ fileChosenPath, setFileChosenPath ] = useState('');
	if(props.formData[1].value!== undefined && fileChosenPath !== '') {
	  props.formData[1].value = fileChosenPath
	// if(fileChosenPath !== '')
	// console.log(props.formData)
	}

  	// if (props.invalid && props.shouldValidate && props.touched) {
	//     inputClasses.push(classes.Invalid);
	// }
	function showFileManagerDialog() {
		setShowFMDialog(true);
	}

	function handleFMClose() {
		setShowFMDialog(false);
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
				
					required
					
				/>
			);
			break;
			case 'string':
				inputElement =  (
					 <SelectFormsy
					 className="my-16 inputStyle"
					 name="related"
					 label={props.formData[0]}
					 value={props.formData[1].value}	
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
				break;
				
				case 'boolean':
					inputElement =  (
						<RadioGroupFormsy
						className="my-16 inputStyle"
						name="gender"
						label={props.formData[0]}
						required
					>
						<FormControlLabel value="true" control={<Radio color="primary"/>} label="True"/>
						<FormControlLabel value="false" control={<Radio color="primary"/>} label="False"/>
						
					</RadioGroupFormsy>
					);
					break;

					default:
						inputElement = (
							<div className="my-32" >
								<label className="my-32 ">
									{props.formData[1].formLabel}-
									<Button onClick={showFileManagerDialog} style={selectButtonStyle}>
										&nbsp;Select file
									</Button>
									<CheckboxFormsy
										id={props.formData[1].formLabel}
										className="my-16 "
										name="accept"
										required
										value={false}
										validations={{
											equals: true,
										}}
										validationErrors={{
											equals: "You need to accept"
										}}
									/> 
								</label>
								<span className="my-32 ">{fileChosen == '' ? 'No file chosen' : <b>{fileChosen}</b>}</span>
							</div>
						);
	}
	useEffect(()=>{
        if(fileChosen)
         document.getElementById(props.formData[1].formLabel).checked= true;
    })

	return (
		<FusePageSimple
			classes={{
				header: 'headerDisplay'
			}}
			header={
				<FMPopup
					showModal={showFMDialog}
					setShowModal={(p) => setShowFMDialog(p)}
					handleFMClose={handleFMClose}
					setFileChosen={(p) => setFileChosen(p)}
					setFileChosenPath={(p) => setFileChosenPath(p)}
					fileTypes={props.formData[1].types} 
					props={props}
				/>
			}
			content={
				<div className="flex">
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
