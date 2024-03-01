import React from 'react';
import {
    View,
    Text,
    Modal
} from 'react-native';


import AppButton from '../UI/button';

const ConfirmModal = (props) => {

    const { showConfirmModal, confirmMessage }=props

    return (
        <Modal
            visible={showConfirmModal?true:false}
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
                    padding: 15,
                }}>
                    <Text style={{
                        fontSize: 19, marginBottom: 15,
                        textAlign: 'center'
                    }}>
                        {confirmMessage}
                    </Text>

                    <View style={{flexDirection:'row',margin:5}}>
                     <AppButton
                           title="NO"
                           style={{ width: 100 }}
                           clicked={() => props.handleRes("NO")}
                     />
                     <View style={{width: 20}}></View>
                     <AppButton
                           title="YES"
                           style={{ width: 100 }}
                           clicked={() => props.handleRes("YES")}
                     />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmModal;