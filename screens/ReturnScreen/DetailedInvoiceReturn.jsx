////tags
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

////hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

///components
import ConfirmationModal from "../../components/ConfirmationModal";
import { ViewButton } from "../../customsTags/ViewButton";

///states
import { getMyEveryInvoiceReturn } from "../../store/reducers/requestSlice";
import { acceptInvoiceReturn } from "../../store/reducers/requestSlice";

////helpers
import { formatCount } from "../../helpers/amounts";
import { MyTable } from "../../common/MyTable/MyTable";
import ResultCounts from "../../common/ResultCounts/ResultCounts";

export const DetailedInvoiceReturn = ({ route, navigation }) => {
  const { guid } = route.params;
  const [acceptOk, setAcceptOk] = useState(false); //// для модалки приняти накладной
  const [rejectNo, setRejectNo] = useState(false); //// для модалки отказа накладной

  const dispatch = useDispatch();
  const { everyInvoiceReturn } = useSelector((state) => state.requestSlice);
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const clickOkay = () => setAcceptOk(true);

  const clickNo = () => setRejectNo(true);

  const acceptInvoiceFN = () => {
    ///// для принятия накладной торговой токой
    const send = { ...acceptConfirmInvoice, status: 2 };
    const obj = { seller_guid: data?.seller_guid };
    dispatch(acceptInvoiceReturn({ props: { ...send, ...obj }, navigation }));
    setAcceptOk(false);
  };

  const rejectInvoiceFN = () => {
    ///// для отклонения накладной торговой токой
    const send = { ...acceptConfirmInvoice, status: -2 };
    const obj = { seller_guid: data?.seller_guid };
    dispatch(acceptInvoiceReturn({ props: { ...send, ...obj }, navigation }));
    setRejectNo(false);
  };

  useEffect(() => {
    dispatch(getMyEveryInvoiceReturn(guid));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${everyInvoiceReturn?.codeid}`,
    });
  }, [everyInvoiceReturn]);

  const checkStatus = everyInvoiceReturn?.status !== 0;

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.parent}>
          <Text style={styles.titleDate}>
            Дата создания: {everyInvoiceReturn?.date}
          </Text>
        </View>
        <MyTable arr={everyInvoiceReturn?.list} />
        <View style={styles.total}>
          <ResultCounts list={everyInvoiceReturn?.list} />

          <Text style={styles.totalItemCount}>
            Сумма: {formatCount(everyInvoiceReturn?.total_price)} сом
          </Text>
          {checkStatus && (
            <View style={styles.actionBlock}>
              <ViewButton styles={styles.acceptBtn} onclick={clickOkay}>
                Принять накладную
              </ViewButton>
              <ViewButton styles={styles.rejectBtn} onclick={clickNo}>
                Отклонить накладную
              </ViewButton>
            </View>
          )}
        </View>
      </View>
      <ConfirmationModal
        visible={acceptOk}
        message="Принять накладную ?"
        onYes={acceptInvoiceFN}
        onNo={() => setAcceptOk(false)}
        onClose={() => setAcceptOk(false)}
      />
      <ConfirmationModal
        visible={rejectNo}
        message="Отклонить накладную ?"
        onYes={rejectInvoiceFN}
        onNo={() => setRejectNo(false)}
        onClose={() => setRejectNo(false)}
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

  titleDate: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    paddingVertical: 8,
  },

  total: {
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

  actionBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  acceptBtn: {
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    color: "#fff",
    width: "47%",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 8,
  },

  rejectBtn: {
    backgroundColor: "red",
    color: "#fff",
    width: "47%",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 8,
  },
});
