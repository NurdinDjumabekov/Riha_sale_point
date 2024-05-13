import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearListCategory,
  clearListProductTT,
  createInvoiceTT,
} from "../store/reducers/requestSlice";
import { useEffect } from "react";
import {
  changeActiveSelectCategory,
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { EveryInvoiceSale } from "../components/SaleProd/EveryInvoiceSale";

export const MyShipmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { infoKassa } = useSelector((state) => state.requestSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    clearStates();
    getData();

    return () => {
      dispatch(clearListProductTT());
      dispatch(clearListCategory());
      ///// очищаю список категрий и продуктов
      dispatch(changeActiveSelectCategory(""));
      /// очищаю категории, для сортировки товаров по категориям
    };
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(createInvoiceTT(data?.seller_guid));
  };

  const clearStates = () => {
    dispatch(changeTemporaryData({})); // очищаю активный продукт
    dispatch(changeStateForCategory({})); /// очищаю активную категорию
  };

  const listProdSale = () => {
    navigation.navigate("SoldProduct", {
      navigation,
      guidInvoice: infoKassa?.guid,
    });
  };

  return (
    <View style={styles.parentBlock}>
      <TouchableOpacity onPress={listProdSale} style={styles.arrow}>
        <Text style={styles.textBtn}>Список продаж</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <EveryInvoiceSale navigation={navigation} />
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
    paddingTop: 11,
    paddingBottom: 11,
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
