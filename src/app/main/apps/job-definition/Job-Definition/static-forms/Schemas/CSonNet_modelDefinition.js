export const modelJSON = {
	"description": "Simulator of contagion dynamics on networks",
	"models": {
		"threshold_model": {
			"states": [
				"S",
				"I"
			],
			"default_state": "S",
			"collect_random_seed": false,
			"rules": [
				{
					"input": {
						"threshold_value": {
							"type": "number",
							"label": "Threshold Value",
							"description": "Node threshold",
							"minimum": 0
						}
					},
					"rule": {
						"node": "all",
						"from_state": "S",
						"to_state": "I",
						"cause": [
							"I"
						],
						"rule": "threshold"
					}
				}
			]
		},
		"SEIR": {
			"submodels": {
				"fixed exposed fixed infectious": {
					"states": [
						"S",
						"E",
						"I",
						"R"
					],
					"default_state": "S",
					"collect_random_seed": true,
					"rules": [
						{
							"input": {
								"weight_probability_column_name": {
									"type": "string",
									"label": "Weight Column Name",
									"description": "Name of the column containing edge weight"
								}
							},
							"rule": {
								"node": "all",
								"from_state": "S",
								"to_state": "E",
								"cause": [
									"I"
								],
								"rule": "edge_probability"
							}
						},
						{
							"input": {
								"time_duration": {
									"type": "integer",
									"label": "Exposed Duration",
									"description": "Time spent in exposed state (E)",
									"exclusiveMinimum": 0
								}
							},
							"rule": {
								"node": "all",
								"from_state": "E",
								"to_state": "I",
								"cause": "auto",
								"rule": "discrete"
							}
						},
						{
							"input": {
								"time_duration": {
									"type": "integer",
									"label": "Infectious Duration",
									"description": "Time spent in infectious (I) state",
									"exclusiveMinimum": 0
								}
							},
							"rule": {
								"node": "all",
								"from_state": "I",
								"to_state": "R",
								"cause": "auto",
								"rule": "discrete"
							}
						}
					]
				},
				"fixed exposed stochastic infectious": {
					"states": [
						"S",
						"E",
						"I",
						"R"
					],
					"default_state": "S",
					"collect_random_seed": true,
					"rules": [
						{
							"input": {
								"weight_probability_column_name": {
									"type": "string",
									"label": "Weight Column Name",
									"description": "Name of the column containing edge weight"
								}
							},
							"rule": {
								"node": "all",
								"from_state": "S",
								"to_state": "E",
								"cause": [
									"I"
								],
								"rule": "edge_probability"
							}
						},
						{
							"input": {
								"time_duration": {
									"type": "integer",
									"label": "Exposed Duration",
									"description": "Time spent in exposed state (E)",
									"exclusiveMinimum": 0
								}
							},
							"rule": {
								"node": "all",
								"from_state": "E",
								"to_state": "I",
								"cause": "auto",
								"rule": "discrete"
							}
						},
						{
							"input": {
								"probability": {
									"type": "number",
									"label": "Infectious probability transition",
									"description": "Probability to transition out of infectious (I) state per timestep",
									"minimum": 0,
									"maximum": 1
								}
							},
							"rule": {
								"node": "all",
								"from_state": "I",
								"to_state": "R",
								"cause": "auto",
								"rule": "node_probability"
							}
						}
					]
				},
				"stochastic exposed fixed infectious": {
					"states": [
						"S",
						"E",
						"I",
						"R"
					],
					"default_state": "S",
					"collect_random_seed": true,
					"rules": [
						{
							"input": {
								"weight_probability_column_name": {
									"type": "string",
									"label": "Weight Column Name",
									"description": "Name of the column containing edge weight"
								}
							},
							"rule": {
								"node": "all",
								"from_state": "S",
								"to_state": "E",
								"cause": [
									"I"
								],
								"rule": "edge_probability"
							}
						},
						{
							"input": {
								"probability": {
									"type": "number",
									"label": "Exposed probability transition",
									"description": "Probability to transition out of exposed (E) state per timestep",
									"minimum": 0,
									"maximum": 1
								}
							},
							"rule": {
								"node": "all",
								"from_state": "E",
								"to_state": "I",
								"cause": "auto",
								"rule": "node_probability"
							}
						},
						{
							"input": {
								"time_duration": {
									"type": "integer",
									"label": "Infectious Duration",
									"description": "Time spent in infectious state (I)",
									"exclusiveMinimum": 0
								}
							},
							"rule": {
								"node": "all",
								"from_state": "I",
								"to_state": "R",
								"cause": "auto",
								"rule": "discrete"
							}
						}
					]
				},
				"stochastic exposed stochastic infectious": {
					"states": [
						"S",
						"E",
						"I",
						"R"
					],
					"default_state": "S",
					"collect_random_seed": true,
					"rules": [
						{
							"input": {
								"weight_probability_column_name": {
									"type": "string",
									"label": "Weight Column Name",
									"description": "Name of the column containing edge weight"
								}
							},
							"rule": {
								"node": "all",
								"from_state": "S",
								"to_state": "E",
								"cause": [
									"I"
								],
								"rule": "edge_probability"
							}
						},
						{
							"input": {
								"probability": {
									"type": "number",
									"label": "Exposed probability transition",
									"description": "Probability to transition out of exposed (E) state per timestep",
									"minimum": 0,
									"maximum": 1
								}
							},
							"rule": {
								"node": "all",
								"from_state": "E",
								"to_state": "I",
								"cause": "auto",
								"rule": "node_probability"
							}
						},
						{
							"input": {
								"probability": {
									"type": "number",
									"label": "Infectious probability transition",
									"description": "Probability to transition out of infectious (I) state per timestep",
									"minimum": 0,
									"maximum": 1
								}
							},
							"rule": {
								"node": "all",
								"from_state": "I",
								"to_state": "R",
								"cause": "auto",
								"rule": "node_probability"
							}
						}
					]
				}
			}
		},
		"SIR": {
			"submodels": {
				"fixed infectious": {
					"states": [
						"S",
						"I",
						"R"
					],
					"default_state": "S",
					"collect_random_seed": true,
					"rules": [
						{
							"input": {
								"weight_probability_column_name": {
									"type": "string",
									"label": "Weight Column Name",
									"description": "Name of the column containing edge weight"
								}
							},
							"rule": {
								"node": "all",
								"from_state": "S",
								"to_state": "I",
								"cause": [
									"I"
								],
								"rule": "edge_probability"
							}
						},
						{
							"input": {
								"time_duration": {
									"type": "integer",
									"label": "Infectious Duration",
									"description": "Time spent in infectious state (I)",
									"exclusiveMinimum": 0
								}
							},
							"rule": {
								"node": "all",
								"from_state": "I",
								"to_state": "R",
								"cause": "auto",
								"rule": "discrete"
							}
						}
					]
				}
			}
		}
	}
}