import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getMyInvoice } from "../store/reducers/requestSlice";
import { EveryMyInvoice } from "../components/EveryMyInvoice";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";

export const MyApplicationScreen = ({ navigation }) => {
  /// загрузки
  const dispatch = useDispatch();

  const { preloader, listMyInvoice } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getMyInvoice(data?.seller_guid));
  };

  useEffect(() => getData(), []);

  const getHistory = () => navigation.navigate("InvoiceHistory");

  const widthMax = { minWidth: "100%", width: "100%" };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={getHistory} style={styles.arrow}>
        <Text style={styles.textBtn}>Список принятых накладных</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <View style={styles.parentBlock}>
        <FlatList
          contentContainerStyle={widthMax}
          data={listMyInvoice}
          renderItem={({ item }) => (
            <EveryMyInvoice obj={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => `${item.guid}${index}`}
          refreshControl={
            <RefreshControl refreshing={preloader} onRefresh={getData} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    minWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 110,
  },

  arrow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "rgba(47, 71, 190, 0.287)",
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

  noneData: {
    flex: 1,
    // paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
