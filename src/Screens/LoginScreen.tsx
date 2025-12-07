import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/Slices/AuthSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const onLogin = () => {
    if (!email) return alert('Enter email');
    dispatch(login({ email }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>SaveIt</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={'#171616ff'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'#171616ff'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button color={'#0d0c0cff'} title="Login" onPress={onLogin} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    backgroundColor: '#98d7f6ff',
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1f1e1eff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
});
