import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//////tags
import { SafeAreaView, View } from "react-native";
import { StyleSheet, Text } from "react-native";

//////fns
import { clearLeftovers } from "../store/reducers/requestSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { getWorkShopsGorSale } from "../store/reducers/requestSlice";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { changeActiveSelectCategory } from "../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../store/reducers/stateSlice";

////helpers
import { getLocalDataUser } from "../helpers/returnDataUser";

/////// components
import { ActionsEveryInvoice } from "../common/ActionsEveryInvoice";
import { TablesLeftovers } from "./Tables/TablesLeftovers";
import { ViewButton } from "../customsTags/ViewButton";

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
    dispatch(getWorkShopsGorSale({ ...sendData, location: "Shipment" }));
  };

  const price = () => {};

  const counts = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ActionsEveryInvoice type={"leftovers"} location={"Shipment"} />
      {listLeftovers?.length === 0 ? (
        <Text style={styles.noneData}>Остатков нет...</Text>
      ) : (
        <>
          {/* <View style={styles.buttonContainer}>
            <ViewButton onclick={counts} styles={styles.btns}>
              Количество
            </ViewButton>
            <ViewButton onclick={price} styles={styles.btns}>
              Цена
            </ViewButton>
          </View> */}
          <TablesLeftovers arr={listLeftovers} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 10 },

  choiceCateg: {
    fontSize: 16,
    width: "96%",
    alignSelf: "center",
    paddingVertical: 8,
    fontWeight: "600",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
    marginBottom: 8,
  },

  btns: {
    width: "45%",
    height: "auto",
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: 15,
    borderRadius: 5,
    marginTop: 0,
    color: "#fff",
  },

  blockSelect: {
    backgroundColor: "#fff",
    width: "97%",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
  },

  textStyles: {
    margin: 6,
    marginBottom: 8,
    marginTop: 8,
    fontSize: 12,
  },

  sortBlock: { display: "flex", flexDirection: "row" },

  head: { height: 65, backgroundColor: "rgba(199, 210, 254, 0.250)" },

  noneData: {
    flex: 1,
    height: 500,
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
  },

  styleHeadTable: {
    borderWidth: 1,
    borderColor: "rgba(199, 210, 254, 0.718)",
    minWidth: "100%",
    textAlign: "center",
  },
});
