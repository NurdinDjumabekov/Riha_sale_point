import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { createInvoiceTT } from "../store/reducers/requestSlice";
import { clearTemporaryData } from "../store/reducers/stateSlice";
import { changeActiveSelectCategory } from "../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../store/reducers/stateSlice";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { EveryInvoiceSale } from "../components/SaleProd/EveryInvoiceSale";

export const MyShipmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { infoKassa } = useSelector((state) => state.requestSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(createInvoiceTT(data?.seller_guid));
  };

  useEffect(() => {
    clearStates();
    getData();

    return () => {
      dispatch(clearListProductTT());
      dispatch(clearListCategory());
      ///// очищаю список категрий и продуктов
      dispatch(changeActiveSelectCategory(""));
      /// очищаю категории, для сортировки товаров по категориям
      dispatch(changeActiveSelectWorkShop(""));
      /// очищаю цеха, для сортировки товаров по категориям
    };
  }, []);

  const clearStates = () => dispatch(clearTemporaryData()); // очищаю активный продукт

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
