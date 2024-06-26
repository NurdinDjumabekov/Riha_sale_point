////tags
import { Text, View } from "react-native";

///hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

///components
import ConfirmationModal from "../../../components/ConfirmationModal";
import { ViewButton } from "../../../customsTags/ViewButton";

///states
import { getMyEveryInvoice } from "../../../store/reducers/requestSlice";
import { acceptInvoiceTT } from "../../../store/reducers/requestSlice";

////helpers
import { formatCount } from "../../../helpers/amounts";
import { MyTable } from "../../../common/MyTable/MyTable";
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

////style
import styles from "./style";

export const DetailedInvoiceProdScreen = ({ route, navigation }) => {
  const { guid } = route.params;
  const dispatch = useDispatch();

  const [acceptOk, setAcceptOk] = useState(false); //// для модалки приняти накладной
  const [rejectNo, setRejectNo] = useState(false); //// для модалки отказа накладной

  const { everyInvoice } = useSelector((state) => state.requestSlice);
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const clickOkay = () => setAcceptOk(true);

  const clickNo = () => setRejectNo(true);

  const acceptInvoiceFN = () => {
    ///// для принятия накладной торговой токой
    const send = { ...acceptConfirmInvoice, status: 2 };
    const obj = { seller_guid: data?.seller_guid };
    dispatch(acceptInvoiceTT({ props: { ...send, ...obj }, navigation }));
    setAcceptOk(false);
  };

  const rejectInvoiceFN = () => {
    ///// для отклонения накладной торговой токой
    const send = { ...acceptConfirmInvoice, status: -2 };
    const obj = { seller_guid: data?.seller_guid };
    dispatch(acceptInvoiceTT({ props: { ...send, ...obj }, navigation }));
    setRejectNo(false);
  };

  useEffect(() => dispatch(getMyEveryInvoice(guid)), []);

  useEffect(() => {
    const obj = { title: `Накладная №${everyInvoice?.codeid}` };
    navigation.setOptions(obj);
  }, [everyInvoice]);

  const checkStatus = everyInvoice?.status !== 0;

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.parent}>
          <Text style={styles.titleDate}>
            Дата создания: {everyInvoice?.date}
          </Text>
        </View>
        <MyTable arr={everyInvoice?.list} />
        <View style={styles.total}>
          <ResultCounts list={everyInvoice?.list} />
          <Text style={styles.totalItemCount}>
            Сумма: {formatCount(everyInvoice?.total_price)} сом
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
