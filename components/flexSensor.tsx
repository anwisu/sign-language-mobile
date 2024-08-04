import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios'; 
import Ok from "@/assets/images/4.png";
import Like from "@/assets/images/5.png";
import ILoveYou from "@/assets/images/6.png";
import Hi from "@/assets/images/7.png";
import Sorry from "@/assets/images/8.png";

export const FlexSensor = () => {
    const [flexData, setFlexData] = useState({
        flex1: false,
        flex2: false,
        flex3: false,
        flex4: false,
        flex5: false,
    });
    // const [currentIndex, setCurrentIndex] = useState(0);
    // const gestures = [
    //     { image: Ok, text: "OK" },
    //     { image: Like, text: "Like" },
    //     { image: ILoveYou, text: "I Love You" },
    //     { image: Hi, text: "Hi" },
    //     { image: Sorry, text: "Sorry" },
    // ];

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
        const fetchLatestFlexSensorData = async () => {
            try {
                const { data } = await axios.get('https://raspi-server.onrender.com/api/v1/flexsensor/latest');
                if (data) {
                    setFlexData({
                        flex1: data.flex1,
                        flex2: data.flex2,
                        flex3: data.flex3,
                        flex4: data.flex4,
                        flex5: data.flex5,
                    });
                } else {
                    console.error('No data found');
                }
            } catch (error) {
                console.error('Error fetching latest flex sensor data:', error);
            }
        };

        fetchLatestFlexSensorData();
        const interval = setInterval(fetchLatestFlexSensorData, 3000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Finger Bend Status (delay: 5-10s)</Text>
                <Text style={styles.subtitle}>Thumb: {flexData.flex1 ? "Bent" : "Not Bent"}</Text>
                <Text style={styles.subtitle}>Point: {flexData.flex2 ? "Bent" : "Not Bent"}</Text>
                <Text style={styles.subtitle}>Middle: {flexData.flex3 ? "Bent" : "Not Bent"}</Text>
                <Text style={styles.subtitle}>Ring: {flexData.flex4 ? "Bent" : "Not Bent"}</Text>
                <Text style={styles.subtitle}>Pinky: {flexData.flex5 ? "Bent" : "Not Bent"}</Text>
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
});