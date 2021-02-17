import React from 'react'
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import Topics from './Topics'

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden/>
            <Topics/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(242, 238, 227)',
        justifyContent: 'center',
    }
})
