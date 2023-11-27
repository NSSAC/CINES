/*
Attributes needed for cwe-fielUploader
  1. uploadableTypes: accepted file types 
  2. path: path of folder user is currently in;
  3. file_types: attributeChanged callback - api data for all file types. On file type selection required file type is filted;
  4. uploader_stat: attributeChanged callback - api prgress for active uploads;
*/

import './cwe-jsonRenderer'

const template_FileUploadWizard = document.createElement("template");
template_FileUploadWizard.innerHTML = '';
template_FileUploadWizard.innerHTML = /* html */ `
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <style>
       input[type="file"] {
       opacity: 0;
       position: absolute;
       pointer-events: none;
       }

       /* Style the file input container */
       .file-input-container {
         display: inline-block;
         position: relative;
         overflow: hidden;
       }

       /* Style the file input button */
       .file-input-button {
        background-color: #122230;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        padding: 6px 16px;
        font-size: 1.4rem;
        min-width: 64px;
        box-sizing: border-box;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-family: Muli,Roboto,"Helvetica",Arial,sans-serif;
        font-weight: 600;
        line-height: 1.75;
        border-radius: 4px;
        text-decoration: none;
        text-transform: uppercase;
       }

       .file-input-button:hover {
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)
       }

       .upload_title{
        font-size: 2rem;
        font-family: Muli,Roboto,"Helvetica",Arial,sans-serif;
        font-weight: 600;
        line-height: 1.6;
       }

       #action-buttons{

       }

       .remove_btn:focus{
        outline: none;
       }
       .remove_btn{
        background-color: transparent;
        border: 0px;
        cursor: pointer;
       }
       .textWrap{
        word-break: break-all;
        word-wrap: normal;
       }
    </style>
    <div class="drop-zone" id="drop-zone">
        <div class="row">
          <div class="col-md-12">
            <div class="wizard">
              <div class="wizard-inner">

              <div class="tab-content">
                <div class="tab-pane file-upload active" role="tabpanel" slide-tagName="file-upload">

                      <div class="dialog">
                          <div class="content">
                              <div class="header">
                                  <h2 class="title upload_title">Upload Files</h2>
                              </div>
                              <div class="body d-flex flex-column align-items-center">
                                <div class="file-input-container">
                                  <input type="file" id="file-input" multiple>
                                  <button class="file-input-button">Choose or Drop File</button>
                                </div>
                                <div class="table-responsive">
                                  <table id="file_list" class="table d-none" >    <!-- Table is to only populate the selected files to be uploaded  -->
                                    <thead>
                                      <tr>
                                        <th scope="col"  class="border-top-0">Name</th>
                                        <th scope="col"  class="border-top-0">Type</th>
                                        <th scope="col"  class="border-top-0">Size</th>
                                        <!-- <th>Remove</th> // commented on purpose: This last table heading  column is for remove button but has no heading  -->
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <!-- Table rows will be dynamically added here -->
                                    </tbody>
                                  </table>
                                  
                                  <table id="active_uploads" class="table d-none" >   <!-- Table is to only populate the active uploads  -->
                                    <thead>
                                      <tr>
                                        <th scope="col" class="border-0" colspan="3"> Active Uploads</th>
                                      </tr>
                                      <tr>
                                        <th scope="col"  class="border-top-0">Name</th>
                                        <th scope="col"  class="border-top-0">Size</th>
                                        <th scope="col"  class="border-top-0">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <!-- Table rows will be dynamically added here -->
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                          </div>
                      </div>
                </div>
              </div>
              <div id="action-buttons" class="pt-4 d-flex flex-row align-items-center justify-content-end">
                <button style="font-size: small;" class="prev-step border border-dark btn btn-light ml-1 font-weight-bold d-none">PREVIOUS</button>
                <button style="font-size: small;" class="next-step border border-dark btn btn-light ml-1 font-weight-bold d-none" disabled >NEXT</button>
                <button style="font-size: small;" class="cancel-wizard border border-dark btn btn-light ml-1 font-weight-bold">CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

class FileUploadWizard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Variable declaration
    this.table_file_List = ""       //selected files table
    this.tbody_file_List = ""       //selected files table-body
    this.table_active_uploads = ""    // active uploads table
    this.tbody_active_uploads = ""    // active uploads table-body
    this.files = []       //selected files array
    this.path = ""      // path of uploaded file
    this.uploadFiles = []       //files to be uploaded
    this.uploadableTypes = []       //accepted file types
    this.unique_id = 0       //unique id for removing the file
    this.api_fileTypes = []     //file types returned by API
    this.slide_data = {}        //data passed to slides.
    this.filtered_fileTypes = []        // selected file type stored data from API
    this.totalSlides = 1    // total slides at fist  (upload slide and output)
    this.nextButton = ""
    this.prevButton = ""
    this.cancelButton = ""
    this.currentTab = 0
    this.tab_content = "";
    this.tempIndexVar = "";
    this.customEventArray = [];
    this.endUpload = []
    this.uploadQueue = []   // uploader queue api response for active uploads
  }

  static get observedAttributes() {
    return ['file_types', 'uploader_stat'];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template_FileUploadWizard.content.cloneNode(true));

    this.getFileAttributes()
    this.initilization()
    this.fileUpload()
    
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const self = this;
    if (newVal && (name === 'file_types')) {
      self.api_fileTypes = self.getAttribute('file_types')
      self.api_fileTypes = JSON.parse(self.api_fileTypes)
    }

    if(newVal && (name === 'uploader_stat')){
      self.uploadQueue = self.getAttribute('uploader_stat')
      self.uploadQueue = JSON.parse(self.uploadQueue)
      if(self.uploadQueue.queue && self.uploadQueue.queue.length > 0){
        self.table_active_uploads.classList.remove('d-none')
        self.activeUploads()
      }else{
        self.table_active_uploads.classList.add('d-none')
      }
    }

  }

  getFileAttributes() {
    const self = this;
    self.path = JSON.parse(self.getAttribute("path"))
    self.uploadableTypes = JSON.parse(self.getAttribute("uploadableTypes"))
  }

  initilization() {
    const self = this;
    self.tab_content = self.shadowRoot.querySelector('.tab-content');
    self.addEventOnButtons()
  }

  fileUpload() {
    const self = this;
    self.handleFileInputChange = self.handleFileInputChange.bind(this);

    const fileInput = self.shadowRoot.querySelector('#file-input');
    const fileInputButton = self.shadowRoot.querySelector('.file-input-button');
    self.table_file_List = self.shadowRoot.querySelector('#file_list')
    self.tbody_file_List = self.shadowRoot.querySelector('#file_list').querySelector('tbody');

    self.table_active_uploads = self.shadowRoot.querySelector('#active_uploads')
    self.tbody_active_uploads = self.shadowRoot.querySelector('#active_uploads').querySelector('tbody');

    fileInputButton.addEventListener('click', () => {
      fileInput.value = null;
      fileInput.click();
    });
    fileInput.addEventListener('input', self.handleFileInputChange);
    self.dragDrop()
  }

  dragDrop(){
    const self = this;
    const dropZone = self.shadowRoot.querySelector('#drop-zone');

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      // Filter out duplicates based on file name
      const uniqueFiles = Array.from(files).filter(file => {
        return !self.uploadFiles.some(uploadedFile => uploadedFile.fileName === file.name);
      });

      self.handleFileInputChange(uniqueFiles)
    });
  }

  handleFileInputChange(event) {
    const self = this;
    if(event.target){
      // Removing duplicate files from getting uploaded. This check based on file-name
      const uniqueFiles = Array.from(event.target.files).filter(file => {
        return !self.uploadFiles.some(uploadedFile => uploadedFile.fileName === file.name);
      });
      self.files = uniqueFiles;
      // self.files = event.target.files
    }else{
      // condition that adds dragged and dropped files
      self.files = event
    }
    if (self.files.length > 0) {
      self.table_file_List.classList.remove('d-none')
    }
    // Setting unique id for specific file removal in case of dusplicate files
    for (const file of self.files) {
      // let x = self.unique_id++
      file['unique_id'] = `${file.name}(${self.unique_id++})`;
    }

    for (const file of self.files) {
      const row = self.createFileRow(file.name, file.size, file.unique_id);
      self.tbody_file_List.appendChild(row);
    }


    let tempF = Object.keys(self.files).map((fk) => {
      var f = self.files[fk]
      var fobj = {}
      if (self.uploadableTypes.length === 1) {
        fobj.type = self.uploadableTypes[0]
      } else {
        fobj.type = self.uploadableTypes.indexOf(f.name.split('.').pop()) !== -1 && f.name.split('.').pop();
      }
      fobj.fileName = f.name;
      fobj.size = f.size;
      fobj['unique_id'] = f.unique_id
      fobj['contents'] = f
      delete fobj['contents']['unique_id']
      return fobj
    })
    self.uploadFiles.push(...tempF)
    //Add Next button and add eventlistener on it
    self.addRmv_nextBtn()

    // Enable/Disable next button when files are getting added( ALSO CASE: if 1 file is selected then nxt btn gets enabled but if we addd one more file then it should get disabled )
    self.enableNextButton()
  }


  removeFile = (row, unique_id) => {
    const self = this
    let attrfileName = row.getAttribute("file-name")

    self.uploadFiles = self.uploadFiles.filter((obj) => {
      let xFileName = obj.unique_id
      if (xFileName !== attrfileName) {
        return obj
      }
    })
    // remove the object from slide_data
    if (self.slide_data) {

      delete self.slide_data[unique_id]

      if (self.slide_data['create_slide']) {
        const index = self.slide_data['create_slide'].indexOf(unique_id);
        if (index > -1) {
          self.slide_data['create_slide'].splice(index, 1);

          // Removing tab-pane from DOM if file is removed
          let removeTab_attr = `[slide-tagname='${unique_id}']`
          let tab_pane = self.shadowRoot.querySelector(removeTab_attr)
          if (tab_pane) {
            tab_pane.remove()
          }


          // Removing row from last slide if there is any 
          let summary_id = `[summary_id='${unique_id}']`
          let summary_row = self.shadowRoot.querySelector(summary_id)
          if (summary_row) {
            summary_row.remove()
          }
        }
      }
    }

    // Updating total no. of slides
    if (self.slide_data && self.slide_data['create_slide'] && self.slide_data['create_slide'].length > 0) {
      self.totalSlides = 1 + self.slide_data['create_slide'].length
    } else {
      self.totalSlides = 1
    }

    //Remove Next button if uploaded_files.length === 0
    self.addRmv_nextBtn();
  }

  updateTableVisibility = () => {   //remove table headers if no file selected
    const self = this;

    if (self.tbody_file_List.children.length === 0) {
      self.table_file_List.classList.add('d-none')
    } else {
      self.table_file_List.classList.remove('d-none')
    }
  };

  updateWizard = () => {
    const self = this;
    //  const tabs = self.shadowRoot.querySelectorAll('.nav-tabs li');
    //  tabs.forEach((tab, index) => {
    //    tab.classList.toggle('completed', index < currentTab);
    //    tab.classList.toggle('active', index === currentTab);
    //    tab.classList.toggle('disabled', index !== currentTab + 1);
    //  });
    const panes = self.shadowRoot.querySelectorAll('.tab-pane');
    panes.forEach((pane, index) => {
      pane.classList.toggle('active', index === self.currentTab);
    });

    // Remove Previous button if currenttab === 0 
    if (self.currentTab === 0) {
      const prevBtn_classList = Array.from(self.prevButton.classList)
      if (!prevBtn_classList.includes('d-none')) {
        self.prevButton.classList.add('d-none')
      }
    } else {
      self.prevButton.classList.remove('d-none')
    }
  };

  addRmv_nextBtn() {    // add remove next button 
    const self = this;
    if (self.uploadFiles.length > 0) {
      // Checking: if d-none class is present ? remove and add event
      const nextBtn_classList = Array.from(self.nextButton.classList)
      if (nextBtn_classList.includes('d-none')) {
        self.nextButton.classList.remove('d-none')
      }

    } else {
      self.nextButton.classList.add('d-none')
    }
  }

  enableNextButton = () => {
    const self = this
    const allSelect_dropdown = self.shadowRoot.querySelectorAll('[select-checkAllVal="value-check"]')
    let enable_nextBtn = true;

    if (allSelect_dropdown.length > 0) {
      for (let i = 0; i < allSelect_dropdown.length; i++) {
        const select = allSelect_dropdown[i]
        if (select.value === "Select File Type") {
          enable_nextBtn = false;
          break
        }
      }
      if (enable_nextBtn) {
        self.nextButton.removeAttribute('disabled')
        self.createSlideTab()
      } else {
        self.nextButton.setAttribute('disabled', true)
      }
    }
  }

  createSlideTab() {
    const self = this
    if(self.slide_data && self.slide_data.create_slide && self.slide_data.create_slide.length > 0){
      self.slide_data.create_slide.forEach((unique_fileID) => {
        let slide_details_uniqueId = self.slide_data[unique_fileID]
        let className = `tab-pane`
        let slide_tag = `[slide-tagname="${unique_fileID}"]`
        let checkInDOM = self.shadowRoot.querySelector(slide_tag)

        if (!checkInDOM) {
          let div = document.createElement('div')
          div.setAttribute('class', className)
          div.setAttribute('role', 'tabpanel')
          div.setAttribute('slide-tagName', unique_fileID)

          let jsonReader = document.createElement('cwe-jsonrenderer')
          jsonReader.setAttribute('details', JSON.stringify(slide_details_uniqueId))
          jsonReader.setAttribute('uniqueId', unique_fileID)
          jsonReader.setAttribute('submitFlow', "false")
          let event = {}
          // Description : Here CustomEvents are created for a reason. The reason being if any selected file that requires an additional property and needs to go through jsonRenderer web component then for each jsonRenderer web component being loaded for respective file should have unique set of events. This is to maintain the uniqueness of events so they dont get called unecessary for non-required selected files.

          // customEventArray is an array which has the CustomEvent, that will be used later in function addEventOnButtons()
          const eventOne = `cust_EventOne_${unique_fileID}`
          const eventTwo = `cust_EventTwo_${unique_fileID}`
          const customEvent_One = new CustomEvent(eventOne, {
            bubbles: true,
            composed: true,
            detail: {"unique_fileID" : unique_fileID}
          })

          event['id'] = unique_fileID;
          event['cust_eventOne'] = customEvent_One;
          event['cust_eventTwo'] = eventTwo;
          self.customEventArray.push(event)

          div.appendChild(jsonReader)
          const lastFileSummaryTab = self.tab_content.querySelector('.tab-pane.file-summary');
          if (lastFileSummaryTab) {
            // Insert the new tab before the lastFileSummaryTab
            self.tab_content.insertBefore(div, lastFileSummaryTab);
          } else {
            // If no "tab-pane file-summary" div is found, simply append the new tab to the end
            self.tab_content.appendChild(div)
          }
        }
      })
    }
  }

  formatSize(bytes, check) {
    // bytes is size of file in bytes
    // check: if check is true then size type will be mentioned i.e 20MB else 20 
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    // const sizes_included = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    // const sizes_notincluded = Math.round(bytes / Math.pow(1024, i), 2);
    const returnOutput = check === true ? Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i] : Math.round(bytes / Math.pow(1024, i), 2)
    return returnOutput
  }

  createFileRow(name, size, unique_id) {
    const self = this;
    const row = document.createElement('tr');
    row.setAttribute("file-name", unique_id)

    // Name column
    const nameCell = document.createElement('td');
    nameCell.style.wordBreak = "break-all"
    nameCell.textContent = name;
    row.appendChild(nameCell);

    // Type column with dropdown
    const typeCell = document.createElement('td');
    const typeDropdown = document.createElement('select');
    typeDropdown.setAttribute('select-id', unique_id)
    typeDropdown.setAttribute('select-checkAllVal', 'value-check')
    let fileTypes = [...self.uploadableTypes]
    fileTypes.unshift("Select File Type")

    for (const fileType of fileTypes) {
      const option = document.createElement('option');
      option.textContent = fileType;
      if (fileType === "Select File Type") {
        option.disabled = true
        option.selected = true
      } else {
        option.value = fileType
      }
      typeDropdown.appendChild(option);
    }
    typeCell.appendChild(typeDropdown);
    row.appendChild(typeCell);

    // Size column
    const sizeCell = document.createElement('td');
    sizeCell.textContent = self.formatSize(size, true);
    row.appendChild(sizeCell);

    // Remove column with button
    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove_btn')

    removeButton.innerHTML = /* html */`
          <svg  focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="fill: currentColor;
             width: 1em;
             height: 1em;
             display: inline-block;
             font-size: 2.4rem;
             transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
             flex-shrink: 0;
             user-select: none;
          ">
              <path
                d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z">
              </path>
          </svg>`
    removeButton.setAttribute('remove-id', unique_id)
    removeButton.addEventListener('click', () => {
      let attrRemoveId = removeButton.getAttribute('remove-id')
      self.removeFile(row, attrRemoveId);
      row.remove();
      self.updateTableVisibility();

      //** DO NOT REMOVE/MOVE this function position. Explicitly called were as letting row removed from dom and then checking for select dropdowns */ Enable/Disable next button when files are getting added( ALSO CASE: if 1 file is selected then nxt btn gets enabled but if we addd one more file then it should get disabled )
      self.enableNextButton()
    });
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    // typeDropdown.addEventListener('change', self.updateFileTypeSelect(typeDropdown_id,row))
    typeDropdown.addEventListener('change', () => {
      const attrSelectId = typeDropdown.getAttribute('select-id');
      const selectedFileType = typeDropdown.value;

      // setting the selected file type in self.uploadedFiles
      if (selectedFileType !== "Select File Type") {
        self.uploadFiles.forEach((obj) => {

          if (obj.unique_id === attrSelectId) {
            obj.type = selectedFileType
            let temp_filetype = self.api_fileTypes.filter((obj) => obj.id === selectedFileType)
            let checkForm_prop = temp_filetype.length > 0 && temp_filetype[0].hasOwnProperty('usermeta_schema') ? true : false      // check if filter api response has usermeta_schema


            // pushing filtered file types in self.filtered_fileTypes and checking for duplicates if multiple file type select same file type
            if (self.filtered_fileTypes.length > 0 && self.filtered_fileTypes.findIndex((obj) => obj.id === selectedFileType) !== 0) {
              self.filtered_fileTypes.push(...temp_filetype)

            } else if (self.filtered_fileTypes.length === 0) {
              self.filtered_fileTypes.push(...temp_filetype)
            }

            // creating slide data
            self.slide_data[obj.unique_id] = {}
            self.slide_data[obj.unique_id]['file_name'] = obj.fileName;
            self.slide_data[obj.unique_id]['type'] = obj.type;
            self.slide_data[obj.unique_id]['size'] = obj.size
            self.slide_data['create_slide'] = self.slide_data.hasOwnProperty('create_slide') ? self.slide_data['create_slide'] : []

            if (checkForm_prop) {
              if (self.slide_data['create_slide']) {
                if (!self.slide_data['create_slide'].includes(obj.unique_id)) {
                  self.slide_data['create_slide'].push(obj.unique_id)
                }
              } else {
                self.slide_data['create_slide'] = []
                self.slide_data['create_slide'].push(obj.unique_id)
              }

              self.slide_data[obj.unique_id]['file_schema'] = temp_filetype[0]
              self.slide_data[obj.unique_id]['schema_values'] = {}
              self.slide_data[obj.unique_id]['error'] = []
              self.slide_data[obj.unique_id]['status'] = "not-started"
              self.slide_data[obj.unique_id]['boolean_createSlide'] = true


              // Setting total no. of slides
              if (self.slide_data['create_slide']) {
                self.totalSlides = 1 + self.slide_data['create_slide'].length
              }

            } else {
              // when user change the file type whose type is already selected
              if (self.slide_data['create_slide'] && self.slide_data['create_slide'].includes(obj.unique_id)) {
                const index = self.slide_data['create_slide'].indexOf(obj.unique_id);
                if (index > -1) {
                  self.slide_data['create_slide'].splice(index, 1);
                }
                // Updating total no. of slides
                if (self.slide_data['create_slide']) {
                  self.totalSlides = 1 + self.slide_data['create_slide'].length
                }

                // Removing tab-pane from DOM selected file type is changed and it doesnot have input_schema
                let removeTab_attr = `[slide-tagname='${obj.unique_id}']`
                let tab_pane = self.shadowRoot.querySelector(removeTab_attr)
                if (tab_pane) {
                  tab_pane.remove()
                }
              }
            }
          }
        })
      }

      // Function to enable Next Button on selecting file types for uploaded files. Gets triggered every time user select file type to check if all file types are selected
      self.enableNextButton()

    })

    return row;
  }

  addEventOnButtons() {
    const self = this;
    self.nextButton = self.shadowRoot.querySelector('.next-step');
    self.nextButton.addEventListener('click', (e) => {
      if (self.currentTab < self.totalSlides) {
          
          if(self.currentTab === 0){
          self.currentTab++;
          if (self.currentTab === self.totalSlides) { // if user uploaded ALL files that dont require form then next sllide will be summary slide
            self.createSummaryTab();
          }
            self.updateWizard();
          } else {
          e.stopPropagation();
          // Once we are on form Tab (jsonRenderer web component) and we click on next tab below code performs these things internally
          // 1. Check for active tab, get its slide-tagname
          // 2. filter obj in customEventArray (that have pre made CustomEvents) obj.id === slideTag
          // 3. cust_eventOne dispatched to trigger functions extractFormProperties() && _ajvValidation().
          // 4. Once both functions are completed in jsonRenderer wc, output gets sent through CustomEventsto fileUploader wc. Name of event is being dispatched is filterdEvent[0].cust_eventTwo. With the same event name an EventListener is added to check if details.formValidation === "true". if found true then move to next slide
          self.tempIndexVar = self.currentTab
          const getActive_tab = self.shadowRoot.querySelector('.tab-pane.active')
          const slideTag = getActive_tab.getAttribute('slide-tagname')
          const filterdEvent = self.customEventArray.filter( obj => obj.id === slideTag)
          self.nextButton.dispatchEvent(filterdEvent[0].cust_eventOne)

          const formDataReadyHandler = (event) => {
            const details = event.detail;
            self.slide_data.create_slide.forEach((unique_Id) => {
              if (unique_Id === details.uniqueId){
                self.slide_data[unique_Id].schema_values = details.formData
              }
            })

            if (details.formValidation === "true") {
              self.currentTab++;
              self.createSummaryTab();
              self.updateWizard();
            }
            window.removeEventListener(filterdEvent[0].cust_eventTwo, formDataReadyHandler);
          }

            window.addEventListener(filterdEvent[0].cust_eventTwo, formDataReadyHandler);


        }
      }else if(self.currentTab === self.totalSlides){
        self.endPoint_uploadFile()
      }
    });

    self.prevButton = self.shadowRoot.querySelector('.prev-step');
    self.prevButton.addEventListener('click', () => {
      if (self.currentTab > 0) {
        self.currentTab--;
        self.updateWizard();

        if (self.currentTab !== self.totalSlides) {
          self.nextButton.textContent = "NEXT"
        }
      }
    });

    self.cancelButton = self.shadowRoot.querySelector('.cancel-wizard')
    self.cancelButton.addEventListener('click', () => {
      self.cancelButton.dispatchEvent(
        new CustomEvent("cancel-wizard", {
          bubbles: true,
          composed: true,
          detail: true
        })
      );
    })

    self.updateWizard();
  }

  createSummaryTab(){
    const self = this;
    if (self.currentTab === self.totalSlides) {
      self.nextButton.textContent = "UPLOAD"

      // code for last slide
      let className = `tab-pane file-summary`
      let slide_tag = `[slide-tagname="file-summary"]`
      let checkInDOM = self.shadowRoot.querySelector(slide_tag)

      if(!checkInDOM){
        let div = document.createElement('div')
        div.setAttribute('class', className)
        div.setAttribute('role', 'tabpanel')
        div.setAttribute('slide-tagName', 'file-summary')

        for(const fileId in self.slide_data ){
          if(fileId !== 'create_slide'){
            self.createSummaryData(fileId, div)
          }
        }
        self.tab_content.appendChild(div)
      }
      else{
        for(const fileId in self.slide_data ){
          if(fileId !== 'create_slide'){
            const check_summary_id = checkInDOM.querySelector(`[summary_id="${fileId}"]`)
            if(!check_summary_id){
              self.createSummaryData(fileId, checkInDOM)
            }
          }
        }
      }
    }
  }

  createSummaryData(fileId, div) {
    const self = this

        const fileContent = self.slide_data[fileId];
        const summary_row = document.createElement('div')
        summary_row.classList.add('row', 'border', 'border-dark', 'rounded', 'mb-3')
        summary_row.setAttribute('summary_id', fileId)

        const col_ten = document.createElement('div')
        col_ten.className = "col py-1 d-flex flex-row justify-content-between align-items-center";
        col_ten.innerHTML = /* html */`
            <div>
              <h4 class="font-weight-bold textWrap"> File Name : ${fileContent.file_name}</h4>
              <h5 class="font-weight-bold">Type : ${fileContent.type}</h5>
            </div>
            
        `

        const div_button = document.createElement('div')
        const button = document.createElement('button')
        button.className = "remove_btn";
        button.innerHTML =  /* html */ `
            <svg  focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="fill: currentColor;
                   width: 1em;
                   height: 1em;
                   display: inline-block;
                   font-size: 3.4rem;
                   transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                   flex-shrink: 0;
                   user-select: none;
                ">
                    <path
                      d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z">
                    </path>
           </svg>
        `
        div_button.appendChild(button)
        col_ten.appendChild(div_button)
        button.addEventListener('click', () => {
          if(Object.keys(self.slide_data).length === 2){
            // if only single file is selected and the same file is being removed
            self.resetUploadFunctionality()
          }else{
            // if multiple files are selected and one of them being removed
            summary_row.remove()
            const index = self.slide_data['create_slide'].indexOf(fileId);
            if (index > -1) {
              self.slide_data['create_slide'].splice(index, 1);
            }

              delete self.slide_data[fileId]

              // Removing tab-pane from DOM if file is removed
              let removeTab_attr = `[slide-tagname='${fileId}']`
              let tab_pane = self.shadowRoot.querySelector(removeTab_attr)
              if (tab_pane) {
                tab_pane.remove()
              }

              //Removing row form table from first slide
              let removeRow = `[file-name='${fileId}']`
              let row = self.shadowRoot.querySelector(removeRow)
              if (row) {
                row.remove()
              }

              // Setting total no. of slides
              if (self.slide_data['create_slide']) {
                self.totalSlides = 1 + self.slide_data['create_slide'].length
                self.currentTab = self.totalSlides
              }
          }
        })
        summary_row.appendChild(col_ten)
        div.appendChild(summary_row)
  }

  endPoint_uploadFile(){
    const self = this;
    self.endUpload= [];
        for(const fileId in self.slide_data){
          if(fileId !== 'create_slide'){
            const slideDataObj = self.slide_data[fileId]
            const uploadFileObj = self.uploadFiles.filter((obj) => obj.unique_id === fileId)[0];
            const requiredObj = {}
            requiredObj['type'] = slideDataObj.type;
            requiredObj['fileName'] = slideDataObj.file_name;
            requiredObj['size'] = slideDataObj.size;
            requiredObj['contents'] = uploadFileObj.contents;
            if(slideDataObj && slideDataObj.hasOwnProperty('schema_values')){
              requiredObj['usermeta'] = slideDataObj.schema_values
            }
            self.endUpload.push(requiredObj)
          }
        }

        const uploadEvent = new CustomEvent("end-upload", {
          bubbles: true,
          composed: true,
          detail: { 'uploadData' : self.endUpload}
        })
        window.dispatchEvent(uploadEvent)
        setTimeout(() => {
          self.resetUploadFunctionality()
        },500)

  }

  activeUploads(){
    const self = this;
    self.tbody_active_uploads.innerHTML = ""
    if(self.uploadQueue.queue.length > 0){
      self.uploadQueue.queue.forEach((file) => {
        const row = self.createActiveUploadrow(file);
        self.tbody_active_uploads.appendChild(row);
      })
    } 
  }

  createActiveUploadrow = (file) => {
    const self = this;
    const row = document.createElement('tr');
    row.setAttribute("queue-fileId", file.fileName)

    // Name column
    const nameCell = document.createElement('td');
    nameCell.style.wordBreak = "break-all"
    nameCell.textContent = file.fileName;
    row.appendChild(nameCell);

    // Size column
    const sizeCell = document.createElement('td');
    const loaded = file.hasOwnProperty('loaded') ? self.formatSize(file.loaded, false) : 0
    const total = file.hasOwnProperty('total') ? self.formatSize(file.total, true) : 0
    sizeCell.textContent = `${loaded}/${total}`
    row.appendChild(sizeCell);
    
    // Progress bar column
    const progressCell = document.createElement('td')
    progressCell.innerHTML = /* html */ `
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${file.percentage || 0}%" aria-valuenow="${file.percentage || 0}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    `
    row.appendChild(progressCell)

    return row;
  }

  resetUploadFunctionality(){
    const self = this;
    self.nextButton.textContent = "NEXT"
    let summary_tag = `[slide-tagname="file-summary"]`
    let check_summarySlide = self.shadowRoot.querySelector(summary_tag)
    if(check_summarySlide){
      check_summarySlide.remove()
    }
    for(let fileId in self.slide_data){
      if(fileId === 'create_slide'){
        delete self.slide_data.create_slide
      }else{
        const index = self.slide_data['create_slide'] && self.slide_data['create_slide'].indexOf(fileId);
            if (index > -1) {
              self.slide_data['create_slide'].splice(index, 1);
            }
            
            // Removing tab-pane from DOM if file is removed
            let removeTab_attr = `[slide-tagname='${fileId}']`
            let tab_pane = self.shadowRoot.querySelector(removeTab_attr)
            if (tab_pane) {
              tab_pane.remove()
            }
  
            //Removing row form table from first slide
            let removeRow = `[file-name='${fileId}']`
            let row = self.shadowRoot.querySelector(removeRow)
            if (row) {
              row.remove()
            }

            delete self.slide_data[fileId]
  
            // Setting total no. of slides
            self.totalSlides = 1
            self.currentTab = 0
            self.updateWizard();
      }
    }
    self.slide_data = {}
    self.uploadFiles = []
    self.table_file_List.classList.add('d-none');
    self.addRmv_nextBtn()
    self.enableNextButton()

  }
}

customElements.define("cwe-fwiz", FileUploadWizard);

//External functions...




