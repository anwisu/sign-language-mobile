import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
// import axios from 'axios';

interface GyroData {
    accelerometer: {
        x: number;
        y: number;
        z: number;
    };
    gyroscope: {
        x: number;
        y: number;
        z: number;
    };
}

// const Gyroscope: React.FC<{ onDataUpdate: (data: GyroData) => void }> = ({ onDataUpdate }) => {
//     useEffect(() => {
//         const fetchLatestGyroData = async () => {
//             try {
//                 const { data } = await axios.get<GyroData>(
//                     "http://192.168.35.170:4001/api/v1/gyrosensor/latest"
//                 );
//                 if (data.accelerometer && data.gyroscope) {
//                     const roundedAccelerometer = {
//                         x: +data.accelerometer.x.toFixed(2),
//                         y: +data.accelerometer.y.toFixed(2),
//                         z: +data.accelerometer.z.toFixed(2),
//                     };
//                     const roundedGyroscope = {
//                         x: +data.gyroscope.x.toFixed(2),
//                         y: +data.gyroscope.y.toFixed(2),
//                         z: +data.gyroscope.z.toFixed(2),
//                     };
//                     onDataUpdate({
//                         accelerometer: roundedAccelerometer,
//                         gyroscope: roundedGyroscope,
//                     });
//                 } else {
//                     console.error("Unexpected data structure:", data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching latest gyroscope data:", error);
//             }
//         };

//         fetchLatestGyroData();
//         const interval = setInterval(fetchLatestGyroData, 3000);

//         return () => clearInterval(interval); // Cleanup on component unmount
//     }, [onDataUpdate]);

//     return null;
// };

export const LineChartSensor = () => {
    const [data, setData] = useState({
        labels: [] as string[],
        datasets: [
            {
                data: [] as number[],
                color: (opacity = 1) => `rgba(136, 132, 216, ${opacity})`, // optional
                strokeWidth: 2 // optional
            },
            {
                data: [] as number[],
                color: (opacity = 1) => `rgba(130, 202, 157, ${opacity})`, // optional
                strokeWidth: 2 // optional
            },
            {
                data: [] as number[],
                color: (opacity = 1) => `rgba(255, 198, 88, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ]
    });

    const handleDataUpdate = (gyroData: GyroData) => {
        setData((prevData) => ({
            labels: [...prevData.labels, (prevData.labels.length + 1).toString()],
            datasets: [
                { ...prevData.datasets[0], data: [...prevData.datasets[0].data, gyroData.accelerometer.x] as number[] },
                { ...prevData.datasets[1], data: [...prevData.datasets[1].data, gyroData.accelerometer.y] as number[] },
                { ...prevData.datasets[2], data: [...prevData.datasets[2].data, gyroData.accelerometer.z] as number[] },
            ]
        }));
    };

    return (
        <View>
            {/* <Gyroscope onDataUpdate={handleDataUpdate} /> */}
            <LineChart
                data={data}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
};
