export default {
    group_config: [
        { group: "default", "label": "General", "field_order": ["numNodes", "numEdges", "edgeDirectionality", "sourceNodeIdColumn", "destinationNodeIdColumn", "isEdgeAttributed", "isNodeAttributed", "isWeaklyConnected"] },
        { group: "File Format", "field_order": ['sourceNodeIdColumn','destinationNodeIdColumn']},
        { group: "Node Degree" },
        { group: "Strongly Connected Components","field_order": ["numSccComponents","sizeSmallestScc","numSccComponentsSmallestSize","fracSmallestScc", "sizeLargestScc","numSccComponentsLargestSize","fracLargestScc"]},
        { group: "Weakly Connected Components","field_order": ["numWccComponents","sizeSmallestWcc","numWccComponentsSmallestSize","fracSmallestWcc", "sizeLargestWcc","numWccComponentsLargestSize","fracLargestWcc"]},
        { group: "Node In Degree" },
        { group: "Node Out Degree" },
        { group: "Kcore", "field_order": ["smallestKcore","numNodesSmallestKcore","fracNodesSmallestKcore","largestKcore","numNodesLargestKcore","fracNodesLargestKcore"] },
        { group: "Node Betweenness Centrality"},
        { group: "Edge Betweenness Centrality"}
    ],
    field_config: [
        {
            "match": "estimatedGraphDiameter",
            "group": "default",
            "label": "Estimated Graph Diameter"
        },
        {
            "match": "edgeDirectionality",
            "group": "default",
            "label": "Edge Directionality"
        },
        {
            "match": "isWeaklyConnected",
            "group": "default",
            "label": "Weakly Connected",
            'formatter': (val)=>{
                if (typeof val === 'undefined'){
                    return '-'
                }else{
                    if (val) { return "TRUE"}
                    return "FALSE"
                }
            }
        },
        {
            "match": "(.*)EdgeBetweennessCentrality$",
            "group": "Edge Betweenness Centrality"
        },
        {
            "match": "(.*)NodeAuthorityScoreHits$",
            "group": "Node Authority Score Hits"
        },
        {
            "match": "(.*)NodeBetweennessCentrality$",
            "group": "Node Betweenness Centrality"
        },
        {
            "match": "(.*)NodeDegree$",
            "group": "Node Degree"
        },
        {
            "match": "(.*)NodeEigenvectorCentrality$",
            "group": "Node Eigenvector Centrality"
        },
        {
            "match": "(.*)NodeIdColumn",
            "group": "File Format",
            "label": (label,matches)=>{
                return `${matches.matches[1]} ID Column`
            }
        },
        {
            "match": "is(Edge|Node)Attributed",
            "group": "default",
            "label": (label,matches) =>{
        
                return `${matches.matches[1]} Attributed`
            },
            'formatter': (val)=>{
                return `${!!val?'TRUE':'FALSE'}`
            }
        },
        {
            "match": "(.*)NodeHubScoreHits$",
            "group": "Node Hub Score Hits"
        },
        {
            "match": "(.*)NodeInDegree$",
            "group": "Node In Degree"
        },
        {
            "match": "(.*)NodeOutDegree$",
            "group": "Node Out Degree"
        },
        {
            "match": "(.*)NodePageRank$",
            "group": "Node Page Rank"
        },
        {
            "match": "((num|frac)(Nodes)(Largest|Smallest)Kcore)",
            "group": "Kcore",
            label: (prop,matches)=>{
                return `${matches.matches[2]} ${matches.matches[3]} ${matches.matches[4]}`
            }
        },
        {
            "match": "(.*)Kcore$",
            "group": "Kcore"
        },
        {
            "match": "kcoreSize50percentNodes",
            "group": "Kcore",
            "label": "Kcore Size 50% Nodes"
        },
        {
            "match": "num(Edges|Nodes)$",
            "group": "default"
        },
        {
            "match": "numSccComponents$",
            "group": "Strongly Connected Components",
            "label": "num"
        },
        {
            "match": "numWccComponents$",
            "group": "Weakly Connected Components",
            "label": "num"
        },

        {
            "match": "((num)SccComponents(Largest|Smallest)Size)",
            "group": "Strongly Connected Components",
            "label": (prop, matches) => {
                return `${matches.matches[2]} ${matches.matches[3]}`
            }
        },
        {
            "match": "((num)WccComponents(Largest|Smallest)Size)",
            "group": "Weakly Connected Components",
            "label": (prop, matches) => {
                return `${matches.matches[2]} ${matches.matches[3]} Size`
            }
        },
        {
            "match": "((frac|num|size)(Largest|Smallest)Wcc)",
            "group": "Weakly Connected Components",
            "label": (prop,matches)=>{
                return `${matches.matches[2]} ${matches.matches[3]}`
            }
        },
        {
            "match": "((frac|num|size)(Largest|Smallest)Scc)",
            "group": "Strongly Connected Components",
            "label": (prop,matches)=>{
                return `${matches.matches[2]} ${matches.matches[3]}`
            }
        },


    ]
}