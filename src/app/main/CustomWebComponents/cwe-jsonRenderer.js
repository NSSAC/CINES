// Import AJV library
import Ajv from 'ajv';
import RefParser from 'json-schema-ref-parser';
import _ from '@lodash';

let updated_mmSchema = {
    "type": "object",
    "description": "Movie Maker Input Parameters",
    "definitions": {
      "key_type": {
        "type": "string",
        "enum": [
          "US State-level FIPS",
          "US County-level FIPS",
          "Admin0 ADCW",
          "Admin1 ADCW",
          "Admin2 ADCW",
          "Country ADCW",
          "State ADCW",
          "County ADCW",
          "Categorical"
        ],
        "description": "Indicates the region id type used in the input file (eg, ADCW or FIPS codes), or that catagories are used instead of regions",
        "displayName": "Region/Key Type"
      },
      "bounds": {
        "properties": {
          "lower_bound": {
            "type": "string",
            "description": "The column where the lower uncertainty bound value can be found",
            "displayName": "Lower Uncertainty Bound Column",
            "columnProperty": true
          },
          "upper_bound": {
            "type": "string",
            "description": "The column where the upper uncertainty bound value can be found",
            "displayName": "Upper Uncertainty Bound Column",
            "columnProperty": true
          }
        }
      },
      "bar_measures": {
        "type": "array",
        "items": {
          "allOf": [
            {
              "$ref": "#/definitions/measures/items"
            },
            {
              "$ref": "#/definitions/bounds"
            },
            {
              "type": "object",
              "properties": {
                "pattern": {
                  "type": "string",
                  "description": "Allows users to apply a texture to the displayed Bar/StackedBar chart, primarily to differentiate between multiple measures",
                  "displayName": "Texture",
                  "$comment": "added '' into this enum until I talk to mandy",
                  "enum": [
                    " ",
                    ".",
                    "\\",
                    "O",
                    "/",
                    "*",
                    "x",
                    "-",
                    "o",
                    "+"
                  ],
                  "default": " "
                }
              }
            }
          ]
        }
      },
      "curve_measures": {
        "type": "array",
        "items": {
          "allOf": [
            {
              "$ref": "#/definitions/measures/items"
            },
            {
              "$ref": "#/definitions/bounds"
            },
            {
              "properties": {
                "pattern": {
                  "type": "string",
                  "description": "Allows users to apply a texture to the displayed Curve chart, primarily to differentiate between multiple measures",
                  "displayName": "Texture",
                  "enum": [
                    "-",
                    "--",
                    ":",
                    "-."
                  ],
                  "default": " "
                }
              }
            }
          ]
        }
      },
      "measures": {
        "type": "array",
        "description": "List of measures to include on the movies (multiple measures are supported for Curve, Bar, and StackedBar movies)",
        "displayName": "Measures",
        "items": {
          "properties": {
            "measure_type": {
              "type": "string",
              "description": "Indicates if the expected values are numeric or categorical (e.g., Low, Medium, or High)",
              "displayName": "Expected Measure Value Type",
              "enum": [
                "numeric",
                "category"
              ],
              "default": "numeric"
            },
            "column": {
              "type": "string",
              "description": "The column in the input data file containing the measure values to plot",
              "displayName": "Measure Column",
              "columnProperty": true
            },
            "display_name": {
              "type": "string",
              "description": "Allows user to indicate a name for the measure other than the column name",
              "displayName": "Measure Display Name"
            },
            "show_aggregate": {
              "type": "boolean",
              "description": "If true, the moviemaker will display an aggregate (summed) value across all regions in the movie",
              "displayName": "Show Aggregate",
              "default": false
            },
            "interpolate_missing_data": {
              "type": "boolean",
              "description": "If this is true, and there are missing dates in the input dataset, the application will interpolate the missing values",
              "displayName": "Interpolate Missing Data",
              "default": false
            },
            "cumulative_or_incidence": {
              "type": "string",
              "enum": [
                "cumulative",
                "incidence"
              ],
              "description": "If interpolating missing data, this will influence how the missing data is calculated",
              "displayName": "Input Data is Cumulative or Incidence?"
            }
          },
          "required": [
            "column",
            "show_aggregate"
          ],
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "show_aggregate": {
                  "const": true
                },
                "display_name_aggregate": {
                  "type": "string",
                  "description": "Allow the user to add a custom label to the aggregate value display",
                  "displayName": "Aggregate Label"
                }
              },
              "required": [
                "show_aggregate",
                "display_name_aggregate"
              ]
            },
            {
              "type": "object",
              "properties": {
                "show_aggregate": {
                  "const": false
                }
              }
            }
          ],
          "uniqueItems": true,
          "minItems": 1
        }
      },
      "barchart_orientation": {
        "type": "string",
        "description": "Indicates whether Bar or StackedBar charts should be oriented vertically or horizontally",
        "displayName": "Barchart Orientation",
        "enum": [
          "vertical",
          "horizontal"
        ],
        "default": "vertical"
      },
      "animated_timeline_axis": {
        "type": "boolean",
        "description": "When true, new date values will be added to the axis as the movie runs.",
        "displayName": "Animated Timeline Axis",
        "default": false
      },
      "legend_bins": {
        "type": "array",
        "description": "Helps users to create a custom legend for movies where colors should differ by measure values (like Map movies)",
        "displayName": "Custom Legend by Value Definition",
        "items": {
          "properties": {
            "label": {
              "type": "string",
              "pattern": "[A-Za-z0-9 -]+[^ +]",
              "description": "The caption for this line on the legend",
              "displayName": "Legend Caption"
            },
            "color": {
              "$ref": "#/definitions/color_selection"
            }
          },
          "oneOf":[
            {
              "properties":{
                 "measure_type": {
                  "const": "numeric"
                 },
                "start": {
                  "type": "number",
                  "description": "Start value for the legend bin range",
                  "displayName": "Range Start"
                },
                "end": {
                  "type": "number",
                  "description": "End value for the legend bin range",
                  "displayName": "Range End"
                }
              }
            },
            {
              "properties":{
                "measure_type": {
                  "const": "category"
                 },
                "start": {
                  "type": "string",
                  "description": "Start value for the categorical legend bin range",
                  "displayName": "Range Start"
                },
                "end": {
                  "type": "string",
                  "description": "End value for the categorical legend bin range",
                  "displayName": "Range End"
                }
              }
            }
          ],
          "required": [
            "label",
            "color"
          ]
        },
        "uniqueItems": true
      },
      "legend_by_value_header": {
        "type": "string",
        "description": "Custom header for the legend_bins (default is the measure display name)",
        "displayName": "Custom Legend Header"
      },
      "chart_legend_bins": {
        "type": "array",
        "description": "Custom legend for charts or curve movies",
        "displayName": "Custom Legend by Region/Category",
        "items": {
          "properties": {
            "label": {
              "type": "string",
              "description": "The caption for this region or category on the legend",
              "displayName": "Region/Category Caption"
            },
            "key": {
              "type": "string",
              "description": "Either the region id or category; needs to be consistent with select key type",
              "displayName": "Region/Category Identifier"
            },
            "color": {
              "$ref": "#/definitions/color_selection"
            }
          },
          "required": [
            "key",
            "color"
          ]
        },
        "uniqueItems": true
      },
      "chart_legend_header": {
        "type": "string",
        "description": "Custom header for the chart_legend_bins (default is Regions or Categories)",
        "displayName": "Custom Legend Header"
      },
      "measure_legend_header": {
        "type": "string",
        "description": "In the case where there are multiple measures, the user can define a custom header for the Measures portion of the legend (default is Measures)",
        "displayName": "Custom Measures Legend Header"
      },
      "status_legend_bins": {
        "type": "array",
        "description": "Custom legend for scatterplot movies",
        "displayName": "Custom Legend by Status",
        "items": {
          "properties": {
            "label": {
              "type": "string",
              "description": "Caption for scatterplot map status",
              "displayName": "Status Caption"
            },
            "status": {
              "type": "string",
              "description": "The status for this legend bin",
              "displayName": "Status Value",
              "displayOptions": {
                "enum_data_source": {
                  "input_file": "input_file",
                  "jsonpath": "$..states"
                }
              }
            },
            "color": {
              "$ref": "#/definitions/color_selection"
            }
          },
          "required": [
            "label",
            "color"
          ]
        },
        "uniqueItems": true
      },
      "status_legend_header": {
        "type": "string",
        "description": "Custom header for the Scatterplot Map legend (default is Status)",
        "displayName": "Custom Legend Header"
      },
      "scatterplot_settings": {
        "type": "object",
        "description": "Elements required for a Scatterplot Map",
        "displayName": "Scatterplot Map settings",
        "properties": {
          "scatter_indicator_size": {
            "type": "integer",
            "description": "Indicates the size of the scatterplot dots from 1 (smallest) to 100 (largest)",
            "displayName": "Scatterplot Dot Size",
            "minimum": 1,
            "maximum": 100,
            "default": 10
          },
          "terminal_status": {
            "type": "array",
            "description": "A list of statuses that are considered Terminal States, so they may be removed from the Scatterplot after they appear",
            "displayName": "Terminal Statuses",
            "items": {
              "properties": {
                "status": {
                  "type": "string",
                  "description": "Terminal status",
                  "displayName": "Terminal Status"
                }
              }
            },
            "uniqueItems": true
          },
          "scatter_layer_priority": {
            "type": "array",
            "description": "Indicates which order the statuses should be layered on the movie (e.g., don't want Susceptible overlaying Recovered)",
            "displayName": "Status scatterplot layer priority",
            "properties": {
              "Status": {
                "type": "string",
                "description": "Status to include on the next layer",
                "displayName": "Status"
              }
            }
          },
          "columns": {
            "type": "object",
            "description": "Defines the columns necessary for the scatterplot",
            "displayName": "Scatterplot Column Definition",
            "properties": {
              "latitude": {
                "type": "string",
                "description": "Latitude column in the input file",
                "displayName": "Latitude Column",
                "columnProperty": true
              },
              "longitude": {
                "type": "string",
                "description": "Longitude column in the input file",
                "displayName": "Longitude Column",
                "columnProperty": true
              },
              "scatter_id": {
                "type": "string",
                "description": "Column for the unique location identifier (only needed for interpolated scatterplots",
                "displayName": "Scatterplot Identifier Column",
                "columnProperty": true
              }
            },
            "required": [
              "latitude",
              "longitude"
            ]
          }
        }
      }, 
      "key_column": {
        "type": "string",
        "description": "The column in the input file that indicates either the region id (if Key Type is a regional type) or category (if Key Type is a categorical type).",
        "displayName": "Region Id/Category Column",
        "displayOptions": {
          "enum_data_source": {
            "input_file": "input_file",
            "jsonpath": "$..columns"
          }
        }
      },
      "xaxis_label": {
        "type": "string",
        "description": "Custom label for the x-axis for the Curve, Bar, and StackedBar graph movies",
        "displayName": "X-Axis Label"
      },
      "yaxis_label": {
        "type": "string",
        "description": "Custom label for the y-axis for the Curve, Bar, and StackedBar graph movies",
        "displayName": "Y-Axis Label"
      },
      "map_background": {
        "type": "string",
        "enum": [
          "open-street-map",
          "carto-positron",
          "carto-darkmatter",
          "stamen-terrain",
          "stamen-toner"
        ],
        "description": "Allows user to change the map background",
        "displayName": "Map Background",
        "default": "carto-positron"
      },
     "color_selection": {
        "type": "string",
        "displayName": "Color",
        "description": "Allows the user to enter a color value",
        "display_options": {
          "component": "builtin://color_pallette"
        },
        "oneOf": [
          {
            "enum": [
              "aqua",
              "black",
              "blue",
              "fuchsia",
              "gray",
              "green",
              "lime",
              "maroon",
              "navy",
              "olive",
              "purple", 
              "red",
              "silver",
              "teal",
              "white",
              "yellow"
            ]
          },
          {
            "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          }
        ]
      }
    },
    "properties": {
      "movie_title": {
        "type": "string",
        "description": "Title of the movie",
        "maxLength": 50,
        "displayName": "Movie Title"
      },
      "output_type": {
        "type": "string",
        "enum": [
          "mp4",
          "gif"
        ],
        "description": "Indicates which movie type to generate",
        "displayName": "Output Type",
        "default": "mp4"
      },
      "visualization_type": {
        "type": "string",
        "displayName": "Visualization Type",
        "description": "The type of movie visualization to be generated",
        "$comment":"This property drives the oneOf section below. The enum values will be overridden by the visualization_type values provided in the oneOf below"
      },
      "date_settings": {
        "type": "object",
        "displayName": "Date Settings",
        "description": "Define characteristics of the dates for the movie, such as date format (date or tick), range (start and end date), aggregation, where to display the date, and more.",
        "properties": {
          "date_or_tick": {
            "type": "string",
            "$comment": "This property drives the oneOf section below. The enum values will be overridden by the date_or_tic values provided in the oneOf",
            "enum": [
              "date",
              "tick"
            ],
            "description": "Input files can either be keyed by date (YYYY-MM-DD format) or tick (sequential numbers)",
            "displayName": "Input temporal key type",
            "default": "date"
          },
          "tick_unit_of_measure": {
            "description": "Input Data Unit of Measure (used to indicate whether the input dataset is aggregated by day, week, etc.)",
            "type": "string",
            "enum": [
              "Hours",
              "Day",
              "Week",
              "Fortnight",
              "Month"
            ],
            "displayName": "Input Data Unit of Measure",
            "default": "Day"
          },
          "aggregate_by": {
            "description": "Indicates what the temporal aggregation should be (hour, day, week, fortnight, or month)",
            "type": "string",
            "enum": [
              "Day",
              "Week",
              "Fortnight",
              "Month"
            ],
            "displayName": "Aggregate Data By",
            "default": "Day"
          },
          "show_date_or_tick_label": {
            "type": "array",
            "description": "Where on the movie should the date or tick be displayed (e.g. under the title).",
            "displayName": "Where to show Date/Tick on Movie",
            "items": {
              "enum": [
                "Title",
                "Under Title",
                "Middle",
                "Bottom"
              ],
              "type": "string"
            },
            "uniqueItems": true,
            "minItems": 1,
            "default": ["Title"]
          }
        },
        "required": [
          "date_or_tick"
        ],
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "date_or_tick": {
                "const": "date"
              },
              "start": {
                "type": "string",
                "format": "date",
                "description": "In filtering the input dataset, indicates what the first date in the range should be",
                "displayName": "Starting Date"
              },
              "end": {
                "type": "string",
                "format": "date",
                "description": "In filtering the input dataset, indicates what the last date in the range should be",
                "displayName": "Ending Date"
              }
            }
          },
          {
            "type": "object",
            "properties": {
              "date_or_tick": {
                "const": "tick"
              },
              "start": {
                "type": "integer",
                "minimum": 0,
                "description": "In filtering the input dataset, indicates what the first tick in the range should be",
                "displayName": "Starting Tick"
              },
              "end": {
                "type": "integer",
                "minimum": 0,
                "description": "In filtering the input dataset, indicates what the last tick in the range should be",
                "displayName": "Ending Tick"
              }
            }
          }
        ]
      },
      "date_or_tick_column": {
        "type": "string",
        "description": "The column in the input file that indicates the date or tick",
        "displayName": "Date/Tick Column",
        "$comment": "TBD: This property should be getting its enumerated list of valid data from the provided input file to this job.",
        "columnProperty": true
      },
      "duration": {
        "type": "integer",
        "minimum": 1,
        "description": "The duration (in seconds) for the output movie",
        "displayName": "Movie Duration",
        "default": 30
      },
      "width": {
        "type": "integer",
        "minimum": 1024,
        "maximum": 8000,
        "description": "Width of the movie (in pixels)",
        "displayName": "Width (in pixels)",
        "default": 1024
      },
      "height": {
        "type": "integer",
        "minimum": 720,
        "maximum": 8000,
        "description": "Height of the movie (in pixels)",
        "displayName": "Height (in pixels)",
        "default": 720
      }
    },
    "oneOf": [
      {
        "type": "object",
        "properties": {
          "visualization_type": {
            "type": "string",
            "const": "Map"
          },
          "key_type": {
            "$ref": "#/definitions/key_type"
          },
          "key_column": {
            "$ref": "#/definitions/key_column"
          },
          "measures": {
            "$ref": "#/definitions/measures"
          },
          "legend_bins": {
            "$ref": "#/definitions/legend_bins"
          },
          "legend_by_value_header": {
            "$ref": "#/definitions/legend_by_value_header"
          },
          "map_background": {
            "$ref": "#/definitions/map_background"
          }
        },
        "required": [
          "key_type",
          "measures"
        ]
      },
      {
        "type": "object",
        "properties": {
          "visualization_type": {
            "type": "string",
            "const": "Curve"
          },
          "key_type": {
            "$ref": "#/definitions/key_type"
          },
          "key_column": {
            "$ref": "#/definitions/key_column"
          },
          "measures": {
            "$ref": "#/definitions/curve_measures"
          },
          "animated_timeline_axis": {
            "$ref": "#/definitions/animated_timeline_axis"
          },
          "chart_legend_bins": {
            "$ref": "#/definitions/chart_legend_bins"
          },
          "chart_legend_header": {
            "$ref": "#/definitions/chart_legend_header"
          },
          "measure_legend_header": {
            "$ref": "#/definitions/measure_legend_header"
          },
          "xaxis_label": {
            "$ref": "#/definitions/xaxis_label"
          },
          "yaxis_label": {
            "$ref": "#/definitions/yaxis_label"
          }
        },
        "required": [
          "key_type",
          "measures"
        ],
        "oneOf": [
          {
            "properties": {
              "key_type":{
                "const": "Categorical"
              }
            }
          },
          {
            "properties": {
              "key_type":{
                "enum": [
                  "US State-level FIPS",
                  "US County-level FIPS",
                  "Admin0 ADCW",
                  "Admin1 ADCW",
                  "Admin2 ADCW",
                  "Country ADCW",
                  "State ADCW",
                  "County ADCW"
                ]
              }
            },
            "required": []
          }
        ]
      },
      {
        "type": "object",
        "properties": {
          "visualization_type": {
            "type": "string",
            "const": "Bar"
          },
          "key_type": {
            "$ref": "#/definitions/key_type"
          },
          "key_column": {
            "$ref": "#/definitions/key_column"
          },
          "measures": {
            "$ref": "#/definitions/bar_measures"
          },
          "barchart_orientation": {
            "$ref": "#/definitions/barchart_orientation"
          },
          "chart_legend_bins": {
            "$ref": "#/definitions/chart_legend_bins"
          },
          "chart_legend_header": {
            "$ref": "#/definitions/chart_legend_header"
          },
          "measure_legend_header": {
            "$ref": "#/definitions/measure_legend_header"
          },
          "xaxis_label": {
            "$ref": "#/definitions/xaxis_label"
          },
          "yaxis_label": {
            "$ref": "#/definitions/yaxis_label"
          }
        },
        "required": [
          "key_type",
          "measures"
        ]
      },
      {
        "type": "object",
        "properties": {
          "visualization_type": {
            "type": "string",
            "const": "StackedBar"
          },
          "key_type": {
            "$ref": "#/definitions/key_type"
          },
          "key_column": {
            "$ref": "#/definitions/key_column"
          },
          "measures": {
            "$ref": "#/definitions/bar_measures"
          },
          "barchart_orientation": {
            "$ref": "#/definitions/barchart_orientation"
          },
          "animated_timeline_axis": {
            "$ref": "#/definitions/animated_timeline_axis"
          },
          "chart_legend_bins": {
            "$ref": "#/definitions/chart_legend_bins"
          },
          "chart_legend_header": {
            "$ref": "#/definitions/chart_legend_header"
          },
          "measure_legend_header": {
            "$ref": "#/definitions/measure_legend_header"
          },
          "xaxis_label": {
            "$ref": "#/definitions/xaxis_label"
          },
          "yaxis_label": {
            "$ref": "#/definitions/yaxis_label"
          }
        },
        "required": [
          "key_type",
          "measures"
        ]
      },
      {
        "type": "object",
        "properties": {
          "visualization_type": {
            "type": "string",
            "const": "Scatterplot Map"
          },
          "measures": {
            "$ref": "#/definitions/measures"
          },
          "scatterplot_settings": {
            "$ref": "#/definitions/scatterplot_settings"
          },
          "status_legend_bins": {
            "$ref": "#/definitions/status_legend_bins"
          },
          "status_legend_header": {
            "$ref": "#/definitions/status_legend_header"
          },
          "map_background": {
            "$ref": "#/definitions/map_background"
          }
        },
        "required": [
          "measures",
          "scatterplot_settings"
        ]
      }
    ],
    "required": [
      "movie_title",
      "output_type",
      "visualization_type",
      "date_or_tick_column"
    ]
  }

