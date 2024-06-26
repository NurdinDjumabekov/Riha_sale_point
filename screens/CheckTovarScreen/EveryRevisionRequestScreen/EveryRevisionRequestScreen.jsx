////// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { Text, View } from "react-native";

///components
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import { ViewButton } from "../../../customsTags/ViewButton";
import { MyTable } from "../../../common/MyTable/MyTable";

///states
import { acceptInvoiceRevision } from "../../../store/reducers/requestSlice";
import { getEveryRevisionRequest } from "../../../store/reducers/requestSlice";

////helpers
import { formatCount } from "../../../helpers/amounts";
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

////style
import styles from "./style";

export const EveryRevisionRequestScreen = ({ route, navigation }) => {
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
