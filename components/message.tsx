import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech';
import Ok from "@/assets/images/20.png";
import Like from "@/assets/images/19.png";
import ILoveYou from "@/assets/images/21.png";
import Hello from "@/assets/images/23.png";
import No from "@/assets/images/22.png";

export const Message = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const gestures = [
        { image: Ok, text: "Okay" },
        { image: Like, text: "Like" },
        { image: ILoveYou, text: "I Love You" },
        { image: Hello, text: "Hello" },
        { image: No, text: "No!!" },
    ];
    
    const [flexData, setFlexData] = useState({ flex1: false, flex2: false, flex3: false, flex4: false, flex5: false });
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const [message, setMessage] = useState('No message');
    const [prevMessage, setPrevMessage] = useState('No message');
    const [prevAccelX, setPrevAccelX] = useState(0);
    const [handDetected, setHandDetected] = useState(false);
    const [handEverDetected, setHandEverDetected] = useState(false);
    const [distance, setDistance] = useState(0);
    const [maleVoice, setMaleVoice] = useState<string | null>(null);
    const [messageSpoken, setMessageSpoken] = useState(false);
    const isInitialRender = useRef(true);
    
    const listAllVoiceOptions = async () => {
        try {
            const voices = await Speech.getAvailableVoicesAsync();
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
    
        const fetchLatestSensorData = async () => {
            try {
                const { data } = await axios.get(
                    "https://raspi-server-1.onrender.com/api/v1/hand/latest"
                );
                if (data.handDetected) {
                    setHandEverDetected(true);
                }
    
                // Fetch distance data
                const distanceResponse = await axios.get('https://raspi-server-1.onrender.com/api/v1/ultrasonicsensor/latest');
                if (distanceResponse.data) {
                    setDistance(distanceResponse.data.distance);
                }
    
                // Fetch flex sensor data
                const flexResponse = await axios.get('https://raspi-server-1.onrender.com/api/v1/flexsensor/latest');
                if (flexResponse.data) {
                    setFlexData({
                        flex1: flexResponse.data.flex1,
                        flex2: flexResponse.data.flex2,
                        flex3: flexResponse.data.flex3,
                        flex4: flexResponse.data.flex4,
                        flex5: flexResponse.data.flex5,
                    });
                }
    
                // Fetch gyro data
                const gyroResponse = await axios.get("https://raspi-server-1.onrender.com/api/v1/gyrosensor/latest");
                if (gyroResponse.data.accelerometer && gyroResponse.data.gyroscope) {
                    setAcceleration({
                        x: +gyroResponse.data.accelerometer.x.toFixed(2),
                        y: +gyroResponse.data.accelerometer.y.toFixed(2),
                        z: +gyroResponse.data.accelerometer.z.toFixed(2),
                    });
                }
    
                let newMessage = 'No sign detected';
                const currentAccelX = acceleration.x;
                const gyroSaysHello = (currentAccelX >= -10 && currentAccelX <= -2) || (currentAccelX >= 2 && currentAccelX <= 10);
    
                const gyroSaysNo = gyroSaysHello;
                const gyroSaysILoveYou = gyroSaysHello;
    
                const allExceptPin1Bent = flexData.flex2 && flexData.flex3 && flexData.flex4 && flexData.flex5;
                const allExceptPin345Bent = flexData.flex1 && flexData.flex2;
                const pin3AndPin4Bent = flexData.flex3 && flexData.flex4;
                const pin1345Bent = flexData.flex1 && flexData.flex3 && flexData.flex4 && flexData.flex5;
    
                if (allExceptPin1Bent) {
                    newMessage = 'Like';
                } else if (allExceptPin345Bent) {
                    newMessage = 'Okay';
                }
    
                if (pin3AndPin4Bent && gyroSaysILoveYou) {
                    newMessage = 'I Love You';
                }
    
                if (pin1345Bent && gyroSaysNo) {
                    newMessage = 'No!!';
                }
    
                setMessage(newMessage);
                setPrevAccelX(currentAccelX);
                setHandDetected(data.handDetected);
                setMessageSpoken(false); // Reset message spoken state
    
                if (!isInitialRender.current && data.handDetected && newMessage !== prevMessage && !messageSpoken) {
                    const options: Speech.SpeechOptions = {
                        voice: maleVoice ?? undefined,
                        pitch: 1.0,
                        rate: 1.0,
                        volume: 1.0,
                        onDone: () => console.log('Speech finished'),
                        onError: (error: Error) => console.error('Speech error:', error),
                    };
                    Speech.speak(newMessage, options);
                    setMessageSpoken(true); // Mark message as spoken
                }
    
                if (isInitialRender.current) {
                    isInitialRender.current = false;
                }
    
                setPrevMessage(newMessage);
    
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };
    
        fetchLatestSensorData();
        const interval = setInterval(fetchLatestSensorData, 3000);
    
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [flexData, acceleration, prevAccelX, prevMessage, messageSpoken]); // Depend on flexData, acceleration, prevAccelX, prevMessage, and messageSpoken to re-evaluate the message when they change
    
    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.title}>Message</Text>
                {gestures.map((gesture) => {
                    if (gesture.text === message) {
                        return (
                            <View key={gesture.text} style={styles.gestureContainer}>
                                <Image source={gesture.image} alt={gesture.text} style={styles.image} />
                                <Text style={styles.subtitle}>{gesture.text}</Text>
                            </View>
                        );
                    }
                    return null;
                })}
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
    gestureContainer: {
        alignItems: 'center',
        marginVertical: 8,
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