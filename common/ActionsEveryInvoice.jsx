import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { ViewButton } from "../customsTags/ViewButton";
import RNPickerSelect from "react-native-picker-select";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { getProductTT, searchProdTT } from "../store/reducers/requestSlice";
import {
  changeActiveSelectCategory,
  changeSearchProd,
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";
import { useMemo } from "react";

export const ActionsEveryInvoice = ({ getData, checkComponent }) => {
  const dispatch = useDispatch();

  const { searchProd } = useSelector((state) => state.stateSlice);

  const { listCategory } = useSelector((state) => state.requestSlice);

  const { activeSelectCategory } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const onChange = (text) => {
    dispatch(changeSearchProd(text));
    if (text === "") {
      getData();
    }
  };

  const searchData = async () => {
    if (searchProd === "") {
      Alert.alert("Введите текст!");
    } else {
      await dispatch(changeActiveSelectCategory("0")); /// 0 - все (категории)
      getLocalDataUser({ changeLocalData, dispatch });
      const sendData = { searchProd, seller_guid: data?.seller_guid };
      await dispatch(searchProdTT({ ...sendData, checkComponent }));
    }
  };

  const handleValueChange = (value) => {
    if (value !== activeSelectCategory) {
      getLocalDataUser({ changeLocalData, dispatch });
      const sendData = { guid: value, seller_guid: data?.seller_guid };
      dispatch(getProductTT({ ...sendData, checkComponent }));

      dispatch(changeStateForCategory(value));
      dispatch(changeTemporaryData({}));
      ///// checkcheck

      dispatch(changeActiveSelectCategory(value));
      /// хранение активной категории, для сортировки товаров(храню guid категории)
      dispatch(changeSearchProd(""));
      ////// очищаю поиск
    }
  };

  return (
    <>
      <View style={styles.blockSearch}>
        <TextInput
          style={styles.inputSearch}
          placeholderTextColor={"rgba(47, 71, 190, 0.591)"}
          placeholder="Поиск товаров"
          onChangeText={onChange}
          value={searchProd}
        />
        <ViewButton onclick={searchData} styles={styles.blockBtn}>
          Поиск
        </ViewButton>
      </View>
      <Text style={styles.choiceCateg}>Выберите категорию</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={handleValueChange}
          items={listCategory}
          value={activeSelectCategory}
          placeholder={{}}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  /////////// search

  blockSearch: {
    position: "relative",
    width: "96%",
    alignSelf: "center",
  },

  inputSearch: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.591)",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    paddingRight: 110,
  },

  blockBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 100,
    height: 50,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    borderWidth: 1,
    color: "#fff",
    borderColor: "rgba(47, 71, 190, 0.591)",
    borderLeftWidth: 0,
    lineHeight: 25,
  },

  /////////// category

  choiceCateg: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    width: "95%",
    alignSelf: "center",
    paddingBottom: 3,
  },

  blockSelect: {
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.591)",
    width: "96%",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    height: 55,
  },
});
