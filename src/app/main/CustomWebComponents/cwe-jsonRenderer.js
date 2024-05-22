/*
  Attributes required for this component
    1. details : this attribute holds for generating json.
    2. submitFlow: attribute holds check if form has submit flow or not. doesnot have submit flow ? "false" : (set as "true" or will work if nothing is set)
    3. resubmitData : attribute holds the resubmit data for the selected job
    4. jobversion : attribute holds the version of current job definiton
*/

import Ajv from 'ajv';
import addFormats from "ajv-formats";
import RefParser from 'json-schema-ref-parser';
import _ from '@lodash';
import { JobService } from "node-sciduct";
import { parseInt } from 'lodash';
import { array } from 'vega';


const template_JSONFromRendered = document.createElement('template');
template_JSONFromRendered.innerHTML = /* html */ `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <style>
    .info-icon {
        position: absolute;
        right: 14px;
        top: 20px;
        color: #302d2d;
        font-size: 15px;
        cursor: pointer;
        font-weight: 500;
    }
    #json-form{
        background-color: white;
    }
    .padding-20{
      padding: 20px;
    }
    .modify-form {
      overflow-x: hidden;
    }
    .modify-label {
        margin-bottom: 0px !important;
    }
    .modify-label_radio{
        display: block !important;
    }
    .modify-input {
        font-size: 1.4rem;
        background-color: white !important;
        width: 95% !important;
    }
    .modify-input:focus {
        outline: none;
        outline: transparent !important;
        box-shadow: none !important;
    }
    .modify-select{
        font-size: 1.4rem;
        width: 95% !important;
        height: calc(2.25rem + 4px);
    }
    .modify-select:focus {
        outline: none;
        outline: transparent !important;
        box-shadow: none !important;
    }
    .category-container {
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 15px 5px;
        margin: 15px 0px 10px 0px;;
        position: relative;
        }
    .category-container::before {
        content: attr(data-form-title);
        position: absolute;
        top: -15px;
        left: 10px;
        background-color: white;
        padding: 0 5px;
        font-size: 16px;
        color: #201f1f;
    }

    .container{
        padding: 0px 7px !important
    }
    .breaker{
        height: 0;
        margin: 1rem 0;
        overflow: hidden;
        border-top: 3px solid #121212b8
    }
    .btn-colPos{
        display: flex;
        justify-content: flex-end;
    }
    .btn-boxShadow{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
    .btn-boxShadow:focus{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
    .modify-formGroup{
        margin-bottom: 0.5rem;
    }

    .custom-dropdown {
        position: relative;
        display: block;
      }
    .custom-checkBox {
        float: left;
        margin: 2px 10px 2px 2px;
    }

     .custom-dropdown .dropdown-select {
       display: none;
       position: absolute;
       background-color: #fff;
       border: 1px solid #ccc;
       max-height: 125px;
       overflow-y: auto;
       z-index: 999;
       width: 100%;
     }

    .custom-dropdown .checkbox-option {
      display: block;
      padding: 5px;
      cursor: pointer;
    }

    .custom-dropdown .checkbox-option input[type="checkbox"] {
      margin-right: 5px;
    }

    .custom-rounded{
       border-radius: 0.64rem!important;
    }

    .required::after {
       content: '  *   ';
       color: red;
    }

    .error_span{
      font-size: 1.2rem;
      color: red;
      font-weight: 400;
      height: 1rem;
      display: inline-block;
    }

    .booelan_error_span{
      display: block !important;
    }

    .boolean_div{
      padding: 0.375rem 0.75rem;
    }

    .error_input{
      border-bottom-color: red !important;
    }

    .error_label{
      color: red
    }

    .multi-select{

    }
    .modify-colorSpanDetail{
    position: absolute;
    right: 38%;
    top: 16%;
    color: #302d2d;
    font-size: 16px;
    font-weight: 600;
    transform: translate(50%,50%);
    }

    .modify-fieldset{
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 5px 10px;
        margin-top: 15px;
    }

    .modify-legend{
        padding: 0px 10px 5px 10px;
        width: auto;
    }

    .modify-rowIn_container{
        padding: 0px 10px 0px 10px;
    }

        /* Style the date picker icon in Chrome */
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }

    /* Style the date picker icon in Firefox */
    input[type="date"]::-moz-calendar-picker-indicator {
      cursor: pointer;
    }
  
    /* Style the date picker icon in Microsoft Edge */
    input[type="date"]::-ms-calendar-picker-indicator {
      cursor: pointer;
    }

    input[type="number"]{
      appearance: none; /* Remove default arrow in other browsers */
      -webkit-appearance: none; /* Remove default arrow in WebKit browsers (Chrome, Safari) */
      -moz-appearance: textfield; /* Remove default arrow in Firefox */
    }

    input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
    }

    .toast {
      position: absolute;
  	  top: 7px;
  	  right: 10px;
      z-index: 1000;
  	  border-radius: 12px;
      background: #fff;
      padding: 10px 35px 13px 20px;
       /*box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.1);  */
       border: 2px solid #c7baba;
      box-shadow: 10px 8px 17px -6px rgba(0,0,0,0.75);
      overflow: hidden;
      transform: translateX(calc(100% + 30px));
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35);
    }

    .toast.active {
      transform: translateX(0%);
    }

    .toast .toast-content {
      display: flex;
      align-items: center;
    }

    .toast-content .check {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 35px;
      min-width: 35px;
      background-color: #4070f4;
      color: #fff;
      font-size: 20px;
      border-radius: 50%;
    }

    .toast-content .message {
      display: flex;
      flex-direction: column;
      margin: 0px 40px 0 0;
    }

    .message .text {
      font-size: 16px;
      font-weight: 400;
      color: #666666;
    }

    .message .text.text-1 {
      color: #e22323;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }

    .message .text.text-2 {
      font-weight: 600;
      color: #4caf50;;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }

    .toast .close {
      position: absolute;
      /* top: 10px;
      right: 15px;
      padding: 5px; */
      top: 7px;
      right: 12px;
      cursor: pointer;
      opacity: 0.7;
      font-size: x-large;
    }

    .toast .close:hover {
      opacity: 1;
    }

    .toast .progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
    }

    .toast .progress:before {
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
      background-color: #4070f4;
    }

    .progress.active:before {
      animation: progress 5s linear forwards;
    }

    @keyframes progress {
      100% {
        right: 100%;
      }
    }

    button {
      padding: 12px 20px;
      font-size: 20px;
      outline: none;
      border: none;
      background-color: #4070f4;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.3s;
    }

    button span:hover {
      color: black;
    }

    .toast.active ~ button {
      pointer-events: none;
    }

    svg {
        margin-bottom: 3px;
    }

    .inputOutputBtn {
        color: black;
        margin-left: 10px;
        background-color: rgb(97, 218, 251);
        font-family: Muli,Roboto,"Helvetica",Arial,sans-serif;
        font-weight: 600;
        line-height: 1.75;
        border-radius: 4px;
        padding: 6px 16px;
        font-size: 1.4rem;
        min-width: 64px;
        box-sizing: border-box;
        font-size: 1.4rem;
        text-transform: uppercase;
    }
    
    .inputOutputBtn:focus {
      outline: none;
      border: 0px
    }

    .formButton {
        margin-right: 7%;
        color: #fff;
        background-color: #192d3e;
        font-family: Muli,Roboto,"Helvetica",Arial,sans-serif;
        font-weight: 600;
        line-height: 1.75;
        border-radius: 4px;
        padding: 6px 16px;
        font-size: 1.4rem;
        min-width: 64px;
        box-sizing: border-box;
        font-size: 1.4rem;
        text-transform: uppercase;
    }

    .formButton.disabled {
      color: rgba(0, 0, 0, 0.26);
      box-shadow: none;
      background-color: rgba(0, 0, 0, 0.12);
      cursor: default;
      pointer-events: none;
    }

    .formButton:hover{
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
      background-color: #122230;
    }

    .formButtons{
      margin-bottom:10px; 
      margin-top:15px; 
      grid-row-end: 11;
    }

    .dropdownIcon{
      position: absolute;
      right: 37px;
      top: 1px;
    }

</style>
<form id="json-form" class="modify-form">

<div class="toast d-none">
    <div class="toast-content">
        <div class="message" id="tosterMessage">
            <div class="errorMsg d-none">
                <div class="text errorSpan text-1">
                    <span style="font-size:x-large">&#9888; &nbsp;</span>
                    <span> Error messages</span>

                </div>
            </div>
            <div class="successMsg d-none">
                <div class="text successSpan text-2">
                    <!-- <span style="font-size:x-large">&#10003; &nbsp;</span> -->
                    <span class="text text-2 successMessage">Success message</span>
                </div>
            </div>
            <span class="text errorMessages">Form errors will be displyed here</span>
        </div>
    </div>
    <button type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    <div class="progress active"></div>
</div>

</form>
<button class="btn" style="display:none">asdasd</button>
`;

