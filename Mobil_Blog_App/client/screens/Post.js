import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { PostContext } from '../context/postContext';
import FooterMenu from '../components/Menus/FooterMenu';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Post = ({ navigation }) => {
  const [posts, setPosts] = useContext(PostContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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

  const handlePost = async () => {
    try {
      setLoading(true);
      if (!title) {
        alert('Please add post title ');
        return;
      }
      if (!description) {
        alert('Please add post description');
        return;
      }

      let formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image) {
        let localUri = image;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('image', { uri: localUri, name: filename, type });
      }

      const { data } = await axios.post('/post/create-post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      setPosts([...posts, data?.post]);
      alert(data?.message);
      navigation.navigate('Home');
    } catch (error) {
      alert(error.response.data.message || error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.heading}>Post Oluştur</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Post Başlığı"
            placeholderTextColor={'gray'}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Post Açıklaması"
            placeholderTextColor={'gray'}
            multiline={true}
            numberOfLines={6}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.imagePicker}>
              <FontAwesome5 name="image" size={18} /> Resim Seç
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
            <Text style={styles.postBtnText}>
              <FontAwesome5 name="plus" size={18} /> {'  '}
              Yeni Ekle
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
    marginTop: 40,
    backgroundColor: '#e6e6fa',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputBox: {
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    paddingTop: 10,
    width: 320,
    marginTop: 30,
    fontSize: 16,
    paddingLeft: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    color: '#333',
  },
  imagePicker: {
    marginTop: 20,
    color: '#ffffff',
    fontSize: 18,
    backgroundColor: '#4a90e2',
    borderWidth: 1,
    borderColor: '#4a90e2',
    borderRadius: 25,
    padding: 10,
    width: 300,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4a90e2',
    alignSelf: 'center',
  },
  postBtn: {
    backgroundColor: '#4a90e2',
    width: 300,
    marginTop: 30,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Post;
