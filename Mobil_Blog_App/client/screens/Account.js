import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Account = () => {
  
  const [state, setState] = useContext(AuthContext);
  const { user, token } = state;
 
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState('');
  const [email] = useState(user?.email);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(user?.image || null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      let formData = new FormData();
      formData.append('name', name);
      formData.append('password', password);
      formData.append('email', email);
      if (image) {
        let localUri = image;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('image', { uri: localUri, name: filename, type });
      }

      const response = await axios.put('/auth/update-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      if (response && response.data) {
        const { data } = response;
        let updatedUser = JSON.stringify(data.updatedUser);
        setState({ ...state, user: updatedUser });
        alert(data.message);
      } else {
        alert('Beklenmedik bir hata oluştu.');
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Beklenmedik bir hata oluştu.');
      } else {
        alert(error.message || 'Beklenmedik bir hata oluştu.');
      }

      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{
              uri:
                image ||
                'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            }}
            style={{ height: 200, width: 200, borderRadius: 100 }}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.imagePicker}>
              <FontAwesome5 name="image" size={18} /> Resim Seç
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Ad & Soyad</Text>
          <TextInput
            style={styles.inputBox}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Email</Text>
          <TextInput style={styles.inputBox} value={email} editable={false} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Şifre</Text>
          <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>
              {loading ? 'Lütfen Bekleyin' : 'Profili Güncelle'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <FooterMenu />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
    marginTop: 40,
    backgroundColor: '#e6e6fa',
  },
  warningtext: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontWeight: 'bold',
    width: 70,
    color: 'gray',
  },
  inputBox: {
    width: 250,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    paddingLeft: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    color: '#333',
  },
  updateBtn: {
    backgroundColor: '#4a90e2',
    height: 45,
    width: 250,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  updateBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default Account;
