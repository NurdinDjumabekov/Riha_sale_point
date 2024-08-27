////tags
import { Text, View } from "react-native";

////hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////fns
import { changeListActionLeftovers } from "../../../store/reducers/requestSlice";
import { getLeftoversForCheck } from "../../../store/reducers/requestSlice";
import { sendCheckListProduct } from "../../../store/reducers/requestSlice";

///// components
import { ViewButton } from "../../../customsTags/ViewButton";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";

///// helpers
import { totalSumRevision } from "../../../helpers/amounts";
import { TablesRevision } from "../../Tables/TablesRevision/TablesRevision";
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

////style
import styles from "./style";

export const InvoiceCheckScreen = ({ route, navigation }) => {
  const { invoice_guid, guidWorkShop, seller_guid_to } = route.params;
  //// список товаров для ревизии

  const dispatch = useDispatch();

  const [modalSend, setModalSend] = useState(false);

  const { listActionLeftovers } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    getData();

    return () => {
      dispatch(changeListActionLeftovers([]));
    };
    ///// очищаю список товаров, которые я отпрвляю для ревизии
  }, []);

  const getData = () => {
    const obj = { seller_guid: seller_guid_to, guidWorkShop };
    dispatch(getLeftoversForCheck(obj));
    /// get остатки разделенные по цехам для ревизии
  };

  const closeModal = () => setModalSend(false);

  const sendData = () => {
    //////////////////////////////////////////////
    const products = listActionLeftovers?.map((props) => {
      const { guid, price, change_end_outcome, unit_codeid } = props;
      return { guid, price, count: change_end_outcome, unit_codeid };
    });
    const data = { invoice_guid, products };
    dispatch(sendCheckListProduct({ data, navigation }));
    closeModal();
  };

  const noneData = listActionLeftovers?.length === 0;

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <TablesRevision arr={listActionLeftovers} />
        {!noneData && (
          <View style={styles.divAction}>
            <View style={styles.blockTotal}>
              <ResultCounts list={listActionLeftovers} />
              <Text style={styles.totalItemCount}>
                Сумма: {totalSumRevision(listActionLeftovers) || 0} сом
              </Text>
            </View>
          </View>
        )}
        {noneData ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <ViewButton
            styles={styles.sendBtn}
            onclick={() => setModalSend(true)}
          >
            Сформировать накладную
          </ViewButton>
        )}
      </View>

      <ConfirmationModal
        visible={modalSend}
        message="Сформировать накладную для ревизии товара ?"
        onYes={sendData}
        onNo={closeModal}
        onClose={closeModal}
      />
    </View>
  );
};