// const ajv = new Ajv();
// const validate = ajv.compile(updated_mmSchema);

const template_JSONFromRendered = document.createElement('template');
template_JSONFromRendered.innerHTML = /* html */ `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <style>
    .info-icon {
        position: absolute;
        right: 11px;
        top: 20px;
        color: #302d2d;
        font-size: 15px;
        cursor: pointer;
        font-weight: 500;
        }
    #json-form{
        background-color: white;
        padding: 20px;
        }
    .modify-form {

        }
    .modify-label {
        margin-bottom: 0px !important;
        }
    .modify-label_radio{
        display: block !important;
        }
    .modify-input {
        font-size: 1.4rem;
        background-color: white !important;
        width: 95% !important;
        }
    .modify-input:focus {
        outline: none;
        outline: transparent !important;
        box-shadow: none !important;
        }
    .modify-select{
        font-size: 1.4rem;
        width: 95% !important;
        height: calc(2.25rem + 4px);
        }
    .modify-select:focus {
        outline: none;
        outline: transparent !important;
        box-shadow: none !important;
        }
    .category-container {
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 15px 5px;
        margin: 15px 0px 10px 0px;;
        position: relative;
        }
    .category-container::before {
        content: attr(data-form-title);
        position: absolute;
        top: -15px;
        left: 10px;
        background-color: white;
        padding: 0 5px;
        font-size: 16px;
        color: #201f1f;
        }

    .container{
        padding: 0px 7px !important
        }
    .breaker{
        height: 0;
        margin: 1rem 0;
        overflow: hidden;
        border-top: 3px solid #121212b8
        }
    .btn-colPos{
        display: flex;
        justify-content: flex-end;
        }
    .btn-boxShadow{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
    .btn-boxShadow:focus{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
    .modify-formGroup{
        margin-bottom: 0.5rem;
    }

    .custom-dropdown {
        position: relative;
        display: block;
      }
    .custom-checkBox {
        float: left;
        margin: 2px 10px 2px 2px;
    }

     .custom-dropdown .dropdown-select {
       display: none;
       position: absolute;
       background-color: #fff;
       border: 1px solid #ccc;
       max-height: 125px;
       overflow-y: auto;
       z-index: 999;
       width: 100%;
     }

    .custom-dropdown .checkbox-option {
      display: block;
      padding: 5px;
      cursor: pointer;
    }

    .custom-dropdown .checkbox-option input[type="checkbox"] {
      margin-right: 5px;
    }

    .custom-rounded{
       border-radius: 0.64rem!important;
    }

    .required::after {
       content: ' *';
       color: red;
    }

    .error_span{
      font-size: 1.2rem;
      color: red;
      font-weight: 400;
      height: 1rem;
      display: inline-block;
    }

    .booelan_error_span{
      display: block !important;
    }

    .boolean_div{
      padding: 0.375rem 0.75rem;
    }

    .error_input{
      border-bottom-color: red !important;
    }

    .error_label{
      color: red
    }

    .multi-select{

    }

        /* Style the date picker icon in Chrome */
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }

    /* Style the date picker icon in Firefox */
    input[type="date"]::-moz-calendar-picker-indicator {
      cursor: pointer;
    }
  
    /* Style the date picker icon in Microsoft Edge */
    input[type="date"]::-ms-calendar-picker-indicator {
      cursor: pointer;
    }


    input[type="number"]{
      appearance: none; /* Remove default arrow in other browsers */
      -webkit-appearance: none; /* Remove default arrow in WebKit browsers (Chrome, Safari) */
      -moz-appearance: textfield; /* Remove default arrow in Firefox */
    }

    input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
}

</style>
<form id="json-form" class="modify-form"></form>
<button class="btn" style="display:none">asdasd</button>
<div class="row" style="display:none">
	<div class="col-md-12" style="display: flex;justify-content: flex-end;">
	  <button id="submitBtn" class="btn btn-primary" style="margin-right: 8px;" type="button"> Submit</button>
	  <button id="cancelBtn" class="btn btn-secondary" style="margin-right: 7%;" type="button">Cancel</button>
	</div>
</div>
`;

