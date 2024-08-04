import { Image, View, Text, FlatList, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/bg.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">GROUP 1</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Members:</ThemedText>
        <FlatList
          data={[
            { key: 'Cabauatan, Jianella Guia' },
            { key: 'Eguiron, Jonas' },
            { key: 'Fabila, Crislhan' },
            { key: 'Francisco, Emmanuel Cleto' },
            { key: 'Parpan, Mariella' },
            { key: 'Rosete, Jann Paulo' },
          ]}
          renderItem={({ item }) => {
            return (
              <ThemedText style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>{`\u2022 ${item.key}`}</Text>
              </ThemedText>
            );
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 240,
    width: 400,
    top: 25,
    bottom: 0,
    left: 0,
    position: 'relative',
  },
});
