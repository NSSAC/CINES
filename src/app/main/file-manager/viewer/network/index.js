import { Button, IconButton, Menu, MenuItem, Select, Tab, Tabs } from '@material-ui/core';
import { ArrowDropDown, AspectRatio } from "@material-ui/icons";
import cytoscape from "cytoscape";
import avsdf from "cytoscape-avsdf";
import cola from "cytoscape-cola";
import cose from "cytoscape-cose-bilkent";
import dagre from "cytoscape-dagre";
import euler from "cytoscape-euler";
import klay from "cytoscape-klay"
import spread from "cytoscape-spread";
import React, { useRef, useState } from 'react';
import { GithubPicker as ColorPicker } from 'react-color';
import CytoscapeComponent from 'react-cytoscapejs';
import { useDispatch, useSelector } from "react-redux";

import FileOverviewPanel from "app/main/file-manager/panel/FileOverviewPanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
import withReducer from "app/store/withReducer";

import { MAX_RAW_FILE_VIEW_SIZE } from "../../FileManagerAppConfig"
import * as Actions from "./store/actions";
import reducer from "./store/reducers";

cytoscape.use(euler)
cytoscape.use(cola)
cytoscape.use(dagre)
cytoscape.use(avsdf)
cytoscape.use(cose)
cytoscape.use(spread)
cytoscape.use(klay)

