import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { SelectFormsy, TextFieldFormsy } from '@fuse';

import { MenuItem } from '@material-ui/core';

export const Submodels = (props) => {
    var renderField = null;
    useEffect(() => {
        ReactTooltip.rebuild();
    })
    if (props.sub.menu){
        renderField = <SelectFormsy
            className="my-12 inputStyle1 model"
            name="Sub Model"
            label={[
                "Sub Model",
                <span key={1} style={{ color: "red" }}>
                    {"*"}
                </span>,
            ]}
              value={props.sub.value}
            onChange={props.changed}
            disabled={props.enableBlocking || !props.validInput}
            required
        >
            {props.sub.menu.map((subModel) => {
                return (
                    <MenuItem key={subModel} value={subModel}>
                        {subModel}
                    </MenuItem>
                );
            })}
        </SelectFormsy>}
    else {
        switch (props.sub[Object.keys(props.sub)[0]].type) {
            case "integer":
                renderField = <TextFieldFormsy
                    className="my-16 inputStyle"
                    type="text"
                    name={props.sub[Object.keys(props.sub)[0]].label}
                    style={{ width: "18px" }}
                    value={props.sub.value}
                    label={props.sub[Object.keys(props.sub)[0]].label}
                    onChange={props.changed}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value);
                        },
                    }}
                    validationError="This is not a valid value"
                    disabled={props.enableBlocking || !props.validInput}
                    autoComplete="off"
                    required
                />
                break;
            case "number":
                renderField = <TextFieldFormsy
                    className="my-16 inputStyle"
                    type="text"
                    name={props.sub[Object.keys(props.sub)[0]].label}
                    style={{ width: "18px" }}
                    value={props.sub.value}
                    label={props.sub[Object.keys(props.sub)[0]].label}
                    onChange={props.changed}
                    validations={{
                        isPositiveInt: function (values, value) {
                            if (props.sub[Object.keys(props.sub)[0]].maximum && props.sub[Object.keys(props.sub)[0]].maximum === 1){
                                return RegExp(/^(0+\.?|0*\.\d+|0*1(\.0*)?)$/).test(value)
                            // eslint-disable-next-line eqeqeq
                            } else if ((props.sub[Object.keys(props.sub)[0]].minimum && props.sub[Object.keys(props.sub)[0]].minimum.toString() === '0') == 0){
                                return RegExp(/^(?:[0-9]\d*)?(?:\.\d+)?$/).test(value);
                            } else {
                                return RegExp(/^[+-]?\d+(\.\d+)?$/).test(value)
                            }
                        },
                    }}
                    validationError="This is not a valid value"
                    disabled={props.enableBlocking || !props.validInput}
                    autoComplete="off"
                    required
                />
                break;
            default:
                renderField = <SelectFormsy
                    className="my-12 inputStyle1 model"
                    name="Sub Model"
                    label={[
                        "Sub Model",
                        <span key={1} style={{ color: "red" }}>
                            {"*"}
                        </span>,
                    ]}
                    value={props.sub.value}
                    onChange={props.changed}
                    disabled={props.enableBlocking || !props.validInput}
                    required
                >
                    {props.sub.menu.map((subModel) => {
                        return (
                            <MenuItem key={subModel} value={subModel}>
                                {subModel}
                            </MenuItem>
                        );
                    })}
                </SelectFormsy>
        }
    }
        return (
            <>
            {renderField}
            {props.sub.description && props.desc(props.sub.description)}
            </>
        )
}