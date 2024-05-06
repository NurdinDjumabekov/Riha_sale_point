import { useEffect } from "react";
import { Dimensions, RefreshControl, SafeAreaView, View } from "react-native";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLeftovers,
  getCategoryTT,
  getMyLeftovers,
} from "../store/reducers/requestSlice";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import { listTableLeftoverst } from "../helpers/Data";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";

export const LeftoversScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listLeftovers, listCategory } = useSelector(
    (state) => state.requestSlice
  );

  const [initialState, setInitialState] = useState({}); // Установка значения по умолчанию

  useEffect(() => {
    getData();
    return () => dispatch(changeLeftovers([]));
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });

    const obj = { seller_guid: data?.seller_guid, type: "leftovers" };
    await dispatch(getCategoryTT({ ...obj, checkComponent: true }));
    ///// get cписок категорий, продукты которых у меня есть
    setInitialState(listCategory?.[1]);
    /// пропускаю категорию "Все" и сразу отображаю вторую категорию
  };

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [35, 19, 14, 14, 18]; //  проценты %
  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      // Если скролл достиг верхней границы
      getData();
    }
  };

  const handleValueChange = (value) => {
    setInitialState(value);
    const objData = { seller_guid: data?.seller_guid, initilalCateg: value };
    dispatch(getMyLeftovers(objData));
  };

  const newList = listCategory?.slice(1, 1000);
  /// срезаю категорию "Все" и сразу отображаю вторую категорию

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={preloader} onRefresh={getData} />
      }
    >
      <SafeAreaView>
        {listLeftovers?.length === 0 ? (
          <Text style={styles.noneData}>Остатков нет...</Text>
        ) : (
          <>
            <View>
              <Text style={styles.choiceCateg}>Выберите категорию *</Text>
              <View style={styles.blockSelect}>
                <RNPickerSelect
                  onValueChange={handleValueChange}
                  items={newList}
                  value={initialState}
                  placeholder={{}}
                />
              </View>
            </View>
            <Table borderStyle={styles.styleHeadTable}>
              <Row
                data={listTableLeftoverst}
                style={styles.head}
                textStyle={{ margin: 3, fontSize: 13, fontWeight: 500 }}
                flexArr={resultWidths}
              />
              <TableWrapper style={{ flexDirection: "row" }}>
                <Rows
                  data={listLeftovers.map((item) => [
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
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};
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
