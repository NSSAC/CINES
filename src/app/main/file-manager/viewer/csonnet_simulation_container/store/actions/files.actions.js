import { FileService } from "node-sciduct";
import Papa from 'papaparse'

export const GET_FILES = '[csonnet_simulation_container] GET FILES';
export const GET_ANALYSIS_FILES = '[csonnet_simulation_container] GET ANALYSIS FILES';
export const GET_FILES_FAILED = '[csonnet_simulation_container] GET FILES FAILED';
export const GET_ANALYSIS_FILES_FAILED = '[csonnet_simulation_container] GET ANALYSIS FILES FAILED';
export const GET_OUTPUT_FILE = '[csonnet_simulation_container] GET OUTPUT FILE';
export const GET_OUTPUT_FILE_FAILED = '[csonnet_simulation_container] GET OUTPUT FILE FAILED';

function streamToString(stream) {
  return new Promise(resolve => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString()));
  });
}

export function getSimulationOutput(file){
  console.log("Get Simulation output: ", file)
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token||"")
  return (dispatch) =>{
    return filesvc.get(file.id).then((data)=>{
      streamToString(data).then((of)=>{
        // console.log("of: ", of)
        dispatch({
          type: GET_OUTPUT_FILE,
          payload: of
        });
      })
    })
    .catch(err=>{
      dispatch({
        type: GET_OUTPUT_FILE_FAILED,
        payload: err
      });
    })
  }
}

export function getAnalysisFiles(files){
  console.log("getAnalysisFiles: ", files)
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token||"")

  return (dispatch) =>{
    var defs = files.analysis.map((f)=>{
      console.log("Get File: ", f.id)
      return new Promise((resolve,reject)=>{
        return filesvc.get(f.id).then(data=>{
          Papa.parse(data, {
            delimiter: "",
            delimitersToGuess: [',', '\t', '|', ';',' ','  ', Papa.RECORD_SEP, Papa.UNIT_SEP],
            newline: "\n",
            comments: "#",
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (parsed)=>{
              f.contents = parsed;
              resolve(f)
            }
          });
        })
      })
    })
    Promise.all(defs).then(()=>{
      dispatch({
        type: GET_ANALYSIS_FILES,
        payload: files.analysis
      });
   })
   .catch((err)=>{
    console.log("Error retrieving analysis files: ", err)
    dispatch({
      type: GET_ANALYSIS_FILES_FAILED,
      payload: {
        error: err
      }
    })
});
  }
}
export function getFiles(path)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token||"")

  return (dispatch) =>
    filesvc.list(path).then((files) => {
      console.log("Files: ", files)
      var s = {"analysis": [],"other":[]}
      files.forEach((f)=>{
        // console.log("f: ", f)
        switch(f.type){
            case "csonnet_data_analysis":
              var matches = f.name.match("((.*)-(.*).analysis)$")
              // console.log("matches: ", matches)
              f.analysis_state = matches[2]
              f.analysis_type = matches[3]
              s.analysis.push(f)
              break;
            case "csonnet_simulation":
              s.output = f
              break;
            case "csonnet_initial_states":
              s.initial_states = f
              break;
            default:
              s.other.push(f)
        }
      })
      console.log("S: ", s)
      dispatch({
        type: GET_FILES,
        payload: s
      });
    })
    .catch((err)=>{
        console.log("Error retrieving files: ", err)
        dispatch({
          type: GET_FILES_FAILED,
          payload: {
            error: err
          }
        })
    });
}
