import { useEffect } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmSoputka,
  getListSoputkaProd,
} from "../store/reducers/requestSlice";
import { FlatList } from "react-native";
import { ViewButton } from "../customsTags/ViewButton";

export const SoputkaProdHistoryScreen = ({ navigation, route }) => {
  //// история каждой накладной сапутки
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;

  const { preloader, listProdSoputka } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
    navigation.setOptions({
      title: `${listProdSoputka?.[0]?.date}`,
    });
  }, []);

  const getData = () => {
    dispatch(getListSoputkaProd(guidInvoice));
  };

  const confirmBtn = () => {
    const { oper_invoice_guid, agent_invoice_guid } = listProdSoputka;
    const forAddTovar = { oper_invoice_guid, agent_invoice_guid };
    dispatch(confirmSoputka({ forAddTovar, navigation }));
    /// подтверждение накладной сопутки
  };

  const status = listProdSoputka?.[0]?.status === 0;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListStyle}
        data={listProdSoputka?.[0]?.list}
        renderItem={({ item }) => (
          <View style={styles.EveryInner}>
            <View style={styles.mainData}>
              <Text style={styles.titleNum}>{item.codeid}</Text>
              <View>
                {/* <Text style={styles.sum}>{item.date}</Text> */}
                <Text style={styles.sum}>
                  {item.product_price} х {item.count} = {item.total} сом
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{item.product_name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.codeid}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={getData} />
        }
      />
      {status && (
        <ViewButton styles={styles.sendBtn} onclick={confirmBtn}>
          Подтвердить
        </ViewButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },

  flatListStyle: {
    minWidth: "100%",
    width: "100%",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.587)",
  },

  EveryInner: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  titleNum: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.672)",
    borderColor: "rgba(47, 71, 190, 0.672)",
    borderWidth: 1,
    backgroundColor: "#d4dfee",
    padding: 3,
    paddingLeft: 7,
    paddingRight: 5,
    borderRadius: 5,
  },

  sum: {
    fontSize: 16,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
  },

  title: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 5,
  },

  sendBtn: {
    backgroundColor: "#fff",
    color: "#fff",
    minWidth: "95%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    marginTop: 20,
    alignSelf: "center",
  },
});
