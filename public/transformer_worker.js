import cytoscape from "./cytoscape.esm.min.js"

function transformNetwork(raw_data){
    var nodes={}
    var edges=[]
    var lines = raw_data.split("\n")
    var data = lines.filter((line)=>{
        var trimmed=line.trim()
        return (trimmed !== "" && trimmed[0]!=="#")
    }).forEach((line,idx)=>{
        var parts = line.split(/\s+/)
        if (parts.length>1){
            const src = parts[0].trim()
            const tg = parts[1].trim()
            edges.push({
                data: {
                    id: `e${idx}`,
                    source: src,
                    target: tg
                }
            })
            if (!nodes[src]){
                nodes[src]={data: {id: src, label: src}}
            }

            if (!nodes[tg]){
                nodes[tg]={data: {id: tg, label: tg}}
            }
        }
    })
    nodes = Object.keys(nodes).map((n)=>{
        return nodes[n]
    })

    return nodes.concat(edges)
}

function generateVis(graph){

}

onmessage = (msg) => {
    const { type, payload } = msg.data;
    switch (type) {
        case "transform_network":
            postMessage({type: "transformed_network", payload: transformNetwork(payload)})
            break;
        case "generate_graph_vis": 
            postMessage({type: "image", payload: generateVis(payload)})
            break;
        default:
            console.log("Unknown Message type in worker")
    }
};