import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const EditModal = ({ modalVisible, setModalVisible, post }) => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

//güncelleme gönderisini yönet
  const updatePostHandler = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/post/update-post/${id}`, {
        title,
        description,
      });
      setLoading(false);
      alert(data?.message);
      navigation.push("Postlarım");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(erorr);
    }
  };
//ilk gönderi verileri\
  useEffect(() => {
    setTitle(post?.title);
    setDescription(post?.description);
  }, [post]);
  //kullanıcı arayüz tasarımı
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text>{JSON.stringify(post, null, 4)}</Text> */}
            <Text style={styles.modalText}>Post Güncelle</Text>
            <Text>Başlık</Text>
            <TextInput
              style={styles.inputBox}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
            <Text>Açıklama</Text>
            <TextInput
              style={styles.inputBox}
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <View style={styles.btnContainer}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  updatePostHandler(post && post._id),
                    setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>
                  {loading ? "Please Wait" : "Güncelle"}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>İptal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
//stiller
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#f7f7f7",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputBox: {
    marginBottom: 20,
    paddingTop: 12,
    textAlignVertical: "top",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    marginTop: 12,
    paddingLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4a90e2",
    elevation: 5,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#ff3333",
  },
  textStyle: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
});

export default EditModal;
