import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <AntDesign
          name="home"
          style={styles.iconStyle}
          color={route.name === "Home" && "blue"}
        />
        <Text>Anasayfa</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Post Ekle")}>
        <AntDesign
          name="plus"
          style={styles.iconStyle}
          color={route.name === "Post Ekle" && "blue"}
        />
        <Text>Post Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Postlarım")}>
        <AntDesign
          name="bars"
          style={styles.iconStyle}
          color={route.name === "Postlarım" && "blue"}
        />
        <Text>Postlarım</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Hesap")}>
        <AntDesign
          name="user"
          style={styles.iconStyle}
          color={route.name === "Hesap" && "blue"}
        />
        <Text>Hesap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
    
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
});

export default FooterMenu;
