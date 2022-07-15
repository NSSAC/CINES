export const modelJSON = {
    "description": "Simulator of contagion dynamics on networks",
    "models": {
        "Threshold":{
            "description" : "States: 0 (inactive, unactivated), 1 (active, activated).  State transitions: 0 -> 1.",
            "submodels" : {
                "Absolute threshold models": {
                    "description" : "Thresholds are counts.",
                    "submodels" : {
                        "Deterministic absolute models": {
                            "description" : "Deterministic state transition 0 -> 1.",
                            "submodels": {
                                "Deterministic progressive absolute threshold": {
                                    "description" : "Progressive model means that an agent in state 1 stays in state 1.",
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
                                                    "label": "Node threshold",
                                                    "description": "Node threshold value >= 0.",
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
                            "description" : "Stochastic state transition 0 -> 1.",
                            "submodels": {
                                "Stochastic progressive absolute threshold": {
                                    "description" : "Progressive model means that an agent in state 1 stays in state 1.",
                                    "states": [
                                        "0",
                                        "1"
                                    ],
                                    "default_state": "0",
                                    "rules": [
                                        {
                                            "input": {
                                                "node_threshold_value": {
                                                    "type": "integer",
                                                    "data_sources": [
                                                        "fixed"
                                                    ],
                                                    "network_element": "node",
                                                    "label": "Node threshold",
                                                    "description": "Node threshold value >= 0.",
                                                    "minimum": 0
                                                },
                                                "node_probability_value": {
                                                    "type": "number",
                                                    "label": "Activation transition probability",
                                                    "description": "Probability to transition to state 1 per timestep once threshold is met",
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
                    "description" : "Thresholds are relative to the node's degree.",
                    "submodels" : {
                        "Deterministic relative models": {
                            "description" : "Deterministic state transition 0 -> 1.",
                            "submodels": {
                                "Deterministic progressive relative threshold": {
                                    "description" : "Progressive model means that an agent in state 1 stays in state 1.",
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
                                                    "label": "Node relative threshold",
                                                    "description": "Value between 0 and 1.",
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
                            "description" : "Stochastic state transition 0 -> 1.",
                            "submodels" : {
                                "Stochastic progressive relative threshold": {
                                    "description" : "Progressive model means that an agent in state 1 stays in state 1.",
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
                                                    "label": "Relative node threshold.",
                                                    "description": "Value between 0 and 1.",
                                                    "minimum": 0,
                                                    "maximum": 1
                                                },
                                                "relative_node_probability_value": {
                                                    "type": "number",
                                                    "label": "Activation transition probability",
                                                    "description": "Probability to transition to state 1 per timestep once threshold is met.",
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
            "description" : "States:  S (susceptible), E (exposed [infected but not infectious]), I (infectious), R (recovered/removed).  State transitions: S -> E, E -> I, I -> R",
            "submodels": {
                "fixed exposed fixed infectious": {
                    "description" : "Durations of nodes in state E and I are fixed and user specified.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "description": "Time spent in exposed state (E), >= 1",
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
                                    "description": "Time spent in infectious state (I), >= 1",
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
                    "description" : "Duration of nodes in state E is stochastic; duration of nodes in state I is fixed.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "description": "Time spent in exposed state (E), >= 1.",
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
                                    "label": "Infectious transition probability",
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
                    "description" : "Duration of nodes in state E is fixed; duration of nodes in state I is stochastic.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "label": "Exposed transition probability",
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
                                    "description": "Time spent in infectious state (I), >= 1.",
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
                    "description" : "Durations of nodes in states E and I are stochastic.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "label": "Exposed transition probability",
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
                                    "label": "Infectious transition probability",
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
            "description": "States:  S (susceptible), I (infectious), R (recovered/removed).  State transitions: S -> I, I -> R.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "description": "Time spent in infectious state (I), >= 1.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "label": "Infectious transition probability",
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
            "description": "States:  S (susceptible), I (infectious).  State transitions: S -> I, I -> S.",
            "submodels": {
                "fixed infectious": {
                    "description": "Agents spend a user-specified fixed time in state I.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "description": "Time spent in infectious state (I), >= 1.",
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
                    "description": "Agents transition out of state I at each time step with a user-specified probability.",
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
                                    "data_sources": [
                                        "fixed"
                                    ],
                                    "network_element": "edge",
                                    "label": "Edge probability",
                                    "description": "Value between 0 and 1.",
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
                                    "label": "Infectious transition probability",
                                    "description": "Probability to transition out of infectious state (I) per timestep.",
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
            "description": "States:  0 (inactive, unactivated), I (active, activated).  State transitions: 0 -> 1.",
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
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "edge",
                            "label": "Edge probability",
                            "description": "Value between 0 and 1.",
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
                        "from_state": "1",
                        "to_state": "2",
                        "cause": "auto",
                        "rule": "discrete_time_auto"
                    }
                }
            ]
        },
        "Linear threshold Model (Integer threshold)": {
            "description": "States:  0 (inactive, unactivated), I (active, activated).  State transitions: 0 -> 1.  This model most often used in sociology.",
            "states": [
                "0",
                "1"
            ],
            "default_state": "0",
            "rules": [
                {
                    "input": {
                        "threshold_value_int": {
                            "type": "integer",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "node",
                            "label": "Node threshold value (integer)",
                            "description": "Threshold for LT model, >= 0.",
                            "minimum": 0
                        },
                        "edge_weight_value": {
                            "type": "number",
                            "label": "Edge weight value",
                            "description": "Often between 0 and 1, but can be any value >= 0.",
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
            "description": "States:  0 (inactive, unactivated), I (active, activated).  State transitions: 0 -> 1.  This model most often used in biology.",
            "states": [
                "0",
                "1"
            ],
            "default_state": "0",
            "rules": [
                {
                    "input": {
                        "threshold_value_float": {
                            "type": "number",
                            "data_sources": [
                                "fixed"
                            ],
                            "network_element": "node",
                            "label": "Node threshold value (float)",
                            "description": "Threshold can be any real value including <= 0."
                        },
                        "edge_weight_value": {
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
                        "from_state": "0",
                        "to_state": "1",
                        "cause": [
                            "1"
                        ],
                        "rule": "linear_threshold_02"
                    }
                }
            ]
        }

    }
}

export default modelJSON
