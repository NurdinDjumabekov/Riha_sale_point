////// hooks
import { useEffect } from "react";
import { RefreshControl, View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

////// components
import { EveryMyInvoice } from "../../../components/MainInvoiceProd/EveryMyInvoice/EveryMyInvoice";

////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////// fns
import { getAcceptInvoice } from "../../../store/reducers/requestSlice";
import { changeLocalData } from "../../../store/reducers/saveDataSlice";

////style
import styles from "./style";

export const AcceptInvoiceHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listAcceptInvoice } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getAcceptInvoice(data?.seller_guid));
  };

  const screns = ["DetailedInvoiceProdScreen", "EveryInvoiceAcceptScreen"];

  return (
    <View style={styles.blockList}>
      <FlatList
        contentContainerStyle={styles.flatListStyle}
        data={listAcceptInvoice}
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
