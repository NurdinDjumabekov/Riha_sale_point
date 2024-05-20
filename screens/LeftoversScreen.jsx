import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//////tags
import { Dimensions, RefreshControl, SafeAreaView } from "react-native";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";

//////fns
import { clearLeftovers } from "../store/reducers/requestSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { getWorkShopsGorSale } from "../store/reducers/requestSlice";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { changeActiveSelectCategory } from "../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../store/reducers/stateSlice";

////helpers
import { listTableLeftoverst } from "../helpers/Data";
import { getLocalDataUser } from "../helpers/returnDataUser";

/////// components
import { ActionsEveryInvoice } from "../common/ActionsEveryInvoice";

export const LeftoversScreen = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listLeftovers } = useSelector(
    (state) => state.requestSlice
  );

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

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [35, 19, 14, 14, 18]; //  проценты %

  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={preloader} onRefresh={getData} />
      }
    >
      <SafeAreaView>
        <ActionsEveryInvoice type={"leftovers"} location={"Shipment"} />
        {listLeftovers?.length === 0 ? (
          <Text style={styles.noneData}>Остатков нет...</Text>
        ) : (
          <Table borderStyle={styles.styleHeadTable}>
            <Row
              data={listTableLeftoverst}
              style={styles.head}
              textStyle={{ margin: 3, fontSize: 13, fontWeight: 500 }}
              flexArr={resultWidths}
            />
            <TableWrapper style={{ flexDirection: "row" }}>
              <Rows
                data={listLeftovers?.map((item) => [
                  item[0], // Товар
                  item[1], // Остаток на начало
                  <Text style={{ ...styles.textStyles, color: "green" }}>
                    {item[2]}
                  </Text>, // Приход
                  <Text style={{ ...styles.textStyles, color: "red" }}>
                    {item[3]}
                  </Text>, // Расход
                  item[4], // Остаток на конец
                ])}
                textStyle={styles.textStyles}
                flexArr={resultWidths}
              />
            </TableWrapper>
          </Table>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

// data={listLeftovers?.map((item) => [
//   item[0], // Товар
//   item[1], // Остаток на начало
//   <Text style={{ ...styles.textStyles, color: "green" }}>
//     {item[2]}
//   </Text>, // Приход
//   <Text style={{ ...styles.textStyles, color: "red" }}>
//     {item[3]}
//   </Text>, // Расход
//   item[4], // Остаток на конец
// ])}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 10,
    paddingBottom: 30,
    marginBottom: 20,
  },

  choiceCateg: {
    fontSize: 16,
    width: "96%",
    alignSelf: "center",
    paddingVertical: 8,
    fontWeight: "600",
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

  sortBlock: {
    display: "flex",
    flexDirection: "row",
  },

  head: {
    height: 65,
    backgroundColor: "rgba(199, 210, 254, 0.250)",
  },
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
