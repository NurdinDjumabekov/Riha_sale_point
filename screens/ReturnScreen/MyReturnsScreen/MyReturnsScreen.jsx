////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

////// components
import { EveryMyInvoice } from "../../../components/MainInvoiceProd/EveryMyInvoice/EveryMyInvoice";

////// fns
import { getMyReturnInvoice } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

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
