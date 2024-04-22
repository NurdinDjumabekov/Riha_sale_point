import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getMyLeftovers } from "../store/reducers/requestSlice";
import { useEffect } from "react";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import { ScrollView } from "react-native";
import { listTableLeftoverst } from "../helpers/Data";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";

export const LeftoversScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { id, name } = route?.params;
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listLeftovers } = useSelector(
    (state) => state.requestSlice
  );

  // const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getMyLeftovers(data?.seller_guid));
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

  // console.log(listLeftovers, "listLeftovers");

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
    marginBottom: 10,
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
