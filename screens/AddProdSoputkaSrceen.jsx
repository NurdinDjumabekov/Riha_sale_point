import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearListCategory,
  clearListProductTT,
  createInvoiceTT,
} from "../store/reducers/requestSlice";
import { useEffect } from "react";
import {
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";
import { EveryInvoice } from "./EveryInvoice";
import { transformDate } from "../helpers/transformDate";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";

export const AddProdSoputkaSrceen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { forAddTovar } = route.params; //// хранятся данные накладной сапутки

  const { infoKassa } = useSelector((state) => state.requestSlice);
  ///// delete

  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    defaultActive();
    navigation.setOptions({
      title: `${transformDate(new Date())}`,
    });
    getData();

    return () => {
      dispatch(clearListCategory());
      dispatch(clearListProductTT());
      //// очищаю список категорий и товаров
    };
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(createInvoiceTT(data?.seller_guid));
  };

  const defaultActive = () => {
    dispatch(changeStateForCategory({})); /// категория будет "все"
    dispatch(changeTemporaryData({})); // очищаю активный продукт
  };

  const listProdSale = () => {
    navigation.navigate("SoputkaProductScreen", {
      guidInvoice: forAddTovar?.agent_invoice_guid,
      forAddTovar,
    });
  };

  return (
    <View style={styles.parentBlock}>
      <TouchableOpacity onPress={listProdSale} style={styles.arrow}>
        <Text style={styles.textBtn}>Список сопутствующих товаров</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <EveryInvoice navigation={navigation} forAddTovar={forAddTovar} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    backgroundColor: "#ebeef2",
  },
  arrow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "rgba(12, 169, 70, 0.486)",
    marginBottom: 0,
  },
  arrowInner: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
    height: 15,
    width: 15,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
    marginTop: 5,
  },
  textBtn: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
});
