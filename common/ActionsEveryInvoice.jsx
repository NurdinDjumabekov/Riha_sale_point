import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { getProductTT } from "../store/reducers/requestSlice";
import {
  changeActiveSelectCategory,
  changeSearchProd,
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";

export const ActionsEveryInvoice = ({ checkComponent }) => {
  const dispatch = useDispatch();

  const { listCategory } = useSelector((state) => state.requestSlice);

  const { activeSelectCategory } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

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
    <View style={styles.parentSelects}>
      <Text style={styles.choiceCateg}>Выберите цех</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={handleValueChange}
          items={listCategory}
          useNativeAndroidPickerStyle={false}
          value={activeSelectCategory}
          placeholder={{}}
          style={styles}
        />
        <View style={styles.arrow}></View>
      </View>
      <Text style={styles.choiceCateg}>Выберите категорию</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={handleValueChange}
          items={listCategory}
          useNativeAndroidPickerStyle={false}
          value={activeSelectCategory}
          placeholder={{}}
          style={styles}
        />
        <View style={styles.arrow}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentSelects: {
    paddingVertical: 10,
  },

  choiceCateg: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    width: "96%",
    alignSelf: "center",
    paddingBottom: 3,
    marginTop: 0,
    paddingLeft: 3,
  },

  blockSelect: {
    width: "96%",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    position: "relative",
  },

  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#222",
    height: 12,
    width: 12,
    borderRadius: 3,
    transform: [{ rotate: "135deg" }],
    position: "absolute",
    top: 14,
    right: 25,
  },
});
