export const plotSchema = {
  input_schema: {
    description: "cSonNet Plot Schema",
    properties: {
      dpi: {
        default: 600,
        description:
          "Dots-per-inch specification on plot resolution.  600 dpi is standard for pub quality.",
        exclusiveMinimum: 0,
        type: "integer",
      },
      line_width: {
        default: 4,
        description: "The thickness of curves on the plots connecting data.",
        exclusiveMinimum: 0,
        type: "integer",
      },
      output_filetype: {
        description: "The type of plot output file (add period)",
        enum: ["pdf", "png", "ps", "svg", "eps"],
        type: "string",
      },
      plot_types: {
        properties: {
          bar_plot: {
            oneOf: [
              {
                properties: {
                  exists: {
                    description: "If true, then generate a bar plot",
                    type: "boolean",
                    const: false,
                  },
                },
                required: ["exists"],
              },
              {
                properties: {
                  bar_annotation_fontsize: {
                    default: 10,
                    description: "Font size for annotations by bars",
                    exclusiveMinimum: 0,
                    type: "integer",
                  },
                  bar_width: {
                    default: 0.25,
                    description: "Width of bars on plot",
                    exclusiveMinimum: 0,
                    type: "number",
                  },
                  exists: {
                    description: "If true, then generate a bar plot",
                    type: "boolean",
                    const: true,
                  },
                },
                required: ["bar_annotation_fontsize", "bar_width", "exists"],
              },
            ],
          },
          errorbar_plot: {
            oneOf: [
              {
                properties: {
                  exists: {
                    description: "If true, then generate an error bar plot",
                    type: "boolean",
                    const: false,
                  },
                },
                required: ["exists"],
              },
              {
                properties: {
                  capwidth: {
                    defualt: 1,
                    description: "Thickness of error bars",
                    exclusiveMinimum: 0,
                    type: "integer",
                  },
                  capsize: {
                    default: 3,
                    description: "Width of the caps on the error bars",
                    exclusiveMinimum: 0,
                    type: "integer",
                  },
                  exists: {
                    description: "If true, then generate an error bar plot",
                    type: "boolean",
                    const: true,
                  },
                  show_error_every: {
                    default: 1,
                    description:
                      "Value of q, where error bars are shown every q'th data point",
                    minimum: 1,
                    type: "integer",
                  },
                },
                required: ["capwidth", "capsize", "exists", "show_error_every"],
              },
            ],
          },
          line_plot: {
            description: "If true, then generate a line plot",
            type: "boolean",
          },
          scatter_plot: {
            description: "If true, then generate a scatter plot",
            type: "boolean",
          },
        },
        required: ["errorbar_plot", "line_plot", "scatter_plot", "bar_plot"],
        type: "object",
      },
      show_points: {
        description: "If true, show data points on each plot.",
        type: "boolean",
      },
      text_sections: {
        properties: {
          legend_section: {
            properties: {
              legend_fontsize: {
                default: 25,
                description: "Font size of legend text",
                minimum: 2,
                type: "integer",
              },
              legend_items: {
                description: "Items in the Legend",
                items: {
                  properties: {
                    alpha_value: {
                      description:
                        "Opacity for each curve on a plot.  Typically 1.",
                      default: 1,
                      maximum: 1,
                      minimum: 0,
                      type: "number",
                    },
                    data_color: {
                      description: "Colors for curves in plot",
                      enum: [
                        "red",
                        "black",
                        "brown",
                        "green",
                        "blue",
                        "magenta",
                        "cyan",
                        "orange",
                        "pink",
                        "khaki",
                      ],
                      type: "string",
                    },
                    legend_name: {
                      description:
                        "Textual strings for legend in plot to identify curves",
                      type: "string",
                    },
                  },
                  required: ["data_color", "alpha_value"],
                  type: "object",
                },
                minItems: 0,
                type: "array",
              },
            },
            required: ["legend_fontsize", "legend_items"],
            type: "object",
          },
          tick_section: {
            properties: {
              axes_in_scientfic: {
                description:
                  "Identify which axis ticks (if either) are to be shown in scientific notatation",
                enum: ["y", "x", "both", "neither"],
                type: "string",
              },
              tick_fontsize: {
                default: 35,
                description: "Font size of x- and y-axes tick labels",
                minimum: 2,
                type: "integer",
              },
            },
            required: ["tick_fontsize", "axes_in_scientific"],
            type: "object",
          },
          title_section: {
            properties: {
              title_fontsize: {
                default: 15,
                description: "Font size of title text",
                minimum: 2,
                type: "integer",
              },
              title_text: {
                description: "Title of plot.  Leave blank for no title.",
                type: "string",
              },
            },
            required: ["title_fontsize", "title_text"],
            type: "object",
          },
          x_axis_section: {
            properties: {
              set_x_increment: {
                description:
                  "True if setting increment in values along x-axis.",
                type: "boolean",
              },
              set_x_limits: {
                description: "True if setting limits for x-axis ticks",
                type: "boolean",
              },
              x_axis_fontsize: {
                default: 35,
                description: "Font size of x-axis label",
                minimum: 2,
                type: "integer",
              },
              x_axis_text: {
                description: "x-axis label.  Leave blank for no a-axis label.",
                type: "string",
              },
              x_increment: {
                description: "Increment value along x-axis tick labels",
                type: "number",
              },
              x_limit_higher: {
                description: "Maximum value on x-axis ticks",
                type: "number",
              },
              x_limit_lower: {
                description: "Minimum value on x-axis ticks",
                type: "number",
              },
              x_scale: {
                description: "Type of scale for x-axis",
                enum: ["linear", "log", "symlog"],
                type: "string",
              },
            },
            required: [
              "x_axis_fontsize",
              "x_axis_text",
              "x_scale",
              "set_x_limits",
              "set_x_increment",
            ],
            allOf: [
              {
                oneOf: [
                  {
                    properties: {
                      set_x_limits: {
                        type: "boolean",
                        const: false,
                      },
                    },
                  },
                  {
                    properties: {
                      set_x_limits: {
                        type: "boolean",
                        const: true,
                      },
                    },
                    required: ["x_limit_higher", "x_limit_lower"],
                  },
                ],
              },
              {
                oneOf: [
                  {
                    properties: {
                      set_x_increment: {
                        type: "boolean",
                        const: false,
                      },
                    },
                  },
                  {
                    properties: {
                      set_x_increment: {
                        type: "boolean",
                        const: true,
                      },
                    },
                    required: ["x_increment"],
                  },
                ],
              },
            ],
            type: "object",
          },
          y_axis_section: {
            properties: {
              set_y_increment: {
                description:
                  "True if setting increment in values along y-axis.",
                type: "boolean",
              },
              set_y_limits: {
                description: "True if setting limits for y-axis ticks",
                type: "boolean",
              },
              y_axis_fontsize: {
                default: 35,
                description: "Font size of y-axis label",
                minimum: 2,
                type: "integer",
              },
              y_axis_text: {
                description: "y-axis label.  Leave blank for no y-axis label.",
                type: "string",
              },
              y_increment: {
                description: "Increment value along y-axis tick labels",
                type: "number",
              },
              y_limit_higher: {
                description: "Maximum value on y-axis ticks",
                type: "number",
              },
              y_limit_lower: {
                description: "Minimum value on y-axis ticks",
                type: "number",
              },
              y_scale: {
                description: "type of scale for y-axis.",
                enum: ["linear", "log", "symlog"],
                type: "string",
              },
            },
            required: [
              "y_axis_fontsize",
              "y_axis_text",
              "y_scale",
              "set_y_limits",
              "set_y_increment",
            ],
            allOf: [
              {
                oneOf: [
                  {
                    properties: {
                      set_y_limits: {
                        type: "boolean",
                        const: false,
                      },
                    },
                  },
                  {
                    properties: {
                      set_y_limits: {
                        type: "boolean",
                        const: true,
                      },
                    },
                    required: ["y_limit_higher", "y_limit_lower"],
                  },
                ],
              },
              {
                oneOf: [
                  {
                    properties: {
                      set_y_increment: {
                        type: "boolean",
                        const: false,
                      },
                    },
                  },
                  {
                    properties: {
                      set_y_increment: {
                        type: "boolean",
                        const: true,
                      },
                    },
                    required: ["y_increment"],
                  },
                ],
              },
            ],
            type: "object",
          },
        },
        type: "object",
        required: [
          "legend_section",
          "title_section",
          "x_axis_section",
          "y_axis_section",
          "tick_section",
        ],
      },
    },
    required: [
      "plot_types",
      "show_points",
      "line_width",
      "output_filetype",
      "text_sections",
      "dpi",
    ],
    type: "object",
  },
};

export default plotSchema;
