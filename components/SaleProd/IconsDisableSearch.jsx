import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { TouchableOpacity, Image } from "react-native";

/////imgs
import searchIcon from "../../assets/icons/searchIcon.png";
import { useDispatch } from "react-redux";
import { changeSearchProd } from "../../store/reducers/stateSlice";

const IconsDisableSearch = ({ navigation }) => {
  const dispatch = useDispatch();
  //// delete

  const navSearch = () => {
    navigation.navigate("SaleSearchScreen");
    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  };

  return (
    <TouchableOpacity style={styles.searchBlock} onPress={navSearch}>
      <Text>Поиск товаров ...</Text>
      <View>
        <Image style={styles.iconSearch} source={searchIcon} />
      </View>
    </TouchableOpacity>
  );
};

export default IconsDisableSearch;

const styles = StyleSheet.create({
  searchBlock: {
    height: 45,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 0,
    marginRight: -20,
  },

  iconSearch: {
    width: 30,
    height: 30,
  },
});
