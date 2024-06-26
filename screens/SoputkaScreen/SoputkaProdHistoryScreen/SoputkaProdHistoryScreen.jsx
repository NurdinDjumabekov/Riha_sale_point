//// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//// tags
import { FlatList, RefreshControl } from "react-native";
import { TouchableOpacity, Text, View } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";
import ConfirmationModal from "../../../components/ConfirmationModal";

//// redux
import { confirmSoputka } from "../../../store/reducers/requestSlice";
import { deleteSoputkaProd } from "../../../store/reducers/requestSlice";
import { getListSoputkaProd } from "../../../store/reducers/requestSlice";

//// helpers
import { formatCount, sumSoputkaProds } from "../../../helpers/amounts";

/////components
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

//// style
import styles from "./style";

export const SoputkaProdHistoryScreen = ({ navigation, route }) => {
  //// история каждой накладной сапутки
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;

  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const [confirm, setConfirm] = useState(false); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const { preloader, listProdSoputka } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    navigation.setOptions({ title: `${listProdSoputka?.[0]?.date}` });
  }, [listProdSoputka?.[0]?.date]);

  useEffect(() => getData(), []);

  const getData = () => {
    dispatch(getListSoputkaProd(guidInvoice));
  };

  const confirmBtn = () => {
    dispatch(confirmSoputka({ invoice_guid: guidInvoice, navigation }));
    /// подтверждение накладной сопутки
  };

  const addProd = () => {
    const forAddTovar = { invoice_guid: guidInvoice };
    navigation?.navigate("AddProdSoputkaSrceen", { forAddTovar });
    /// д0бавление товара в накладную сопутки
  };

  const del = (product_guid) => {
    dispatch(deleteSoputkaProd({ product_guid, getData }));
    setModalItemGuid(null);
    /// удаление товара в накладную сопутки
  };

  const status = listProdSoputka?.[0]?.status === 0; /// 0 - не подтверждён

  const listData = listProdSoputka?.[0]?.list;

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.historyParent, !status && styles.more]}>
          <FlatList
            data={listData}
            renderItem={({ item, index }) => (
              <>
                <View style={styles.EveryInner}>
                  <View style={styles.mainData}>
                    <View style={styles.mainDataInner}>
                      <Text style={styles.titleNum}>{index + 1}</Text>
                      <Text style={styles.sum}>
                        {item?.sale_price} сом х {item?.count} {item?.unit} ={" "}
                        {formatCount(item?.total_soputka)} сом
                      </Text>
                    </View>
                    {status && (
                      <TouchableOpacity
                        style={styles.krest}
                        onPress={() => setModalItemGuid(item?.guid)}
                      >
                        <View style={[styles.line, styles.deg]} />
                        <View style={[styles.line, styles.degMinus]} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.title}>{item?.product_name}</Text>
                </View>
                <ConfirmationModal
                  visible={modalItemGuid == item?.guid}
                  message="Отменить возврат ?"
                  onYes={() => del(item?.guid)}
                  onNo={() => setModalItemGuid(null)}
                  onClose={() => setModalItemGuid(null)}
                />
              </>
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
        <ResultCounts list={listData} />
        <Text style={styles.totalItemSumm}>
          Сумма: {sumSoputkaProds(listProdSoputka?.[0]?.list)} сом
        </Text>
        {status && (
          <View style={styles.actions}>
            <ViewButton
              styles={styles.sendBtn}
              onclick={() => setConfirm(true)}
            >
              Подтвердить
            </ViewButton>
            <ViewButton styles={styles.sendBtn} onclick={addProd}>
              Добавить товар
            </ViewButton>
          </View>
        )}
      </View>
      <ConfirmationModal
        visible={confirm}
        message="Подтвердить ?"
        onYes={() => confirmBtn()}
        onNo={() => setConfirm(false)}
        onClose={() => setConfirm(false)}
      />
    </>
  );
};
