export const TRANSFORM_NETWORK = '[NetworkViewerApp] TRANSFORM_NETWORK';

export function transformNetwork(raw_data) {

    const _transformNetwork = (dispatch, data) => {
        // console.log("_transformNetwork", data)
        const worker = new window.Worker('./transformer_worker.js',{type: "module"})
        worker.postMessage({ type: "transform_network", payload: data });
        worker.onerror = (err) => err;
        worker.onmessage = (e) => {
            const { type, payload } = e.data;
            // console.log("reponse type: ", type, " rdata: ", payload, "e: ", e)
            if (type==="transformed_network"){
                dispatch({
                    type: TRANSFORM_NETWORK,
                    payload: payload
                })
            }else{
                console.log(`Unknown message type: ${type}`)
            }
            
            worker.terminate();
        };
    };

    return (dispatch) => {

        _transformNetwork(dispatch, raw_data)
    }
}
