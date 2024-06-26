/////// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// tags
import { FlatList, Text } from "react-native";
import { View, TouchableOpacity, RefreshControl } from "react-native";

////fns
import { confirmSoputka } from "../../../store/reducers/requestSlice";
import { deleteSoputkaProd } from "../../../store/reducers/requestSlice";
import { getListSoputkaProd } from "../../../store/reducers/requestSlice";

/////components
import ConfirmationModal from "../../../components/ConfirmationModal";
import { ViewButton } from "../../../customsTags/ViewButton";
import ResultCounts from "../../../common/ResultCounts";

///helpers
import { sumSoputkaProds } from "../../../helpers/amounts";

////style
import styles from "./style";

export const SoputkaProductScreen = ({ route, navigation }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно
  const [modalConfirm, setModalConfirm] = useState(false);

  const { preloader, listProdSoputka } = useSelector(
    (state) => state.requestSlice
  );

  const getData = () => dispatch(getListSoputkaProd(guidInvoice));

  useEffect(() => getData(), [guidInvoice]);

  const del = (product_guid) => {
    dispatch(deleteSoputkaProd({ product_guid, getData }));
    setModalItemGuid(null);
    ////// удаление продуктов сопутки
  };

  const confirmBtn = () => {
    dispatch(confirmSoputka({ invoice_guid: guidInvoice, navigation }));
    ///// подтверждение накладной сопутки
  };

  const newList = listProdSoputka?.[0]?.list;

  const none = newList?.length === 0;

  const moreOne = newList?.length > 0;

  return (
    <View style={styles.main}>
      {none ? (
        <Text style={styles.noneData}>Список пустой</Text>
      ) : (
        <View style={styles.flatListParent}>
          <FlatList
            contentContainerStyle={styles.flatList}
            data={newList}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.container}>
                <View style={styles.parentBlock}>
                  <View style={styles.mainData}>
                    <Text style={styles.titleNum}>{index + 1} </Text>
                    <View>
                      <Text style={styles.titleDate}>
                        {item?.date || "..."}
                      </Text>
                      <Text style={styles.totalPrice}>
                        {item?.sale_price} сом х {item?.count} {item?.unit} ={" "}
                        {item?.total_soputka} сом
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.krest}
                    onPress={() => setModalItemGuid(item?.guid)}
                  >
                    <View style={[styles.line, styles.deg]} />
                    <View style={[styles.line, styles.degMinus]} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.title}>{item?.product_name}</Text>
                </View>
                <ConfirmationModal
                  visible={modalItemGuid === item.guid}
                  message="Отменить ?"
                  onYes={() => del(item.guid)}
                  onNo={() => setModalItemGuid(null)}
                  onClose={() => setModalItemGuid(null)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
          <View style={styles.actionBlock}>
            <ResultCounts list={newList} />
            <Text style={styles.totalItemSumm}>
              Сумма: {sumSoputkaProds(listProdSoputka?.[0]?.list)} сом
            </Text>
            {moreOne && (
              <ViewButton
                styles={styles.sendBtn}
                onclick={() => setModalConfirm(true)}
              >
                Подтвердить
              </ViewButton>
            )}
          </View>
        </View>
      )}
      <ConfirmationModal
        visible={modalConfirm}
        message="Подтвердить ?"
        onYes={confirmBtn}
        onNo={() => setModalConfirm(false)}
        onClose={() => setModalConfirm(false)}
      />
    </View>
  );
};
