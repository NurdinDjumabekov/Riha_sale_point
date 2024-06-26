////hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////tags
import { FlatList, Text, View } from "react-native";
import { SafeAreaView, RefreshControl } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";

/////fns
import { changeLocalData } from "../../../store/reducers/saveDataSlice";
import { clearListAgents } from "../../../store/reducers/requestSlice";
import { getHistoryBalance } from "../../../store/reducers/requestSlice";
import { getListAgents } from "../../../store/reducers/requestSlice";

/////components
import { ModalPayTA } from "../../../components/Pay/ModalPayTA/ModalPayTA";
import EveryPay from "../../../components/Pay/EveryPay/EveryPay";

//////helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////style
import styles from "./style";

export const PayMoneyScreen = ({ navigation }) => {
  ///// оплата ТА (принятие денег ТА)

  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader } = useSelector((state) => state.requestSlice);
  const { listHistoryBalance } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    getData();

    return () => dispatch(clearListAgents());
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getHistoryBalance(data?.seller_guid));
    await dispatch(getListAgents(data?.seller_guid));
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.payBlock}>
          <ViewButton styles={styles.pay} onclick={() => setModalState(true)}>
            + Произвести оплату
          </ViewButton>
        </View>
        <Text style={styles.title}>История оплат</Text>
        <View style={styles.listContent}>
          <FlatList
            data={listHistoryBalance}
            renderItem={({ item }) => <EveryPay item={item} key={item?.guid} />}
            keyExtractor={(item) => `${item.guid}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </SafeAreaView>
      <ModalPayTA
        modalState={modalState}
        setModalState={setModalState}
        navigation={navigation}
      />
    </>
  );
};
