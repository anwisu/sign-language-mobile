import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import SpeakerOnImg from "@/assets/images/12.png";
import SpeakerOffImg from "@/assets/images/14.png";

export const Speaker = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const gestures = [
        { image: SpeakerOnImg, text: "Speaker On" },
        { image: SpeakerOffImg, text: "Speaker Off" },
    ];

    useEffect(() => {
        const toggleGesture = () => {
            const randomIndex = Math.floor(Math.random() * gestures.length);
            setCurrentIndex(randomIndex);
        };

        const randomInterval = Math.floor(Math.random() * 5000) + 1000;
        const timer = setTimeout(toggleGesture, randomInterval);

        return () => clearTimeout(timer);
    }, [currentIndex, gestures.length]);

    const { image, text } = gestures[currentIndex];

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Speaker</Text>
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
        textTransform: 'capitalize',
        color: 'white',
    },
});