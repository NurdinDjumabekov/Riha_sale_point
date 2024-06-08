////hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////tags
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, RefreshControl } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

/////fns
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { clearListAgents } from "../../store/reducers/requestSlice";
import { getHistoryBalance } from "../../store/reducers/requestSlice";
import { getListAgents } from "../../store/reducers/requestSlice";

/////components
import { ModalPayTA } from "../../components/ModalPayTA";
import EveryPay from "../../components/Pay/EveryPay";

//////helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";

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

const styles = StyleSheet.create({
  title: {
    padding: 8,
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    color: "#fff",
  },

  listContent: { maxHeight: "82%" },

  payBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "100%",
  },

  pay: {
    fontSize: 16,
    color: "#fff",
    minWidth: "95%",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 20,
    marginBottom: 20,
  },
});
