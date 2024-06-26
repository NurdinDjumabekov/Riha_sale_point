import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

////style
import styles from "./style";

export const EveryCategory = ({ obj, navigation }) => {
  const clickCateg = () => {
    navigation.navigate(`${obj.link}`, {
      id: obj?.codeid,
      name: obj?.name,
      pathApi: obj?.pathApi,
    });
  };

  return (
    <TouchableOpacity style={styles.parentDiv} onPress={clickCateg}>
      <View style={styles.shadow}></View>
      <Image source={{ uri: obj?.img }} style={styles.backgroundImage} />
      <View style={styles.main}>
        <Text style={styles.textTitle}>{obj?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};
