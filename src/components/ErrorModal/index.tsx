import React from 'react';
import {
    View,
    Text,
    Modal
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { hideErrorModalFunc } from '../../store/utilsSlice';

import AppButton from '../UI/button';

const ErrorModal = (props) => {
    const dispatch = useDispatch();

    const utilsReducer = useSelector(state => state.utils)

    return (
        <Modal
            visible={utilsReducer.showErrorModal}
            style={{
                flex: 1,
            }}
            transparent={true}
            animationType="slide"
        >

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 12, 6, 0.3)'
            }}>
                <View style={{
                    width: '85%',
                    minHeight: 150,
                    padding: 13,
                    borderRadius: 9,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 19, marginBottom: 15,
                        textAlign: "center"
                    }}>
                        {utilsReducer.errorMessage}
                    </Text>

                    <AppButton
                        title="OKAY"
                        underlayColor="black"
                        style={{ width: 100 }}
                        clicked={() => dispatch(hideErrorModalFunc())}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default ErrorModal;