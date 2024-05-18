import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductTT,
  getCategoryTT,
  getMyLeftovers,
  clearLeftovers,
} from "../store/reducers/requestSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { changeActiveSelectCategory } from "../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../store/reducers/stateSlice";
import { changeSearchProd } from "../store/reducers/stateSlice";
import { changeTemporaryData } from "../store/reducers/stateSlice";

export const ActionsEveryInvoice = ({ checkComponent, type }) => {
  const dispatch = useDispatch();

  const { listCategory, listWorkShopSale } = useSelector(
    (state) => state.requestSlice
  );

  const { activeSelectCategory, activeSelectWorkShop } = useSelector(
    (state) => state.stateSlice
  );

  // console.log(listWorkShopSale, "listWorkShopSale");
  // console.log(listCategory, "listCategory");

  const { data } = useSelector((state) => state.saveDataSlice);

  const { seller_guid } = data;

  const onChangeWorkShop = (value) => {
    if (value !== activeSelectCategory) {
      dispatch(clearListCategory()); //// очищаю список категорий перед отправкой запроса
      const send = { seller_guid, type, workshop_guid: value };
      dispatch(getCategoryTT({ ...send, checkComponent }));

      dispatch(changeActiveSelectWorkShop(value));
      /// хранение активной категории, для сортировки товаров(храню guid категории)
      clear();
    }
  };

  const onChangeCateg = (value) => {
    if (value !== activeSelectCategory) {
      dispatch(clearListProductTT()); //// очищаю список товаров перед отправкой запроса
      dispatch(clearLeftovers()); //// очищаю массив данныз остатков

      if (type === "sale") {
        dispatch(getProductTT({ guid: value, seller_guid, checkComponent }));
      } else if (type === "leftovers") {
        dispatch(getMyLeftovers({ seller_guid, category_guid: value }));
      }

      dispatch(changeActiveSelectCategory(value));
      /// хранение активной категории, для сортировки товаров(храню guid категории)
      clear();
    }
  };

  const clear = () => {
    dispatch(changeSearchProd(""));
    ////// очищаю поиск
    dispatch(changeTemporaryData({}));
    ////// очищаю временный данные для продажи
  };

  return (
    <View style={styles.parentSelects}>
      <Text style={styles.choiceCateg}>Выберите цех</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={onChangeWorkShop}
          items={listWorkShopSale}
          useNativeAndroidPickerStyle={false}
          value={activeSelectWorkShop}
          // placeholder={{}}
          style={styles}
        />
        <View style={styles.arrow}></View>
      </View>
      <Text style={styles.choiceCateg}>Выберите категорию</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={onChangeCateg}
          items={listCategory}
          useNativeAndroidPickerStyle={false}
          value={activeSelectCategory}
          // placeholder={{}}
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
