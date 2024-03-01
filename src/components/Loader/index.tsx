import React from 'react';
import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const loader = props => {

    const utilsReducer = useSelector(state => state.utils)

    const { showLoadingModal } = utilsReducer

    return <Modal visible={showLoadingModal} animationType="slide" transparent={true} >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 70,
                backgroundColor: '#fff',
                width: 70, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#355D9B" />
            </View>
        </View>
    </Modal>
}

export default loader