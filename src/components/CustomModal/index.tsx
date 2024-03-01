import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal
} from 'react-native';

import AppButton from '../UI/button';

export const CustomModal = (props) => {

    const okHanlder = props.okHandler;
    const displayMessage=props.displayMessage
    const showModal= props.showModal?props.showModal:false

    return (
        <Modal
            visible={showModal}
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
                        {displayMessage}
                    </Text>

                    <AppButton
                        title="OKAY"
                        style={{ width: 100 }}
                        clicked={() => {
                            okHanlder()
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal;