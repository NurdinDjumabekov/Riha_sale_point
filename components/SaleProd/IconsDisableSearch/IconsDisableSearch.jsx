//////// hooks
import { useDispatch } from "react-redux";
import React from "react";

////// tags
import { Text, View } from "react-native";
import { TouchableOpacity, Image } from "react-native";

/////imgs
import searchIcon from "../../../assets/icons/searchIcon.png";

////// fns
import { changeSearchProd } from "../../../store/reducers/stateSlice";

////style
import styles from "./style";

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
