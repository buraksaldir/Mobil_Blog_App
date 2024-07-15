import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import axios from "axios";
import PostCard from "../components/PostCard";

const Myposts = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/post/get-user-post");
      setLoading(false);
      setPosts(data?.userPosts);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <PostCard posts={posts} myPostScreen={true} />
        {/* <Text>{JSON.stringify(posts, null, 4)}</Text> */}
      </ScrollView>
      <View style={{  backgroundColor: '#e6e6fa', }}>
        <FooterMenu />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
});
export default Myposts;
