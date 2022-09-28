export const jobCategoryJSON = {
	"max_tasks_per_category": 5,
	"categories": [
		{
			"label": "Structural Analysis",
			"query": "eq(tags,structural_analysis)",
			"job_defs": [
				"development/nx_algorithms.approximation.steinertree.metric_closure",
				"net.science/snap_CntDegNodes",
                'net.science/snap_GetOutDegCnt',
                'net.science/snap_CommunityCNM',
                'net.science/snap_GetWccSzCnt',
                'net.science/snap_GetDegCnt',
                'net.science/snap_GetInDegCnt',
			]
		},
		{
			"label": "Network Generators",
			"query": "eq(tags,network_generators)",
			"job_defs": [
				"net.science/snap_GenRndGnm",
				"net.science/snap_GenPrefAttach",
                'net.science/snap_GetWccSzCnt',
			]
	
		},
		{
			"label": "Category 1 ",
			"query": "eq(tags,Category_1)",
			"job_defs": [
				"net.science/snap_GenRndGnm",
				"net.science/snap_GenPrefAttach"
			]
	
		}
		
	]
}

export default jobCategoryJSON