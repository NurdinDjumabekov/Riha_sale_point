////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

////// components
import { EveryMyInvoice } from "../../../components/MainInvoiceProd/EveryMyInvoice/EveryMyInvoice";

////// fns
import { getMyInvoice } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

export const AcceptInvoiceProdScreen = ({ navigation }) => {
  ////// загрузки
  const dispatch = useDispatch();

  const { preloader, listMyInvoice } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = () => {
    dispatch(getMyInvoice(data?.seller_guid));
  };

  useEffect(() => getData(), []);

  const getHistory = () => navigation.navigate("AcceptInvoiceHistoryScreen");

  const screns = ["DetailedInvoiceProdScreen", "EveryInvoiceAcceptScreen"];

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={getHistory} style={styles.arrow}>
        <Text style={styles.textBtn}>Список принятых накладных</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <View style={styles.parentBlock}>
        <FlatList
          contentContainerStyle={styles.widthMax}
          data={listMyInvoice}
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
