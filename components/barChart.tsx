import React from 'react';
import { Dimensions, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

// Define the shape of your data
interface DataItem {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

// Sample data
const data: DataItem[] = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
];

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
};

const screenWidth = Dimensions.get('window').width;

export const BarChartSensor: React.FC = () => {
    // Transform data to fit chart-kit requirements
    const labels = data.map(item => item.name);
    const datasets = [
        {
            data: data.map(item => item.uv),
        },
    ];

    return (
        <View>
            <BarChart
                yAxisSuffix=""
                data={{
                    labels,
                    datasets,
                }}
                width={screenWidth}
                height={220}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={30}
            />
        </View>
    );
};