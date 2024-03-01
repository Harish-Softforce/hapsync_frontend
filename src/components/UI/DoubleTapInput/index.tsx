import * as React from 'react';
import { PressableProps, TextInput, TextInputProps, } from 'react-native';
import { verticalScale } from '../../../utils/scalingUnits';
import DoubleTap from '../../DoubleTapComponent';

type Props = {
    textInputProps: TextInputProps,
    onDoubleTap: () => {},
    pressableProps: PressableProps
}

const DoubleTapInput = (props: Props) => {
    return <DoubleTap
        onDoubleTap={props.onDoubleTap}
        pressableProps={{
            ...props.pressableProps,
            ...(props.textInputProps.inEditMode && { pointerEvents: 'none' })
        }}
    >
        <TextInput
            {...props.textInputProps}
            style={{
                ...props.textInputProps.style,
                ...(props.textInputProps.editable && {
                    borderBottomWidth: verticalScale(1),
                    borderBottomColor: '#355D9B'
                })
            }}
        />
    </DoubleTap>
}

export default DoubleTapInput;