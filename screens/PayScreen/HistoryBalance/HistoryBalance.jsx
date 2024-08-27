////tags
import { FlatList, StyleSheet } from "react-native";
import { View, RefreshControl } from "react-native";

////hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

////components
import EveryPay from "../../../components/Pay/EveryPay/EveryPay";

////helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

/////fns
import { changeLocalData } from "../../../store/reducers/saveDataSlice";
import { getHistoryBalance } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

export const HistoryBalance = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listHistoryBalance } = useSelector(
    (state) => state.requestSlice
  );

  const getData = () => {
    dispatch(getHistoryBalance(data?.seller_guid));
  };

  useEffect(() => getData(), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={listHistoryBalance}
        renderItem={({ item }) => <EveryPay item={item} key={item?.guid} />}
        keyExtractor={(item) => `${item.guid}`}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={getData} />
        }
      />
    </View>
  );
};
