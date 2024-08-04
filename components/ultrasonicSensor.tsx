import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Perfect from "@/assets/images/24.png";
import TooNear from "@/assets/images/25.png";
import TooFar from "@/assets/images/26.png";
import HandUndetectedImg from "@/assets/images/10.png";

export const UltrasonicSensor = () => {
    const [data, setData] = useState({ image: HandUndetectedImg, text: 'No data available' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://raspi-server.onrender.com/api/v1/ultrasonicsensor/latest');

                const result = await response.json();

                if (!result || result.distance === undefined || result.distance === null) {
                    setData({ image: HandUndetectedImg, text: 'No data available' });
                    return;
                }

                const distance = result.distance;
                const roundedDistance = +distance.toFixed(2);
                let newData = { image: HandUndetectedImg, text: 'No data available' }; // Default fallback

                if (distance === 0 || (distance >= 1 && distance <= 29)) {
                    newData = { image: TooNear, text: `User distance is too near (${roundedDistance} cm)` };
                } else if (distance >= 30 && distance <= 100) {
                    newData = { image: Perfect, text: `User is in perfect position (${roundedDistance} cm)` };
                } else if (distance >= 101 && distance <= 500) {
                    newData = { image: TooFar, text: `User distance is too far (${roundedDistance} cm)` };
                }

                setData(newData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData({ image: HandUndetectedImg, text: 'No data available' });
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 500);
        return () => clearInterval(interval);
    }, []);

    const { image, text } = data;

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Ultrasonic Sensor</Text>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} />
                </View>
                <Text style={styles.subtitle}>{text}</Text>
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
        color: 'white',
    },
});