class JSONRenderer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.form_details = ""
    this.uniqueId = ""
    this.submitFlow = ""
    this.normalized_schema = ""
    this.commonFields = ""
    this.mergeProps = ""
    this.jsonForm_Genx = ""
    this.formProperties = {}
    this.input_output_properties = {}
    this.validityCheck = "false";
    this.use_schema = "";
    this.eventObj = "";
    this.input_files = null;
    this.output_files = null
    this.inputFile_actualdata = []
    this.inputFile_metadata = ""
    this.jobdefiniation = ""
    this.resubmitData = null;   // Resubmit complete data coming from last comp
    this.resubmitProp = null;   // extracted input data 
    this.inputFileResponse = []
    this.jobVersion = ""
  }

  static get observedAttributes() {
    return ['inputfileresponse', 'jobversion'];
  }

  connectedCallback() {
    const self = this;
    this.jobdefiniation = JSON.parse(this.getAttribute("details"));
    this.shadowRoot.appendChild(template_JSONFromRendered.content.cloneNode(true));
    self.jsonForm_Genx = self.shadowRoot.querySelector('#json-form')

    // Get a reference to the button element
    const interval = setInterval(() => {
      const button = this.shadowRoot.querySelector('.btn')
      let fontWeight;
      if (button) {
        const computedStyle = window.getComputedStyle(button);
        fontWeight = computedStyle.fontWeight;
      }

      if (fontWeight === "400") {
        button.style.display = "none"
        clearInterval(interval)
        self.callFn()
      }
    }, 100)
  }


  callFn() {
    const self = this;
    self.getFileAttribute()
    self.initilization()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const self = this;

    if (newVal && (name === 'jobversion')) {   // ***RESUBMIT FUNCTIONALITY*** attribute jobversion checks for the change in version of job definitions. 
      self.jobVersion = self.getAttribute('jobversion')
      self.jobVersion = JSON.parse(self.jobVersion)

      self.extractFormProperties()
      const outputContainerDOM_col = self.shadowRoot.querySelector(`[property="output_container"]`);
      const outputNameDOM_col = self.shadowRoot.querySelector(`[property="output_name"]`);
      let outputContainer_value = ""
      let outputName_value = "" 
      if(outputContainerDOM_col){
        outputContainer_value = outputContainerDOM_col.getAttribute('value')
      }
      if(outputNameDOM_col){
        outputName_value = outputNameDOM_col.getAttribute('value')
      }

      const inputSelectionProperties_element = self.shadowRoot.querySelectorAll(`[container-type="input-selection"]`);
      let inpuFiles = []
      if (inputSelectionProperties_element) {
        inputSelectionProperties_element.forEach((inputoutput_element) => {
          const input_row_elements = inputoutput_element.querySelectorAll('.col-md-6');
          let element = {}
          input_row_elements.forEach((row_element) => {
            element['name'] = row_element.getAttribute('property');
            element['filePath'] = row_element.getAttribute('value') !== null ? row_element.getAttribute('value') : "";
            if(element['filePath']) {
              const parts = element['filePath'].split('/');
              const lastFileName = parts[parts.length - 1];
              element['stored_name'] = lastFileName
            }
            element['type'] = row_element.getAttribute('types');
            inpuFiles.push(element)
          });
        });
      }
      const storedData = {
        "formProperties" : self.formProperties,
        "inputFile_actualdata" : self.inputFile_actualdata.length > 0 ? self.inputFile_actualdata : [],
        "outputContainer" : outputContainer_value ? outputContainer_value : "",
        "outputName": outputName_value ? outputName_value : "",
        "inputFiles": inpuFiles
      }
      window.restoreDynamicFData = storedData;
    }
  }


  getFileAttribute() {
    const self = this;
    self.form_details = self.getAttribute('details')
    self.form_details = JSON.parse(self.form_details);

    self.submitFlow = self.getAttribute('submitFlow');
    self.uniqueId = self.getAttribute('uniqueId')
    // self.eventObj = self.getAttribute('eventObj')
    if (self.form_details && self.form_details.hasOwnProperty('file_schema') && self.form_details.file_schema.hasOwnProperty('usermeta_schema')) {
      // File Manager case
      self.use_schema = self.form_details.file_schema.usermeta_schema
    } else if (self.form_details && self.form_details.hasOwnProperty('input_schema')) {
      // Job definitions Case
      // JSON Form Generation
      self.use_schema = self.form_details.input_schema;
      if (self.form_details.hasOwnProperty('input_files') && self.form_details.input_files.length > 0) {
        self.input_files = self.form_details.input_files
      }
      if (self.form_details.hasOwnProperty('output_files')) {
        self.output_files = Object.keys(self.form_details.output_files).length > 0 ? self.form_details.output_files : null
      }
    }


    // Resubmit functionality
    if (self.hasAttribute('resubmitData')) {
      self.resubmitData = self.getAttribute('resubmitData');
      self.resubmitData = JSON.parse(self.resubmitData)
      self.resubmitProp = self.resubmitData !== null && self.resubmitData.inputData && self.resubmitData.inputData.input ? self.resubmitData.inputData.input : null;
      self.inputFile_actualdata = self.resubmitData !== null && self.resubmitData.inputData && self.resubmitData.inputData.input_files ? self.resubmitData.inputData.input_files : [];
    }

  }

  initilization() {
    const self = this;
    // self._deRefrenceJSON(ns_schema)
    self._deRefrenceJSON(self.use_schema)

    setTimeout(() => {
      self._processJSON()
    }, 500)

    if (self.submitFlow === "false") {   // adding external events for file uploader 
      self.externalEvents()
    }

  }

  externalEvents() {
    const self = this;
    const eventOne = `cust_EventOne_${self.uniqueId}`;
    const eventTwo = `cust_EventTwo_${self.uniqueId}`;

    const eventOneHandler = (event) => {
      // Your event handling logic here
      self.extractFormProperties()
        .then(() => self._ajvValidation())
        .then(() => {

          const returnJSON_data = new CustomEvent(eventTwo, {
            bubbles: true,
            composed: true,
            detail: {
              formValidation: self.validityCheck,
              formData: self.formProperties,
              uniqueId: self.uniqueId
            }
          });
          window.dispatchEvent(returnJSON_data);
        });
    };

    // Add the event listener
    window.addEventListener(eventOne, eventOneHandler);
  }

  sumbitFormFlow() {
    const self = this;

    // const form_buttons = self.shadowRoot.querySelector(".formButtons");
    // form_buttons.className = "row formButtons  d-none"

    // form_buttons.innerHTML =  /* html */`
    //       <div class="col-md-12" style="display: flex;justify-content: flex-end;">
    //         <button id="submitBtn" class="formButton disabled"  style="margin-right: 8px;" type="button"> Submit</button>
    //         <button id="cancelBtn" class="formButton" onclick="window.history.back();"  style="margin-right: 6%;" type="button">Cancel</button>
    //       </div>
    //     `
    self.jsonForm_Genx.classList.add('padding-20')
    self.submitForm();

    // adding events o
    self.jsonForm_Genx.addEventListener('change', function () {
      self.enableDisableSubmitBtn();
    });

    self.jsonForm_Genx.addEventListener('keyup', function () {
      self.enableDisableSubmitBtn();
    });

    // setTimeout(() => {
    //   form_buttons.classList.remove('d-none')
    // }, 200);

  }

  enableDisableSubmitBtn() {
    const self = this;
    let enabled = false;
    let propWithVal = [];
    const required_elements = self.shadowRoot.querySelectorAll(`[required="true"]`);
    if (required_elements) {

      for (let index = 0; index < required_elements.length; index++) {
        const element = required_elements[index];
        const hasAttr = element.hasAttribute('value')
        const attrVal = element.getAttribute('value')
        if (hasAttr && attrVal && (attrVal !== null || attrVal !== "")) {
          propWithVal.push(true);
        } else {
          break;
        }
      }

      if (required_elements.length === propWithVal.length) {
        enabled = true;
      }
    }

    let submitBtn = self.shadowRoot.querySelector('#submitBtn');
    if (submitBtn) {
      if (enabled) {
        submitBtn.classList.remove('disabled');
      } else {
        if (!submitBtn.classList.contains('disabled'))
          submitBtn.classList.add('disabled');
      }
    }
  }

  _deRefrenceJSON(json) {
    const self = this;

    RefParser.dereference(json)
      .then((dereferencedSchema) => {

        self.normalized_schema = dereferencedSchema
      })
      .catch((err) => {
        console.error(err);
      });
  }

  _processJSON() {
    const self = this;

    if (self.normalized_schema) {
      self.commonFields = self.extractCommonFieldsFromOneOf(self.normalized_schema);
      self.mergeProps = self.mergeProperties(self.commonFields, self.normalized_schema, "normalized")

      self.initilize_formGeneration(self.mergeProps, false)
    }
  }

  extractCommonFieldsFromOneOf(json) {
    const commonFields = {
      "properties": {},
      "required": []
    };

    if (json.oneOf) {


      // Perform below operations on above oenOf array

      // Initialize commonFields with the properties from the first object in oneOf
      if (json.oneOf[0] && json.oneOf[0].properties) {
        for (const prop in json.oneOf[0].properties) {
          commonFields['properties'][prop] = { ...json.oneOf[0].properties[prop] };
        }
      }

      // Iterate through the remaining objects in oneOf to find common properties
      for (let i = 1; i < json.oneOf.length; i++) {
        const instance = { ...json.oneOf[i] };

        if (instance.properties) {
          for (const prop in commonFields['properties']) {
            // If the property exists in commonFields['properties'] but not in this instance, remove it
            if (instance.properties.hasOwnProperty(prop)) {

              if (commonFields['properties'][prop].hasOwnProperty('const')) {

                //adding required fields only if they have const values
                if (commonFields['required'].indexOf(prop) === -1) {
                  commonFields['required'].push(prop)
                }

                if (!commonFields['properties'][prop].hasOwnProperty('enum')) {
                  // Below line is to add the value in enum that is already present in commonFields['properties'][prop]['const']
                  commonFields['properties'][prop]['enum'] = [commonFields['properties'][prop]['const']]

                  if (instance.properties[prop].hasOwnProperty('enum')) {       // if instead of const value there are multiple values in enum that needs to be added in enum that we are creating so below :
                    commonFields['properties'][prop]['enum'] = commonFields['properties'][prop]['enum'].concat(instance.properties[prop]['enum'])
                  } else if (instance.properties[prop].hasOwnProperty('const')) {
                    commonFields['properties'][prop]['enum'].push(instance.properties[prop]['const'])
                  }

                } else {
                  if (instance.properties[prop].hasOwnProperty('enum')) {
                    commonFields['properties'][prop]['enum'] = commonFields['properties'][prop]['enum'].concat(instance.properties[prop]['enum'])
                  } else if (instance.properties[prop].hasOwnProperty('const')) {
                    commonFields['properties'][prop]['enum'].push(instance.properties[prop]['const'])
                  }
                }

                // Deleting const value from commonFields in the last iteration of oneOf
                // Reason : since we have pushed those values in enum no point in keeping const and enum
                if (i === json.oneOf.length - 1) {
                  delete commonFields['properties'][prop]['const']
                }
              }
              else if (commonFields['properties'][prop].hasOwnProperty('items') &&
                commonFields['properties'][prop].items.hasOwnProperty('properties') &&
                Object.keys(commonFields['properties'][prop].items.properties).length === 1) {
                // this is the case for oneOf[0].oneOf[0].properties.measures.items.properties.measure_type wehere form_driving property is looped inside of main property. so to check each of those properties from oneOf we need to loop over and then extract the enum value and merge it into one. This will help displaying that property as select dropdown.
                for (const externalProp in commonFields['properties'][prop].items.properties) {

                  const iteratedExProp = commonFields['properties'][prop].items.properties[externalProp]
                  const instanceExProp = instance['properties'][prop].items.properties[externalProp]


                  if (commonFields['required'].indexOf(prop) === -1) {
                    commonFields['required'].push(prop)
                  }

                  if (!iteratedExProp.hasOwnProperty('enum')) {
                    // Below line is to add the value in enum that is already present in commonFields['properties'][prop]['const']
                    iteratedExProp['enum'] = [iteratedExProp['const']]

                    if (instanceExProp.hasOwnProperty('enum')) {       // if instead of const value there are multiple values in enum that needs to be added in enum that we are creating so below :
                      iteratedExProp['enum'] = iteratedExProp['enum'].concat(instanceExProp['enum'])
                    } else if (instanceExProp.hasOwnProperty('const')) {
                      iteratedExProp['enum'].push(instanceExProp['const'])
                    }

                  } else {
                    if (instanceExProp.hasOwnProperty('enum')) {
                      iteratedExProp['enum'] = iteratedExProp['enum'].concat(instanceExProp['enum'])
                    } else if (instanceExProp.hasOwnProperty('const')) {
                      iteratedExProp['enum'].push(instanceExProp['const'])
                    }
                  }

                  if (i === json.oneOf.length - 1) {
                    delete iteratedExProp['const']
                  }
                }

              }

            } else {
              delete commonFields['properties'][prop];
            }
          }
        }
      }
    } else {
      if (json.hasOwnProperty('properties')) {
        commonFields["properties"] = { ...json.properties }
      } else {
        commonFields["properties"] = null
      }
      if (json.hasOwnProperty('required')) {
        commonFields["required"] = [...json.required]
      } else {
        commonFields["required"] = null
      }
    }
    return commonFields;
  }

  mergeProperties(common_Fields, json) {
    const self = this;
    let combineObj = {}
    let mergeProp = {
      "properties": {},
      "required": []
    }

    let form_drivingProp = []
    if (common_Fields && json && json.hasOwnProperty('oneOf')) {
      const properties = json.properties

      //removing properties frm common_Fields that do no have enum``

      if (properties) {

        // removing properties from common_Fields.properties that are not present in common_Fields.required. This is maek sure that only one propety that will drive the form goes forward and other gets removed.

        for (const prop in common_Fields['properties']) {
          if (!common_Fields['required'].includes(prop)) {
            delete common_Fields['properties'][prop]
          }
        }

        // Logic to understand ***form_drivingProp*** properties. Properties on which we need to render the oneOf object
        for (const prop in common_Fields['properties']) {
          if (common_Fields['properties'][prop].hasOwnProperty('enum')) {     // if property has enum
            if (form_drivingProp.length === 0) {      // there can only be one driving factor for form
              if ((json['oneOf'].length === 2) && (common_Fields['properties'][prop].type === 'boolean')) {     // if driving factor is a type boolean, then oneOf array should have only two object

                form_drivingProp.push(prop)
              } else if (common_Fields['properties'][prop].type !== 'boolean') {         // else if property is not boolean, as it already has enum and is common on all oneOf object
                form_drivingProp.push(prop)
              }
            }
          }
          else if (common_Fields['properties'][prop].hasOwnProperty('items') &&
            common_Fields['properties'][prop].items.hasOwnProperty('properties') &&
            Object.keys(common_Fields['properties'][prop].items.properties).length === 1) {
            if (form_drivingProp.length === 0) {      // there can only be one driving factor for form
              for (const extrnalProp in common_Fields['properties'][prop].items.properties) {
                const completePropertyObj = common_Fields['properties'][prop].items.properties[extrnalProp]

                if ((json['oneOf'].length === 2) && (completePropertyObj.type === 'boolean')) {     // if driving factor is a type boolean, then oneOf array should have only two object

                  form_drivingProp.push(prop)
                } else if (completePropertyObj.type !== 'boolean') {         // else if property is not boolean, as it already has enum and is common on all oneOf object
                  form_drivingProp.push(prop)
                }
              }

            }
          }
        }

        mergeProp['properties'] = { ...json.properties }
        mergeProp['required'] = []
        if (json.hasOwnProperty('required')) {
          mergeProp['required'].push(...json['required'])
        }
        if (common_Fields.hasOwnProperty('required')) {
          mergeProp['required'].push(...common_Fields['required'])
        }
        // mergeProp['required'] = [...json['required'], ...common_Fields['required']]
        mergeProp['required'] = [...new Set(mergeProp['required'])]

        // to merge the properties that are present in common_Fields and json.properties
        for (const prop in properties) {
          if (common_Fields['properties'].hasOwnProperty(prop)) {

            if (common_Fields['properties'][prop].hasOwnProperty('items') &&
              common_Fields['properties'][prop].items.hasOwnProperty('properties') &&
              Object.keys(common_Fields['properties'][prop].items.properties).length === 1) {

              for (const extrnalProp in common_Fields['properties'][prop].items.properties) {

                const propertyToSearch = extrnalProp;
                const tomergeData = common_Fields['properties'][prop].items.properties[extrnalProp]

                const updatedMergedData = self.searchKeyAndMerge(properties[prop], propertyToSearch, tomergeData);
                self.removeEnumFromMeasures(updatedMergedData, propertyToSearch); // removing the enum for type boolean in nested json 

                mergeProp['properties'][prop] = { ...updatedMergedData }


              }
            } else {
              mergeProp['properties'][prop] = { ...properties[prop], ...common_Fields['properties'][prop] }

              // removing the enum for type boolean 
              if (mergeProp['properties'][prop]["type"] === "boolean") {
                if (mergeProp['properties'][prop].hasOwnProperty("enum")) {
                  delete mergeProp['properties'][prop]['enum']
                }
              }
            }

            // removing the enum for type boolean 
            // if (mergeProp['properties'][prop]["type"] === "boolean") {
            //   if (mergeProp['properties'][prop].hasOwnProperty("enum")) {
            //     delete mergeProp['properties'][prop]['enum']
            //   }
            // }
          }
        }

        // to add the properties that are not present in json.properties but in common_Fields
        for (const prop in common_Fields['properties']) {
          if (!mergeProp['properties'].hasOwnProperty(prop)) {
            mergeProp['properties'][prop] = { ...common_Fields['properties'][prop] }

            // removing the enum i.e made up in function extractCommonFieldsFromOneOf() as they have const values declared.
            if (mergeProp['properties'][prop]["type"] === "boolean") {
              if (mergeProp['properties'][prop].hasOwnProperty("enum")) {
                delete mergeProp['properties'][prop]['enum']
              }
            }
          }
        }


        // This alignes the merge Prop with sequence. Defined is the sequence with conditions
        const sequence = [
          { type: "string", enum: true }, /// dropdown
          { type: "integer", enum: true },    ////// dropdown
          { type: "string", enum: false },    /// input type string
          { type: "integer", enum: false },   /// input type number
          { type: "boolean", enum: false },   /// input type booelan
          { type: "array", enum: true },  /// multip-select dropdown
          { type: "object" }, /// properties type object
          { type: "array" },  /// properties type array
        ];
        // sequence will be in such format. top of the form will have dropdown, input fields. If their are mutlipe properties of type object/array, those will be aligned as all objects first and then all array later

        const alignedProps = {}
        for (const condition of sequence) {

          for (const key in mergeProp['properties']) {
            const property = mergeProp['properties'][key]

            if (condition.type === property.type) {
              if (condition.hasOwnProperty('enum')) {
                if (condition.enum === property.hasOwnProperty('enum')) {
                  alignedProps[key] = property
                }
              } else if (property.type === "object") {
                alignedProps[key] = property

              } else if (property.type === "array") {
                alignedProps[key] = property

              }
            }
          }
        }

        // Add any remaining properties from jsonSchema to alignedProperties
        for (const ele in mergeProp['properties']) {
          alignedProps[ele] = mergeProp['properties'][ele];
        }
        if (Object.keys(mergeProp['properties']).length === Object.keys(alignedProps).length) {
          mergeProp['properties'] = alignedProps
        }
        // let json_oneOf = 
        combineObj = {
          "mergeProp": mergeProp,
          "form_drivingProp": {}
        }
        if (form_drivingProp.length > 0) {
          const f_dp = form_drivingProp[0]
          combineObj['form_drivingProp'][f_dp] = { "oneOf": [...json.oneOf] }
        }

      }
    } else if (common_Fields && json.hasOwnProperty('properties')) {

      if (json.properties) {
        mergeProp["properties"] = { ...common_Fields.properties }
      } else {
        mergeProp["properties"] = null
      }

      if (json.hasOwnProperty('required')) {
        mergeProp["required"] = [...common_Fields.required]
      } else {
        mergeProp["required"] = null
      }

      combineObj = {
        "mergeProp": mergeProp,
        "form_drivingProp": null
      }

    } else {
      combineObj = {
        "mergeProp": null,
        "form_drivingProp": null
      }
    }

    return combineObj;
  }

  findValueByKey(object, keyToFind) {
    const self = this;
    for (const key in object) {
      if (key === keyToFind) {
        return object[key];
      } else if (typeof object[key] === 'object') {
        const result = self.findValueByKey(object[key], keyToFind);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return undefined;
  }

  searchKeyAndMerge(json, keyToFind, mergeData) {
    // this function takes 3 arguments. json is the porpvided obj, keyToFind is the property key that we needs to find in json, mergeData is the data that needs to be merged in the json at same location where keyToFind is found in json 
    function mergeObject(obj, key) {
      if (obj[key] !== undefined) {
        obj[key] = { ...obj[key], ...mergeData };
      } else {
        for (const k in obj) {
          if (typeof obj[k] === 'object') {
            mergeObject(obj[k], key);
          }
        }
      }
    }

    mergeObject(json, keyToFind);
    return json;
  }
  // Perform deletion of 'enum' key
  removeEnumFromMeasures(json, keyToFind) {
    function removeEnum(obj, key) {
      if (obj[key] !== undefined && obj[key].type === 'boolean' && obj[key].hasOwnProperty('enum')) {
        delete obj[key].enum;
      } else {
        for (const k in obj) {
          if (typeof obj[k] === 'object') {
            removeEnum(obj[k], key);
          }
        }
      }
    }

    removeEnum(json, keyToFind);
  }

  initilize_formGeneration(mergedData, check) {
    const self = this;
    //There are job-definition where input files and input_schema is blank, so mergeData will throw null values

      if (self.submitFlow === "false") {
        self.jsonForm_Genx.innerHTML += /* html */`
          <div class="row">
            <div class="col-md-8" style="word-break: break-all;">
            <p class="font-weight-bold"> File : ${self.form_details.file_name}</p>
            </div>
            <div class="col-md-4">
            <p class="font-weight-bold text-right">Type : ${self.form_details.type}</p>
            </div>
          </div>
          <hr>
        `
      }

      const container_input = self.createNewRow('container')
      container_input.setAttribute('container-type', 'input-selection')
      container_input.style.marginBottom = '25px';
      const row_inputSelection = self.createNewRow('row')
      container_input.appendChild(row_inputSelection)

      if (self.input_files !== null && self.input_files.length > 0) {

        self.input_files.forEach((file, index) => {
          const required = file.required ? file.required : false;
          // const types = file.types ? file.types : []
          const types = file.types

          const uniqueInputId = `input_files_${index}`
          const name = file.name ? file.name : uniqueInputId
          const col = document.createElement('div')
          col.classList.add('col-md-6')
          col.setAttribute("property", name)
          col.setAttribute("property-index", uniqueInputId)
          col.setAttribute("types", types)
          col.setAttribute("name", name)
          col.setAttribute("required", required)
          col.style.wordBreak = 'break-all'
          col.style.setProperty('white-space', 'normal', 'important')

          const inputDiv = document.createElement('div')
          inputDiv.classList.add('form-group', 'modify-formGroup');

          const inputLabel = document.createElement('label')
          inputLabel.textContent = name;
          inputLabel.style.width = '130px'
          inputLabel.setAttribute('for', name)

          required ? inputLabel.classList.add('modify-label', 'required', 'font-weight-bold') : inputLabel.classList.add('modify-label', 'font-weight-bold')

          const inputBtn = document.createElement('button')
          inputBtn.type = 'button'
          inputBtn.textContent = "select File"
          inputBtn.className = "inputOutputBtn"

          const inputPathSpan = document.createElement('span')
          inputPathSpan.setAttribute('setpath', uniqueInputId)
          inputPathSpan.textContent = 'No File Chosen'
          inputPathSpan.className = 'ml-2'

          inputDiv.append(inputLabel, inputBtn, inputPathSpan)
          col.appendChild(inputDiv)
          row_inputSelection.appendChild(col)

          setTimeout(() => {
            inputBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              let eventOutput;
              const props = {
                'formData': [
                  "inputFile_Graph",
                  {
                    "name": name,
                    "required": true,
                    "types": types,
                    "stage": true,
                    "require_related_provenance_files": false,
                    "retrieve_provenance_files": false,
                    "id": index,
                    "formLabel": name,
                    "outputFlag": false,
                    "value": ""
                  }
                ]
              }
              window.askForPathOutput = {
                openFM_props: props,
                setPathFor: uniqueInputId
              }
              const showFileManager = new CustomEvent('cust-openFM', {
                bubbles: true,
                composed: true,
                detail: {
                  openFM_props: props,
                  setPathFor: uniqueInputId,
                  showFileManager: true
                }
              });
              inputBtn.dispatchEvent(showFileManager);

              const generate_event = `cust_${uniqueInputId}`
              const setInputPath = (event) => {
                eventOutput = event.detail.pathDetails
                inputPathSpan.textContent = eventOutput[0];
                inputPathSpan.style.fontWeight = 'bold';
                self.inputFile_actualdata = []
                self.inputFile_actualdata = [event.detail.metadata]

                const selectDropDowns = self.shadowRoot.querySelectorAll(`[input-dependselect='true']`)
                for (let index = 0; index < selectDropDowns.length; index++) {
                  const selectDD = selectDropDowns[index];
                  selectDD.innerHTML = ""
                  // adding a default selected select option
                  const select_option = document.createElement('option');
                  select_option.textContent = "Please select input file";
                  select_option.setAttribute('disabled', true)
                  select_option.setAttribute('selected', true)
                  selectDD.appendChild(select_option);
                  selectDD.setAttribute('input-dependselectupdate', 'not-updated')
                }

                const multiSelectDropd = self.shadowRoot.querySelectorAll(`[input-dependmultiselect='true']`)
                for (let index = 0; index < multiSelectDropd.length; index++) {
                  const multiselectDD = multiSelectDropd[index];
                  multiselectDD.innerHTML = ""
                  // adding a default selected select option
                  const _li = document.createElement('li');
                  _li.textContent = "Please select input file";
                  _li.className = "checkbox-option"
                  multiselectDD.appendChild(_li);
                  multiselectDD.setAttribute('input-dependmultiselectupdate', 'not-updated')
                }
                self.updateSelectOptions(true)
                col.setAttribute("value", eventOutput.length > 0 ? eventOutput[0] : "")

                self.enableDisableSubmitBtn() // This is enable/disable submit button on changes for required fields
                window.removeEventListener(generate_event, setInputPath)
              }
              window.addEventListener(generate_event, setInputPath)
            })
          }, 200)

        })

      }


      const container_output = self.createNewRow('container')
      container_output.setAttribute('container-type', 'output-selection')
      container_output.style.marginBottom = '25px';
      const row_outputSelection = self.createNewRow('row')
      container_output.appendChild(row_outputSelection)

      if (self.output_files !== null) {
        const required = true
        const types = ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"]
        const name = "output_container"
        const col = document.createElement('div')
        const uniqueOutputId = `output_container`

        col.classList.add('col-md-6')
        col.setAttribute("property", "output_container")
        col.setAttribute("types", types)
        col.setAttribute("name", name)
        col.setAttribute("required", required)
        col.style.wordBreak = 'break-all'
        col.style.setProperty('white-space', 'normal', 'important')

        const outputDiv = document.createElement('div')
        outputDiv.classList.add('form-group', 'modify-formGroup');

        const outputLabel = document.createElement('label')
        outputLabel.textContent = name;
        outputLabel.setAttribute('for', name)
        required ? outputLabel.classList.add('modify-label', 'required', 'font-weight-bold') : outputLabel.classList.add('modify-label', 'font-weight-bold')

        const outputBtn = document.createElement('button')
        outputBtn.type = 'button'
        outputBtn.textContent = "Select Path"
        outputBtn.className = "inputOutputBtn"

        const outputPathSpan = document.createElement('span')
        outputPathSpan.setAttribute('setOutput_containerPath', uniqueOutputId)
        outputPathSpan.textContent = 'No Folder Specified'
        outputPathSpan.className = 'ml-2'

        outputDiv.append(outputLabel, outputBtn, outputPathSpan)
        col.appendChild(outputDiv)
        row_outputSelection.appendChild(col)

        setTimeout(() => {
          outputBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            let eventOutput;
            const showFolderManager = new CustomEvent('cust-openFolderM', {
              bubbles: true,
              composed: true,
              detail: {
                // openFM_props: props,
                setOutput_containerPath: uniqueOutputId,
                showFolderManager: true
              }
            });
            outputBtn.dispatchEvent(showFolderManager);


            const generate_event = `cust-containerPath`
            const setInputPath = (event) => {
              eventOutput = event.detail.pathDetails
              outputPathSpan.textContent = eventOutput;
              outputPathSpan.style.fontWeight = 'bold';
              col.setAttribute("value", eventOutput)
              self.enableDisableSubmitBtn() // This is enable/disable submit button on changes for required fields

              window.removeEventListener(generate_event, setInputPath)
            }
            window.addEventListener(generate_event, setInputPath)
          })

        }, 200);

        // Output file Nama HTML
        const col_outputName = document.createElement('div')
        col_outputName.classList.add('col-md-6')
        col_outputName.setAttribute("property", "output_name")
        col_outputName.setAttribute("property-type", "string")

        col_outputName.setAttribute("name", "outputFile_name")
        col_outputName.setAttribute("required", required)

        const form_group = document.createElement('div')
        form_group.className = "form-group modify-formGroup"

        const label = document.createElement('label')
        label.className = "modify-label required"
        label.setAttribute('for', 'output_name');
        label.textContent = 'output_name'

        const input = document.createElement('input')
        input.type = 'string'
        input.className = "form-control border-bottom modify-input"
        input.setAttribute('actual-name', 'output_name')
        input.id = 'output_name';
        input.name = 'output_name'
        input.style.border = 'none'

        form_group.append(label, input)
        col_outputName.append(form_group)
        row_outputSelection.append(col, col_outputName)
        setTimeout(() => {
          input.addEventListener("input", function () {
            self.setValue_column(input.value.trim(), col_outputName)
          });
        }, 200);

      }
      
      const container_propCommon = self.createNewRow('container')
      const row_propCommon = self.createNewRow('row')
      row_propCommon.setAttribute('primary-row', "true")
      container_propCommon.setAttribute('container-type', 'commonProperties')

      const container_propObject = self.createNewRow('container')
      container_propObject.setAttribute('container-type', 'objectProperties')

      const container_propArray = self.createNewRow('container')
      container_propArray.setAttribute('container-type', 'arrayProperties')
      container_propArray.style.marginBottom = '25px'

      container_propCommon.appendChild(row_propCommon)

      const container_formButtons = document.createElement('div');

      if (self.submitFlow !== 'false') {  // adding this condition to add submit button 
        self.jsonForm_Genx.classList.add('padding-20')        // adding this because there shoudld be padding if its a job definiton form

        container_formButtons.className = "row formButtons"
        container_formButtons.style.marginBottom = '10px';
        container_formButtons.style.marginTop = '15px';
        container_formButtons.innerHTML =  /* html */`
              <div class="col-md-12" style="display: flex;justify-content: flex-end;">
                <button id="submitBtn" class="formButton disabled"  style="margin-right: 8px;" type="button"> Submit</button>
                <button id="cancelBtn" class="formButton" onclick="window.history.back();"  style="margin-right: 6%;" type="button">Cancel</button>
              </div>
            `
      }

      self.jsonForm_Genx.append(self.input_files ? container_input : "", container_propCommon, container_propObject, container_propArray, self.output_files ? container_output : "", self.submitFlow !== 'false' ? container_formButtons : "")
      
      if(mergedData['mergeProp']){  // if mergedData['mergeProp'] === null, means either input_schema is blank or there is issue with input_schema structure
        self._generateForm_HTML(mergedData, row_propCommon, container_propObject, container_propArray);
      }

      if (self.resubmitProp !== null) {
        self.resubmitFunctionality()
      }

      if (self.submitFlow !== 'false') {   // adding this condtion to enable events until submit button is added if self.submitFlow !== 'false'
        let intervalId;
        let submitBtn = false
        const intervalFn = () => {
          if (submitBtn) {
            self.sumbitFormFlow()
            clearInterval(intervalId)
          } else {
            const form_buttons = self.shadowRoot.querySelector(".formButtons");
            form_buttons ? submitBtn = true : submitBtn = false;
          }
        }
        intervalId = setInterval(intervalFn, 500)

      }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  arraysHaveSameValues(arr1, arr2) {      // checks if two array has same value or not irrespective of the object sequence in both arrays
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
  }

  setNotUpdated(obj) {
    const self = this;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        // If the value is an object (excluding arrays), recursively set its values
        self.setNotUpdated(obj[key]);
      } else if (Array.isArray(obj[key])) {
        if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
          // If it's an array of objects, set each element of the array to "not-updated"
          obj[key].forEach((item) => {
            for (const subKey in item) {
              item[subKey] = 'not-updated';
            }
          });
        } else {
          // If it's a simple array, set the entire array to "not-updated"
          obj[key] = 'not-updated';
        }
      } else {
        // For non-object and non-array values, set the value to "not-updated"
        obj[key] = 'not-updated';
      }
    }
  }

  resubmitFunctionality() {
    const self = this;
    const json = self.resubmitProp
    const updatedPropList = [];
    self.updateSelectOptions(true)    // RESTRICTED from moving position of this function. 
    
    let removeInputfile_properties = []   // array holds the name of inputFile i.e input_file, input_graph. Later on these can excluded as inputFile are getting set before form properties
    const updatedValuePropJSON = _.cloneDeep(self.resubmitProp)
    self.setNotUpdated(updatedValuePropJSON)

    // input file pre-selection for resubmit
    if (self.resubmitData.inputData.input_files && self.resubmitData.inputData.input_files.length > 0) {
      if(self.resubmitData.inputData.inputFile_actualdata){
        self.inputFile_actualdata = self.resubmitData.inputData.inputFile_actualdata
      }
      let inputFiles = self.resubmitData.inputData.input_files
      removeInputfile_properties = inputFiles.map(inp_file => inp_file.name)
      inputFiles.forEach((file) => {
        const fileDOM_col = self.shadowRoot.querySelector(`[property="${file.name}"]`);
        if (fileDOM_col) {
          fileDOM_col.setAttribute("value", file.filePath ? file.filePath : "")
          const inputPathSpan = fileDOM_col.querySelector('span')
          if (inputPathSpan) {
            inputPathSpan.textContent = file.filePath
            inputPathSpan.style.fontWeight = 'bold';
          }
        }
      })
    }

    // output-container path && output name pre-selection for resubmit
    if (self.resubmitData.inputData.output_container) {
      const outputContainerDOM_col = self.shadowRoot.querySelector(`[property="output_container"]`);
      if (outputContainerDOM_col) {
        outputContainerDOM_col.setAttribute("value", self.resubmitData.inputData.output_container ? self.resubmitData.inputData.output_container : "")
        const outputPathSpan = outputContainerDOM_col.querySelector('span')
        if (outputPathSpan) {
          outputPathSpan.textContent = self.resubmitData.inputData.output_container
          outputPathSpan.style.fontWeight = 'bold';
        }
      }

    }
    // if(self.resubmitData.inputData.state !== "Completed"){
    //   if (self.resubmitData.inputData.output_name) {
    //     const outputNameDOM_col = self.shadowRoot.querySelector(`[property="output_name"]`);
    //     if (outputNameDOM_col) {
    //       outputNameDOM_col.setAttribute("value", self.resubmitData.inputData.output_name ? self.resubmitData.inputData.output_name : "")
    //       const outputNameInput = outputNameDOM_col.querySelector('input')
    //       if (outputNameInput) {
    //         outputNameInput.value = self.resubmitData.inputData.output_name
    //       }
    //     }
    //   }
    // }

    function updateStatusInList(parent, mainProp, property, type, index, extras) {
      if ((index !== undefined && index !== null) && mainProp) {
        if (parent[mainProp][index]) {
          parent[mainProp][index][property] = "updated";
        }
      } else if (mainProp) {
        parent[mainProp][property] = "updated";
      } else {
        parent[property] = "updated";
      }
    }

    function hasNotUpdatedValue(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          // If the value is an object (excluding arrays), recursively check its values
          if (hasNotUpdatedValue(obj[key])) {
            return true;
          }
        } else if (Array.isArray(obj[key])) {
          // If the value is an array, check each element
          for (const item of obj[key]) {
            if (typeof item === 'object') {
              if (hasNotUpdatedValue(item)) {
                return true;
              }
            } else if (item === 'not-updated') {
              return true;
            }
          }
        } else if (obj[key] === 'not-updated') {
          return true;
        }
      }
      return false;
    }

    function checkObjectType(value) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        return "object";
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return "object";
      } else {
        return "nonObject";
      }
    }

    loopJSON()
    async function loopJSON() {
      // self.updateSelectOptions(true)

      for (const prop in json) {
        let propVal = json[prop]
        if (!removeInputfile_properties.includes(prop)) {
          setVal(prop, propVal)
        }
      }
      window.formEdited = true;
    }
    setTimeout(() => {
      loopJSON()
      self.enableDisableSubmitBtn();
    }, 1000);

    function setVal(prop, propVal) {
      const propValType = checkObjectType(propVal)
      if (propValType === 'nonObject') {
        const propHTML = self.shadowRoot.querySelector(`[property="${prop}"]`)
        if (propHTML) {
          const propertyType = propHTML.getAttribute('property-type')
          const formDriven_check = propHTML.getAttribute('form-driven')

          if (propertyType === "string" || propertyType === "integer" || propertyType === "number") {

            const inputOrSelect = propHTML.querySelector('input, select');
            if (inputOrSelect) {
              if (inputOrSelect.tagName.toLowerCase() === 'select') {

                if (updatedValuePropJSON[prop] !== "updated") {
                  const updateListCheck = true
                  proceed_select(prop, propVal, formDriven_check, propHTML, inputOrSelect, updateListCheck)
                }
              } else if (inputOrSelect.tagName.toLowerCase() === 'input') {

                if (updatedValuePropJSON[prop] !== "updated") {
                  const updateListCheck = true
                  proceed_input(prop, propVal, formDriven_check, propHTML, inputOrSelect, updateListCheck)
                }
              }
            }
          }

          else if (propertyType === "boolean") {
            if (updatedValuePropJSON[prop] !== "updated") {
              const updateListCheck = true
              proceed_boolean(prop, propVal, formDriven_check, propHTML, updateListCheck)
            }
          }

          else if (propertyType === "array-multiselect") {
          }
        }
      } else if (propValType === "object") {    // this case is applied for properties that are type array or object for eg. measures, date_settings

        const propHTML = self.shadowRoot.querySelector(`[major-name="${prop}"]`)
        if (propHTML) {
          const majorPropertyType = propHTML.getAttribute('property-type')
          if (majorPropertyType === "array") {

            const add_completeSectionBtn = self.shadowRoot.querySelector(`[add-completesection="add_${prop}"]:not(.d-none)`)
            if (add_completeSectionBtn) {     // case where add complete section button is present && needs to be clicked

              let event = new Event('click');
              add_completeSectionBtn.dispatchEvent(event);
              (async () => {
                await initiateArray(prop, propVal, propHTML);
              })();

            } else {         // case where add complete section button is not present. here we need to check the length of array and if > 1 then we need to click the add another button of array to match the no. of object
              (async () => {
                await initiateArray(prop, propVal, propHTML);
              })();

            }
          }

          if (majorPropertyType === "object") {

            const add_completeSectionBtn = self.shadowRoot.querySelector(`[add-completesection="add_${prop}"]:not(.d-none)`)
            if (add_completeSectionBtn) {     // case where add complete section button is present && needs to be clicked

              let event = new Event('click');
              add_completeSectionBtn.dispatchEvent(event);
              (async () => {
                await initiateObject(prop, propVal, propHTML);
              })();

            } else {         // case where add complete section button is not present. here we need to check the length of array and if > 1 then we need to click the add another button of array to match the no. of object
              (async () => {
                await initiateObject(prop, propVal, propHTML);
              })();

            }
          }
        }

        async function initiateObject(prop, propVal, propHTML, extraParams) {
          let copy_arguments = {
            "prop": prop,
            "propVal": propVal,
            "propHTML": propHTML,
            "type": "object"

          }

          for (const property in propVal) {
            const propertyValue = propVal[property]
            const propValType = checkObjectType(propertyValue)
            let propertyDiv = ""
            let extraParameter = extraParams ? extraParams : []
            if (propValType === "nonObject") {
              propertyDiv = propHTML.querySelector(`[property="${property}"]`)
            } else if (propValType === "object") {
              propertyDiv = propHTML.querySelector(`[major-name="${property}"]`)
            }

            if (propertyDiv) {
              await divertFunctions(property, propertyValue, null, propertyDiv, copy_arguments, extraParameter)
            }

          }
        }

        async function initiateArray(prop, propVal, propHTML) {   
          const highestIndex = propHTML.getAttribute('highest-index');
          const match = highestIndex.match(/\[(\d+)\]/);
          const extractedNumber = parseInt(match[1], 10);
          if (match) {     
            if (propVal.length === extractedNumber + 1) {     // Array related function : if prop ex, measure is already present in DOM then settinng values directly
              await startSettingArrVal(prop, propVal, propHTML)

            } else {  // appending object in array that is === propVal.length (array.length)
              const appendObjBtn = propHTML.querySelector(`[id="add_${prop}[0]"]`)    // this is Add Another button 
              // await self.delay(500);

              for (let i = 0; i < propVal.length - 1; i++) {
                appendObjBtn.click();
              }
              await startSettingArrVal(prop, propVal, propHTML)
            }
          }
        }

        async function startSettingArrVal(prop, propVal, propHTML) {    // Array related function: this function make no. of object == no. of object in DOM
          const attribute = `${prop}-index`     //ex : measures-index
          const propIndices = [];    // Array to store the extracted value of attribute based on its unique index value
          const innerDivs = propHTML.querySelectorAll(`[${attribute}]`);
          let copy_arguments = {
            "prop": prop,
            "propVal": propVal,
            "propHTML": propHTML,
            "type": "array"
          }

          // Iterate through the inner div elements and extract the values
          innerDivs.forEach((div) => {
            const attributeVal = div.getAttribute(attribute);
            const index = propIndices.indexOf(attributeVal);
            if (index === -1) {
              propIndices.push(attributeVal);
            }
          });

          if (propIndices.length > 0) {
            for (let i = 0; i < propVal.length; i++) {
              const obj = propVal[i];
              for (const property in obj) {
                const propertyValue = obj[property]
                if (propertyValue !== "object") {
                  const propertyDiv = propHTML.querySelector(`[property="${property}"][${attribute}="${propIndices[i]}"]`)
                  if (propertyDiv) {

                    await divertFunctions(property, propertyValue, propIndices[i], propertyDiv, copy_arguments)
                    // await self.delay(100)
                    updateStatusInList(updatedValuePropJSON, prop, property, typeof property, i)
                  }
                }
              }
            }
          }
        }

        async function divertFunctions(property, propertyValue, currentPropArrIndex, propertyDiv, copy_arguments, extraParams) {    // seperate unique function for both array and object 
          const propValType = checkObjectType(propertyValue)
          if (propValType === "nonObject") {
            const propertyType = propertyDiv.getAttribute('property-type')
            const formDriven_check = propertyDiv.getAttribute('form-driven')

            if (propertyType === "string" || propertyType === "integer" || propertyType === "number") {
              const inputOrSelect = propertyDiv.querySelector('input, select');

              if (inputOrSelect) {
                if (inputOrSelect.tagName.toLowerCase() === 'select') {
                  if (inputOrSelect.value !== propertyValue) {
                    selectDDProperties(property, propertyValue, formDriven_check, inputOrSelect, copy_arguments)
                  }
                }
                else if (inputOrSelect.tagName.toLowerCase() === 'input') {
                  if (inputOrSelect.value !== propertyValue) {

                    inputProperties(property, propertyValue, formDriven_check, inputOrSelect, copy_arguments)
                  }
                }
              }
            }

            if (propertyType === "boolean") {
              let value = propertyDiv.getAttribute('value')
              value = JSON.parse(value)
              if (value !== propertyValue) {  // as functions are recuring over and over again adding some checks to check if resubmission value and actual value on propertyHTML matches or not. It should not match  
                booleanProperties(property, propertyValue, formDriven_check, propertyDiv, currentPropArrIndex, copy_arguments)
              }
            }

            if (propertyType === "array-multiselect") {
              arrayMultiSelect(property, propertyValue, formDriven_check, propertyDiv, copy_arguments)
              // const result = arraysHaveSameValues(a, b);
            }
          } else if (propValType === "object") {

            // const propHTML = self.shadowRoot.querySelector(`[major-name="${prop}"]`)

            if (propertyDiv) {
              const propertyDivType = propertyDiv.getAttribute('property-type')

              if (propertyDivType === "array") {
                const add_completeSectionBtn = self.shadowRoot.querySelector(`[add-completesection="add_${property}"]:not(.d-none)`)
                if (add_completeSectionBtn) {     // case where add complete section button is present && needs to be clicked

                  let event = new Event('click');
                  add_completeSectionBtn.dispatchEvent(event);
                  (async () => {
                    await initiateArray(property, propertyValue, propertyDiv);
                  })();

                } else {         // case where add complete section button is not present. here we need to check the length of array and if > 1 then we need to click the add another button of array to match the no. of object
                  (async () => {
                    await initiateArray(property, propertyValue, propertyDiv);
                  })();

                }
              }

              if (propertyDivType === "object") {
                const add_completeSectionBtn = self.shadowRoot.querySelector(`[add-completesection="add_${property}"]:not(.d-none)`)
                if (add_completeSectionBtn) {     // case where add complete section button is present && needs to be clicked

                  let event = new Event('click');
                  add_completeSectionBtn.dispatchEvent(event);
                  (async () => {
                    await initiateObject(property, propertyValue, propertyDiv);
                  })();

                } else {         // case where add complete section button is not present. here we need to check the length of array and if > 1 then we need to click the add another button of array to match the no. of object
                  (async () => {
                    await initiateObject(property, propertyValue, propertyDiv);
                  })();

                }
              }

            }
          }

        }

        async function selectDDProperties(property, propertyValue, formDriven_check, string_select, copy_arguments) {
          const arg = copy_arguments
          await self.delay(100)
          for (let i = 0; i < string_select.options.length; i++) {
            if (string_select.options[i].text === propertyValue) {
              string_select.options[i].selected = true; // Set the selected attribute
              break;
            }
          }
          let event = new Event('change');
          string_select.dispatchEvent(event);
          if (formDriven_check === "true") {      // if the property is a formDriven prop and other properties are dependeable on it, in that case loopJSON() will be called again as other properties just got added to DOM
            await self.delay(100)
            await loopJSON()
          }
        }

        function inputProperties(property, propertyValue, formDriven_check, input, copy_arguments) {

          setTimeout(() => {
            let v = propertyValue
            if (propertyValue && (typeof propertyValue === "number" || typeof propertyValue === "integer")) {
              v = propertyValue.toString()
            }
            input.value = v
            let event = new Event('input');
            input.dispatchEvent(event);
          }, 100);
        }

        async function booleanProperties(property, propertyValue, formDriven_check, propertyDiv, currentPropArrIndex, copy_arguments) {
          const arg = copy_arguments
          await self.delay(100)

          // setTimeout(() => {
          let param;
          if (currentPropArrIndex) {
            param = `input[name="${currentPropArrIndex}_${property}_boolean"]`
          } else {
            param = `input[name="${property}_boolean"]`
          }
          const booleanArr = propertyDiv.querySelectorAll(param);
          if (booleanArr.length > 0) {
            let valueSeton_PropertyDiv = propertyDiv.getAttribute('value')
            valueSeton_PropertyDiv = JSON.parse(valueSeton_PropertyDiv)
            if (valueSeton_PropertyDiv !== propertyValue) {     // adding this condition to make sure that propertyValue is !== value that is set on propertyDiv(this value is getting set during HTML generation).
              booleanArr.forEach((element) => {
                let boolValue = element.getAttribute('value')
                boolValue = JSON.parse(boolValue)    // consverting string "true"/"false" to boolean for comparing
                if (propertyValue == boolValue) {
                  element.setAttribute('checked', true)
                  let event = new Event('change')
                  element.dispatchEvent(event)

                  if (formDriven_check === "true") {
                    setTimeout(() => {
                      // (async () => {
                      startSettingArrVal(arg.prop, arg.propVal, arg.propHTML)
                      // })();
                    }, 200);
                  }
                }
              })
            }
          }
          // }, 100);
        }

        function arrayMultiSelect(property, propertyValue, formDriven_check, arrayMulti_Select, copy_arguments) {
          setTimeout(() => {
            if (propertyValue.length > 0) {
              const selectedOptions = propertyValue;
              const id = `#${property} input[type="checkbox"]`
              const checkboxOptions = arrayMulti_Select.querySelectorAll(id);
              checkboxOptions.forEach(function (checkbox) {
                if (selectedOptions.includes(checkbox.value)) {
                  checkbox.checked = true
                }
              });

              if (selectedOptions.length > 0) {
                const _input = arrayMulti_Select.querySelector('input[readonly]');
                _input.placeholder = selectedOptions.toString()
                arrayMulti_Select.setAttribute('value', selectedOptions.toString())
              }
            }
          }, 100);


        }

      }
    }

    function proceed_select(prop, propVal, formDriven_check, propHTML, string_select, updateListCheck) {     // high level select dropdowns

      // const index = updatedPropList.indexOf(prop);
      // if (index === -1) {
      for (let i = 0; i < string_select.options.length; i++) {
        if (string_select.options[i].text === propVal) {
          string_select.options[i].selected = true; // Set the selected attribute
          if (updateListCheck) {
            updateStatusInList(updatedValuePropJSON, null, prop, typeof propVal)
          }
          break;
        }
      }
      setTimeout(() => {
        let event = new Event('change');
        string_select.dispatchEvent(event);

        // updateList(prop)
        if (formDriven_check === "true") {      // if the property is a formDriven prop and other properties are dependeable on it, in that case loopJSON() will be called again as other properties just got added to DOM
          loopJSON()
        }
      }, 100);
      // }
    }

    function proceed_input(prop, propVal, formDriven_check, propHTML, input, updateListCheck) {      // high level input fields

      // const index = updatedPropList.indexOf(prop);
      // if (index === -1) {
      setTimeout(() => {
        let v = propVal
        if (propVal && (typeof propVal === "number" || typeof propVal === "integer")) {
          v = propVal.toString()
        }
        input.value = v
        let event = new Event('input');
        input.dispatchEvent(event);
        if (updateListCheck) {
          updateStatusInList(updatedValuePropJSON, null, prop, typeof propVal)
        }
        // updateList(prop)
      }, 100);
      // }
    }

    function proceed_boolean(prop, propVal, formDriven_check, propHTML, updateListCheck) {
      // const index = updatedPropList.indexOf(prop);
      // if (index === -1) {
      setTimeout(() => {
        const param = `input[name="${prop}_boolean"]`
        const booleanArr = propHTML.querySelectorAll(param);
        if (booleanArr.length > 0) {
          booleanArr.forEach((element) => {
            let boolValue = element.getAttribute('value')
            boolValue = JSON.parse(boolValue)    // consverting string "true"/"false" to boolean for comparing
            if (propVal == boolValue) {
              element.setAttribute('checked', true)
              let event = new Event('change')
              element.dispatchEvent(event)

              if (updateListCheck) {
                updateStatusInList(updatedValuePropJSON, null, prop, typeof propVal)
              }
              // updateList(prop)
              if (formDriven_check === "true") {      // if the property is a formDriven prop and other properties are dependeable on it, in that case loopJSON() will be called again as other properties just got added to DOM
                loopJSON()
              }
            }

          })
        }
      }, 100);
      // }
    }

    function updateList(prop) {      // updating the updatedPropList with propeties whose values are updated.
      const index = updatedPropList.indexOf(prop);
      if (index === -1) {
        updatedPropList.push(prop)
      }
    }
  }

  _generateForm_HTML(mergedData, row_propCommon, container_propObject, container_propArray, setAttr) {
    const self = this
    let iterateProp = mergedData['mergeProp']['properties']
    let form_drivingProp = mergedData['form_drivingProp']
    let requiredProp = mergedData['mergeProp']['required'] ? mergedData['mergeProp']['required'] : []

    for (const prop in iterateProp) {
      const property = iterateProp[prop]
      let inputDependable;
      if (property.hasOwnProperty('type') && property.type === 'array') {
        // case for input dependable properties that have multiselect dropdown
        if (property.hasOwnProperty('items')) {
          inputDependable = property.items.hasOwnProperty('displayOptions') && property.items.displayOptions.hasOwnProperty('enum_data_source') ? true : false
        }
      } else {
        inputDependable = property.hasOwnProperty('displayOptions') && property.displayOptions.hasOwnProperty('enum_data_source') ? true : false

      }
      switch (true) {
        case property.type === 'string' && property.hasOwnProperty('enum') && !inputDependable:
          // *****Details
          // prop : property name
          // property: property object
          // requiredProp/form_drivingProp : variables from above
          // row_propCommon, container_propObject, container_propArray : reference to row, object container, array container
          // setAttr: object getting passed on form self.__array() used to setAttributes on fields
          self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, container_propArray, setAttr)

          break;
        // ================================
        case property.type === 'integer' && property.hasOwnProperty('enum') && !inputDependable:
          self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case property.type === 'string' && inputDependable:
          self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, container_propArray, setAttr)

          break;
        // ================================
        case property.type === 'integer' && inputDependable:
          self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case property.type === 'string' && !property.hasOwnProperty('enum') && !inputDependable:

          self._stringInt_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case (property.type === 'integer' || property.type === 'number') && !property.hasOwnProperty('enum') && !inputDependable:

          self._stringInt_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case property.type === 'boolean' && !property.hasOwnProperty('enum'):

          self._boolean_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, container_propArray, setAttr)

          break;
        // ================================
        case property.type === 'array' && property.hasOwnProperty('items') && property.items.type === "string" && inputDependable:

          // this is case of select multiple dropdown for inputDependable

          self._array_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case property.type === 'array' && property.hasOwnProperty('items') && property.items.hasOwnProperty('enum') && !inputDependable:

          // this is case of select multiple dropdown where enum is provided

          self._array_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

          break;
        // ================================
        case property.type === 'object':

          self.__object(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, setAttr)
          break;
        // ================================
        case property.type === 'array':

          self.__array(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propArray, setAttr)
          break;
        // ================================
        default:
          console.log("Pleae check the case type for property", property);
      }
    }
  }

  _stringInt_Enum(prop, property, requiredProp, form_drivingProp, rowX, container_propObject, container_propArray, setAttr) {
    const self = this;
    let setId;
    // inputDependable: This variable decides weather the options of select dropdown comes fromprovided array or dependent on input file selection
    const inputDependable = property.hasOwnProperty('displayOptions') && property.displayOptions.hasOwnProperty('enum_data_source') ? true : false

    const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ? true : false;
    const requiredProp_check = requiredProp.includes(prop) ? true : false
    const col = document.createElement('div')
    col.classList.add('col-md-6')
    col.setAttribute("property", prop)
    col.setAttribute("property-type", property.type ? property.type : "")
    col.setAttribute("required", requiredProp_check)
    col.setAttribute("form-driven", formDrivenProp_check)


    if (setAttr && Object.keys(setAttr).length > 1) {
      //check if setAttr has key and value property or not
      if (setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')) {
        col.setAttribute(setAttr.key, setAttr.value)
        setId = `${setAttr.value}_${prop}`
      }
    } else {
      setId = prop
    }
    // setting the extra paramater attribute on the col so the same property can be used to remove the element if its linkto element on change of its value
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      col.setAttribute("linkedTo", setAttr['extraParams'])

    }

    const form_group = document.createElement('div')
    form_group.classList.add('form-group', 'modify-formGroup')

    const label = document.createElement('label');
    const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
    label.setAttribute('for', setId)
    // label.classList.add('modify-label')
    requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')
    label.textContent = label_text

    const string_select = document.createElement('select')
    string_select.setAttribute('actual-name', prop)
    string_select.setAttribute('name', setId)
    string_select.setAttribute('id', setId)
    string_select.style.border = "none";
    string_select.classList.add('form-control', 'border-bottom', 'modify-select')
    string_select.setAttribute('form-driven', formDrivenProp_check)


    if (inputDependable) {

      const extract_from = property.displayOptions.enum_data_source.input_file ? property.displayOptions.enum_data_source.input_file : null
      const optionsType = property.displayOptions.enum_data_source.jsonpath ? property.displayOptions.enum_data_source.jsonpath.replace(/[$.]/g, '') : null
      if (optionsType !== null) {
        string_select.setAttribute('input-dependselectkey', optionsType)
      }
      // else {
      //   string_select.setAttribute('input-dependselectkey', 'columns')
      // }
      string_select.setAttribute('input-dependselect', 'true') // attribute to get all those input dependable dropdowns
      string_select.setAttribute('input-dependselectupdate', 'not-updated')

      // adding a default selected select option
      const select_option = document.createElement('option');
      select_option.textContent = "Please select input file";
      select_option.setAttribute('disabled', true)
      select_option.setAttribute('selected', true)
      string_select.appendChild(select_option);

    } else {
      // adding a default selected select option
      const select_option = document.createElement('option');
      select_option.textContent = "Select option";
      select_option.setAttribute('disabled', true)
      select_option.setAttribute('selected', true)
      string_select.appendChild(select_option);

      for (const val of property.enum) {
        const option = document.createElement('option');
        option.textContent = val;
        option.value = val
        if (property.hasOwnProperty('default') && (option.value === property.default)) {
          option.setAttribute('selected', true)
        }
        string_select.appendChild(option);
      }
    }

    const span = self.createSpanTag(property)
    const error_span = document.createElement('span')
    error_span.classList.add('error_span')

    form_group.append(label, string_select, span, error_span)
    col.appendChild(form_group)
    rowX.appendChild(col);
    setTimeout(() => {


      string_select.addEventListener('change', function () {
        self.setValue_column(string_select.value.trim(), col)
        self._validateInput(string_select, error_span, label_text, label, col)
        self.enableDisableSubmitBtn()
        if (formDrivenProp_check) {
          // const oneOf = [...form_drivingProp[prop].oneOf]
          const selectedValue = string_select.value
          let matched_oneOf = {}
          let axx = "" // axx is the key that needs to be removed from oneOf once matched_oneOf is found

          if (form_drivingProp[prop].hasOwnProperty('primaryLevel') && form_drivingProp[prop].primaryLevel === true) {
            const oneOf = [...form_drivingProp[prop].oneOf]
            for (let index = 0; index < oneOf.length; index++) {
              let obj = oneOf[index]
              if (obj['properties']) {
                for (let ax = 0; ax < Object.keys(obj['properties']).length; ax++) {
                  const jsonElement = obj['properties'][Object.keys(obj['properties'])[ax]]
                  axx = Object.keys(obj['properties'])[ax]
                  const keyToSearch = prop;
                  const foundValue = self.findValueByKey(jsonElement, keyToSearch); // serch the key (prop) in the jsonElement 
                  if (foundValue) {
                    if (foundValue.hasOwnProperty('const')) {
                      if (selectedValue === foundValue['const']) {
                        matched_oneOf = { ...obj }
                        break;
                      }
                    }
                  }
                }
              }
              if (Object.keys(matched_oneOf).length > 0) {
                break;
              }
            }

          } else {
            const oneOf = [...form_drivingProp[prop].oneOf]

            for (let index = 0; index < oneOf.length; index++) {
              let obj = oneOf[index]
              if (obj['properties']) {
                if (obj['properties'].hasOwnProperty(prop)) {
                  if (obj['properties'][prop].hasOwnProperty('const')) {
                    if (selectedValue === obj['properties'][prop]['const']) {
                      matched_oneOf = { ...obj }
                      break;
                    }
                  } else if (obj['properties'][prop].hasOwnProperty('enum')) {
                    if (obj['properties'][prop]['enum'].includes(selectedValue)) {
                      matched_oneOf = { ...obj }
                      break;
                    }
                  }
                }
              }
              if (Object.keys(matched_oneOf).length > 0) {
                break;
              }
            }
          }
          //finding out the object from oneOf that matches the selectedValue


          if (matched_oneOf) {
            const matchedOneOfCopy = _.cloneDeep(matched_oneOf)
            let _mergeData;
            let _commonFields;

            // deleting the property that is already pressent in the form from the matches_oneOf.proerties
            if (form_drivingProp[prop].hasOwnProperty('primaryLevel') && form_drivingProp[prop].primaryLevel === true) {
              for (const pros in matchedOneOfCopy['properties']) {
                if (pros === axx) {
                  delete matchedOneOfCopy['properties'][axx];
                  break;
                }
              }

            } else {
              for (const pros in matchedOneOfCopy['properties']) {
                if (pros === prop) {
                  delete matchedOneOfCopy['properties'][pros];
                  break;
                }
              }
            }
            if (matchedOneOfCopy.hasOwnProperty('oneOf')) {
              const copyOfmatchedOneOfCopy = _.cloneDeep(matchedOneOfCopy) // this line is added to make a copy of matchedOneOfCopy as somehwere in extractCommonFieldsFromOneOf function, json passed to this function is getting changed only for case with meaure_type (moviemaker-json.oneOf[0].oneOf) 
              _commonFields = self.extractCommonFieldsFromOneOf(copyOfmatchedOneOfCopy);

              _mergeData = self.mergeProperties(_commonFields, matchedOneOfCopy, prop)
            } else {
              _mergeData = {
                "form_drivingProp": null,
                "mergeProp": matchedOneOfCopy
              }
            }

            //Adding this attribute only to know the fields that are added on change event and link them with parent
            let paramVal = `linkedTo_${string_select.getAttribute('name')}`
            let addAttr = {
              "extraParams": paramVal
            }
            const elements = self.shadowRoot.querySelectorAll(`[linkedto="${paramVal}"]`)
            if (elements) {
              const removeElement = (linked_toElement) => {
                if (linked_toElement) {
                  linked_toElement.forEach((ele) => {
                    ele.remove()
                  })
                }
              }
              elements.forEach((element) => {
                if (element.hasAttribute('property') === true) { // normal scenario where elemens will be remeoved if there are nested linkage
                  let linkto_attr = `linkedTo_${element.getAttribute('property')}`
                  let linked_toElement = self.shadowRoot.querySelectorAll(`[linkedto="${linkto_attr}"]`)
                  removeElement(linked_toElement)
                } else { // special scenario where nested elements will be removed from array. ex. on visulization type  => measure is added. measure.measure_type ==> other properteis are added. Those should also be removed form dom 
                  // highest-index
                  // linkedTo_measures[0]_measure_type
                  let secondaryElements = element.querySelector(`[major-name]`)

                  let major_name = secondaryElements.getAttribute('major-name')
                  // let = `${major_name}-index`
                  let secondaryElementsArr = secondaryElements.querySelectorAll(`[${major_name}-index]`)
                  secondaryElementsArr.forEach((secEle) => {
                    let major_name_index = secEle.getAttribute(`${major_name}-index`)
                    let property_name = secEle.getAttribute('property')
                    let linkto_attr = `linkedTo_${major_name_index}_${property_name}`
                    let linked_toElement = self.shadowRoot.querySelectorAll(`[linkedto="${linkto_attr}"]`)
                    removeElement(linked_toElement)
                  })
                }
                element.remove();
              })
            }
            // rowX.getAttribute('primary-row') is set only on row present in container-type=commonProperties. so if there is any driving form property in primary-row it can get appended in container_propObject & container_propArray if type found are object and array respectively.
            if (form_drivingProp[prop].hasOwnProperty('primaryLevel') && form_drivingProp[prop].primaryLevel === true) {
              const row_propCommonX = self.shadowRoot.querySelector(`[primary-row="true"]`)
              const container_propObjectX = self.shadowRoot.querySelector(`[container-type="objectProperties"]`);
              const container_propArrayX = self.shadowRoot.querySelector(`[container-type="arrayProperties"]`);
              self._generateForm_HTML(_mergeData, row_propCommonX, container_propObjectX, container_propArrayX, addAttr)
            }
            else if (rowX.getAttribute('primary-row') === "true") {
              self._generateForm_HTML(_mergeData, rowX, container_propObject, container_propArray, addAttr)
              self.updateSelectOptions(false)
              self.enableDisableSubmitBtn();

            } else {
              self._generateForm_HTML(_mergeData, rowX, null, null, addAttr)
              self.updateSelectOptions(false)
              self.enableDisableSubmitBtn();
            }
          }
        }
      })

      // calling this to trigger the event change if there is default value set
      if (property.hasOwnProperty('default')) {
        let event = new Event('change');
        string_select.dispatchEvent(event);
      }
    }, 100)
  }

  _stringInt_noEnum(prop, property, requiredProp, form_drivingProp, rowX, setAttr) {

    const self = this;
    let setId;
    const requiredProp_check = requiredProp.includes(prop) ? true : false
    // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty('property') ? ( form_drivingProp.property.includes(prop) ? true : false ) : false
    // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ?  true : false;

    const col = document.createElement('div')
    col.classList.add('col-md-6')
    col.setAttribute("property", prop)
    col.setAttribute("property-type", property.type ? property.type : "")
    col.setAttribute("required", requiredProp_check)
    // col.setAttribute("form-driven", formDrivenProp_check)

    if (setAttr && Object.keys(setAttr).length > 1) {
      //check if setAttr has key and value property or not
      if (setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')) {
        col.setAttribute(setAttr.key, setAttr.value)
        setId = `${setAttr.value}_${prop}`
      }

    } else {
      setId = prop
    }

    // setting the extra paramater attribute on the col so the same property can be used to remove the element if its link to elemnt changes its value
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      col.setAttribute("linkedTo", setAttr['extraParams'])
      // setId = prop
    }

    const form_group = document.createElement('div')
    form_group.classList.add('form-group', 'modify-formGroup')

    const label = document.createElement('label');
    const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
    label.setAttribute('for', setId)
    requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')

    label.textContent = label_text

    const input = document.createElement('input')
    input.style.border = 'none';
    let inputType = "";
    const colorDetails = document.createElement('span') // keeping a copy created for span tag for displaying colorDetails, global varible scope for this function
    if (property.type === 'string') {

      if (property.hasOwnProperty('format') && property.format === 'date') {
        inputType = 'date'
      } else if (property.hasOwnProperty('display_options') && property.display_options.hasOwnProperty('component') && property.display_options.component === 'builtin://color_pallette') {
        inputType = 'color'
      } else {
        inputType = 'string'
      }

    } else if (property.type === 'integer' || property.type === 'number') {
      inputType = 'number'
    }

    input.type = inputType ? inputType : 'string'
    input.classList.add('form-control', 'border-bottom', 'modify-input');
    input.setAttribute('actual-name', prop)
    input.setAttribute('id', setId)
    input.setAttribute('name', setId)
    if (property.hasOwnProperty('default')) {
      input.value = property['default']
    }
    if (inputType === 'color') {
      // modify-colorSpanDetail
      input.style.setProperty('width', '46%', 'important')
      colorDetails.className = 'modify-colorSpanDetail'
      colorDetails.textContent = "Choose a color"
    }
    self._addValidations(input, property)

    const span = self.createSpanTag(property)
    const error_span = document.createElement('span')
    error_span.classList.add('error_span')

    form_group.append(label, input, inputType === 'color' ? colorDetails : "", span, error_span)
    col.appendChild(form_group)
    rowX.appendChild(col);

    setTimeout(() => {

      input.addEventListener('keydown', function (e) {
        let keyCode = e.keyCode || e.which
        if (property.type === 'integer') {
          if (
            (keyCode >= 48 && keyCode <= 57) ||     // 0-9
            keyCode === 8 || // Backspace
            keyCode === 9 || // Tab
            keyCode === 37 || // Left arrow
            keyCode === 39 || // Right arrow
            keyCode === 46 || // Delete
            (keyCode === 189 && input.value.indexOf('-') === -1) // Minus sign and not already present
            ) {
            return true
          } else {
            e.preventDefault(); // Prevent the key press
          }
        }else if (property.type === 'number') {
          if (
            (keyCode >= 48 && keyCode <= 57) ||     // 0-9
            keyCode === 8 || // Backspace
            keyCode === 9 || // Tab
            keyCode === 37 || // Left arrow
            keyCode === 39 || // Right arrow
            keyCode === 46 || // Delete
            keyCode === 190 || // Decimal point
            (keyCode === 189 && input.value.indexOf('-') === -1) // Minus sign and not already present
            ) {
            return true
          } else {
            e.preventDefault(); // Prevent the key press
          }
        }
      })

      input.addEventListener("input", function () {
        if (inputType === 'color') {
          colorDetails.textContent = input.value
        }
        self.setValue_column(input.value.trim(), col)
        self._validateInput(input, error_span, label_text, label, col)
      });

      // calling this to trigger the event change if there is default value set
      if (property.hasOwnProperty('default')) {
        let event = new Event('input');
        input.dispatchEvent(event);
      }

    }, 100)
  }

  _boolean_noEnum(prop, property, requiredProp, form_drivingProp, rowX, container_propObject, container_propArray, setAttr) {
    const self = this;
    let setId;
    const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ? true : false;

    const requiredProp_check = requiredProp.includes(prop) ? true : false

    const col = document.createElement('div')
    col.classList.add('col-md-6')
    col.setAttribute("property", prop)
    col.setAttribute("property-type", property.type ? property.type : "")
    col.setAttribute("required", requiredProp_check)
    col.setAttribute("form-driven", formDrivenProp_check)

    if (setAttr && Object.keys(setAttr).length > 1) {
      //check if setAttr has key and value property or not
      if (setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')) {
        col.setAttribute(setAttr.key, setAttr.value)
        setId = `${setAttr.value}_${prop}`
      }
    } else {
      setId = prop
    }
    // setting the extra paramater attribute on the col so the same property can be used emove the element if its link to elemnt changes its value
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      col.setAttribute("linkedTo", setAttr['extraParams'])
      // setId = prop
    }

    const form_group = document.createElement('div')
    form_group.classList.add('form-group', 'modify-formGroup')

    const label = document.createElement('label');
    const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
    label.setAttribute('for', setId)
    label.classList.add('modify-label_radio')
    requiredProp_check ? label.classList.add('modify-label_radio', 'required') : label.classList.add('modify-label_radio')

    label.textContent = label_text

    //True Case//
    const div_true = document.createElement('div');
    div_true.classList.add('form-check', 'form-check-inline', 'boolean_div')

    const input_true = document.createElement('input')
    input_true.type = 'radio'
    input_true.classList.add('form-check-input');
    input_true.setAttribute('actual-name', prop)
    input_true.setAttribute('id', `${setId}_boolean-true`)
    input_true.setAttribute('name', `${setId}_boolean`)


    input_true.value = true;
    if (property.hasOwnProperty('default') && property['default'] === true) {
      input_true.setAttribute('checked', true)
    }

    const label_true = document.createElement('label');
    label_true.setAttribute('for', `${setId}_boolean-true`)
    label_true.classList.add('form-check-label')
    label_true.textContent = "True"

    div_true.append(input_true, label_true)

    //False Case//
    const div_false = document.createElement('div');
    div_false.classList.add('form-check', 'form-check-inline', 'boolean_div')

    const input_false = document.createElement('input')
    input_false.type = 'radio'
    input_false.classList.add('form-check-input');
    input_false.setAttribute('actual-name', prop)
    input_false.setAttribute('id', `${setId}_boolean-false`)
    input_false.setAttribute('name', `${setId}_boolean`)
    input_false.value = false;
    if (property.hasOwnProperty('default') && property['default'] === false) {
      input_false.setAttribute('checked', true)
    }

    const label_false = document.createElement('label');
    label_false.setAttribute('for', `${setId}_boolean-false`)
    label_false.classList.add('form-check-label')
    label_false.textContent = "False"

    div_false.append(input_false, label_false)

    const span = self.createSpanTag(property)
    const error_span = document.createElement('span')
    error_span.classList.add('error_span', 'booelan_error_span')

    form_group.append(label, div_true, div_false, span, error_span)
    col.appendChild(form_group)
    rowX.appendChild(col);

    setTimeout(() => {
      const id = `input[name="${setId}_boolean"]`
      const radioBtn = self.shadowRoot.querySelectorAll(id)

      radioBtn.forEach((btn) => {
        btn.addEventListener('change', function () {
          if (btn.value) {
            self.setValue_column(btn.value, col)
            self._validateInput(btn, error_span, label_text, label, col)

            if (formDrivenProp_check) {
              const oneOf = [...form_drivingProp[prop].oneOf]
              let matched_oneOf;
              let selectedValue = btn.value;

              //finding out the object from oneOf that matches the selectedValue
              for (const obj of oneOf) {

                if (obj['properties']) {
                  for (const proa in obj['properties']) {
                    if (proa === prop) {
                      if (typeof selectedValue === 'string' || typeof obj['properties'][proa]['const'] === 'string') {
                        selectedValue = JSON.parse(selectedValue)
                        obj['properties'][proa]['const'] = JSON.parse(obj['properties'][proa]['const'])
                      }
                      if (selectedValue === obj['properties'][proa]['const']) {
                        matched_oneOf = { ...obj }
                        break;
                      }
                    }
                  }
                }
                if (matched_oneOf) {
                  break;
                }
              }

              if (matched_oneOf) {
                let matchedOneOfCopy = _.cloneDeep(matched_oneOf)
                let _mergeData;
                let _commonFields;
                // deleting the property that is already pressent in the form from the matches_oneOf.proerties
                for (const pros in matchedOneOfCopy['properties']) {
                  if (pros === prop) {
                    delete matchedOneOfCopy['properties'][pros];
                    break;
                  }
                }

                if (matchedOneOfCopy.hasOwnProperty('oneOf')) {
                  _commonFields = self.extractCommonFieldsFromOneOf(property);

                  _mergeData = self.mergeProperties(_commonFields, property, prop)
                } else {
                  _mergeData = {
                    "form_drivingProp": null,
                    "mergeProp": matchedOneOfCopy
                  }
                }

                let paramVal = `linkedTo_${btn.getAttribute('name')}`
                let addAttr;
                if (setAttr) {
                  //adding extraParams only if the case getting already iterated from type array
                  setAttr['extraParams'] = paramVal
                } else {
                  //adding extraParams if this type boolean is a formDrivng factor but not iterated from array
                  addAttr = {
                    "extraParams": paramVal
                  }
                }

                //below is to remove the appeneded divs on change event
                const elements = self.shadowRoot.querySelectorAll(`[linkedto="${paramVal}"]`)
                if (elements) {
                  elements.forEach((element) => {
                    element.remove();
                  })
                }

                if (_mergeData && Object.keys(_mergeData.mergeProp['properties']).length > 0) {
                  const row_type = rowX.getAttribute('property-type')
                  const tempDiv = document.createElement('div')

                  // rowX.getAttribute('primary-row') is set only on row present in container-type=commonProperties. so if there is any driving form property in primary-row it can get appended in container_propObject & container_propArray if type found are object and array respectively.
                  if (rowX.getAttribute('primary-row') === "true") {
                    self._generateForm_HTML(_mergeData, rowX, container_propObject, container_propArray, setAttr ? setAttr : addAttr)
                    setTimeout(() => {
                      self.enableDisableSubmitBtn()
                    }, 200);

                  } else {
                    //checking row_type if the value being appended is in array or not . if array then creating a tempDiv and appending the col-md-6 divs in it and later on removing it from tempDiv and appending it at its correct index
                    self._generateForm_HTML(_mergeData, row_type === "array" ? tempDiv : rowX, null, null, setAttr ? setAttr : addAttr)
                  }

                  // //checking row_type if the value being appended is in array or not . if array then creating a tempDiv and appending the col-md-6 divs in it and later on removing it from tempDiv and appending it at its correct index
                  // self._generateForm_HTML(_mergeData, row_type === "array" ? tempDiv : rowX, null, null, setAttr ? setAttr : addAttr)

                  if (row_type === "array") {
                    // code that will remove the divs from tempDiv and append at its exact index
                    setTimeout(() => {
                      //taking child div from the row in which all the col-md-6 are appended according to their correct sequence
                      const childElements = rowX.children
                      const divElements = []

                      //Pushing col-md-6 that have prop_property & prop_measure_index both. This will remove the div the have  buttons and breaker
                      for (let i = 0; i < childElements.length; i++) {   //property  measures-index
                        const childElement = childElements[i];
                        const prop_property = childElement.getAttribute('property');
                        const prop_measure_index = childElement.getAttribute(setAttr.key)           //setAttr object will be present as it was previously iterated from array
                        if (childElement.tagName.toLowerCase() === 'div' && prop_property && prop_measure_index) {
                          divElements.push(childElement)
                        }
                      }
                      //Extracting the index to exactly append the element after it
                      let attr_name = btn.getAttribute('name')
                      let extractedIndex;
                      let parts = attr_name.split('_');
                      if (parts.length > 0) {
                        extractedIndex = parts[0]
                      }

                      //setting lastArrayDiv to the last div that matches with the index where we want to insert thetempDiv.children
                      let lastArray1Div = null;
                      divElements.forEach((divElement) => {
                        if (divElement.getAttribute(setAttr.key) === extractedIndex) {
                          lastArray1Div = divElement;
                        }
                      });

                      // inserting tempDiv.children after the lastArrayDiv
                      if (lastArray1Div) {
                        let x = tempDiv.children

                        for (let i = 0; i < x.length; i++) {
                          lastArray1Div.parentNode.insertBefore(x[i], lastArray1Div.nextSibling);
                        }
                      }
                      self.enableDisableSubmitBtn()

                    }, 200)
                  }

                }

              }
            }
          }
        })
      })

      // calling this to trigger the event change if there is default value set
      if (property.hasOwnProperty('default')) {
        const checkedId = `input[name="${setId}_boolean"]:checked`
        const selectedBtn = self.shadowRoot.querySelector(checkedId)

        let event = new Event('change')
        selectedBtn.dispatchEvent(event)
        self.setValue_column(selectedBtn.value, col)
      }

    }, 100)


  }

  _array_Enum(prop, property, requiredProp, form_drivingProp, rowX, setAttr) {
    const self = this;
    let setId;
    const requiredProp_check = requiredProp.includes(prop) ? true : false
    const prop_default = property.hasOwnProperty('default') ? (Array.isArray(property.default) ? property.default : [property.default]) : []
    // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty('property') ? ( form_drivingProp.property.includes(prop) ? true : false ) : false
    const inputDependable = property.hasOwnProperty('items') && property.items.hasOwnProperty('displayOptions') && property.items.displayOptions.hasOwnProperty('enum_data_source') ? true : false

    const col = document.createElement('div')
    col.classList.add('col-md-6')
    col.setAttribute("property", prop)
    col.setAttribute("property-type", `${property.type}-multiselect`)
    col.setAttribute("required", requiredProp_check)
    // col.setAttribute("form-driven", formDrivenProp_check)

    if (setAttr && Object.keys(setAttr).length > 1) {
      //check if setAttr has key and value property or not
      if (setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')) {
        col.setAttribute(setAttr.key, setAttr.value)
        setId = `${setAttr.value}_${prop}`
      }
    } else {
      setId = prop
    }

    // setting the extra paramater attribute on the col so the same property can be used toremove the element if its link to elemnt changes its value
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      col.setAttribute("linkedTo", setAttr['extraParams'])
      // setId = prop
    }

    const form_group = document.createElement('div')
    form_group.classList.add('form-group', 'modify-formGroup')

    const label = document.createElement('label');
    const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
    label.setAttribute('for', setId)
    requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')
    label.textContent = label_text

    const _div = document.createElement('div')
    _div.className = "custom-dropdown"

    const _input = document.createElement('input')
    _input.type = "text"
    _input.placeholder = "Multiple select options"
    _input.readOnly = true
    _input.style.border = 'none';
    _input.classList.add('form-control', 'border-bottom', 'modify-input', 'multi-select');

    const dropdownIcon = document.createElement('span')
    dropdownIcon.innerHTML = '&#x25BC;';
    dropdownIcon.className = "dropdownIcon"

    const __div = document.createElement('div')
    const idx = `dropdownSelect_${prop}`
    __div.id = idx
    __div.classList.add('dropdown-select', 'custom-rounded', 'shadow', 'mb-3', 'bg-white', 'rounded');

    const _ul = document.createElement('ul')
    _ul.style.paddingLeft = "0px"
    if (inputDependable) {
      const optionsType = property.items.displayOptions.enum_data_source.jsonpath ? property.items.displayOptions.enum_data_source.jsonpath.replace(/[$.]/g, '') : null
      if (optionsType !== null) {
        _ul.setAttribute('input-dependmultiselectkey', optionsType)
      }
      _ul.setAttribute('input-dependmultiselect', 'true') // attribute to get all those input dependable dropdowns
      _ul.setAttribute('input-dependmultiselectupdate', 'not-updated')
      _ul.setAttribute('input-dependmultiselectsetid', setId)
      _ul.setAttribute('input-dependmultiselectprop_default', prop_default)
      const _li = document.createElement('li');
      _li.textContent = "Please select input file";
      _li.className = "checkbox-option"
      // _li.id = setId
      _ul.appendChild(_li);

    } else {
      for (const val of property.items.enum) {
        const _li = document.createElement('li');
        _li.textContent = val;
        _li.className = "checkbox-option"
        _li.id = setId

        const input_inLi = document.createElement('input')
        input_inLi.type = "checkbox"
        input_inLi.value = val
        input_inLi.innerText = val
        input_inLi.className = 'custom-checkBox'
        prop_default.includes(val) ? input_inLi.checked = true : input_inLi.checked = false

        _li.appendChild(input_inLi)
        _ul.appendChild(_li);
      }
    }

    __div.appendChild(_ul)
    _div.append(_input, dropdownIcon, __div)

    const span = self.createSpanTag(property)
    form_group.append(label, _div, span)
    col.appendChild(form_group)
    rowX.appendChild(col);


    setTimeout(() => {
      // const dropdown = self.shadowRoot.getElementById(idx);

      _div.addEventListener('click', () => {
        // const dropdown = self.shadowRoot.getElementById('dropdownSelect');
        if (__div.style.display === '') {
          __div.style.display = 'block';
        } else {
          __div.style.display = 'block';
        }

        const selectedOptions = [];
        const id = `#${setId} input[type="checkbox"]`
        const checkboxOptions = self.shadowRoot.querySelectorAll(id);
        checkboxOptions.forEach(function (checkbox) {
          if (checkbox.checked) {
            selectedOptions.push(checkbox.value);
          }
        });
        if (selectedOptions.length > 0) {
          _input.placeholder = selectedOptions.toString()
          self.setValue_column(selectedOptions.toString(), col)
        } else {
          _input.placeholder = "Multiple select options"
        }

        self.shadowRoot.addEventListener('click', function (event) {
          // const dropdown = self.shadowRoot.getElementById('dropdownSelect');
          if (!event.target.closest('.custom-dropdown') && __div.style.display === 'block') {
            __div.style.display = 'none';
          }
        });

      })

      if (prop_default) {
        let event = new Event('click');
        _div.dispatchEvent(event);
        __div.style.display = 'none';
      }
    }, 500)

  }

  __object(prop, property, requiredProp, form_drivingPropObj, rowX, container_propObject, setAttr) {

    const self = this;
    const requiredProp_check = requiredProp.includes(prop) ? true : false
    let _commonFields
    let _mergeData;

    if (property && property.hasOwnProperty('properties') && !property.hasOwnProperty('oneOf')) {      // if no oneOf found in property then create _mergeData
      _mergeData = {
        "form_drivingProp": null,
        "mergeProp": {
          "properties": property['properties'],
          "required": property['required']
        }
      }
    } else if (property && property.hasOwnProperty('allOf') && !property.hasOwnProperty('oneOf')) {
      // ex. oneOf[1].properties.date_settings
      let allOf = property.allOf
      let allMerge = {}
      for (const item in allOf) {
        const data = allOf[item]
        let temp_mergeData = "";
        if (data.hasOwnProperty('oneOf') && !data.hasOwnProperty('properties')) {
          // Here data only has oneOf.
          // This If condition is to make sure that form driving property is extracted and convert it in required format where properties is not found. Converted format is then merged to  
          let form_drivingProp = []
          let temp_commonFields = self.extractCommonFieldsFromOneOf(data);

          // Logic to understand ***form_drivingProp*** properties. Properties on which we need to render the oneOf object
          for (const prop in temp_commonFields['properties']) {
            if (temp_commonFields['properties'][prop].hasOwnProperty('enum')) {     // if property has enum
              if (form_drivingProp.length === 0) {      // there can only be one driving factor for form
                if ((data['oneOf'].length === 2) && (temp_commonFields['properties'][prop].type === 'boolean')) {     // if driving factor is a type boolean, then oneOf array should have only two object
                  form_drivingProp.push(prop)
                } else if (temp_commonFields['properties'][prop].type !== 'boolean') {  // else if property is not boolean, as it already has enum and is common on all oneOf object
                  form_drivingProp.push(prop)
                }
              }
            }
          }

          temp_mergeData = {
            "mergeProp": {
              "properties": null,
              "required": null
            },
            "form_drivingProp": {}
          }
          if (form_drivingProp.length > 0) {
            const f_dp = form_drivingProp[0]
            temp_mergeData['form_drivingProp'][f_dp] = { "oneOf": [...data.oneOf] }
          }




        } else if (data.hasOwnProperty('properties')) {

          let temp_commonFields = self.extractCommonFieldsFromOneOf(data);
          temp_mergeData = self.mergeProperties(temp_commonFields, data)


        }

        if (temp_mergeData) {
          allMerge[item] = temp_mergeData
        }
      }

      if (Object.keys(allMerge).length > 0) {
        // Merge the objects into one
        const mergedObject = {
          "form_drivingProp": null,
          "mergeProp": {
            "properties": null,
            "required": null
          }
        };

        // Iterate through the provided objects
        for (const key in allMerge) {
          if (allMerge[key].form_drivingProp) {

            if (mergedObject['form_drivingProp']) {
              mergedObject['form_drivingProp'] = { ...mergedObject['form_drivingProp'], ...allMerge[key]["form_drivingProp"] }
            } else {
              mergedObject['form_drivingProp'] = { ...allMerge[key]["form_drivingProp"] }
            }
          }

          if (allMerge[key].mergeProp.properties) {
            if (mergedObject['mergeProp']['properties']) {
              mergedObject['mergeProp']['properties'] = { ...mergedObject['mergeProp']['properties'], ...allMerge[key]['mergeProp']['properties'] }
            } else {
              mergedObject['mergeProp']['properties'] = { ...allMerge[key]['mergeProp']['properties'] }
            }
          }

          if (allMerge[key].mergeProp.required) {
            if (mergedObject['mergeProp']['required']) {
              mergedObject['mergeProp']['required'] = [...mergedObject['mergeProp']['required'], ...allMerge[key]['mergeProp']['required']]
            } else {
              mergedObject['mergeProp']['required'] = [...allMerge[key]['mergeProp']['required']]
            }

          }
        }
        _mergeData = mergedObject
      }

    }
    else if (property && property.hasOwnProperty('oneOf')) {                                                                           // if oneOf found then _merge data will be created by below functions
      _commonFields = self.extractCommonFieldsFromOneOf(property);

      _mergeData = self.mergeProperties(_commonFields, property, prop)
    }

    const container = self.createNewRow('container')
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      container.setAttribute("linkedTo", setAttr['extraParams'])
    }
    const fieldSet = document.createElement('fieldset')
    fieldSet.className = "modify-fieldset"
    container.appendChild(fieldSet)

    const legend = document.createElement('legend');
    legend.className = 'modify-legend font-weight-bold';
    const displayName = property.hasOwnProperty('displayName') ? property.displayName : prop
    const category_header = requiredProp_check ? `${displayName} ` : displayName
    legend.textContent = category_header

    const astreikSpan = document.createElement('span')
    astreikSpan.className = requiredProp_check ? 'required' : ''

    const infoSpan = document.createElement('span')
    infoSpan.innerHTML = '&#9432;'
    infoSpan.style.marginLeft = '10px'
    infoSpan.style.cursor = 'pointer'
    infoSpan.style.fontWeight = 'normal'
    infoSpan.setAttribute('title', property.hasOwnProperty('description') ? property['description'] : "")

    legend.append(astreikSpan, infoSpan)
    fieldSet.appendChild(legend)

    const rowIn_container = self.createNewRow('row')
    rowIn_container.classList.add('modify-rowIn_container')
    rowIn_container.setAttribute('property-type', "object");
    rowIn_container.setAttribute('major-name', prop);       // setting this to have the highest index of object that was inserted in array
    fieldSet.appendChild(rowIn_container)

    if (!requiredProp_check) { // if prooperty type object is not required then there will be add button and click on it properties will be rendered and on click of remove innerHTMl for rowIn_container will be cleared

      const button_div = document.createElement('div')
      button_div.classList.add('col-md-12', 'btn-colPos', 'modify-rowIn_container')

      const button_add = document.createElement('button')
      button_add.textContent = `Add ${displayName}`
      button_add.type = "button"
      button_add.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow')
      button_add.setAttribute('add-completesection', `add_${prop}`)

      const button_remove = document.createElement('button')
      button_remove.textContent = `Remove ${displayName}`
      button_remove.type = "button"
      button_remove.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow', 'd-none')
      button_remove.setAttribute('remove-completesection', `remove_${prop}`)

      button_div.append(button_add, button_remove)
      fieldSet.appendChild(button_div)

      button_add.addEventListener('click', function () {
        self._generateForm_HTML(_mergeData, rowIn_container, null, null, setAttr)
        self.enableDisableSubmitBtn();
        setTimeout(() => {
          self.updateSelectOptions(false);
        }, 500);

        button_add.classList.add('d-none')
        button_remove.classList.remove('d-none')

      })

      button_remove.addEventListener('click', function () {
        rowIn_container.innerHTML = ""
        button_add.classList.remove('d-none')
        button_remove.classList.add('d-none')
        self.enableDisableSubmitBtn();

      })
    } else {
      self._generateForm_HTML(_mergeData, rowIn_container, null, null, setAttr)
    }
    if (container_propObject) {
      container_propObject.appendChild(container)
    } else {
      rowX.appendChild(container)
    }
  }

  __array(prop, property, requiredProp, form_drivingPropArr, rowX, container_propArray, setAttr) {
    const self = this;
    const requiredProp_check = requiredProp.includes(prop) ? true : false
    const formDrivenProp_check = form_drivingPropArr && form_drivingPropArr.hasOwnProperty(prop) ? true : false;
    let additionalForm_drivingProp = []
    let _commonFields
    let _mergeData;
    let add_BtnBreaker = true
    let inline_array = false // false ? "meausres": [{  "abc1": "heading_one"},{  "xyz1": "heading_two"}] : “column_headers”: [“heading_one”,”heading_two”]

    if (property.hasOwnProperty('properties') && !property.hasOwnProperty('items')) {
      //ex. oneOf[4].properties.scatterplot_settings.properties.scatter_layer_priority
      _mergeData = {
        "form_drivingProp": null,
        "mergeProp": {
          "properties": property['properties'],
          "required": property['required'] ? property['required'] : []
        }
      }
      // add_BtnBreaker = false

    }
    else if (property.hasOwnProperty('items') && !property.hasOwnProperty('properties') && !property.items.hasOwnProperty('properties') && !property.items.hasOwnProperty('oneOf') && !property.items.hasOwnProperty('allOf')) {
      // ex.  "column_headers": {
      //   "type": "array",
      //   "description": "Array of column headers",
      //   "items": {
      //         "type": "string",
      //         "description": "Array of column headers",
      //         "displayName": "Column Header"
      // },
      // "minItems": 1	  }

      property[prop] = property['items']
      delete property['items']
      property['properties'] = {
        [prop]: property[prop]
      }

      inline_array = true
      _mergeData = {
        "form_drivingProp": null,
        "mergeProp": {
          "properties": property['properties'],
          "required": property['required'] ? property['required'] : []
        }
      }
    }
    else if (property && property.items && property.items.hasOwnProperty('properties') && !property.items.hasOwnProperty('oneOf') && !property.items.hasOwnProperty('allOf')) {
      //ex.  oneOf[4].properties.scatterplot_settings.properties.terminal_status
      //   {
      //     "type": "array",
      //     "description": "A list of statuses that are considered terminal states which should be removed from the scatterplot movie after they appear",
      //     "displayName": "Terminal Statuses",
      //     "items": {
      //         "properties": {
      //             "status": {
      //                 "type": "string",
      //                 "description": "Terminal status",
      //                 "displayName": "Terminal Status",
      //                 "displayOptions": {
      //                     "enum_data_source": {
      //                         "input_file": "input_file",
      //                         "jsonpath": "$..states"
      //                     }
      //                 }
      //             }
      //         }
      //     },
      //     "uniqueItems": true
      // }
      _mergeData = {
        "form_drivingProp": null,
        "mergeProp": {
          "properties": property.items['properties'],
          "required": property.items['required']
        }
      }

    }
    else if (property && property.items && property.items.hasOwnProperty('oneOf') && !property.items.hasOwnProperty('allOf')) {
      // ex. parts of json object where priperty.item has oneOf
      _commonFields = self.extractCommonFieldsFromOneOf(property.items);
      _mergeData = self.mergeProperties(_commonFields, property.items)

    }
    else if (property && property.items && property.items.hasOwnProperty('allOf')) {
      // ex. oneOf[0].properties.measures
      let allOf = property.items.allOf
      let allMerge = {}
      for (const item in allOf) {
        const data = allOf[item]
        let temp_mergeData = "";
        if (data.hasOwnProperty('oneOf') && !data.hasOwnProperty('properties')) {
          // Here data only has oneOf.
          // This If condition is to make sure that form driving property is extracted and converted in required format. Converted format is then merged to  "mergedObject"
          let form_drivingProp = []
          let temp_commonFields = self.extractCommonFieldsFromOneOf(data);

          // Logic to understand ***form_drivingProp*** properties. Properties on which we need to render the oneOf object
          for (const prop in temp_commonFields['properties']) {
            if (temp_commonFields['properties'][prop].hasOwnProperty('enum')) {     // if property has enum
              if (form_drivingProp.length === 0) {      // there can only be one driving factor for form
                if ((data['oneOf'].length === 2) && (temp_commonFields['properties'][prop].type === 'boolean')) {     // if driving factor is a type boolean, then oneOf array should have only two object
                  form_drivingProp.push(prop)
                } else if (temp_commonFields['properties'][prop].type !== 'boolean') {  // else if property is not boolean, as it already has enum and is common on all oneOf object
                  form_drivingProp.push(prop)
                }
              }
            }
          }

          temp_mergeData = {
            "mergeProp": {
              "properties": null,
              "required": null
            },
            "form_drivingProp": {}
          }
          if (form_drivingProp.length > 0) {
            const f_dp = form_drivingProp[0]
            temp_mergeData['form_drivingProp'][f_dp] = { "oneOf": [...data.oneOf] }
          }



        }
        else if (data.hasOwnProperty('properties')) {

          let temp_commonFields = self.extractCommonFieldsFromOneOf(data);
          temp_mergeData = self.mergeProperties(temp_commonFields, data)

        }

        if (temp_mergeData) {
          allMerge[item] = temp_mergeData
        }
      }
      if (Object.keys(allMerge).length > 0) {
        // Merge the objects into one
        const mergedObject = {
          "form_drivingProp": null,
          "mergeProp": {
            "properties": null,
            "required": null
          }
        };

        // Iterate through the provided objects
        for (const key in allMerge) {
          if (allMerge[key].form_drivingProp) {
            // mergedObject['form_drivingProp'] = { ...allMerge[key]["form_drivingProp"] }

            if (mergedObject['form_drivingProp']) {
              mergedObject['form_drivingProp'] = { ...mergedObject['form_drivingProp'], ...allMerge[key]["form_drivingProp"] }
            } else {
              mergedObject['form_drivingProp'] = { ...allMerge[key]["form_drivingProp"] }
            }

          }
          if (allMerge[key].mergeProp.properties) {
            if (mergedObject['mergeProp']['properties']) {
              mergedObject['mergeProp']['properties'] = { ...mergedObject['mergeProp']['properties'], ...allMerge[key]['mergeProp']['properties'] }
            } else {
              mergedObject['mergeProp']['properties'] = { ...allMerge[key]['mergeProp']['properties'] }
            }
          }
          if (allMerge[key].mergeProp.required) {
            if (mergedObject['mergeProp']['required']) {
              mergedObject['mergeProp']['required'] = [...mergedObject['mergeProp']['required'], ...allMerge[key]['mergeProp']['required']]
            } else {
              mergedObject['mergeProp']['required'] = [...allMerge[key]['mergeProp']['required']]
            }

          }
        }
        _mergeData = mergedObject
      }
    }

    if (formDrivenProp_check) {
      // this if condition is to make sure that if any property found formDriven property then check in it if their is any other property that is actually fomDriven(if found then this is same reason for being this prop as formDrivien so we check it here, extract that properties and merge it with _mergeData.form_drivingProp)
      // Case : measures.measure_type for visulization_type "Map"
      let form_drivingOneOf = ""
      // let form_drivingKey = ""
      if (form_drivingPropArr.hasOwnProperty(prop)) {
        if (form_drivingPropArr[prop].hasOwnProperty('oneOf')) {
          form_drivingOneOf = form_drivingPropArr[prop]
          const firstOneOf = form_drivingPropArr[prop]['oneOf'][0]

          for (const prox in firstOneOf.properties) {
            let inst = firstOneOf.properties[prox]
            if (inst.hasOwnProperty('items') &&
              inst.items.hasOwnProperty('properties') &&
              Object.keys(inst.items.properties).length === 1) {

              for (const proz in inst.items.properties) {
                // form_drivingKey = proz
                let obj = {};
                form_drivingOneOf['primaryLevel'] = true; // setting primaryLevel key only for this case if formDrivenProp_check is found for type array and its oneOf is a nested format ex. oneOf[0].oneOf[0].measures. in this driven prooerty is not measure but measure_key that is nested in measures
                obj[proz] = form_drivingOneOf;
                additionalForm_drivingProp.push(obj)
                if (_mergeData['form_drivingProp']) { // merging the converted oneOf to _mergeData.for_drivingProp 
                  _mergeData['form_drivingProp'] = { ..._mergeData['form_drivingProp'], ...additionalForm_drivingProp[0] }
                }
              }

            }
          }
        }
      }
    }

    let addAttr = null
    if ((setAttr && Object.keys(setAttr).length === 1) || !setAttr) {
      const key = `${prop}-index`
      const value = `${prop}[0]`
      addAttr = {
        'key': key,
        'value': value,
        'property-name': prop,
        'extraParams': null
      }
    } else {
      addAttr = setAttr
    }

    // iterationIndex is created to check if there should be add and remove button or only add button if its the fist instance of array
    let iterationIndex = addAttr.value.match(new RegExp(`${prop}\\[(\\d+)\\]`));

    const container = self.createNewRow('container')
    if (setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams) {
      container.setAttribute("linkedTo", setAttr['extraParams'])
    }
    const fieldSet = document.createElement('fieldset')
    fieldSet.className = "modify-fieldset"
    container.appendChild(fieldSet)

    const legend = document.createElement('legend');
    legend.className = 'modify-legend font-weight-bold';
    const displayName = property.hasOwnProperty('displayName') ? property.displayName : prop
    const category_header = requiredProp_check ? `${displayName} ` : displayName
    legend.textContent = category_header

    const astreikSpan = document.createElement('span')
    astreikSpan.className = requiredProp_check ? 'required' : ''

    const infoSpan = document.createElement('span')
    infoSpan.innerHTML = '&#9432;'
    infoSpan.style.marginLeft = '10px'
    infoSpan.style.cursor = 'pointer'
    infoSpan.style.fontWeight = 'normal'
    infoSpan.setAttribute('title', property.hasOwnProperty('description') ? property['description'] : "")

    legend.append(astreikSpan, infoSpan)
    fieldSet.appendChild(legend)

    const rowIn_container = self.createNewRow('row')
    rowIn_container.classList.add('modify-rowIn_container')
    rowIn_container.setAttribute('property-type', "array");
    rowIn_container.setAttribute('major-name', prop);
    rowIn_container.setAttribute('inline-array', inline_array)
    rowIn_container.setAttribute('highest-index', addAttr.value)        // setting this to have the highest index of object that was inserted in array
    fieldSet.appendChild(rowIn_container)

    if (!requiredProp_check) {    // if prooperty type array is not required then there will be add button and click on it properties will be rendered and on click of remove innerHTMl for rowIn_container will be cleared

      const button_div = document.createElement('div')
      button_div.classList.add('col-md-12', 'btn-colPos', 'modify-rowIn_container')

      const button_add = document.createElement('button')
      button_add.textContent = `Add ${displayName}`
      button_add.type = "button"
      button_add.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow')
      button_add.setAttribute('add-completesection', `add_${prop}`)

      const button_remove = document.createElement('button')
      button_remove.textContent = `Remove ${displayName}`
      button_remove.type = "button"
      button_remove.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow', 'd-none')
      button_remove.setAttribute('remove-completesection', `remove_${prop}`)


      button_div.append(button_add, button_remove)
      fieldSet.appendChild(button_div)

      button_add.addEventListener('click', function () {
        self.callFromArray_generateForm_HTML(_mergeData, rowIn_container, setAttr, property, add_BtnBreaker, iterationIndex, addAttr)
        self.enableDisableSubmitBtn();
        setTimeout(() => {
          self.updateSelectOptions(false);
        }, 500);

        button_add.classList.add('d-none')
        button_remove.classList.remove('d-none')

      })

      button_remove.addEventListener('click', function () {
        rowIn_container.innerHTML = ""
        button_add.classList.remove('d-none')
        button_remove.classList.add('d-none')
        self.enableDisableSubmitBtn();
      })
    } else {
      // Case if property is type array and required
      self.callFromArray_generateForm_HTML(_mergeData, rowIn_container, setAttr, property, add_BtnBreaker, iterationIndex, addAttr)
    }

    if (container_propArray) {
      container_propArray.appendChild(container)
    } else {
      rowX.appendChild(container)
    }
  }

  callFromArray_generateForm_HTML(_mergeData, rowIn_container, setAttr, property, add_BtnBreaker, iterationIndex, addAttr) {
    const self = this
    self._generateForm_HTML(_mergeData, rowIn_container, null, null, addAttr)
    if (!(property.minItems === 1 && property.maxItems === 1)) {
      if (add_BtnBreaker) {
        const button_div = self.createButtons(iterationIndex, addAttr)

        let breaker = document.createElement('div')
        breaker.classList.add('col-md-12', 'breaker')
        breaker.setAttribute(addAttr.key, addAttr.value)

        rowIn_container.appendChild(button_div)
        rowIn_container.appendChild(breaker)

        setTimeout(() => {
          const addbtn = self.shadowRoot.getElementById(`add_${addAttr.value}`)
          addbtn.addEventListener('click', function () {
            self.appendObject_inArray(_mergeData, addAttr, addbtn)
            self.enableDisableSubmitBtn();
          })
          // if(property.minItems == 1 && property.maxItems == 1){
          //   addbtn.classList.add('d-none')
          //   breaker.classList.add('d-none')
          // }
        }, 500)
      }
    }
  }

  _addValidations(element, iterateProp) {

    for (const prop in iterateProp) {
      const property = iterateProp[prop]
      switch (true) {
        case prop === 'minimum' && typeof property !== ('object' || 'array'):
          element.setAttribute('min', property)
          break;
        // ================================
        case prop === 'maximum' && typeof property !== ('object' || 'array'):
          element.setAttribute('max', property)
          break;
        // ================================
        case prop === 'pattern' && typeof property !== ('object' || 'array'):
          element.setAttribute('pattern', property)
          break;
        // ================================
        case (prop === 'minLength' || prop === 'minlength') && typeof property !== ('object' || 'array'):
          const min_val = (prop === 'minLength') ? iterateProp.minLength : iterateProp.minlength
          element.setAttribute('minlength', min_val)
          break;
        // ================================
        case (prop === 'maxLength' || prop === 'maxlength') && typeof property !== ('object' || 'array'):
          const max_val = (prop === 'maxLength') ? iterateProp.maxLength : iterateProp.maxlength
          element.setAttribute('maxlength', max_val)
          break;
        // ================================
        default:
          // console.log("check _addValidation fn()")
          break;
      }
    }
    return element
  }
  // Function to validate an individual input element
  _validateInput(element, error_span, display_name, label, col) {
    const self = this;
    const value = element.value;
    const fieldName = display_name; // Get the field's actual name
    const pattern = element.getAttribute('pattern')

    const addError = () => {
      element.classList.add('error_input')
      label.classList.add('error_label')
    }
    const removeError = () => {
      element.classList.remove('error_input')
      label.classList.remove('error_label')
    }

    if (element.tagName === 'INPUT') {
      // Reset custom validity
      element.setCustomValidity('');
      // Check required fields
      if (/^\s+$/.test(value)) {
        element.setCustomValidity(`Only space(s) are not allowed.`);
        self._displayError(element, error_span, `Only space(s) are not allowed.`);
        addError()

        return false;
      }

      const trimmedValue = value.trim()

      if (trimmedValue === "") {
        self._displayError(element, error_span, '');
        self.setValue_column(trimmedValue, col)
        removeError()
        return true;
      }

      if (element.hasAttribute('min') && parseFloat(trimmedValue) < parseFloat(element.getAttribute('min'))) {
        element.setCustomValidity(`${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
        self._displayError(element, error_span, `${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
        addError()
        return false;
      }

      if (element.hasAttribute('max') && parseFloat(trimmedValue) > parseFloat(element.getAttribute('max'))) {
        element.setCustomValidity(`${fieldName} must be less than or equal to ${element.getAttribute('max')}.`);
        self._displayError(element, error_span, `${fieldName} must be less than or equal to ${element.getAttribute('max')}.`);
        addError()
        return false;
      }

      if (element.hasAttribute('minlength') && trimmedValue.length < parseInt(element.getAttribute('minlength'))) {
        element.setCustomValidity(`${fieldName} must have a minimum length of ${element.getAttribute('minlength')}.`);
        self._displayError(element, error_span, `${fieldName} must have a minimum length of ${element.getAttribute('minlength')}.`);
        addError()
        return false;
      }

      if (element.hasAttribute('maxlength') && trimmedValue.length > parseInt(element.getAttribute('maxlength'))) {
        element.setCustomValidity(`${fieldName} must have a maximum length of ${element.getAttribute('maxlength')}.`);
        self._displayError(element, error_span, `${fieldName} must have a maximum length of ${element.getAttribute('maxlength')}.`);
        addError()
        return false;
      }

      if (element.hasAttribute('pattern') && !new RegExp(pattern).test(trimmedValue)) {
        element.setCustomValidity(`Invalid ${fieldName}.`);
        self._displayError(element, error_span, `Invalid ${fieldName}.`);
        addError()
        return false;
      }

      // If no validation errors were found, clear the error message
      self._displayError(element, error_span, '');
      removeError()
      self.setValue_column(trimmedValue, col)
      return true;

    } else if (element.tagName === 'SELECT') {
      // Reset custom validity
      element.setCustomValidity('');
      if (element.hasAttribute('required')) {
        if (element.value === '') {
          element.setCustomValidity(`${fieldName} is required`)
          self._displayError(element, error_span, `${fieldName} is required`)
          return false;
        }
      }
    } else if (element.type === 'checkbox' || element.type === 'radio') {
      const fieldset = element.closest('fieldset');
      const checkedInputs = fieldset.querySelectorAll('[type="checkbox"]:checked, [type="radio"]:checked');
      if (checkedInputs.length === 0) {
        fieldset.setCustomValidity(`${fieldName} is required.`)
        self._displayError(element, error_span, `${fieldName} is required.`)
        return false;
      }
    }

  }

  // Function to display error messages
  _displayError(element, error_span, message) {
    error_span.textContent = message;
  }

  // Function to clear error messages
  _clearErrors() {
    const errorSpans = document.querySelectorAll('.error_span');
    errorSpans.forEach(span => {
      span.textContent = '';
    });
  }

  generateIncrementalId = (prop, wholeId) => {
    const match = wholeId.match(new RegExp(`${prop}\\[(\\d+)\\]`));

    if (match) {
      const currentNumber = parseInt(match[1]);
      const newIndex = currentNumber + 1;
      const newId = `${prop}[${newIndex}]`;
      return newId;
    } else {
      throw new Error(`Invalid format for ${wholeId}`);
    }
  }

  removeObject_fromArray(setAttr, removetbtn) {

    const self = this
    let value = `[${setAttr.key}="${setAttr.value}"]`
    const removeArray = self.shadowRoot.querySelectorAll(value)

    removeArray.forEach((obj) => {
      obj.remove()
    })

  }

  appendObject_inArray(_mergeData, addAttr, addbtn) {
    const self = this;
    const prop = addAttr['property-name']
    const rowIn_container = self.shadowRoot.querySelector(`[major-name='${prop}']`)
    const highestIndex = rowIn_container.getAttribute('highest-index')
    let incrementalId = self.generateIncrementalId(prop, highestIndex)
    const key = `${addAttr['property-name']}-index`
    const setAttr = {
      'key': key,
      'value': incrementalId,
      'property-name': prop
    }
    rowIn_container.setAttribute('highest-index', incrementalId)


    self._generateForm_HTML(_mergeData, rowIn_container, null, null, setAttr)


    let iterationIndex = incrementalId.match(new RegExp(`${prop}\\[(\\d+)\\]`));
    const button_div = self.createButtons(iterationIndex, setAttr)
    self.updateSelectOptions(false);
    let breaker = document.createElement('div')
    breaker.classList.add('col-md-12', 'breaker')
    breaker.setAttribute(setAttr.key, setAttr.value)

    rowIn_container.appendChild(button_div)
    rowIn_container.appendChild(breaker)

    setTimeout(() => {
      const addbtn = self.shadowRoot.getElementById(`add_${setAttr.value}`)
      addbtn.addEventListener('click', function () {
        self.appendObject_inArray(_mergeData, setAttr, addbtn)
        self.enableDisableSubmitBtn()
      })

      const removetbtn = self.shadowRoot.getElementById(`remove_${setAttr.value}`)
      removetbtn.addEventListener('click', function () {
        self.removeObject_fromArray(setAttr, removetbtn)
        self.enableDisableSubmitBtn()

      })
    }, 500)
    // this function appends object in array
  }

  updateSelectOptions(renewedData) {
    // renewedData is an argument that declares wheather all select Dropdown should be updated or not(in other case only those dropdwon will be updated with options which gets populated from formDriving properties)
    const self = this;
    if (self.inputFile_actualdata.length > 0) {
      let dropDowns = []
      if (renewedData) {
        // dropDowns = self.shadowRoot.querySelectorAll(`[input-dependselect='true'][input-dependmultiselect='true']`)
        const selectDropd = self.shadowRoot.querySelectorAll(`[input-dependselect='true']`)
        const multiSelectDropd = self.shadowRoot.querySelectorAll(`[input-dependmultiselect='true']`)
        if (selectDropd.length > 0) {
          dropDowns = [...selectDropd]
        }
        if (multiSelectDropd.length > 0) {
          if (dropDowns.length > 0) {
            dropDowns = [...dropDowns, ...multiSelectDropd]
          } else {
            dropDowns = [...multiSelectDropd]
          }
        }
      } else {
        const selectDropd = self.shadowRoot.querySelectorAll(`[input-dependselect='true'][input-dependselectupdate='not-updated']`)
        const multiSelectDropd = self.shadowRoot.querySelectorAll(`[input-dependmultiselect='true'][input-dependmultiselectupdate='not-updated']`)
        if (selectDropd.length > 0) {
          dropDowns = [...selectDropd]
        }
        if (multiSelectDropd.length > 0) {
          if (dropDowns.length > 0) {
            dropDowns = [...dropDowns, ...multiSelectDropd]
          } else {
            dropDowns = [...multiSelectDropd]
          }
        }
      }
      if (dropDowns.length > 0) {
        for (let index = 0; index < dropDowns.length; index++) {

          const selectDD = dropDowns[index];
          let inputDependableOn = ""
          const optionsArray = []
          function extractOptionsArray(inputFile_actualdata, inputDependableOn) {
            let array = []
            if (inputFile_actualdata[0].autometa[inputDependableOn]) {
              array = inputFile_actualdata[0].autometa[inputDependableOn]
            } else if (inputFile_actualdata[0].usermeta[inputDependableOn]) {
              array = inputFile_actualdata[0].usermeta[inputDependableOn]

            } else if (inputFile_actualdata.includes(inputDependableOn)) {
              array = inputFile_actualdata[0][inputDependableOn]
            }
            return array
          }

          if (selectDD.hasAttribute('input-dependselect')) {
            inputDependableOn = selectDD.getAttribute('input-dependselectkey')
            if (self.inputFile_actualdata.length > 0 && inputDependableOn) {
              optionsArray = extractOptionsArray(self.inputFile_actualdata, inputDependableOn)
            }

            if (optionsArray.length > 0) {
              const firstOption = selectDD.options[0]     // updating textContent for option[0] as options array has been extracted.
              firstOption.textContent = "Select option";

              for (const val of optionsArray) {
                const option = document.createElement('option');
                option.textContent = val;
                option.value = val
                selectDD.appendChild(option);
              }
              selectDD.setAttribute('input-dependselectupdate', 'updated')
            }
          }
          else if (selectDD.hasAttribute('input-dependmultiselectkey')) {
            inputDependableOn = selectDD.getAttribute('input-dependmultiselectkey')
            if (self.inputFile_actualdata.length > 0 && inputDependableOn) {
              optionsArray = extractOptionsArray(self.inputFile_actualdata, inputDependableOn)
            }

            if (optionsArray.length > 0) {
              selectDD.innerHTML = ""
              const setId = selectDD.getAttribute('input-dependmultiselectsetid');
              const prop_default = selectDD.getAttribute('input-dependmultiselectprop_default');
              for (const val of optionsArray) {
                const _li = document.createElement('li');
                _li.textContent = val;
                _li.className = "checkbox-option"
                _li.id = setId

                const input_inLi = document.createElement('input')
                input_inLi.type = "checkbox"
                input_inLi.value = val
                input_inLi.innerText = val
                input_inLi.className = 'custom-checkBox'
                prop_default && prop_default.includes(val) ? input_inLi.checked = true : input_inLi.checked = false

                _li.appendChild(input_inLi)
                selectDD.appendChild(_li);
              }
              selectDD.setAttribute('input-dependmultiselectupdate', 'updated')
            }
          }
        }
      }
    }
  }

  createButtons(iteration, addAttr) {
    const button_div = document.createElement('div')
    button_div.classList.add('col-md-12', 'btn-colPos')
    // below line will be used while rmemoving an array of object. queryselecting all elements using addAttr.key.
    button_div.setAttribute(addAttr.key, addAttr.value)


    const button_add = document.createElement('button')
    button_add.textContent = "Add Another"
    button_add.id = `add_${addAttr.value}`
    button_add.type = "button"
    button_add.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow')

    button_div.appendChild(button_add)
    if (parseInt(iteration[1]) > 0) {
      const button_remove = document.createElement('button')
      button_remove.textContent = "Remove"
      button_remove.id = `remove_${addAttr.value}`
      button_remove.type = "button"
      button_remove.classList.add('btn', 'btn-light', 'btn-lg', 'ml-3', 'btn-boxShadow')
      button_div.appendChild(button_remove)
    }
    return button_div
  }

  createNewRow(cls) {
    const newRow = document.createElement('div')
    newRow.classList.add(cls)
    return newRow
  }

  createSpanTag(property) {
    const span = document.createElement('span')
    span.classList.add('info-icon')
    span.innerHTML = '&#9432;'
    span.setAttribute('title', property.hasOwnProperty('description') ? property['description'] : "")

    return span
  }

  setValue_column(eleVal, column) {
    column.setAttribute('value', eleVal)

  }

  submitForm() {
    const self = this;
    const submitButton = self.shadowRoot.querySelector('#submitBtn');
    submitButton.addEventListener('click', function () {
      self.extractFormProperties()
        .then(() => self._ajvValidation())
    });

  }

  extractFormProperties() {     // Extract form properties
    const self = this;
    self.formProperties = {};

    self.validityCheck = 'false'
    return new Promise((resolve, reject) => {
      const inputSelectionProperties_element = self.shadowRoot.querySelectorAll(`[container-type="input-selection"]`);
      if (inputSelectionProperties_element) {
        inputSelectionProperties_element.forEach((inputoutput_element) => {
          const input_row_elements = inputoutput_element.querySelectorAll(`[required="true"]`);
          input_row_elements.forEach((row_element) => {
            self.input_output_properties[row_element.getAttribute('property')] = row_element.getAttribute('value') !== null ? row_element.getAttribute('value') : "";
          });
        });
      }

      const outputSelectionProperties_element = self.shadowRoot.querySelectorAll(`[container-type="output-selection"]`);
      if (outputSelectionProperties_element) {
        outputSelectionProperties_element.forEach((inputoutput_element) => {
          const output_row_elements = inputoutput_element.querySelectorAll(`[required="true"]`);
          output_row_elements.forEach((row_element) => {
            self.input_output_properties[row_element.getAttribute('property')] = row_element.getAttribute('value') !== null ? row_element.getAttribute('value') : "";
          });
        });
      }

      const commonProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="commonProperties"]`);
      if (commonProperties_elements) {
        commonProperties_elements.forEach((element) => {
          const commonProperties_row_elements = element.querySelectorAll(`[primary-row="true"]`);
          commonProperties_row_elements.forEach((row_element) => {
            row_element.childNodes.forEach((child_row_element) => {
              if ((child_row_element.getAttribute('required') === 'true') || (child_row_element.getAttribute('required') === 'false' && child_row_element.hasAttribute('value') && child_row_element.getAttribute('value') !== "")) {

                if (child_row_element.getAttribute('property-type') === 'array-multiselect' ) {
                  self.formProperties[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value').split(",") : [];
                }
                else if (child_row_element.getAttribute('property-type') === 'integer' || child_row_element.getAttribute('property-type') === 'number') {
                  self.formProperties[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseFloat(child_row_element.getAttribute('value')) : 0;
                }
                else if (child_row_element.getAttribute('property-type') === 'date') {
                  self.formProperties[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? child_row_element.getAttribute('value') : new Date();
                }
                else if (child_row_element.getAttribute('property-type') === 'boolean') {
                  self.formProperties[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                }
                else if (child_row_element.getAttribute('property-type') === 'string' && child_row_element.getAttribute('required') === 'true') {
                  self.formProperties[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : null;
                }
                else {
                  self.formProperties[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "" ? child_row_element.getAttribute('value') : "";
                }
              }
            });
          });
        });
      }
      const objectProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="objectProperties"]`);
      if (objectProperties_elements) {
        objectProperties_elements.forEach((element) => {
          const objectProperties_row_elements = element.querySelectorAll(`[property-type="object"]`);
          objectProperties_row_elements.forEach((row_element) => {
            let object_name = row_element.getAttribute('major-name');
            let objectProperties_row_obj = {};
            if (object_name !== 'columns') {
              row_element.childNodes.forEach((child_row_element) => {
                if ((child_row_element.getAttribute('required') === 'true') || (child_row_element.getAttribute('required') === 'false' && child_row_element.hasAttribute('value') && child_row_element.getAttribute('value') !== "")) {
                  if (child_row_element.hasAttribute('property-type')) {
                    if (child_row_element.getAttribute('property-type') === 'integer') {
                      objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseInt(child_row_element.getAttribute('value')) : 0;
                    }
                    else if (child_row_element.getAttribute('property-type') === 'number') {
                      objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseFloat(child_row_element.getAttribute('value')) : 0;
                    }
                    else if (child_row_element.getAttribute('property-type') === 'boolean') {
                      objectProperties_row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                    }
                    else if (child_row_element.getAttribute('property-type') === 'array-multiselect') {
                      if (child_row_element.getAttribute('value') !== "") {
                        let arrayValue = child_row_element.getAttribute('value').split(',')
                        objectProperties_row_obj[child_row_element.getAttribute('property')] = arrayValue;
                      } else {
                        objectProperties_row_obj[child_row_element.getAttribute('property')] = [];
                      }
                    } else if (child_row_element.getAttribute('property-type') === 'string' && child_row_element.getAttribute('required') === 'true') {
                      objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : null;
                    }
                    else {
                      objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : "";
                    }
                  }
                  self.formProperties[`${object_name}`] = objectProperties_row_obj;
                }

              });
            }

            const container_objectProperties_row_elements = row_element.querySelectorAll(`[class="container"]`);
            container_objectProperties_row_elements.forEach((container_row_element) => {
              const child_objectProperties_row_elements = container_row_element.querySelectorAll(`[property-type="object"]`);
              child_objectProperties_row_elements.forEach((row_element) => {
                let child_objectProperties_row_obj = {};
                let object_name = row_element.getAttribute('major-name');
                row_element.childNodes.forEach((child_row_element) => {
                  if ((child_row_element.getAttribute('required') === 'true') || (child_row_element.getAttribute('required') === 'false' && child_row_element.hasAttribute('value') && child_row_element.getAttribute('value') !== "")) {
                    if (child_row_element.hasAttribute('property-type')) {
                      if (child_row_element.getAttribute('property-type') === 'integer') {
                        child_objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseInt(child_row_element.getAttribute('value')) : 0;
                      }
                      else if (child_row_element.getAttribute('property-type') === 'number') {
                        child_objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseFloat(child_row_element.getAttribute('value')) : 0;
                      }
                      else if (child_row_element.getAttribute('property-type') === 'boolean') {
                        child_objectProperties_row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                      }
                      else if (child_row_element.getAttribute('property-type') === 'array-multiselect') {
                        if (child_row_element.getAttribute('value') !== "") {
                          let arrayValue = child_row_element.getAttribute('value').split(',')
                          child_objectProperties_row_obj[child_row_element.getAttribute('property')] = arrayValue;
                        } else {
                          child_objectProperties_row_obj[child_row_element.getAttribute('property')] = [];
                        }
                      } else if (child_row_element.getAttribute('property-type') === 'string' && child_row_element.getAttribute('required') === 'true') {
                        child_objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : null;
                      }
                      else {
                        child_objectProperties_row_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : "";
                      }
                    }
                    objectProperties_row_obj[`${object_name}`] = child_objectProperties_row_obj;
                  }
                });

              });
            });
          });
        });
      }
      const arrayProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="arrayProperties"]`);
      if (arrayProperties_elements) {
        arrayProperties_elements.forEach((element) => {
          const arrayProperties_row_elements = element.querySelectorAll('[property-type="array"]');
          let object_name = '';
          arrayProperties_row_elements.forEach((row_element_container) => {
            let arrayProperties_row_obj = [];
            let inside_obj = {}
            object_name = row_element_container.getAttribute('major-name');
            var buttonExist = row_element_container.querySelectorAll('button')
            row_element_container.childNodes.forEach((child_row_element) => {
              if (child_row_element.hasAttribute('property-type')) {
                if (child_row_element.getAttribute('value') !== 'Select option') {
                  if ((child_row_element.getAttribute('required') === 'true') || (child_row_element.getAttribute('required') === 'false' && child_row_element.hasAttribute('value') && child_row_element.getAttribute('value') !== "")) {
                    if (child_row_element.getAttribute('property-type') === 'integer') {
                      inside_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseInt(child_row_element.getAttribute('value')) : 0;
                    }
                    else if (child_row_element.getAttribute('property-type') === 'number') {
                      inside_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== "" || child_row_element.getAttribute('value') !== null || child_row_element.getAttribute('value') !== NaN) ? parseFloat(child_row_element.getAttribute('value')) : 0;
                    }
                    else if (child_row_element.getAttribute('property-type') === 'boolean') {
                      inside_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                    }
                    else if (child_row_element.getAttribute('property-type') === 'string' && child_row_element.getAttribute('required') === 'true') {
                      inside_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : null;
                    }
                    else {
                      inside_obj[child_row_element.getAttribute('property')] = (child_row_element.getAttribute('value') !== null && child_row_element.getAttribute('value') !== "") ? child_row_element.getAttribute('value') : "";
                    }
                  }
                }
              } else {
                if (Object.keys(inside_obj).length !== 0 && inside_obj.constructor === Object) {
                  arrayProperties_row_obj.push(inside_obj);
                }
                inside_obj = {}
              }
            });

            if (buttonExist.length == 0) {
              if (Object.keys(inside_obj).length !== 0 && inside_obj.constructor === Object) {
                arrayProperties_row_obj.push(inside_obj);
              }
              inside_obj = {}
            }

            if (arrayProperties_row_elements[0].getAttribute('inline-array') === 'true') {
              const convertedObj = arrayProperties_row_obj.map(item => item[`${object_name}`])
              if (convertedObj.length === 0 || convertedObj.indexOf('') > -1) {
                self.formProperties[`${object_name}`] = null;

              } else {
                self.formProperties[`${object_name}`] = convertedObj
              }
            } else {
              if (arrayProperties_row_obj.length > 0)
                self.formProperties[`${object_name}`] = arrayProperties_row_obj;
            }

          });
        });
      }
      resolve()
    })
  }

  _ajvValidation() {     // Ajv validation
    const self = this;
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        strict: false,
        strictMode: false,
        $data: true,
        allErrors: true,
        $comment: false,
        messages: true,
        timestamp: true,
        ownProperties: true,
        verbose: true,
        allowDate: true,
        formats: true
      }
      const ajv = new Ajv(defaultOptions);
      require("ajv-keywords")(ajv)
      addFormats(ajv)
      const validate = ajv.compile(self.use_schema);
      const valid = validate(self.formProperties)
      if (!valid) {
        var errorObj = {};
        validate.errors.forEach(function (arrayItem) {
          var x = arrayItem.message;
          if (self.submitFlow === "false") {
            if (arrayItem.dataPath) {
              let dataPath = arrayItem.dataPath.replace(".", "")
              errorObj[dataPath] = x
            } else if (arrayItem.keyword) {
              let keyword = arrayItem.keyword.replace(".", "")
              errorObj[keyword] = x
            }
          } else {
            if (arrayItem.hasOwnProperty('parentSchema') && arrayItem.parentSchema.hasOwnProperty('displayName'))
              errorObj[arrayItem.parentSchema.displayName] = x;
            // else if (arrayItem.hasOwnProperty('keyword') && !arrayItem.params.hasOwnProperty('missingProperty'))
            //   errorObj[arrayItem.params.missingProperty] = x;
            // else
            //   errorObj[arrayItem.dataPath] = x;
          }
        });
        // console.log(errorObj)
        const errorMessages = self.shadowRoot.querySelector(".errorMessages");
        let error_span = '';
        Object.entries(errorObj).forEach(([key, value]) => {
          error_span += `${key} : ${value} \n`
        })
        errorMessages.innerText = error_span

        const element = self.shadowRoot.querySelector("#json-form");
        element.scrollIntoView()

        if (error_span !== '') {
          const toast = self.shadowRoot.querySelector(".toast");
          const closeIcon = self.shadowRoot.querySelector(".close")
          const progress = self.shadowRoot.querySelector(".progress");
          const errorMsg = self.shadowRoot.querySelector(".errorMsg");

          toast.classList.remove("d-none");
          errorMsg.classList.remove("d-none");
          toast.classList.add("active");
          progress.classList.add("active");

          closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");
            toast.classList.add("d-none");
            errorMsg.classList.add("d-none");
            progress.classList.remove("active");

          });
        }
      } else {
        if (self.submitFlow === "false") {
          self.validityCheck = "true"
        } else {
          self.createSubmissionData()
        }
      }
      resolve()
    })
  }

  createSubmissionData() {
    const self = this
    var requestJson = {
      input: {},
      job_definition: `${self.jobdefiniation.id}@${self.jobdefiniation.version}`,
      pragmas: {},
      // output_container:"",
      // output_name: self.input_output_properties.output_name
    };
    if (self.input_output_properties) {
      for (const key in self.input_output_properties) {
        if (key.includes('input')) {
          self.formProperties[key] = self.input_output_properties[key]
        }
        if (key.includes('output')) {
          requestJson[key] = self.input_output_properties[key]
        }
      }
    }

    requestJson.input = self.formProperties;
    self.onFormSubmit(requestJson);
  }

  onFormSubmit(requestJson) {
    const self = this
    const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const jobServiceInstance = new JobService(url, token)

    jobServiceInstance.createJobInstance(requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container).then(
      (res) => {
        const successMeg = this.shadowRoot.querySelector(".successMessage");
        let successSpan = `"${self.jobdefiniation.id}" job submitted successfully`;
        successMeg.innerText = successSpan

        const element = this.shadowRoot.querySelector("#json-form");
        element.scrollIntoView()

        if (successSpan !== '') {
          const toast = this.shadowRoot.querySelector(".toast");
          const closeIcon = this.shadowRoot.querySelector(".close")
          const progress = this.shadowRoot.querySelector(".progress");
          const successSpan = this.shadowRoot.querySelector(".successMsg");
          const errorMessages = self.shadowRoot.querySelector(".errorMessages");
          const errorSpan = this.shadowRoot.querySelector(".errorMsg");
          toast.classList.remove("d-none");
          errorMessages.classList.add("d-none");
          errorSpan.classList.add("d-none");
          successSpan.classList.remove("d-none");
          toast.classList.add("active");
          progress.classList.add("active");

          closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");
            toast.classList.add("d-none");
            errorMessages.classList.remove("d-none");
            successSpan.classList.add("d-none");
            progress.classList.remove("active");
            errorSpan.classList.remove("d-none");
          });
          let submitBtn = self.shadowRoot.querySelector('#submitBtn');
          if (submitBtn) {
            submitBtn.classList.add('disabled');
          }
          const backToJDListPage = new CustomEvent('cust-backToJDListPage', {
            bubbles: true,
            composed: true,
            detail: {
              navigateToJDList: true
            }
          });
          setTimeout(() => {
            window.dispatchEvent(backToJDListPage);
          }, 4000);
        }

      },
      (error) => {
        const errorMessages = self.shadowRoot.querySelector(".errorMessages");
        if (error.message)
          errorMessages.innerText = `${error.message}`
        else
          errorMessages.innerText = `An internal error occured. Please try again`;

        let errorSpan = errorMessages.innerText;
        const element = this.shadowRoot.querySelector("#json-form");
        element.scrollIntoView()

        if (errorSpan !== '') {
          const toast = this.shadowRoot.querySelector(".toast");
          const closeIcon = this.shadowRoot.querySelector(".close")
          const progress = this.shadowRoot.querySelector(".progress");
          const successSpan = this.shadowRoot.querySelector(".successSpan");
          const errorSpan = this.shadowRoot.querySelector(".errorMsg");
          toast.classList.remove("d-none");
          errorSpan.classList.remove("d-none");
          successSpan.classList.remove("d-none");
          toast.classList.add("active");
          progress.classList.add("active");

          closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");
            toast.classList.add("d-none");
            errorSpan.classList.add("d-none");
            progress.classList.remove("active");

          });
        }
      }
    );
  }
}
customElements.define('cwe-jsonrenderer', JSONRenderer);
