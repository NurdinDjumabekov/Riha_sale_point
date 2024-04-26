import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import { RenderResult } from "../components/RenderResult";
import { getAcceptProdInvoice } from "../store/reducers/requestSlice";
import { totalSumEveryAccept } from "../helpers/amounts";

export const EveryInvoiceAcceptScreen = ({ route, navigation }) => {
  //// каждый возврат накладной типо истории
  const dispatch = useDispatch();
  const { codeid, guid } = route.params; /// guid - накладной

  const { listAcceptInvoiceProd } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${codeid}`,
    });
    dispatch(getAcceptProdInvoice(guid));
  }, []);
  const newList = listAcceptInvoiceProd?.[0]?.list;

  if (newList?.length === 0) {
    return <Text style={styles.noneData}>Данные отсутствуют</Text>;
  }

  return (
    <View style={styles.parent}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={newList}
        renderItem={({ item, index }) => (
          <RenderResult item={item} index={index} />
        )}
        keyExtractor={(item) => item.codeid}
      />
      <Text style={styles.result}>
        {/* Итого: {totalSumEveryAccept(newList)} сом */}
        Итого: {listAcceptInvoiceProd?.[0]?.total_price} сом
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    maxHeight: "98%",
  },

  flatList: {
    minWidth: "100%",
    width: "100%",
    paddingTop: 8,
  },

  result: {
    color: "#222",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "right",
    padding: 10,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
