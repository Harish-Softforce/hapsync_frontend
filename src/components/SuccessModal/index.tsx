import React from 'react';
import {
    View,
    Text,
    Modal
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { hideSuccessModalFunc } from '../../store/utilsSlice';

import AppButton from '../UI/button';

const SuccessModal = (props) => {
    const dispatch = useDispatch();

    const utilsReducer = useSelector(state => state.utils)

    return (
        <Modal
            visible={utilsReducer.showSuccessModal}
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
                    borderRadius: 9,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15
                }}>
                    <Text style={{
                        fontSize: 19, marginBottom: 15,
                        textAlign: 'center'
                    }}>
                        {utilsReducer.successMessage}
                    </Text>

                    <AppButton
                        title="OKAY"
                        style={{ width: 100 }}
                        clicked={() => dispatch(hideSuccessModalFunc())}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default SuccessModal;