import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import EditModal from './EditModal';

const PostCard = ({ posts, myPostScreen }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [post, setPost] = useState({});
  const navigation = useNavigation();
 //silme istemini işle
  const handleDeletePropmt = (id) => {
    Alert.alert('Dikkat!', 'Bu postu silmek istediğinizden emin misiniz?', [
      {
        text: 'İptal',
        onPress: () => {
          console.log('cancel press');
        },
      },
      {
        text: 'Sil',
        onPress: () => handleDeletePost(id),
      },
    ]);
  };

//gönderi verilerini sil
  const handleDeletePost = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/post/delete-post/${id}`);
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: data?.message,
      });
      navigation.push('Postlarım');
    } catch (error) {
      setLoading(false);
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || error.message,
      });
    }
  };
  //kullanıcı arayüz tasarımı
  return (
    <View>
      <Text style={styles.heading}>Toplam Post {posts?.length}</Text>
      {myPostScreen && (
        <EditModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          post={post}
        />
      )}
      {posts?.map((post, i) => (
        <View style={styles.card} key={i}>
          {myPostScreen && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={{ marginHorizontal: 20 }}>
                <FontAwesome5
                  name="pen"
                  size={16}
                  color={'darkblue'}
                  onPress={() => {
                    setPost(post), setModalVisible(true);
                  }}
                />
              </Text>
              <Text>
                <FontAwesome5
                  name="trash"
                  size={16}
                  color={'red'}
                  onPress={() => handleDeletePropmt(post?._id)}
                />
              </Text>
            </View>
          )}
          <Text style={styles.title}>Başlık : {post?.title}</Text>
          <Text style={styles.desc}> {post?.description}</Text>
          {post?.image && (
            <Image
              source={{ uri: post?.image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <View style={styles.footer}>
            {post?.postedBy?.name && (
              <Text>
                {' '}
                <FontAwesome5 name="user" color={'orange'} />{' '}
                {post?.postedBy?.name}
              </Text>
            )}
            <Text>
              {' '}
              <FontAwesome5 name="clock" color={'orange'} />{' '}
              {moment(post?.createdAt).format('DD:MM:YYYY')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
//stiller
const styles = StyleSheet.create({
  heading: {
    color: '#333',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 20,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  desc: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});


export default PostCard;
