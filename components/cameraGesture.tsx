import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech';
import HandDetectedImg from '@/assets/images/17.png';
import HandUndetectedImg from '@/assets/images/18.png';


export const CameraGesture = () => {
    const [handDetected, setHandDetected] = useState(false);
    const [maleVoice, setMaleVoice] = useState<string | null>(null);
    const isInitialRender = useRef(true); // Ref to track if it's the initial render

    const listAllVoiceOptions = async () => {
        try {
            const voices = await Speech.getAvailableVoicesAsync();
            // console.log(voices); // Log all voices to see the available options
    
            const selectedVoice = voices.find(voice => voice.name.includes("en-US-SMTm00"));
            
            if (selectedVoice) {
                setMaleVoice(selectedVoice.identifier);
            } else {
                console.warn('Desired voice not found on this device.');
            }
        } catch (error) {
            console.error('Error fetching available voices:', error);
        }
    };

    useEffect(() => {
        listAllVoiceOptions();

        const fetchHandGestureData = async () => {
            try {
                const { data } = await axios.get('https://raspi-server.onrender.com/api/v1/hand/latest');
                
                if (isInitialRender.current) {
                    // Skip the speech on initial render
                    isInitialRender.current = false;
                    setHandDetected(data.handDetected);
                    return;
                }
                
                if (data.handDetected && !handDetected) {
                    console.log('Hand detected, attempting to read text');

                    const options: Speech.SpeechOptions = {
                        voice: maleVoice ?? undefined, // Set voice only if it's not null
                        pitch: 1.0,
                        rate: 1.0,
                        volume: 1.0,
                        onDone: () => console.log('Speech finished'),
                        onError: (error: Error) => console.error('Speech error:', error),
                    };

                    Speech.speak('Hand Detected', options);
                }
                setHandDetected(data.handDetected);
            } catch (error) {
                console.error('Error fetching hand gesture data:', error);
            }
        };

        fetchHandGestureData();
        const interval = setInterval(fetchHandGestureData, 6000);

        return () => {
            clearInterval(interval);
        };
    }, [handDetected, maleVoice]);

    const gesture = handDetected
        ? { image: HandDetectedImg, text: 'Hand Detected' }
        : { image: HandUndetectedImg, text: 'No Hand Detected' };

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Hand Detection (delay: 5-10s)</Text>
                <View style={styles.imageContainer}>
                    <Image source={gesture.image} style={styles.image} />
                </View>
                <Text style={styles.subtitle}>{gesture.text}</Text>
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