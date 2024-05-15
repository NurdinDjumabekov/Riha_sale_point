import React, { useCallback, useRef } from "react";
import { StyleSheet, Image, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import searchIcon from "../../assets/icons/searchIcon.png";
import { debounce } from "lodash";
import { changeSearchProd } from "../../store/reducers/stateSlice";
import { changeActiveSelectCategory } from "../../store/reducers/stateSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { searchProdTT } from "../../store/reducers/requestSlice";

export const SearchProdsSale = ({ getData, checkComponent }) => {
  const refInput = useRef();

  const dispatch = useDispatch();

  const { searchProd } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const searchDataDebounce = useCallback(
    debounce((text) => {
      dispatch(changeActiveSelectCategory("0")); // Установка активной категории
      getLocalDataUser({ changeLocalData, dispatch }); // Получение локальных данных пользователя
      const sendData = { searchProd: text, seller_guid: data?.seller_guid }; // Подготовка данных для поиска
      dispatch(searchProdTT({ ...sendData, checkComponent })); // Выполнение поиска с заданными параметрами
    }, 800),
    []
  );

  const onChange = (text) => {
    dispatch(changeSearchProd(text));
    searchDataDebounce(text);
    if (text === "") {
      getData();
    }
  };

  return (
    <View style={styles.blockSearch}>
      <TextInput
        ref={refInput}
        style={styles.inputSearch}
        placeholderTextColor={"#222"}
        placeholder="Поиск товаров ..."
        onChangeText={onChange}
        value={searchProd}
      />
      <TouchableOpacity onPress={() => refInput?.current?.focus()}>
        <Image style={styles.iconSearch} source={searchIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blockSearch: {
    height: 50,
    width: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  inputSearch: {
    height: 35,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    width: "100%",
  },
  iconSearch: {
    width: 30,
    height: 30,
  },
});