class JSONRenderer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.slide_details = ""
        this.normalized_schema = ""
        this.commonFields = ""
        this.mergeProps = ""
        this.jsonForm_Genx = ""
        this.formProperties = {}
    }

    static get observedAttributes() {
        return [''];
    }

    connectedCallback() {
        const self = this
        this.shadowRoot.appendChild(template_JSONFromRendered.content.cloneNode(true));
		self.submitForm(self);
        // Get a reference to the button elemen
        const interval = setInterval(() => {
            const button = this.shadowRoot.querySelector('.btn')
            let fontWeight;
            if (button) {
                const computedStyle = window.getComputedStyle(button);
                fontWeight = computedStyle.fontWeight;
            }

            if (fontWeight === "400") {
                button.style.display = "none"
                clearInterval(interval)
                self.callFn()
            }
        }, 100)
    }

    callFn(){
        const self = this
        self.getFileAttribute()
        self.initilization()
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    getFileAttribute() {
        const self = this;
        self.slide_details = self.getAttribute('slide_details')
        self.slide_details = JSON.parse(self.slide_details);
    }

    initilization() {
        const self = this;
        self.jsonForm_Genx = self.shadowRoot.querySelector('#json-form')
        // if (self.slide_details.file_schema.usermeta_schema) {
        self._deRefrenceJSON(updated_mmSchema)
        // }

        setTimeout(() => {
            self._processJSON()
        }, 500)

    }

    _processJSON() {
        const self = this;

        if (self.normalized_schema && self.normalized_schema.hasOwnProperty("oneOf")) {
            self.commonFields = self.extractCommonFieldsFromOneOf(self.normalized_schema);
            // self.commonFields  = JSON.stringify(self.commonFields, null, 2)
            console.log("self.commonFields", self.commonFields);

            self.mergeProps = self.mergeProperties(self.commonFields, self.normalized_schema, "normalized")
            // self.mergeProps  = JSON.stringify(self.mergeProps, null, 2)
            console.log("self.mergeProps", self.mergeProps);


            if (self.mergeProps['mergeProp']) {
                self.initilize_formGeneration(self.mergeProps, true)
            } else {
                self.initilize_formGeneration(self.mergeProps, false)
            }
        }
    }

    _deRefrenceJSON(json) {
        const self = this;

        RefParser.dereference(json)
            .then((dereferencedSchema) => {

                console.log("🏄🏄🏄", dereferencedSchema)
                self.normalized_schema = dereferencedSchema
            })
            .catch((err) => {
                console.error(err);
            });
    }

    extractCommonFieldsFromOneOf(json) {
        const commonFields = {
            "properties": {},
            "required": []
        };

        if (json.oneOf) {

            // Initialize commonFields with the properties from the first object in oneOf
            if (json.oneOf[0] && json.oneOf[0].properties) {
                for (const prop in json.oneOf[0].properties) {
                    commonFields['properties'][prop] = { ...json.oneOf[0].properties[prop] };
                }
            }

            // Iterate through the remaining objects in oneOf to find common properties
            for (let i = 1; i < json.oneOf.length; i++) {
                const instance = json.oneOf[i];

                if (instance.properties) {
                    for (const prop in commonFields['properties']) {
                        // If the property exists in commonFields['properties'] but not in this instance, remove it
                        if (instance.properties.hasOwnProperty(prop)) {

                            if (commonFields['properties'][prop].hasOwnProperty('const')) {

                                //adding required fields only if they have const values
                                if (commonFields['required'].indexOf(prop) === -1) {
                                    commonFields['required'].push(prop)
                                }

                                if (!commonFields['properties'][prop].hasOwnProperty('enum')) {
                                    // Below line is to add the value in enum that is already present in commonFields['properties'][prop]['const']
                                    commonFields['properties'][prop]['enum'] = [commonFields['properties'][prop]['const']]

                                    if(instance.properties[prop].hasOwnProperty('enum')){       // if instead of const value there are multiple values in enum that needs to be added in enum that we are creating so below :
                                        commonFields['properties'][prop]['enum'] =  commonFields['properties'][prop]['enum'].concat(instance.properties[prop]['enum'])
                                    }else if(instance.properties[prop].hasOwnProperty('const')){
                                        commonFields['properties'][prop]['enum'].push(instance.properties[prop]['const'])
                                    }

                                } else {
                                    if(instance.properties[prop].hasOwnProperty('enum')){
                                        commonFields['properties'][prop]['enum'] =  commonFields['properties'][prop]['enum'].concat(instance.properties[prop]['enum'])
                                    }else if(instance.properties[prop].hasOwnProperty('const')){
                                        commonFields['properties'][prop]['enum'].push(instance.properties[prop]['const'])
                                    }
                                }

                                // Deleting const value from commonFields in the last oneOf iteration
                                // Reason : since we have pushed those values in enum no point in keeping const and enum
                                if (i === json.oneOf.length - 1) {
                                    delete commonFields['properties'][prop]['const']
                                }
                            }


                        } else {
                            delete commonFields['properties'][prop];
                        }
                    }
                }
            }
        }
        else{
            if(json.hasOwnProperty('properties')){
                commonFields["properties"] = {...json.properties}
            }else{
                commonFields["properties"] = null
            }
            if(json.hasOwnProperty('required')){
                commonFields["required"] = [...json.required]
            }else{
                commonFields["required"] = null
            }
        }
        return commonFields;
    }

    mergeProperties(common_Fields, json, prop) {
        const self = this;
        let combineObj = {}
        let mergeProp = {
            "properties": {},
            "required": []
        }

        let form_drivingProp = []
        if (common_Fields && json && json.hasOwnProperty('oneOf')) {
            const properties = json.properties

            //removing properties frm common_Fields that do no have enum``

            if (properties) {

                // removing properties from common_Fields.properties that are not present in common_Fields.required

                for(const prop in common_Fields['properties']) {
                    if(!common_Fields['required'].includes(prop)){
                        delete common_Fields['properties'][prop]
                    }
                }

                // Logic to understand ***form_drivingProp*** properties. Properties on which we need to render the oneOf object
                for (const prop in common_Fields['properties']) {
                    if (common_Fields['properties'][prop].hasOwnProperty('enum')) {     // if property has enum
                        if (form_drivingProp.length === 0) {      // there can only be one driving factor for form
                            if ((json['oneOf'].length === 2) && (common_Fields['properties'][prop].type === 'boolean')) {     // if driving factor is a type boolean, then oneOf array should have only two object
                                let obj = {}
                                obj['property'] = prop;
                                obj['path'] =
                                    form_drivingProp.push(prop)
                            } else if (common_Fields['properties'][prop].type !== 'boolean') {         // else if property is not boolean, as it already has enum and is common on all oneOf object
                                form_drivingProp.push(prop)
                            }
                        }
                    }
                }

                mergeProp['properties'] = { ...json.properties }
                mergeProp['required'] = [...json['required'], ...common_Fields['required']]
                mergeProp['required'] = [...new Set(mergeProp['required'])]

                // to merge the properties that are present in common_Fields and json.properties
                for (const prop in properties) {
                    if (common_Fields['properties'].hasOwnProperty(prop)) {
                        mergeProp['properties'][prop] = { ...properties[prop], ...common_Fields['properties'][prop] }

                        // removing the enum for type boolean 
                        if (mergeProp['properties'][prop]["type"] === "boolean") {
                            if (mergeProp['properties'][prop].hasOwnProperty("enum")) {
                                delete mergeProp['properties'][prop]['enum']
                            }
                        }
                    }
                }


                // to add the properties that are not present in json.properties but in common_Fields
                for (const prop in common_Fields['properties']) {
                    if (!mergeProp['properties'].hasOwnProperty(prop)) {
                        mergeProp['properties'][prop] = { ...common_Fields['properties'][prop] }

                        // removing the enum i.e made up in function extractCommonFieldsFromOneOf() as they have const values declared.
                        if (mergeProp['properties'][prop]["type"] === "boolean") {
                            if (mergeProp['properties'][prop].hasOwnProperty("enum")) {
                                delete mergeProp['properties'][prop]['enum']
                            }
                        }
                    }
                }


                // This alignes the merge Prop with sequence. Defined is the sequence with conditions
                const sequence = [
                    { type: "string", enum: true }, /// dropdown
                    { type: "integer", enum: true },    ////// dropdown
                    { type: "string", enum: false },    /// input type string
                    { type: "integer", enum: false },   /// input type number
                    { type: "boolean", enum: false },   /// input type booelan
                    { type: "array", enum: true },  /// multip-select dropdown
                    { type: "object" }, /// properties type object
                    { type: "array" },  /// properties type array
                ];
                // sequence will be in such format. top of the form will have dropdown, input fields. If their are mutlipe properties of type object/array, those will be aligned as all objects first and then all array later
                
                const alignedProps = {}
                for (const condition of sequence) {

                    for (const key in mergeProp['properties']) {
                        const property = mergeProp['properties'][key]

                        if (condition.type === property.type) {
                            if (condition.hasOwnProperty('enum')) {
                                if (condition.enum === property.hasOwnProperty('enum')) {
                                    alignedProps[key] = property
                                }
                            } else if (property.type === "object") {
                                alignedProps[key] = property

                            } else if (property.type === "array") {
                                alignedProps[key] = property

                            }
                        }
                    }
                }

                // Add any remaining properties from jsonSchema to alignedProperties
                for (const ele in mergeProp['properties']) {
                    alignedProps[ele] = mergeProp['properties'][ele];
                }
                if (Object.keys(mergeProp['properties']).length === Object.keys(alignedProps).length) {
                    mergeProp['properties'] = alignedProps
                }
                // let json_oneOf = 
                combineObj = {
                    "mergeProp": mergeProp,
                    "form_drivingProp": {}
                }
                if(form_drivingProp.length > 0){
                    const f_dp  =  form_drivingProp[0]
                    combineObj['form_drivingProp'][f_dp] = {"oneOf" : [...json.oneOf]}
                }

            }
        }else if(common_Fields && json.hasOwnProperty('properties') ){

            if(json.properties){
                mergeProp["properties"] = {...common_Fields.properties}
            }else{
                mergeProp["properties"] = null
            }

            if(json.hasOwnProperty('required')){
                mergeProp["required"] = [...common_Fields.required]
            }else{
                mergeProp["required"] = null
            }

            combineObj = {
                "mergeProp": mergeProp,
                "form_drivingProp": null
            }

        } else {
            combineObj = {
                "mergeProp": null,
                "form_drivingProp": null
            }
        }



        return combineObj;
    }

    initilize_formGeneration(mergedData, check) {
        const self = this;
        //dont forget to handle the error msg if mergeProps are empty

        if (!check) {
            // const form = document.createElement('form');
            // form.id = 'json-form';

            self.jsonForm_Genx.innerHTML += /* html */`
              <div class="row">
                <div class="col">
                <p class="font-weight-bold">Data not found, please check the schema</p>
                </div>
              </div>
              <hr>
        `
        } else if (check) {
            // Create a shadow DOM to encapsulate styles and functionality

            // Create a form element dynamically based on the schema
            // let schema = self.slide_details.file_schema.usermeta_schema.properties


            // const form = document.createElement('form');
            // form.id = 'json-form';

            //         self.jsonForm_Genx.innerHTML += /* html */`
            //       <div class="row">
            //         <div class="col-md-8">
            //         <p class="font-weight-bold"> File : ${self.slide_details.file_name}</p>
            //         </div>
            //         <div class="col-md-4">
            //         <p class="font-weight-bold">Type : ${self.slide_details.type}</p>
            //         </div>
            //       </div>
            //       <hr>
            // `

            const container_propCommon = self.createNewRow('container')
            const row_propCommon = self.createNewRow('row')
            row_propCommon.setAttribute('primary-row',"true")
            container_propCommon.setAttribute('container-type', 'commonProperties')

            const container_propObject = self.createNewRow('container')
            container_propObject.setAttribute('container-type', 'objectProperties')

            const container_propArray = self.createNewRow('container')
            container_propArray.setAttribute('container-type', 'arrayProperties')

            container_propCommon.appendChild(row_propCommon)
            self.jsonForm_Genx.append(container_propCommon, container_propObject, container_propArray)
            self._generateForm_HTML(mergedData, row_propCommon, container_propObject, container_propArray)
        }
    }

    _generateForm_HTML(mergedData, row_propCommon, container_propObject, container_propArray, setAttr) {
        const self = this
        let iterateProp = mergedData['mergeProp']['properties']
        let form_drivingProp = mergedData['form_drivingProp']
        let requiredProp = mergedData['mergeProp']['required'] ? mergedData['mergeProp']['required'] : []

        for (const prop in iterateProp) {
            const property = iterateProp[prop]
            switch (true) {
                case property.type === 'string' && property.hasOwnProperty('enum'):
                    self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, container_propArray, setAttr)
                    break;
                // ================================
                case property.type === 'integer' && property.hasOwnProperty('enum'):
                    self._stringInt_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)
                    break;
                // ================================
                case property.type === 'string' && !property.hasOwnProperty('enum'):
                    self._stringInt_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

                    break;
                // ================================
                case (property.type === 'integer' || property.type === 'number') && !property.hasOwnProperty('enum'):
                    self._stringInt_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)

                    break;
                // ================================
                case property.type === 'boolean' && !property.hasOwnProperty('enum'):
                    self._boolean_noEnum(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, container_propArray, setAttr)
                    break;
                // ================================
                case property.type === 'array' && property.hasOwnProperty('items') && property.items.hasOwnProperty('enum'):
                    self._array_Enum(prop, property, requiredProp, form_drivingProp, row_propCommon, setAttr)
                    break;
                // ================================
                case property.type === 'object':
                    self.__object(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propObject, setAttr)
                    break;
                // ================================
                case property.type === 'array':
                    self.__array(prop, property, requiredProp, form_drivingProp, row_propCommon, container_propArray, setAttr)
                    break;
                // ================================
                default:
                    console.log("Pleae check the case type for property", property);
            }
        }
    }

    _stringInt_Enum(prop, property, requiredProp, form_drivingProp, rowX, container_propObject, container_propArray, setAttr) {
        const self = this;
        let setId;

        const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ?  true : false;
        const requiredProp_check = requiredProp.includes(prop) ? true : false
        const col = document.createElement('div')
        col.classList.add('col-md-6')
        col.setAttribute("property", prop)
        col.setAttribute("property-type", property.type ? property.type : "")
        col.setAttribute("required", requiredProp_check)
        col.setAttribute("form-driven", formDrivenProp_check)


        if (setAttr && Object.keys(setAttr).length > 1) {
            //check if setAttr has key and value property or not
            if(setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')){
                col.setAttribute(setAttr.key, setAttr.value)
                setId = `${setAttr.value}_${prop}`
            }
        } else {
            setId = prop
        }
        // setting the extra paramater attribute on the col so the same property can be used to remove the element if its link to element on change of its value
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            col.setAttribute("linkedTo",setAttr['extraParams'])
        
        }

        const form_group = document.createElement('div')
        form_group.classList.add('form-group', 'modify-formGroup')

        const label = document.createElement('label');
        const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
        label.setAttribute('for', setId)
        // label.classList.add('modify-label')
        requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')
        label.textContent = label_text

        const string_select = document.createElement('select')
        string_select.setAttribute('actual-name', prop)
        string_select.setAttribute('name', setId)
        string_select.setAttribute('id', setId)
        string_select.style.border = "none";
        string_select.classList.add('form-control', 'border-bottom', 'modify-select')
        string_select.setAttribute('form-driven', formDrivenProp_check)



        // adding a default selected select option
        const select_option = document.createElement('option');
        select_option.textContent = "Select option";
        select_option.setAttribute('disabled', true)
        select_option.setAttribute('selected', true)
        string_select.appendChild(select_option);

        for (const val of property.enum) {
            const option = document.createElement('option');
            option.textContent = val;
            option.value = val
            if(property.hasOwnProperty('default') && (option.value === property.default)){
                option.setAttribute('selected', true)
            }
            string_select.appendChild(option);
        }

        const span = self.createSpanTag(property)
        const error_span = document.createElement('span')
        error_span.classList.add('error_span')

        form_group.append(label, string_select, span, error_span)
        col.appendChild(form_group)
        rowX.appendChild(col);
        setTimeout(() => {


            string_select.addEventListener('change', function () {
                self.setValue_column(string_select.value.trim(),col)
                self._validateInput(string_select, error_span, label_text, label)

                if(formDrivenProp_check){
                    const oneOf = [...form_drivingProp[prop].oneOf]
                    const selectedValue = string_select.value
                    let matched_oneOf = {}

                    //finding out the object from oneOf that matches the selectedValue
                    for(let index = 0; index < oneOf.length; index++){
                        let obj = oneOf[index]
                        if(obj['properties']){
                            if(obj['properties'].hasOwnProperty(prop)){
                                if(obj['properties'][prop].hasOwnProperty('const')){
                                    if(selectedValue === obj['properties'][prop]['const']){
                                        matched_oneOf = {...obj}
                                        break;
                                    }
                                }else if(obj['properties'][prop].hasOwnProperty('enum')){
                                    if(obj['properties'][prop]['enum'].includes(selectedValue)){
                                        matched_oneOf = {...obj}
                                        break;
                                    }
                                }
                            }
                        }
                        if(Object.keys(matched_oneOf).length > 0){
                            break;
                        }
                    }

                    if(matched_oneOf){
                        const matchedOneOfCopy = _.cloneDeep(matched_oneOf) 
                        let _mergeData;
                        let _commonFields;

                        // deleting the property that is already pressent in the form from the matches_oneOf.proerties
                        for(const pros in matchedOneOfCopy['properties']){
                            if(pros === prop){
                                delete matchedOneOfCopy['properties'][pros];
                                break;
                            }
                        }
                        if(matchedOneOfCopy.hasOwnProperty('oneOf')){
                            _commonFields = self.extractCommonFieldsFromOneOf(matchedOneOfCopy);
                    
                            _mergeData = self.mergeProperties(_commonFields, matchedOneOfCopy, prop)
                        }else{
                            _mergeData = {
                                "form_drivingProp" : null,
                                "mergeProp" : matchedOneOfCopy
                            }
                        }

                        //Adding this attribute only to know the fields that are added on change event and link them with parent
                        let paramVal = `linkedTo_${string_select.getAttribute('name')}`
                        let addAttr = {
                            "extraParams" : paramVal
                        }
                        const elements = self.shadowRoot.querySelectorAll(`[linkedto="${paramVal}"]`)
                        if(elements){
                            elements.forEach((element) => {

                                let linkto_attr = `linkedTo_${element.getAttribute('property')}`
                                let linked_toElement = self.shadowRoot.querySelectorAll(`[linkedto="${linkto_attr}"]`)
                                if(linked_toElement){
                                    linked_toElement.forEach((ele) => {
                                        ele.remove()
                                    })
                                }

                                element.remove();
                            })
                        }
                        // rowX.getAttribute('primary-row') is used if driving field
                        if(rowX.getAttribute('primary-row') === "true"){
                            self._generateForm_HTML(_mergeData, rowX, container_propObject, container_propArray, addAttr)
                        }else{
                            self._generateForm_HTML(_mergeData, rowX, null, null, addAttr)
                        }
                    }
                }
            })

            // calling this to trigger the event change if there is default value set
            if(property.hasOwnProperty('default')){
                let event = new Event('change');
                string_select.dispatchEvent(event);
            }
        }, 100)
    }

    _stringInt_noEnum(prop, property, requiredProp, form_drivingProp, rowX, setAttr) {

        const self = this;
        let setId;
        const requiredProp_check = requiredProp.includes(prop) ? true : false
        // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty('property') ? ( form_drivingProp.property.includes(prop) ? true : false ) : false
        // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ?  true : false;
        
        const col = document.createElement('div')
        col.classList.add('col-md-6')
        col.setAttribute("property", prop)
        col.setAttribute("property-type", property.type ? property.type : "")
        col.setAttribute("required", requiredProp_check)
        // col.setAttribute("form-driven", formDrivenProp_check)

        if (setAttr && Object.keys(setAttr).length > 1) {
            //check if setAttr has key and value property or not
            if(setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')){
                col.setAttribute(setAttr.key, setAttr.value)
                setId = `${setAttr.value}_${prop}`
            }
            
        } else {
            setId = prop
        }

        // setting the extra paramater attribute on the col so the same property can be used to remove the element if its link to elemnt changes its value
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            col.setAttribute("linkedTo",setAttr['extraParams'])
            // setId = prop
        }

        const form_group = document.createElement('div')
        form_group.classList.add('form-group', 'modify-formGroup')

        const label = document.createElement('label');
        const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
        label.setAttribute('for', setId)
        requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')

        label.textContent = label_text

        const input = document.createElement('input')
        input.style.border = 'none';
        let inputType = "";
        if (property.type === 'string') {

            if (property.hasOwnProperty('format') && property.format === 'date') {
                inputType = 'date'
            } else {
                inputType = 'string'
            }

        } else if (property.type === 'integer') {
            inputType = 'number'
        }

        input.type = inputType ? inputType : 'string'
        input.classList.add('form-control', 'border-bottom', 'modify-input');
        input.setAttribute('actual-name', prop)
        input.setAttribute('id', setId)
        input.setAttribute('name', setId)
        if (property.hasOwnProperty('default')) {
            input.value = property['default']
        }
        self._addValidations(input, property)

        const span = self.createSpanTag(property)
        const error_span = document.createElement('span')
        error_span.classList.add('error_span')

        form_group.append(label, input, span, error_span)
        col.appendChild(form_group)
        rowX.appendChild(col);

        setTimeout(() => {

            input.addEventListener('keydown', function (e) {
                let keyCode = e.keyCode || e.which
                if(property.type === 'integer'){
                    if (
                        (keyCode >= 48 && keyCode <= 57) ||     // 0-9
                        keyCode === 8 || // Backspace
                        keyCode === 9 || // Tab
                        keyCode === 37 || // Left arrow
                        keyCode === 39 || // Right arrow
                        keyCode === 46 // Delete
                     ) {
                        return true
                    } else {
                        e.preventDefault(); // Prevent the key press
                      }
                }
            })

            input.addEventListener("input", function() {
                self.setValue_column(input.value.trim(), col)
                self._validateInput(input, error_span, label_text, label)
              });

            // calling this to trigger the event change if there is default value set
            if(property.hasOwnProperty('default')){
                let event = new Event('input');
                input.dispatchEvent(event);
            }

        }, 100)
    }

    _boolean_noEnum(prop, property, requiredProp, form_drivingProp, rowX, container_propObject, container_propArray, setAttr) {
        const self = this;
        let setId;
        // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty('property') ? ( form_drivingProp.property.includes(prop) ? true : false ) : false
        const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty(prop) ?  true : false;
        
        const requiredProp_check = requiredProp.includes(prop) ? true : false

        const col = document.createElement('div')
        col.classList.add('col-md-6')
        col.setAttribute("property", prop)
        col.setAttribute("property-type", property.type ? property.type : "")
        col.setAttribute("required", requiredProp_check)
        col.setAttribute("form-driven", formDrivenProp_check)

        if (setAttr && Object.keys(setAttr).length > 1) {
            //check if setAttr has key and value property or not
            if(setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')){
                col.setAttribute(setAttr.key, setAttr.value)
                setId = `${setAttr.value}_${prop}`
            }
        } else {
            setId = prop
        }
        // setting the extra paramater attribute on the col so the same property can be used emove the element if its link to elemnt changes its value
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            col.setAttribute("linkedTo",setAttr['extraParams'])
            // setId = prop
        }

        const form_group = document.createElement('div')
        form_group.classList.add('form-group', 'modify-formGroup')

        const label = document.createElement('label');
        const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
        label.setAttribute('for', setId)
        label.classList.add('modify-label_radio')
        requiredProp_check ? label.classList.add('modify-label_radio', 'required') : label.classList.add('modify-label_radio')

        label.textContent = label_text

        //True Case//
        const div_true = document.createElement('div');
        div_true.classList.add('form-check', 'form-check-inline', 'boolean_div')

        const input_true = document.createElement('input')
        input_true.type = 'radio'
        input_true.classList.add('form-check-input');
        input_true.setAttribute('actual-name', prop)
        input_true.setAttribute('id', `${setId}_boolean-true`)
        input_true.setAttribute('name', `${setId}_boolean`)


        input_true.value = true;
        if (property.hasOwnProperty('default') && property['default'] === true) {
            input_true.setAttribute('checked', true)
        }

        const label_true = document.createElement('label');
        label_true.setAttribute('for', `${setId}_boolean-true`)
        label_true.classList.add('form-check-label')
        label_true.textContent = "True"

        div_true.append(input_true, label_true)

        //False Case//
        const div_false = document.createElement('div');
        div_false.classList.add('form-check', 'form-check-inline', 'boolean_div')

        const input_false = document.createElement('input')
        input_false.type = 'radio'
        input_false.classList.add('form-check-input');
        input_false.setAttribute('actual-name', prop)
        input_false.setAttribute('id', `${setId}_boolean-false`)
        input_false.setAttribute('name', `${setId}_boolean`)
        input_false.value = false;
        if (property.hasOwnProperty('default') && property['default'] === false) {
            input_false.setAttribute('checked', true)
        }

        const label_false = document.createElement('label');
        label_false.setAttribute('for', `${setId}_boolean-false`)
        label_false.classList.add('form-check-label')
        label_false.textContent = "False"

        div_false.append(input_false, label_false)

        const span = self.createSpanTag(property)
        const error_span = document.createElement('span')
        error_span.classList.add('error_span','booelan_error_span')

        form_group.append(label, div_true, div_false, span, error_span)
        col.appendChild(form_group)
        rowX.appendChild(col);

        setTimeout(() => {
            const id =  `input[name="${setId}_boolean"]`
            const radioBtn = self.shadowRoot.querySelectorAll(id)

            radioBtn.forEach((btn) => {
                btn.addEventListener('change', function(){
                if(btn.value){
                    self.setValue_column(btn.value,col)
                    self._validateInput(btn, error_span, label_text, label)

                    if(formDrivenProp_check){
                        const oneOf = [...form_drivingProp[prop].oneOf]
                        let matched_oneOf;
                        let selectedValue = btn.value ;

                        //finding out the object from oneOf that matches the selectedValue
                        for(const obj of oneOf){

                            if(obj['properties']){
                                for(const proa in obj['properties']){
                                    if(proa === prop){
                                        if(typeof selectedValue === 'string' || typeof obj['properties'][proa]['const'] === 'string' ){
                                            selectedValue = JSON.parse(selectedValue)
                                            obj['properties'][proa]['const'] = JSON.parse(obj['properties'][proa]['const'])
                                        }
                                        if (selectedValue === obj['properties'][proa]['const']){
                                            matched_oneOf = {...obj}
                                            break;
                                        }
                                    }
                                }
                            }
                            if(matched_oneOf){
                                break;
                            }
                        }

                        if(matched_oneOf){
                            let matchedOneOfCopy = _.cloneDeep(matched_oneOf)
                            let _mergeData;
                            let _commonFields;
                            // deleting the property that is already pressent in the form from the matches_oneOf.proerties
                            for(const pros in matchedOneOfCopy['properties']){
                                if(pros === prop){
                                    delete matchedOneOfCopy['properties'][pros];
                                    break;
                                }
                            }

                            if(matchedOneOfCopy.hasOwnProperty('oneOf')){
                                _commonFields = self.extractCommonFieldsFromOneOf(property);
                                _mergeData = self.mergeProperties(_commonFields, property, prop)
                            }else{
                                _mergeData = {
                                    "form_drivingProp" : null,
                                    "mergeProp" : matchedOneOfCopy
                                }
                            }
                            // let _mergeData = {
                            //     "form_drivingProp" : null,
                            //     "mergeProp" : matchedOneOfCopy
                            // }
                            let paramVal = `linkedTo_${btn.getAttribute('name')}`
                            let addAttr
                            if(setAttr){
                                //adding extraParams only if this the case getting already iterated from type array
                                setAttr['extraParams'] = paramVal
                            }else{
                                //adding extraParams if this type boolean is a formDrivng faactor but not iterated from array
                                addAttr = {
                                    "extraParams" : paramVal
                                }
                            }
                            //below is to remove the appeneded divs on change event
                            const elements = self.shadowRoot.querySelectorAll(`[linkedto="${paramVal}"]`)
                            if(elements){
                                elements.forEach((element) => {
                                    element.remove();
                                })
                            }

                            if(_mergeData && Object.keys(_mergeData.mergeProp['properties']).length > 0){
                                const row_type = rowX.getAttribute('property-type')
                                const tempDiv = document.createElement('div')

                                //checking row_type if the value being appended is in array or not . if array then creating a tempDiv an dappending the col-md-6 divs in it and later on removing it from tempDiv and appending it at its correct index
                                self._generateForm_HTML(_mergeData, row_type === "array" ? tempDiv : rowX, null, null, setAttr ? setAttr : addAttr)
    
                                if(row_type === "array"){
                                    // code that will remove the divs from tempDiv and append at its exact index
                                    setTimeout(() => {
                                        //taking child div from the row in which all the col-md-6 are appended according to their correct sequence
                                        const childElements = rowX.children
                                        const divElements = []
    
                                        //Pushing col-md-6 that have prop_property & prop_measure_index both. This will remove the div the have  buttons and breaker
                                        for(let i = 0; i < childElements.length; i++){   //property  measures-index
                                            const childElement = childElements[i];
                                            const prop_property = childElement.getAttribute('property');
                                            const prop_measure_index = childElement.getAttribute(setAttr.key)           //setAttr object will be present as it was previously iterated from array
                                            if(childElement.tagName.toLowerCase() === 'div' && prop_property && prop_measure_index){
                                                divElements.push(childElement)
                                            }
                                        }
                                        //Extracting the index to exactly append the element after it
                                        let attr_name = btn.getAttribute('name')
                                        let extractedIndex;
                                        let parts = attr_name.split('_');
                                        if(parts.length > 0){
                                            extractedIndex = parts[0]
                                        }
    
                                        //setting lastArrayDiv to the last div that matches with the index where we want to insert thetempDiv.children
                                        let lastArray1Div = null;
                                        divElements.forEach((divElement) => {
                                            if (divElement.getAttribute(setAttr.key) === extractedIndex) {
                                                lastArray1Div = divElement;
                                            }
                                        });
    
                                        // inserting tempDiv.children after the lastArrayDiv
                                        if (lastArray1Div) {
                                            // console.log(tempDiv.children)
                                            let x = tempDiv.children
    
                                            for(let i = 0; i < x.length; i++){
                                                lastArray1Div.parentNode.insertBefore(x[i], lastArray1Div.nextSibling);
                                            }
                                        }
                                    },200)
                                }
                            }
                        }
                    }
                }
                })
            })


            const checkedId = `input[name="${setId}_boolean"]:checked`
            const selectedBtn = self.shadowRoot.querySelector(checkedId)
            
            let event = new Event('change')
            selectedBtn.dispatchEvent(event)
            self.setValue_column(selectedBtn.value, col)

        }, 100)


    }

    _array_Enum(prop, property, requiredProp, form_drivingProp, rowX, setAttr) {
        const self = this;
        let setId;
        const requiredProp_check = requiredProp.includes(prop) ? true : false
        const prop_default = property.hasOwnProperty('default') ?  (Array.isArray(property.default) ? property.default : [property.default]) : []
        // const formDrivenProp_check = form_drivingProp && form_drivingProp.hasOwnProperty('property') ? ( form_drivingProp.property.includes(prop) ? true : false ) : false

        const col = document.createElement('div')
        col.classList.add('col-md-6')
        col.setAttribute("property", prop)
        col.setAttribute("property-type", `${property.type}-multiselect` )
        col.setAttribute("required", requiredProp_check)
        // col.setAttribute("form-driven", formDrivenProp_check)

        if (setAttr && Object.keys(setAttr).length > 1) {
            //check if setAttr has key and value property or not
            if(setAttr.hasOwnProperty('key') && setAttr.hasOwnProperty('value')){
                col.setAttribute(setAttr.key, setAttr.value)
                setId = `${setAttr.value}_${prop}`
            }
        } else {
            setId = prop
        }

        // setting the extra paramater attribute on the col so the same property can be used toremove the element if its link to elemnt changes its value
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            col.setAttribute("linkedTo",setAttr['extraParams'])
            // setId = prop
        }

        const form_group = document.createElement('div')
        form_group.classList.add('form-group', 'modify-formGroup')

        const label = document.createElement('label');
        const label_text = property.hasOwnProperty('displayName') ? property.displayName : prop
        label.setAttribute('for', setId)
        requiredProp_check ? label.classList.add('modify-label', 'required') : label.classList.add('modify-label')
        label.textContent = label_text

        const _div = document.createElement('div')
        _div.className = "custom-dropdown"

        const _input = document.createElement('input')
        _input.type = "text"
        _input.placeholder = "Multiple select options"
        _input.readOnly = true
        _input.style.border = 'none';
        _input.classList.add('form-control', 'border-bottom', 'modify-input', 'multi-select');

        const __div = document.createElement('div')
        __div.id = "dropdownSelect"
        __div.classList.add('dropdown-select', 'custom-rounded', 'shadow', 'mb-3', 'bg-white', 'rounded');

        const _ul = document.createElement('ul')
        _ul.style.paddingLeft = "0px"
        for (const val of property.items.enum) {
            const _li = document.createElement('li');
            _li.textContent = val;
            _li.className = "checkbox-option"
            _li.id = setId

            const input_inLi = document.createElement('input')
            input_inLi.type ="checkbox"
            input_inLi.value = val
            input_inLi.innerText = val
            input_inLi.className= 'custom-checkBox'
            prop_default.includes(val) ? input_inLi.checked = true : input_inLi.checked = false 

            _li.appendChild(input_inLi)
            _ul.appendChild(_li);
        }
        __div.appendChild(_ul)
        _div.append(_input, __div)

        const span = self.createSpanTag(property)
        form_group.append(label, _div , span)
        col.appendChild(form_group)
        rowX.appendChild(col);


        setTimeout(() => {
            const dropdown = self.shadowRoot.getElementById('dropdownSelect');

            _div.addEventListener('click', () => {
                // const dropdown = self.shadowRoot.getElementById('dropdownSelect');
                if (dropdown.style.display === '' ) {
                  dropdown.style.display = 'block';
                }  else{
                  dropdown.style.display = 'block';
                }

                const selectedOptions = [];
                const id = `#${setId} input[type="checkbox"]`
                const checkboxOptions = self.shadowRoot.querySelectorAll(id);
                checkboxOptions.forEach(function(checkbox) {
                  if (checkbox.checked) {
                    selectedOptions.push(checkbox.value);
                  }
                });
                if(selectedOptions.length > 0){
                    _input.placeholder = selectedOptions.toString()
                    self.setValue_column(selectedOptions.toString(), col)
                }else{
                    _input.placeholder = "Multiple select options"
                }

                self.shadowRoot.addEventListener('click', function(event) {
                    // const dropdown = self.shadowRoot.getElementById('dropdownSelect');
                    if (!event.target.closest('.custom-dropdown') && dropdown.style.display === 'block') {
                      dropdown.style.display = 'none';
                    }
                  });

            })

            if(prop_default){
                let event = new Event('click');
                _div.dispatchEvent(event);
                dropdown.style.display = 'none';
            }
        },500)


    }

    __object(prop, property, requiredProp, form_drivingProp, rowX, container_propObject, setAttr) {
        const self = this;

        let _commonFields
        let _mergeData;

        if(!property.hasOwnProperty('oneOf')){      // if no oneOf found in property then create _mergeData
            _mergeData = {
                "form_drivingProp": null,
                "mergeProp": {
                    "properties": property['properties'],
                    "required": property['required']
                }
            }
        }else{                                                                           // if oneOf found then _merge data will be created by below functions
            _commonFields = self.extractCommonFieldsFromOneOf(property);
            _mergeData = self.mergeProperties(_commonFields, property, prop)
        }
        


        // let addAttr = null
        //     if(!setAttr){
        //         const key = `${prop}-index`
        //         const value =  `${prop}[0]`
        //         addAttr = {
        //             'key' : key,
        //             'value' : value,
        //             'property-name' : prop
        //         }
        //     }else{
        //         addAttr = setAttr
        //     }
        const container = self.createNewRow('container')
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            container.setAttribute("linkedTo",setAttr['extraParams'])
        }
        const rowIn_container = self.createNewRow('row')
        rowIn_container.classList.add('category-container');
        const category_header = property.hasOwnProperty('displayName') ? property.displayName : prop
        rowIn_container.setAttribute('data-form-title', category_header);
        rowIn_container.setAttribute('property-type', "object");
        rowIn_container.setAttribute('major-name', prop);

        self._generateForm_HTML(_mergeData, rowIn_container, null, null, setAttr)
        container.appendChild(rowIn_container)
        if (container_propObject) {
            container_propObject.appendChild(container)
        } else {
            rowX.appendChild(container)
        }
    }

    __array(prop, property, requiredProp, form_drivingProp, rowX, container_propArray, setAttr) {

        const self = this;
        const requiredProp_check = requiredProp.includes(prop) ? true : false
        let _commonFields
        let _mergeData;
        let add_BtnBreaker = true

        if(!property.hasOwnProperty('items')){
            _mergeData = {
                "form_drivingProp": null,
                "mergeProp": {
                    "properties": property['properties'],
                    "required": property['required'] ? property['required'] : []
                }
            }

        }else if(property && property.items && !property.items.hasOwnProperty('oneOf') && !property.items.hasOwnProperty('allOf')){
            _mergeData = {
                "form_drivingProp": null,
                "mergeProp": {
                    "properties": property.items['properties'],
                    "required": property.items['required']
                }
            }
        
        }else if(property && property.items && property.items.hasOwnProperty('oneOf') && !property.items.hasOwnProperty('allOf')){
            _commonFields = self.extractCommonFieldsFromOneOf(property.items);
            _mergeData = self.mergeProperties(_commonFields, property.items)
        
        }else if(property && property.items && property.items.hasOwnProperty('allOf')){
            let allOf = property.items.allOf
            let allMerge = {}
            for(const item in allOf){
                const data = allOf[item]
                let temp_commonFields = self.extractCommonFieldsFromOneOf(data);

                let temp_mergeData = self.mergeProperties(temp_commonFields, data)

                if(temp_mergeData){
                    allMerge[item] = temp_mergeData
                }
            }
            if (Object.keys(allMerge).length > 0) {
                // Merge the objects into one
                const mergedObject = {
                    "form_drivingProp": null,
                    "mergeProp": {
                        "properties": null,
                        "required": null
                    }
                };

                // Iterate through the provided objects
                for (const key in allMerge) {
                    if(allMerge[key].form_drivingProp){
                        mergedObject['form_drivingProp'] = {...allMerge[key]["form_drivingProp"]}
                    }
                    if(allMerge[key].mergeProp.properties){
                        if( mergedObject['mergeProp']['properties']){
                            mergedObject['mergeProp']['properties'] = {...mergedObject['mergeProp']['properties'], ...allMerge[key]['mergeProp']['properties']}
                        }else{
                            mergedObject['mergeProp']['properties'] = {...allMerge[key]['mergeProp']['properties']}
                        }
                    }
                    if(allMerge[key].mergeProp.required){
                        if( mergedObject['mergeProp']['required']){
                            mergedObject['mergeProp']['required'] = [...mergedObject['mergeProp']['required'], ...allMerge[key]['mergeProp']['required']]
                        }else{
                            mergedObject['mergeProp']['required'] = [...allMerge[key]['mergeProp']['required']]
                        }
                       
                    }
                }
                _mergeData = mergedObject
            }
        }

        let addAttr = null
        if ((setAttr && Object.keys(setAttr).length === 1) || !setAttr) {
            const key = `${prop}-index`
            const value = `${prop}[0]`
            addAttr = {
                'key': key,
                'value': value,
                'property-name': prop,
                'extraParams' : null
            }
        } else {
            addAttr = setAttr
        }

        // iterationIndex is created to check if there should be add and remove button or only add button if its the fist instance of array
        let iterationIndex = addAttr.value.match(new RegExp(`${prop}\\[(\\d+)\\]`));

        const container = self.createNewRow('container')
        if(setAttr && setAttr.hasOwnProperty('extraParams') && setAttr.extraParams){
            container.setAttribute("linkedTo",setAttr['extraParams'])
        }
        const rowIn_container = self.createNewRow('row')
        rowIn_container.classList.add('category-container');
        const displayName = property.hasOwnProperty('displayName') ? property.displayName : prop
        const category_header = requiredProp_check ? `${displayName}  *` : displayName
        rowIn_container.setAttribute('data-form-title', category_header);
        rowIn_container.setAttribute('property-type', "array");
        rowIn_container.setAttribute('major-name', prop);
        rowIn_container.setAttribute('highest-index', addAttr.value)        // setting this to have the highest index of object that was inserted in array

        self._generateForm_HTML(_mergeData, rowIn_container, null, null, addAttr)

        if(add_BtnBreaker){
            const button_div = self.createButtons(iterationIndex, addAttr)

            let breaker = document.createElement('div')
            breaker.classList.add('col-md-12', 'breaker')
            breaker.setAttribute(addAttr.key, addAttr.value)
            
            rowIn_container.appendChild(button_div)
            rowIn_container.appendChild(breaker)
    
            setTimeout(() => {
                const addbtn = self.shadowRoot.getElementById(`add_${addAttr.value}`)
                addbtn.addEventListener('click', function () {
                    self.appendObject_inArray(_mergeData, addAttr, addbtn)
                })
            }, 1000)
        }
        container.appendChild(rowIn_container)
    
        if (container_propArray) {
            container_propArray.appendChild(container)
        } else {
            rowX.appendChild(container)
        }
        

    }


    _addValidations(element, iterateProp){
    
        for (const prop in iterateProp) {
            const property = iterateProp[prop]
            switch (true) {
                case prop === 'minimum' && typeof property !== ('object' || 'array'):
                    element.setAttribute('min', property)
                    break;
                // ================================
                case prop === 'maximum' && typeof property !== ('object' || 'array'):
                    element.setAttribute('max', property)
                    break;
                // ================================
                case prop ==='pattern' && typeof property !== ('object' || 'array'):
                    element.setAttribute('pattern', property)
                    break;
                // ================================
                case (prop === 'minLength' || prop === 'minlength') && typeof property !== ('object' || 'array'):
                    const min_val = (prop === 'minLength') ? iterateProp.minLength : iterateProp.minlength
                    element.setAttribute('minlength', min_val)
                    break;
                // ================================
                case (prop === 'maxLength' || prop === 'maxlength') && typeof property !== ('object' || 'array'):
                    const max_val = (prop === 'maxLength') ? iterateProp.maxLength : iterateProp.maxlength
                    element.setAttribute('maxlength', max_val)
                    break;
                // ================================
                default:
                    break;
            }
        }
        return element
    }
        // Function to validate an individual input element
    _validateInput(element, error_span, display_name, label) {
        const self = this;
        const value = element.value;
        const fieldName = display_name; // Get the field's actual name
        const pattern = element.getAttribute('pattern')

        const addError = () => {
            element.classList.add('error_input')
            label.classList.add('error_label')
        }
        const removeError = () => {
            element.classList.remove('error_input')
            label.classList.remove('error_label')
        }

        if (element.tagName === 'INPUT') {
            // Reset custom validity
            element.setCustomValidity('');
            // Check required fields
            if (/^\s+$/.test(value)) {
                element.setCustomValidity(`Only space(s) are not allowed.`);
                self._displayError(element, error_span, `Only space(s) are not allowed.`);
                addError()

                return false;
            }

            const trimmedValue = value.trim()

            // Validate based on other attributes like min, max, minlength, maxlength, and pattern
            // if(element.hasAttribute('min')){
            //     if (trimmedValue === "") {
            //         element.setCustomValidity(`${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
            //         self._displayError(element, error_span, `${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
            //         addError()
            //         return false;
            //     }else if ( parseFloat(trimmedValue) < parseFloat(element.getAttribute('min'))) {
            //         element.setCustomValidity(`${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
            //         self._displayError(element, error_span, `${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
            //         addError()
            //         return false;
            //     }
            // }


            if(trimmedValue === ""){
                self._displayError(element, error_span, '');
                removeError()
                return true;
            }

            //  // Check required fields
            //  if (element.hasAttribute('required') && value === '') {
            //    element.setCustomValidity(`${fieldName} is required.`);
            //    displayError(element, `${fieldName} is required.`);
            //    return false;
            //  }

            if (element.hasAttribute('min') && parseFloat(trimmedValue) < parseFloat(element.getAttribute('min'))) {
                element.setCustomValidity(`${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
                self._displayError(element, error_span, `${fieldName} must be greater than or equal to ${element.getAttribute('min')}.`);
                addError()
                return false;
            }

            if (element.hasAttribute('max') && parseFloat(trimmedValue) > parseFloat(element.getAttribute('max'))) {
                element.setCustomValidity(`${fieldName} must be less than or equal to ${element.getAttribute('max')}.`);
                self._displayError(element, error_span, `${fieldName} must be less than or equal to ${element.getAttribute('max')}.`);
                addError()
                return false;
            }

            if (element.hasAttribute('minlength') && trimmedValue.length < parseInt(element.getAttribute('minlength'))) {
                element.setCustomValidity(`${fieldName} must have a minimum length of ${element.getAttribute('minlength')}.`);
                self._displayError(element, error_span, `${fieldName} must have a minimum length of ${element.getAttribute('minlength')}.`);
                addError()
                return false;
            }

            if (element.hasAttribute('maxlength') && trimmedValue.length > parseInt(element.getAttribute('maxlength'))) {
                element.setCustomValidity(`${fieldName} must have a maximum length of ${element.getAttribute('maxlength')}.`);
                self._displayError(element, error_span, `${fieldName} must have a maximum length of ${element.getAttribute('maxlength')}.`);
                addError()
                return false;
            }

            if (element.hasAttribute('pattern') && !new RegExp(pattern).test(trimmedValue)) {
                element.setCustomValidity(`Invalid ${fieldName}.`);
                self._displayError(element, error_span, `Invalid ${fieldName}.`);
                addError()
                return false;
            }

            // If no validation errors were found, clear the error message
            self._displayError(element, error_span, '');
            removeError()
            return true;

        } else if (element.tagName === 'SELECT') {
            // Reset custom validity
            element.setCustomValidity('');
            if (element.hasAttribute('required')) {
                if (element.value === '') {
                    element.setCustomValidity(`${fieldName} is required`)
                    self._displayError(element, error_span, `${fieldName} is required`)
                    return false;
                }
            }
        } else if (element.type === 'checkbox' || element.type === 'radio') {
            const fieldset = element.closest('fieldset');
            const checkedInputs = fieldset.querySelectorAll('[type="checkbox"]:checked, [type="radio"]:checked');
            if (checkedInputs.length === 0) {
                fieldset.setCustomValidity(`${fieldName} is required.`)
                self._displayError(element, error_span, `${fieldName} is required.`)
                return false;
            }
        }

    }

    // Function to display error messages
    _displayError(element, error_span, message) {
        error_span.textContent = message;
    }

    // Function to clear error messages
    _clearErrors() {
        const errorSpans = document.querySelectorAll('.error_span');
        errorSpans.forEach(span => {
            span.textContent = '';
        });
    }

    generateIncrementalId = (prop, wholeId) => {
        const match = wholeId.match(new RegExp(`${prop}\\[(\\d+)\\]`));

        if (match) {
            const currentNumber = parseInt(match[1]);
            const newIndex = currentNumber + 1;
            const newId = `${prop}[${newIndex}]`;
            return newId;
        } else {
            throw new Error(`Invalid format for ${wholeId}`);
        }
    }

    removeObject_fromArray(setAttr, removetbtn) {
        const self = this
        let value = `[${setAttr.key}="${setAttr.value}"]`
        const removeArray = self.shadowRoot.querySelectorAll(value)

        removeArray.forEach((obj) => {
            obj.remove()
        })

    }

    appendObject_inArray(_mergeData, addAttr, addbtn) {
        const self = this;
        const prop = addAttr['property-name']
        const rowIn_container = self.shadowRoot.querySelector(`[major-name='${prop}']`)
        const highestIndex = rowIn_container.getAttribute('highest-index')
        let incrementalId = self.generateIncrementalId(prop, highestIndex)
        const key = `${addAttr['property-name']}-index`
        const setAttr = {
            'key': key,
            'value': incrementalId,
            'property-name': prop
        }
        rowIn_container.setAttribute('highest-index', incrementalId)
        self._generateForm_HTML(_mergeData, rowIn_container, null, null, setAttr)


        let iterationIndex = incrementalId.match(new RegExp(`${prop}\\[(\\d+)\\]`));
        const button_div = self.createButtons(iterationIndex, setAttr)

        let breaker = document.createElement('div')
        breaker.classList.add('col-md-12', 'breaker')
        breaker.setAttribute(setAttr.key, setAttr.value)

        rowIn_container.appendChild(button_div)
        rowIn_container.appendChild(breaker)

        setTimeout(() => {
            const addbtn = self.shadowRoot.getElementById(`add_${setAttr.value}`)
            addbtn.addEventListener('click', function () {
                self.appendObject_inArray(_mergeData, setAttr, addbtn)
            })

            const removetbtn = self.shadowRoot.getElementById(`remove_${setAttr.value}`)
            removetbtn.addEventListener('click', function () {
                self.removeObject_fromArray(setAttr, removetbtn)
            })
        }, 1000)
    }

    createButtons(iteration, addAttr) {
        const button_div = document.createElement('div')
        button_div.classList.add('col-md-12', 'btn-colPos')
        // below line will be used while rmemoving an array of object. queryselecting all elements using addAttr.key.
        button_div.setAttribute(addAttr.key, addAttr.value)


        const button_add = document.createElement('button')
        button_add.textContent = "Add"
        button_add.id = `add_${addAttr.value}`
        button_add.type = "button"
        button_add.classList.add('btn', 'btn-light', 'btn-lg', 'mr-3', 'btn-boxShadow')

        button_div.appendChild(button_add)
        if (parseInt(iteration[1]) > 0) {
            const button_remove = document.createElement('button')
            button_remove.textContent = "Remove"
            button_remove.id = `remove_${addAttr.value}`
            button_remove.type = "button"
            button_remove.classList.add('btn', 'btn-light', 'btn-lg', 'btn-boxShadow')
            button_div.appendChild(button_remove)
        }
        return button_div
    }

    createNewRow(cls) {
        const newRow = document.createElement('div')
        newRow.classList.add(cls)
        return newRow
    }

    createSpanTag(property) {
        const span = document.createElement('span')
        span.classList.add('info-icon')
        span.innerHTML = '&#9432;'
        span.setAttribute('title', property.hasOwnProperty('description') ? property['description'] : "")

        return span
    }

    setValue_column(eleVal,column) {
        column.setAttribute('value', eleVal )
    }
	
	submitForm(self) {
        const form = self.shadowRoot.querySelector('#submitBtn');
        form.addEventListener('click', function () {
            //Populate commonProperties in 
            const commonProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="commonProperties"]`);
            if (commonProperties_elements) {
                commonProperties_elements.forEach((element) => {
                    const commonProperties_row_elements = element.querySelectorAll(`[primary-row="true"]`);
                    commonProperties_row_elements.forEach((row_element) => {
                        row_element.childNodes.forEach((child_row_element) => {
                            if (child_row_element.getAttribute('property-type') === 'integer' || child_row_element.getAttribute('property-type') === 'number') {
                                self.formProperties[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? parseInt(child_row_element.getAttribute('value')) : "";
                            }
                            else if (child_row_element.getAttribute('property-type') === 'boolean') {
                                self.formProperties[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                            } else {
                                self.formProperties[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value');
                            }
    
                        });
                    });
                });
            }
    
            const objectProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="objectProperties"]`);
            if (objectProperties_elements) {
                objectProperties_elements.forEach((element) => {
                    const objectProperties_row_elements = element.querySelectorAll(`[property-type="object"]`);
                    objectProperties_row_elements.forEach((row_element) => {
                        let object_name = row_element.getAttribute('major-name');
                        let objectProperties_row_obj = {};
                        row_element.childNodes.forEach((child_row_element) => {
                            if (child_row_element.getAttribute('property-type') === 'integer' || child_row_element.getAttribute('property-type') === 'number') {
                                objectProperties_row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? parseInt(child_row_element.getAttribute('value')) : "";
                            }
                            else if (child_row_element.getAttribute('property-type') === 'boolean') {
                                objectProperties_row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                            } else {
                                objectProperties_row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value');
                            }
                            self.formProperties[`${object_name}`] = objectProperties_row_obj;
                        });
                    });
                });
            }
    
            const arrayProperties_elements = self.shadowRoot.querySelectorAll(`[container-type="arrayProperties"]`);
            if (arrayProperties_elements) {
                arrayProperties_elements.forEach((element) => {
                    const arrayProperties_row_elements = element.querySelectorAll('.container');
                    let object_name = '';
                    let arrayProperties_row_obj = [];
                    let row_obj = {};
                    arrayProperties_row_elements.forEach((row_element_container) => {
                        const arrayProperties_row_elements = row_element_container.querySelectorAll('.category-container');
                        arrayProperties_row_elements.forEach((row_element) => {
                            object_name = row_element.getAttribute('major-name');
                            row_element.childNodes.forEach((child_row_element) => {
                                if (child_row_element.getAttribute('property-type') === 'integer' || child_row_element.getAttribute('property-type') === 'number') {
                                    row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? parseInt(child_row_element.getAttribute('value')) : "";
                                }
                                else if (child_row_element.getAttribute('property-type') === 'boolean') {
                                    row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value') !== "" ? JSON.parse(child_row_element.getAttribute('value')) : "";
                                } else {
                                    row_obj[child_row_element.getAttribute('property')] = child_row_element.getAttribute('value');
                                }
                            });
                        });
                        arrayProperties_row_obj.push(row_obj);
                        self.formProperties[`${object_name}`] = arrayProperties_row_obj;
                    });
                });
            }

            console.log(self.formProperties);

            const ajv = new Ajv();
            const validate = ajv.compile(updated_mmSchema);
    
            const valid = validate(self.formProperties)
            if (!valid) {
                console.log(validate.errors)
            }
        });
    }
}
customElements.define('cwe-jsonrenderer', JSONRenderer);