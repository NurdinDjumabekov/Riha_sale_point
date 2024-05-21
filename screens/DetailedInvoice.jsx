import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

///components
import ConfirmationModal from "../components/ConfirmationModal";
import { ViewButton } from "../customsTags/ViewButton";

///states
import { getMyEveryInvoice } from "../store/reducers/requestSlice";
import { acceptInvoiceTT } from "../store/reducers/requestSlice";

////helpers
import { unitResultFN } from "../helpers/amounts";
import { MyTable } from "../common/MyTable";

export const DetailedInvoice = ({ route, navigation }) => {
  const { guid } = route.params;
  const [modalVisibleOk, setModalVisibleOk] = useState(false);

  const dispatch = useDispatch();
  const { everyInvoice } = useSelector((state) => state.requestSlice);
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);

  const clickOkay = () => setModalVisibleOk(true);

  const sendData = () => {
    dispatch(acceptInvoiceTT({ data: acceptConfirmInvoice, navigation }));
    setModalVisibleOk(false);
  };

  useEffect(() => dispatch(getMyEveryInvoice(guid)), []);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${everyInvoice?.codeid}`,
    });
  }, [everyInvoice]);

  const totals = unitResultFN(everyInvoice?.list);

  const checkStatus = everyInvoice?.status !== 0;

  // console.log("asdasdd");

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.parent}>
          <Text style={styles.titleDate}>
            Дата создания: {everyInvoice?.date}
          </Text>
        </View>
        <MyTable arr={everyInvoice?.list} />
        <View style={styles.actionBlock}>
          <Text style={styles.totalItemCount}>
            Итого: {totals?.totalKg} кг и {totals?.totalSht} штук
          </Text>
          <Text style={styles.totalItemCount}>
            Сумма: {everyInvoice?.total_price} сом
          </Text>
          {checkStatus && (
            <ViewButton styles={styles.sendBtn} onclick={clickOkay}>
              Принять накладную
            </ViewButton>
          )}
        </View>
      </View>
      <ConfirmationModal
        visible={modalVisibleOk}
        message="Принять накладную ?"
        onYes={sendData}
        onNo={() => setModalVisibleOk(false)}
        onClose={() => setModalVisibleOk(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,
    // paddingBottom: 100,
    paddingTop: 5,
  },

  parent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 4,
    paddingHorizontal: 10,
  },

  actionBlock: {
    borderTopColor: "#222",
    borderTopWidth: 1,
    paddingTop: 8,
  },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingVertical: 5,
    marginHorizontal: 10,
  },

  titleDate: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    paddingVertical: 8,
  },

  sendBtn: {
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    color: "#fff",
    minWidth: "95%",
    alignSelf: "center",
  },
});
