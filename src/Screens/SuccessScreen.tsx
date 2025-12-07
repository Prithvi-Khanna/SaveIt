import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import successAnim from '../Assets/lottie/success.json';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function SuccessScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <LottieView
        source={successAnim}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.success}>Purchase Successful!</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.whiteBack}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: { width: 150, height: 150 },
  success: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  whiteBack: { color: '#fff' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#2b6cb0',
    padding: 12,
    borderRadius: 8,
  },
});
