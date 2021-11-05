export const modelJSON = {
    "description": "Simulator of contagion dynamics on networks",
    "models": {
        "threshold_model": {
            "states": [
                "0",
                "1"
            ],
            "default_state": "0",
            "blocking_states": ["2"],
            "rules": [
                {
                    "input": {
                        "deterministic_progressive_blocking_node_threshold_value": {
                            "type": "integer",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "node",
                            "label": "Node threshold value",
                            "description": "Deterministic progressive blocking node threshold value",
                            "minimum": 0
                        }
                    },
                    "rule": {
                        "node": "all",
                        "from_state": "0",
                        "to_state": "1",
                        "cause": [
                            "1"
                        ],
                        "rule": "deterministic_progressive_blocking_node_threshold"
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
                    "rules": [
                        {
                            "input": {
                                "edge_probability_value": {
                                    "type": "number",
                                    "description": "Edge probability value",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "minimum": 0,
                                    "maximum": 1
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
                                "discrete_time_auto_value": {
                                    "type": "integer",
                                    "label": "Exposed duration",
                                    "description": "Time spent in exposed state (E)",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "exclusiveMinimum": 0
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "E",
                                "to_state": "I",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
                            }
                        },
                        {
                            "input": {
                                "discrete_time_auto_value": {
                                    "type": "integer",
                                    "label": "Infectious duration",
                                    "description": "Time spent in infectious state (I)",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "exclusiveMinimum": 0
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "I",
                                "to_state": "R",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
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
                    "rules": [
                        {
                            "input": {
                                "edge_probability_value": {
                                    "type": "number",
                                    "description": "Edge probability value",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "minimum": 0,
                                    "maximum": 1
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
                                "discrete_time_auto_value": {
                                    "type": "integer",
                                    "label": "Exposed duration",
                                    "description": "Time spent in exposed state (E)",
                                    "exclusiveMinimum": 0,
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node"
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "E",
                                "to_state": "I",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
                            }
                        },
                        {
                            "input": {
                                "node_probability_auto_value": {
                                    "type": "number",
                                    "label": "Infectious probability transition",
                                    "description": "Probability to transition out of infectious state (I) per timestep",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "I",
                                "to_state": "R",
                                "cause": "auto",
                                "rule": "node_probability_auto"
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
                    "rules": [
                        {
                            "input": {
                                "edge_probability_value": {
                                    "type": "number",
                                    "description": "Edge probability value",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "minimum": 0,
                                    "maximum": 1
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
                                "node_probability_auto_value": {
                                    "type": "number",
                                    "label": "Exposed probability transition",
                                    "description": "Probability to transition out of exposed state (E) per timestep",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "E",
                                "to_state": "I",
                                "cause": "auto",
                                "rule": "node_probability_auto"
                            }
                        },
                        {
                            "input": {
                                "discrete_time_auto_value": {
                                    "type": "integer",
                                    "label": "Infectious duration",
                                    "description": "Time spent in infectious state (I)",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "exclusiveMinimum": 0
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "I",
                                "to_state": "R",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
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
                    "rules": [
                        {
                            "input": {
                                "edge_probability_value": {
                                    "type": "number",
                                    "description": "Edge probability value",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "minimum": 0,
                                    "maximum": 1
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
                                "node_probability_auto_value": {
                                    "type": "number",
                                    "label": "Exposed probability transition",
                                    "description": "Probability to transition out of exposed state (E) per timestep",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "E",
                                "to_state": "I",
                                "cause": "auto",
                                "rule": "node_probability_auto"
                            }
                        },
                        {
                            "input": {
                                "node_probability_auto_value": {
                                    "type": "number",
                                    "label": "Infectious probability transition",
                                    "description": "Probability to transition out of infectious state (I) per timestep",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "I",
                                "to_state": "R",
                                "cause": "auto",
                                "rule": "node_probability_auto"
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
                    "rules": [
                        {
                            "input": {
                                "edge_probability_value": {
                                    "type": "number",
                                    "description": "Edge probability value",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "minimum": 0,
                                    "maximum": 1
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
                                "discrete_time_auto_value": {
                                    "type": "integer",
                                    "label": "Infectious duration",
                                    "description": "Time spent in infectious state (I)",
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "node",
                                    "exclusiveMinimum": 0
                                }
                            },
                            "rule": {
                                "node": "all",
                                "from_state": "I",
                                "to_state": "R",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
                            }
                        }
                    ]
                }
            }
        }
    }
}

export default modelJSON