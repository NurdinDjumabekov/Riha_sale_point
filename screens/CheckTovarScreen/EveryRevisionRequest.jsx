import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

///components
import ConfirmationModal from "../../components/ConfirmationModal";
import { ViewButton } from "../../customsTags/ViewButton";
import { MyTable } from "../../common/MyTable/MyTable";

///states
import { acceptInvoiceRevision } from "../../store/reducers/requestSlice";
import { getEveryRevisionRequest } from "../../store/reducers/requestSlice";

////helpers
import { formatCount } from "../../helpers/amounts";
import ResultCounts from "../../common/ResultCounts/ResultCounts";

export const EveryRevisionRequest = ({ route, navigation }) => {
  const { invoice_guid, disable } = route.params;

  const dispatch = useDispatch();

  const [modalVisibleOk, setModalVisibleOk] = useState(false);

  const { everyRequestRevision } = useSelector((state) => state.requestSlice);

  const clickOkay = () => setModalVisibleOk(true);

  const sendData = () => {
    dispatch(acceptInvoiceRevision({ invoice_guid, navigation }));
    setModalVisibleOk(false);
  };

  useEffect(() => {
    dispatch(getEveryRevisionRequest(invoice_guid));

    navigation.setOptions({
      title: `Накладная №${everyRequestRevision?.codeid}`,
    });
  }, [everyRequestRevision?.codeid]);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.parent}>
          <Text style={styles.titleDate}>
            Дата создания: {everyRequestRevision?.date}
          </Text>
        </View>
        <MyTable arr={everyRequestRevision?.list} />
        <View style={styles.actionBlock}>
          <ResultCounts list={everyRequestRevision?.list} />
          <Text style={styles.totalItemCount}>
            Сумма: {formatCount(everyRequestRevision?.total_price)} сом
          </Text>
          {!disable && (
            <ViewButton styles={styles.sendBtn} onclick={clickOkay}>
              Принять накладную
            </ViewButton>
          )}
        </View>
      </View>
      <ConfirmationModal
        visible={modalVisibleOk}
        message="Принять накладную ревизии ?"
        onYes={sendData}
        onNo={() => setModalVisibleOk(false)}
        onClose={() => setModalVisibleOk(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,
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
    paddingTop: 14,
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
