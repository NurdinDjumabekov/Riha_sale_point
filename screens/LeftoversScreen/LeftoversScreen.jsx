import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//////tags
import { SafeAreaView } from "react-native";
import { Text } from "react-native";

//////fns
import { clearLeftovers } from "../../store/reducers/requestSlice";
import { clearListCategory } from "../../store/reducers/requestSlice";
import { clearListProductTT } from "../../store/reducers/requestSlice";
import { getWorkShopsGorSale } from "../../store/reducers/requestSlice";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { changeActiveSelectCategory } from "../../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../../store/reducers/stateSlice";

////helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";

/////// components
import { ActionsEveryInvoice } from "../../common/ActionsEveryInvoice/ActionsEveryInvoice";
import { TablesLeftovers } from "../Tables/TablesLeftovers";

////style
import styles from "./style";

export const LeftoversScreen = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { listLeftovers } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    getData();

    return () => {
      dispatch(clearLeftovers([]));
      dispatch(clearListProductTT());
      dispatch(clearListCategory());
      ///// очищаю список категрий и продуктов
      dispatch(changeActiveSelectCategory(""));
      /// очищаю категории, для сортировки товаров по категориям
      dispatch(changeActiveSelectWorkShop(""));
      /// очищаю цеха, для сортировки товаров по категориям
    };
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    dispatch(clearLeftovers()); //// очищаю массив данныз остатков

    const sendData = { seller_guid: data?.seller_guid, type: "leftovers" };
    // ////// внутри есть getCategoryTT и getProductTT
    dispatch(getWorkShopsGorSale({ ...sendData, location: "SalePointScreen" }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActionsEveryInvoice type={"leftovers"} location={"SalePointScreen"} />
      {listLeftovers?.length === 0 ? (
        <Text style={styles.noneData}>Остатков нет...</Text>
      ) : (
        <TablesLeftovers arr={listLeftovers} />
      )}
    </SafeAreaView>
  );
};
