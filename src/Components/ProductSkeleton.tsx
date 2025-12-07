import { View, StyleSheet } from 'react-native';

export default function ProductSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.lineLarge} />
      <View style={styles.lineSmall} />
      <View style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  image: {
    height: 110,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
  },
  lineLarge: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 14,
    width: '80%',
  },
  lineSmall: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 8,
    width: '40%',
  },
  button: {
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 18,
  },
});
