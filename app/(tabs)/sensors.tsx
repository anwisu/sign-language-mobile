import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { CameraGesture } from '@/components/cameraGesture';
import { CameraIdentification } from '@/components/cameraIdentification';
import { FlexSensor } from '@/components/flexSensor';
import { GyroSensor } from '@/components/gyroSensor';
import { Speaker } from '@/components/speaker';
import { UltrasonicSensor } from '@/components/ultrasonicSensor';

export default function Sensors() { // Assuming you're using React Navigation

    return (
        <ScrollView style={{ marginTop: 25 }}>
        <View style={styles.container}>
            {/* <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity> */}
            <View style={styles.sensorsContainer}>
                <CameraGesture />
                <CameraIdentification />
                <FlexSensor />
                <GyroSensor />
                <Speaker />
                <UltrasonicSensor />
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goBackButton: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    goBackText: {
        fontSize: 20,
        marginLeft: 8,
        color: 'white',
    },
    sensorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },
    sensor: {
        width: '100%', // Adjust based on your layout needs
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#071d26',
    },
});