import { useEffect } from "react";
import { RefreshControl, StyleSheet, View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { EveryMyInvoice } from "../../components/EveryMyInvoice";
import { getAcceptInvoiceReturn } from "../../store/reducers/requestSlice";

export const AcceptReturnHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listAcceptInvoiceReturn } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getAcceptInvoiceReturn(data?.seller_guid));
  };

  const screns = ["DetailedInvoiceReturn", "EveryReturnScreen"];

  return (
    <View style={styles.blockList}>
      <FlatList
        contentContainerStyle={styles.flatListStyle}
        data={listAcceptInvoiceReturn}
        renderItem={({ item }) => (
          <EveryMyInvoice obj={item} navigation={navigation} screns={screns} />
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={getData} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatListStyle: {
    minWidth: "100%",
    width: "100%",
    paddingBottom: 20,
  },

  returnBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "100%",
  },

  return: {
    fontSize: 16,
    color: "#fff",
    minWidth: "95%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 3,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  blockList: {
    flex: 1,
  },
});
