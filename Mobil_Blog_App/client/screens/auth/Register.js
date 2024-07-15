import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import InputBox from '../../components/Forms/InputBox';
import SubmitButton from '../../components/Forms/SubmitButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Register = ({ navigation }) => {
  // states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // function
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password) {
        Alert.alert('Lütfen tüm alanları doldurunuz');
        setLoading(false);
        return;
      }

      let formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (image) {
        let localUri = image;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('image', { uri: localUri, name: filename, type });
      }

      const { data } = await axios.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      alert(data.message);
      navigation.navigate('Login');
    } catch (error) {
      alert(error.response.data.message || error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Kayıt Ol</Text>
      <View style={{ marginHorizontal: 20 }}>
        <InputBox inputTitle={'Ad & Soyad'} value={name} setValue={setName} />
        <InputBox
          inputTitle={'Email'}
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          setValue={setEmail}
        />
        <InputBox
          inputTitle={'Şifre'}
          secureTextEntry={true}
          autoComplete="password"
          value={password}
          setValue={setPassword}
        />
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imagePickerContainer}
        >
     <Text style={[styles.imagePicker, { color: '#fff' }]}>
  <FontAwesome5 name="image" size={18} /> Resim Seç
</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <SubmitButton
        btnTitle="Kayıt Ol"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Text style={styles.linkText}>
        Hesabınız var mı?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Giriş Yap
        </Text>{' '}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e6e6fa',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  inputBox: {
    height: 45,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  link: {
    color: '#333', // New color for "Kayıt Olun"',
    fontWeight: 'bold',
  },
  imagePicker: {
    marginTop: 20,
    marginBottom: 20,
    color: '#000',
    fontSize: 18,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePickerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4a90e2',
   
  },
  link: {
    color: '#ff6347', // New color for "Kayıt Olun"
    fontWeight: 'bold',
  },
});

export default Register;