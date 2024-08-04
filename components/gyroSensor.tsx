import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from "axios";
import GyroscopreOnImage from "@/assets/images/16.png";
import GyroscopreOffImage from "@/assets/images/15.png";

export const GyroSensor = () => {
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const gestures = [
        { image: GyroscopreOnImage, text: "Gyroscope Detected" },
        { image: GyroscopreOffImage, text: "Gyroscope Undetected" },
    ];

    // useEffect(() => {
    //     const toggleGesture = () => {
    //         const randomIndex = Math.floor(Math.random() * gestures.length);
    //         setCurrentIndex(randomIndex);
    //     };

    //     const randomInterval = Math.floor(Math.random() * 5000) + 1000;
    //     const timer = setTimeout(toggleGesture, randomInterval);

    //     return () => clearTimeout(timer);
    // }, [currentIndex, gestures.length]);

    // const { image, text } = gestures[currentIndex];
    useEffect(() => {
        const fetchLatestGyroData = async () => {
            try {
                const { data } = await axios.get(
                    "https://raspi-server.onrender.com/api/v1/gyrosensor/latest"
                );
                if (data.accelerometer && data.gyroscope) {
                    const roundedAccelerometer = {
                        x: +data.accelerometer.x.toFixed(2),
                        y: +data.accelerometer.y.toFixed(2),
                        z: +data.accelerometer.z.toFixed(2),
                    };
                    const roundedGyroscope = {
                        x: +data.gyroscope.x.toFixed(2),
                        y: +data.gyroscope.y.toFixed(2),
                        z: +data.gyroscope.z.toFixed(2),
                    };
                    setAcceleration(roundedAccelerometer);
                    setRotation(roundedGyroscope);
                } else {
                    console.error("Unexpected data structure:", data);
                }
            } catch (error) {
                console.error("Error fetching latest gyroscope data:", error);
            }
        };

        fetchLatestGyroData();
        const interval = setInterval(fetchLatestGyroData, 3000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Gyroscope and Accelerometer (delay: 10s)</Text>
                <View>
                    <Text style={styles.subtitle}>Acceleration</Text>
                    <Text style={styles.text}>X: {acceleration.x}</Text>
                    <Text style={styles.text}>Y: {acceleration.y}</Text>
                    <Text style={styles.text}>Z: {acceleration.z}</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Rotation</Text>
                    <Text style={styles.text}>X: {rotation.x}</Text>
                    <Text style={styles.text}>Y: {rotation.y}</Text>
                    <Text style={styles.text}>Z: {rotation.z}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#071d26',
        alignSelf: 'center',
    },
    cardBody: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
    },
    title: {
        paddingBottom: 10,
        fontSize: 28,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: 'white',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: '75%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    subtitle: {
        paddingTop: 6,
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: 'white',
    },
    text: {
        paddingTop: 6,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: 'white',
    },
});