const default_layouts = {
    "cola": {
        animate: false, // whether to show the layout as it's running
        refresh: 1, // number of ticks per frame; higher is faster but more jerky
        maxSimulationTime: 4000, // max length in ms to run the layout
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
        // positioning options
        randomize: false, // use random node positions at beginning of layout
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        handleDisconnected: true, // if true, avoids disconnected components from overlapping
        convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
        nodeSpacing: function( node ){ return 10; }, // extra spacing around nodes
        flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
        alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
        gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
      
        // different methods of specifying edge length
        // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
        edgeLength: undefined, // sets edge length directly in simulation
        edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
        edgeJaccardLength: undefined, // jaccard edge length in simulation
      
        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: undefined, // unconstrained initial layout iterations
        userConstIter: undefined, // initial layout iterations with user-specified constraints
        allConstIter: undefined,
    },
    "euler": {
        name: 'euler',
      
        // The ideal length of a spring
        // - This acts as a hint for the edge length
        // - The edge length can be longer or shorter if the forces are set to extreme values
        springLength: edge => 80,
      
        // Hooke's law coefficient
        // - The value ranges on [0, 1]
        // - Lower values give looser springs
        // - Higher values give tighter springs
        springCoeff: edge => 0.0008,
      
        // The mass of the node in the physics simulation
        // - The mass affects the gravity node repulsion/attraction
        mass: node => 4,
      
        // Coulomb's law coefficient
        // - Makes the nodes repel each other for negative values
        // - Makes the nodes attract each other for positive values
        gravity: -1.2,
      
        // A force that pulls nodes towards the origin (0, 0)
        // Higher values keep the components less spread out
        pull: 0.001,
      
        // Theta coefficient from Barnes-Hut simulation
        // - Value ranges on [0, 1]
        // - Performance is better with smaller values
        // - Very small values may not create enough force to give a good result
        theta: 0.666,
      
        // Friction / drag coefficient to make the system stabilise over time
        dragCoeff: 0.02,
      
        // When the total of the squared position deltas is less than this value, the simulation ends
        movementThreshold: 1,
      
        // The amount of time passed per tick
        // - Larger values result in faster runtimes but might spread things out too far
        // - Smaller values produce more accurate results
        timeStep: 20,
      
        // The number of ticks per frame for animate:true
        // - A larger value reduces rendering cost but can be jerky
        // - A smaller value increases rendering cost but is smoother
        refresh: 10,
      
        // Whether to animate the layout
        // - true : Animate while the layout is running
        // - false : Just show the end result
        // - 'end' : Animate directly to the end result
        animate: false, // whether to show the layout as it's running
      
        // Animation duration used for animate:'end'
        animationDuration: undefined,
      
        // Easing for animate:'end'
        animationEasing: undefined,
      
        // Maximum iterations and time (in ms) before the layout will bail out
        // - A large value may allow for a better result
        // - A small value may make the layout end prematurely
        // - The layout may stop before this if it has settled
        maxIterations: 1000,
        maxSimulationTime: 4000,
      
        // Prevent the user grabbing nodes during the layout (usually with animate:true)
        ungrabifyWhileSimulating: false,
      
        // Whether to fit the viewport to the repositioned graph
        // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
        fit: true,
      
        // Padding in rendered co-ordinates around the layout
        padding: 30,
      
        // Constrain layout bounds with one of
        // - { x1, y1, x2, y2 }
        // - { x1, y1, w, h }
        // - undefined / null : Unconstrained
        boundingBox: undefined,
      
        // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
        ready: function(){}, // on layoutready
        stop: function(){}, // on layoutstop
      
        // Whether to randomize the initial positions of the nodes
        // true : Use random positions within the bounding box
        // false : Use the current node positions as the initial positions
        randomize: false
      },
      "dagre": {
        // dagre algo options, uses default value on undefined
        nodeSep: undefined, // the separation between adjacent nodes in the same rank
        edgeSep: undefined, // the separation between adjacent edges in the same rank
        rankSep: undefined, // the separation between each rank in the layout
        rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
        ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
        minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
        edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges
      
        // general layout options
        fit: true, // whether to fit to viewport
        padding: 30, // fit padding
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
        animate: false, // whether to show the layout as it's running
        animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
        ready: function(){}, // on layoutready
        stop: function(){} // on layoutstop
      },
      "avsdf": {
        // Called on `layoutready`
        ready: function () {
        },
        // Called on `layoutstop`
        stop: function () {
        },
        // number of ticks per frame; higher is faster but more jerky
        refresh: 30,
        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 10,
        // Prevent the user grabbing nodes during the layout (usually with animate:true)
        ungrabifyWhileSimulating: false,
        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',
        // Duration for animate:end
        animationDuration: 500,   
        // How apart the nodes are
        nodeSeparation: 60
    },
    "cose": {
        name: 'cose',
        animate: false, // whether to show the layout as it's running

        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
    },
    "cose-bilkent":{
        // Called on `layoutready`
        ready: function () {
        },
        // Called on `layoutstop`
        stop: function () {
        },
        // 'draft', 'default' or 'proof" 
        // - 'draft' fast cooling rate 
        // - 'default' moderate cooling rate 
        // - "proof" slow cooling rate
        quality: 'default',
        // Whether to include labels in node dimensions. Useful for avoiding label overlap

        nodeDimensionsIncludeLabels: false,
        // number of ticks per frame; higher is faster but more jerky
        refresh: 30,
        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 10,
        // Whether to enable incremental mode
        randomize: true,
        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 4500,
        // Ideal (intra-graph) edge length
        idealEdgeLength: 50,
        // Divisor to compute edge forces
        edgeElasticity: 0.45,
        // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
        nestingFactor: 0.1,
        // Gravity force (constant)
        gravity: 0.25,
        // Maximum number of iterations to perform
        numIter: 2500,
        // Whether to tile disconnected nodes
        tile: true,
        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',
        // Duration for animate:end
        animationDuration: 500,
        // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingVertical: 10,
        // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingHorizontal: 10,
        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8,
        // Initial cooling factor for incremental layout
        initialEnergyOnIncremental: 0.5
      },
      "spread": {
        animate: false, // Whether to show the layout as it's running
        ready: undefined, // Callback on layoutready
        stop: undefined, // Callback on layoutstop
        fit: true, // Reset viewport to fit default simulationBounds
        minDist: 20, // Minimum distance between nodes
        padding: 20, // Padding
        expandingFactor: -1.0, // If the network does not satisfy the minDist
        // criterium then it expands the network of this amount
        // If it is set to -1.0 the amount of expansion is automatically
        // calculated based on the minDist, the aspect ratio and the
        // number of nodes
        prelayout: { name: 'cose' }, // Layout options for the first phase
        maxExpandIterations: 4, // Maximum number of expanding iterations
        boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        randomize: false // Uses random initial node positions on true
    },
    "klay": {
        nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
        fit: true, // Whether to fit
        padding: 20, // Padding on fit
        animate: false, // whether to show the layout as it's running
        animateFilter: function( node, i ){ return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
        animationDuration: 500, // Duration of animation in ms if enabled
        animationEasing: undefined, // Easing of animation if enabled
        transform: function( node, pos ){ return pos; }, // A function that applies a transform to the final node position
        ready: undefined, // Callback on layoutready
        stop: undefined, // Callback on layoutstop
        klay: {
          // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
          addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
          aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
          borderSpacing: 20, // Minimal amount of space to be left to the border
          compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
          crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
          /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
          INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
          cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
          /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
          INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
          direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
          /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
          edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
          edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
          feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
          fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
          /* NONE Chooses the smallest layout from the four possible candidates.
          LEFTUP Chooses the left-up candidate from the four possible candidates.
          RIGHTUP Chooses the right-up candidate from the four possible candidates.
          LEFTDOWN Chooses the left-down candidate from the four possible candidates.
          RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
          BALANCED Creates a balanced layout from the four possible candidates. */
          inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
          layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
          linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
          mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
          mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
          nodeLayering:'NETWORK_SIMPLEX', // Strategy for node layering.
          /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
          LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
          INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
          nodePlacement:'BRANDES_KOEPF', // Strategy for Node Placement
          /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
          LINEAR_SEGMENTS Computes a balanced placement.
          INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
          SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
          randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
          routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
          separateConnectedComponents: true, // Whether each connected component should be processed separately
          spacing: 20, // Overall setting for the minimal amount of space to be left between objects
          thoroughness: 7 // How much effort should be spent to produce a nice layout..
        },
        priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
    },
    "grid": {},
    "circle": {},
    "concentric": {
        name: 'concentric',
        concentric: function( node ){
          return node.degree();
        },
        levelWidth: function( nodes ){
          return 2;
        }
    },
    "random": {}
}

function NetworkViewer(props) {
    const dispatch = useDispatch();
    const data = useSelector(({ NetworkViewerApp }) => NetworkViewerApp.network);
    const raw_data = useSelector(({NetworkViewerApp}) => NetworkViewerApp.data);

    const [selectedTab, setSelectedTab] = useState(0);
    // const [cy,setCy] = useState()
    const cy = useRef()

    const cyNodeRef = useRef()
    const fullComponentRef = useRef()
    const toolbarRef = useRef()
    const tabBarRef = useRef()
    const [layout,setLayout] = useState()
    const [layoutID, setLayoutID] = useState("concentric")

    const [nodeColorPickerEl, setNodeColorPickerEl] = React.useState(null);
    const [showNodeColorPicker,setShowNodeColorPicker] = useState(false)
    const [nodeColor,setNodeColor]=useState("#1894f8")
    
    const [edgeColorPickerEl, setEdgeColorPickerEl] = React.useState(null);
    const [showEdgeColorPicker,setShowEdgeColorPicker] = useState(false)
    const [edgeColor,setEdgeColor]=useState("#00d084")

    const [maxFileSize] = useState(props.max_file_size || MAX_RAW_FILE_VIEW_SIZE)
    const [enableFileView,setEnableFileView] = useState(false)

    const [maxNetworkSize] = useState(130000)
    const [enableDynamicVisualization,setEnableDynamicVisualization] = useState(false)

    React.useEffect(()=>{
        if (props.meta &&  ((props.meta.state==="staged") || (props.meta.state==="stored")) && (props.meta.size<maxFileSize)  ){
            setEnableFileView(true)
        }else{
            setEnableFileView(false)
        }
    },[props.meta,maxFileSize])

    React.useEffect(()=>{
        if (!props.meta || !props.meta.autometa){
            return
        }
 
        const networkSize = props.meta.autometa.numNodes + props.meta.autometa.numEdges
        if (!networkSize || (typeof networkSize !== "number")){
            return
        }
        if (enableFileView && props.meta &&  (props.meta.state==="stored") && (networkSize<maxNetworkSize)  ){
            setEnableDynamicVisualization(true)
        }else{
            setEnableDynamicVisualization(false)
        }
    },[props.meta,maxNetworkSize,enableFileView])

    React.useEffect(() =>{
        dispatch(Actions.getData(props.meta.id))
    },[dispatch,props.meta])

    const default_style = [
        {
            selector: "node", 
            style: {
                'background-color': nodeColor,
                'label': 'data(id)',
                width: function(ele){ return ele.degree()*3.5; },
                height: function(ele){ return ele.degree()*3.5; }
            }
        },
        {selector: 'edge', style: {
                width: 1, 
                'line-color': edgeColor,
            }
        }
    ]

    if (props && props.meta && props.meta.autometa && props.meta.autometa.edgeDirectionality && props.meta.autometa.edgeDirectionality==="directed"){
        default_style[1] = {
            ...default_style[1],
            style: {
                ...default_style[1].style,
                'target-arrow-color': edgeColor,
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
            }
        }
    }

    React.useEffect(() =>{
        setLayout({
            ...default_layouts[layoutID],
            name: layoutID
        })
    },[layoutID]);

    React.useEffect(() =>{
        if (raw_data){
            dispatch(Actions.transformNetwork(raw_data))
        }
    },[dispatch,raw_data])

    function handleResize(){
        if ((selectedTab === 4) && cy && cy.current){
            cy.current.resize()
            cy.current.fit()
        }
    }

    React.useEffect(()=>{
        window.addEventListener('resize', handleResize)

        return ()=>{
            window.removeEventListener('resize', handleResize)
        }
    })

    // React.useEffect(()=>{
    //     if (cy && cy.current){
    //         console.log("connect to tap event")
    //         cy.current.on('tap','node', function(){
    //             console.log("on select Node")
    //         })            
    //     }


    // },[cy])

    function handleTabChange(event, value) {
        setSelectedTab(value);
    }

    function toggleNodeColorPicker(evt){
        setNodeColorPickerEl(evt.currentTarget)
        setShowNodeColorPicker(!showNodeColorPicker)
    }

    function toggleEdgeColorPicker(evt){
        setEdgeColorPickerEl(evt.currentTarget)
        setShowEdgeColorPicker(!showEdgeColorPicker)
    }

    return (
        <div ref={fullComponentRef} className="flex flex-col overflow-hidden h-full">
            <div ref={tabBarRef}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="standard"
                    className="m-8"
                >
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Overview"
                        label="Overview"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className={`${enableFileView?'':'hidden'} min-w-0`}
                        title="Data"
                        label="Data"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Metadata"
                        label="Metadata"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Provenance"
                        label="Provenance"

                    />

                    <Tab
                        className={`${enableDynamicVisualization?'':'hidden'} min-w-0`}
                        // icon={<MetadataIcon alt="JSON Original" />}
                        title="Visualization"
                        label="Visualization"
                    />
                </Tabs>
            </div>
            {selectedTab === 1 && <div className={`${enableFileView?'':'hidden'} p-4 overflow-auto flex-grow`}><pre>{raw_data}</pre></div>}
            {selectedTab === 0 && <div className="p-4 overflow-auto flex-grow"><FileOverviewPanel meta={props.meta}/></div>}
            {selectedTab === 2 && <div className="p-4 overflow-auto flex-grow"><MetadataPanel item container xs={12} sm={8} md={5} lg={3} meta={props.meta}/></div>}
            {selectedTab === 3 && <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>}
            {selectedTab === 4 && (
                <React.Fragment>
                    <div ref={toolbarRef} className={`${enableDynamicVisualization?'':'hidden'} text-right align-right p-0 overflow-hidden flex-none`}>
                        <IconButton className="mr-4 ml-4" onClick={()=>{ cy.current.fit() }}><AspectRatio /></IconButton>
                        <Button style={{background: nodeColor}} className="mr-4 ml-4" onClick={toggleNodeColorPicker} endIcon={<ArrowDropDown />}>Node Color</Button>

                        {showNodeColorPicker && (
                                  <Menu
                                  id="fade-menu"
                                  MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                  }}
                                  anchorEl={nodeColorPickerEl}
                                  open={showNodeColorPicker}
                                  onClose={toggleNodeColorPicker}
                                //   TransitionComponent={Fade}
                                >
                                    <ColorPicker triangle="none"  color={nodeColor} onChangeComplete={(val)=>{  setNodeColor(val.hex);}}/>
                                </Menu>

                        )}

                        <Button style={{background: edgeColor}} className="mr-4 ml-4" onClick={toggleEdgeColorPicker} endIcon={<ArrowDropDown />}>Edge Color</Button>

                        {showEdgeColorPicker && (
                                <Menu
                                id="fade-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                }}
                                anchorEl={edgeColorPickerEl}
                                open={showEdgeColorPicker}
                                onClose={toggleEdgeColorPicker}
                                //   TransitionComponent={Fade}
                                >
                                    <ColorPicker triangle="none" className="border-0 "  color={nodeColor} onChangeComplete={(val)=>{ setEdgeColor(val.hex);}}/>
                                </Menu>

                        )}

                        Layout Method: <Select
                        value={layoutID}
                        label="Layout Method"
                        onChange={(evt)=> {setLayoutID(evt.target.value)}}
                        >
                        {Object.keys(default_layouts).map((id,idx)=>{
                            return <MenuItem key={idx} value={id}>{id.toUpperCase()}</MenuItem>
                        })}
                        </Select>   
                    </div>
                    <div ref={cyNodeRef} className={`${enableDynamicVisualization?'':'hidden'} p-2 flex-grow overflow-hidden`} >
                         {data && (<CytoscapeComponent  cy={(lcy)=>{cy.current=lcy}} elements={data} layout={layout} stylesheet={default_style} className="w-full h-full border border-gray-400  bg-white" />)}
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default withReducer("NetworkViewerApp", reducer)(NetworkViewer);