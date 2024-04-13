import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import { RenderResult } from "../components/RenderResult";
import { getAcceptProdInvoice } from "../store/reducers/requestSlice";
import { formatCount } from "../helpers/formatCount";

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

  const totalSum = listAcceptInvoiceProd?.reduce((total, item) => {
    return +item?.price * +item?.count + total;
  }, 0);

  return (
    <>
      {listAcceptInvoiceProd?.length === 0 ? (
        <Text style={styles.noneData}>Данные отсутствуют</Text>
      ) : (
        <View style={styles.parent}>
          <FlatList
            contentContainerStyle={styles.flatList}
            data={listAcceptInvoiceProd}
            renderItem={({ item, index }) => (
              <RenderResult item={item} index={index} />
            )}
            keyExtractor={(item) => item.codeid}
          />
          <Text style={styles.result}>Итого: {formatCount(totalSum)} сом </Text>
          {/* <ViewButton styles={styles.sendBtn} onclick={returnFns}>
            Оформить возврат накладной
          </ViewButton> */}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    maxHeight: "95%",
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

  // sendBtn: {
  //   backgroundColor: "#fff",
  //   color: "#fff",
  //   width: "95%",
  //   paddingTop: 10,
  //   borderRadius: 10,
  //   fontWeight: 600,
  //   backgroundColor: "rgba(12, 169, 70, 0.9)",
  //   borderWidth: 1,
  //   borderColor: "rgb(217 223 232)",
  //   marginTop: 10,
  //   marginBottom: 20,
  //   alignSelf: "center",
  // },
});
