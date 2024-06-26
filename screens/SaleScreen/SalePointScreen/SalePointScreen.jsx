////// hooks
import { TouchableOpacity, View, Text } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// fns
import { clearListCategory } from "../../../store/reducers/requestSlice";
import { clearListProductTT } from "../../../store/reducers/requestSlice";
import { createInvoiceTT } from "../../../store/reducers/requestSlice";
import { clearTemporaryData } from "../../../store/reducers/stateSlice";
import { changeActiveSelectCategory } from "../../../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../../../store/reducers/stateSlice";
import { changeLocalData } from "../../../store/reducers/saveDataSlice";

/////// components
import { EveryInvoiceSale } from "../../../components/SaleProd/EveryInvoiceSale";

/////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////style
import styles from "./style";

export const SalePointScreen = ({ navigation }) => {
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
    const data = { navigation, guidInvoice: infoKassa?.guid };

    navigation.navigate("SoldProductScreen", data);
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
