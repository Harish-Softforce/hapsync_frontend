import * as React from 'react'
import {
    View,
    ViewStyle,
    StyleSheet,
    Image
} from 'react-native';

import Text from '../../components/UI/AppText'
import AppButton from '../../components/UI/button'

type Styles = {
    container: ViewStyle
}

class Tour extends React.Component {
    render() {
        return <View
            style={styles.container}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    style={{
                        resizeMode: 'contain',
                        marginBottom: 70
                    }}
                    source={require("../../assets/images/upcoming.png")}
                />
                <Text
                    style={{
                        textTransform: "uppercase",
                        fontSize: 20,
                        color: 'rgba(53, 93, 155, 1)',
                        fontWeight: "bold",
                        marginBottom: 12
                    }}
                >UPCOMING EVENTS</Text>
                <Text
                    style={{
                        fontSize: 16,
                        color: 'rgba(53, 93, 155, 0.8)',
                        fontWeight: "300",
                        textAlign: 'center'
                    }}
                >Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>
            <AppButton
                style={{ width: '100%', marginTop: 'auto', marginBottom: 40 }}
                title="GET STARTED"
                clicked={() => this.props.navigation.navigate("LoginScreen")}
            />
        </View>
    }
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: '#FFFBFB'
    }
})

export default Tour