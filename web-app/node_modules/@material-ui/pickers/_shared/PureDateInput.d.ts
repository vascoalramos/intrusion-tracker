import * as React from 'react';
import { TextFieldProps } from '@material-ui/core/TextField';
import { ExtendMui } from '../typings/extendMui';
export declare type NotOverridableProps = 'openPicker' | 'inputValue' | 'onChange' | 'format' | 'validationError' | 'format' | 'forwardedRef';
export interface PureDateInputProps extends ExtendMui<TextFieldProps, 'variant' | 'onError' | 'onChange' | 'value'> {
    /** Pass material-ui text field variant down, bypass internal variant prop */
    inputVariant?: TextFieldProps['variant'];
    /** Override input component */
    TextFieldComponent?: React.ComponentType<TextFieldProps>;
    InputProps?: TextFieldProps['InputProps'];
    inputProps?: TextFieldProps['inputProps'];
    inputValue: string;
    validationError?: React.ReactNode;
    openPicker: () => void;
}
export declare const PureDateInput: React.FC<PureDateInputProps>;
