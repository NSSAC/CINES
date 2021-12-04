
class FileManagerService {

    getFilesConfig = (path) => {
        var token = localStorage.getItem('id_token')

        if(typeof(token) == "string") {
            var config = {
              method: 'get',
              url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${path}`,
              headers: { 
                'Accept': '*/*',
                'Authorization': token
              }
            };
          }
      
          if(typeof(token) == "object") {
            config = {
              method: 'get',
              url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${path}`,
              headers: { 
                'Accept': '*/*',
              }
           };
        }
        return config
    }

    metaDataConfig = (targetMeta) => {
        let config = {}
        var token = localStorage.getItem('id_token')

        if (typeof token === "string") {
            config = {
                method: "get",
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetMeta}`,
                headers: {
                    Accept: "*/*",
                    Authorization: token,
                },
            };
        } else {
            config = {
                method: "get",
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetMeta}`,
                headers: {
                    Accept: "*/*",
                },
            };
        }
        return config;
    }

    editUsermetaConfig = (path, name, data) => {
        var token = localStorage.getItem('id_token')

        let config = {
            method: 'patch',
            /* eslint-disable-next-line */
            url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${path}` + `${name}`,
            headers: {
                'Content-Type': 'application/json-patch+json',
                'Authorization': token
            },
            data: data
        }
        return config;
    }

    downloadConfig = (id) => {
        let config = {}
        var token = localStorage.getItem('id_token')

        if (typeof (token) === 'string') {
            config = {
                method: 'get',
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
                headers: {
                    'Accept': 'application/octet-stream',
                    'Authorization': token
                },
                responseType: 'blob'
            }
        }
        else {
            config = {
                method: 'get',
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
                headers: {
                    'Accept': 'application/octet-stream',
                    'Authorization': token
                },
                responseType: 'blob'
            }
        }
        return config;
    }

    previewConfig = (id, type) => {
        let config = {}
        var token = localStorage.getItem('id_token')

        if (typeof (token) === "string" && (type === "pdf" || type === "png" || type === "jpeg" || type === "jpg" || type === "excel" || type === "mp3" || type === "mp4")) {
            config = {
                method: 'get',
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
                headers: {
                    'Accept': 'application/octet-stream',
                    'Authorization': token
                },
                responseType: 'arraybuffer'
            };
        }

        else if (typeof (token) == "string") {
            config = {
                method: 'get',
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
                headers: {
                    'Accept': 'application/octet-stream',
                    'Authorization': token
                },
            };
        }

        else if (typeof (token) == "object") {
            config = {
                method: 'get',
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${id}`,
                headers: {
                    'Accept': 'application/octet-stream'
                }
            };
        }
        return config;
    }
}

const FMInstance = new FileManagerService();

export default FMInstance;