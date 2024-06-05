////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

////// components
import { EveryMyInvoice } from "../../components/EveryMyInvoice";

////// fns
import { getMyReturnInvoice } from "../../store/reducers/requestSlice";

export const MyReturnsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { preloader, listMyInvoiceReturn } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = () => dispatch(getMyReturnInvoice(data?.seller_guid));

  useEffect(() => getData(), []);

  const getHistory = () => navigation.navigate("AcceptReturnHistoryScreen");

  const screns = ["DetailedInvoiceReturn", "EveryReturnScreen"];

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={getHistory} style={styles.arrow}>
        <Text style={styles.textBtn}>Список накладных для воврата</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <View style={styles.parentBlock}>
        <FlatList
          contentContainerStyle={styles.widthMax}
          data={listMyInvoiceReturn}
          renderItem={({ item }) => (
            <EveryMyInvoice
              obj={item}
              navigation={navigation}
              screns={screns}
            />
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

  widthMax: {
    minWidth: "100%",
    width: "100%",
  },
});
