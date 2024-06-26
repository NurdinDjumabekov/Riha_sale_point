/////// tags
import { RefreshControl, StyleSheet, View, FlatList } from "react-native";

/////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

/////// components
import { EveryMyInvoice } from "../../../components/MainInvoiceProd/EveryMyInvoice/EveryMyInvoice";

/////// fns
import { changeLocalData } from "../../../store/reducers/saveDataSlice";
import { getAcceptInvoiceReturn } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

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
