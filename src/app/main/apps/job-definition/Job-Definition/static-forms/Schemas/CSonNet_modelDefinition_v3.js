export const modelJSON = {
    "description": "Simulator of contagion dynamics on networks",
    "models": {
        "Threshold":{
            "submodels" : {
                "Absolute threshold models": {
                    "submodels" : {
                        "Deterministic absolute models": {
                            "submodels": {
                                "Deterministic progressive absolute threshold": {
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
                                }
                            }
                        },
                        "Stochastic absolute models": {
                            "submodels": {
                                "Stochastic progressive absolute threshold model": {
                                    "states": [
                                        "0",
                                        "1"
                                    ],
                                    "default_state": "0",
                                    "blocking_states": ["2"],
                                    "rules": [
                                        {
                                            "input": {
                                                "node_threshold_value": {
                                                    "type": "integer",
                                                    "data_sources": [
                                                        "fixed"
                                                    ],
                                                    "network_element": "node",
                                                    "label": "Node threshold value",
                                                    "description": "Stochastic progressive node threshold value >= 0.",
                                                    "minimum": 0
                                                },
                                                "node_probability_auto_value": {
                                                    "type": "number",
                                                    "label": "Activation probability transition",
                                                    "description": "Probability to transition to state 1 per timestep",
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
                                                "from_state": "0",
                                                "to_state": "1",
                                                "cause": [
                                                    "1"
                                                ],
                                                "rule": "stochastic_progressive_node_threshold"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                "Relative threshold models": {
                    "submodels" : {
                        "Deterministic relative models": {
                            "submodels": {
                                "Deterministic progressive relative threshold model": {
                                    "states": [
                                        "0",
                                        "1"
                                    ],
                                    "default_state": "0",
                                    "rules": [
                                        {
                                            "input": {
                                                "deterministic_relative_node_threshold_value": {
                                                    "type": "number",
                                                    "data_sources": [
                                                        "fixed"
                                                    ],
                                                    "network_element": "node",
                                                    "label": "Node relative threshold value",
                                                    "description": "Relative node threshold value; between 0 and 1.",
                                                    "minimum": 0,
                                                    "maximum": 1
                                                }
                                            },
                                            "rule": {
                                                "node": "all",
                                                "from_state": "0",
                                                "to_state": "1",
                                                "cause": [
                                                    "1"
                                                ],
                                                "rule": "deterministic_progressive_relative_node_threshold"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "Stochastic relative models": {
                            "submodels" : {
                                "Stochastic progressive relative threshold model": {
                                    "states": [
                                        "0",
                                        "1"
                                    ],
                                    "default_state": "0",
                                    "rules": [
                                        {
                                            "input": {
                                                "relative_node_threshold_value": {
                                                    "type": "number",
                                                    "data_sources": [
                                                        "fixed"
                                                    ],
                                                    "network_element": "node",
                                                    "label": "Relative node threshold value.",
                                                    "description": "Relative node threshold value; between 0 and 1.",
                                                    "minimum": 0,
                                                    "maximum": 1
                                                },
                                                "relative_node_probability_value": {
                                                    "type": "number",
                                                    "label": "Activation probability transition",
                                                    "description": "Probability to transition to state 1 per timestep",
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
                                                "from_state": "0",
                                                "to_state": "1",
                                                "cause": [
                                                    "1"
                                                ],
                                                "rule": "stochastic_progressive_relative_node_threshold"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
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
            "descripton": "States:  S (susceptible), I (infectious), R (recovered/removed).  State transitions S -> I, I -> R.",
            "submodels": {
                "fixed infectious": {
                    "description": "Agents spend a user-specified fixed time in state I.",
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
                },
                "stochastic infectious": {
                    "description": "Agents transition out of state I at each time step with a user-specified probability.",
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
        "SIS": {
            "submodels": {
                "fixed infectious": {
                    "states": [
                        "S",
                        "I",
                        "S"
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
                                "to_state": "S",
                                "cause": "auto",
                                "rule": "discrete_time_auto"
                            }
                        }
                    ]
                },
                "stochastic infectious": {
                    "states": [
                        "S",
                        "I",
                        "S"
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
                                "to_state": "S",
                                "cause": "auto",
                                "rule": "node_probability_auto"
                            }
                        }
                    ]
                }
            }
        },
        "(Generalized) Independent Cascade Model": {
            "states": [
                "0",
                "1",
                "2"
            ],
            "default_state": "0",
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
                            "label": "Activated duration",
                            "description": "Time spent in infectious state (I); for standard independent cascade model, enter 1.",
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
                        "to_state": "2",
                        "cause": "auto",
                        "rule": "discrete_time_auto"
                    }
                }
            ]
        },
        "Linear threshold Model (Integer threshold)": {
            "description": "This model most often used in sociology.",
            "states": [
                "0",
                "1"
            ],
            "default_state": "0",
            "rules": [
                {
                    "input": {
                        "threshold_value": {
                            "type": "integer",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "node",
                            "label": "Node threshold value (integer)",
                            "description": "Threshold for LT model, >= 0.",
                            "minimum": 0
                        },
                        "edge_probability_value": {
                            "type": "number",
                            "description": "Often between 0 and 1, but can be any value >= 0.",
                            "label": "Edge weight value",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "edge",
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
                        "rule": "linear_threshold_01"
                    }
                }
            ]
        },
        "Linear threshold Model (Float threshold)": {
            "description": "This model most often used in biology.",
            "states": [
                "0",
                "1"
            ],
            "default_state": "0",
            "rules": [
                {
                    "input": {
                        "threshold_value": {
                            "type": "number",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "node",
                            "label": "Node threshold value (float)",
                            "description": "Threshold can be any real value including <= 0."
                        },
                        "edge_probability_value": {
                            "type": "number",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "edge",
                            "label": "Edge weight",
                            "description": "Weight can be any real value including <= 0."
                        }
                    },
                    "rule": {
                        "node": "all",
                        "from_state": "S",
                        "to_state": "I",
                        "cause": [
                            "I"
                        ],
                        "rule": "linear_threshold_02"
                    }
                }
            ]
        }

    }
}

export default modelJSON