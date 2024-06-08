////tags
import { FlatList, StyleSheet } from "react-native";
import { View, RefreshControl } from "react-native";

////hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

////components
import EveryPay from "../../components/Pay/EveryPay";

////helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";

/////fns
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { getHistoryBalance } from "../../store/reducers/requestSlice";

export const HistoryBalance = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listHistoryBalance } = useSelector(
    (state) => state.requestSlice
  );

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getHistoryBalance(data?.seller_guid));
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    paddingVertical: 20,
  },
});
