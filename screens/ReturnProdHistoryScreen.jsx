import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
//////tags
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { TouchableOpacity, View, Text } from "react-native";

////redux
import { confirmReturn } from "../store/reducers/requestSlice";
import { deleteReturnProd } from "../store/reducers/requestSlice";
import { getListReturnProd } from "../store/reducers/requestSlice";

////helpers
import { formatCount, sumSoputkaProds, unitResultFN } from "../helpers/amounts";

//////components
import { ViewButton } from "../customsTags/ViewButton";
import ConfirmationModal from "../components/ConfirmationModal";

export const ReturnProdHistoryScreen = ({ navigation, route }) => {
  ////  просмотр каждой истории возврата накладной
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;

  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const [confirm, setConfirm] = useState(false); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const { preloader, listProdReturn } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    navigation.setOptions({ title: `${listProdReturn?.[0]?.date}` });
  }, [listProdReturn?.[0]?.date]);

  useEffect(() => getData(), []);

  const getData = () => dispatch(getListReturnProd(guidInvoice));

  const confirmBtn = () => {
    dispatch(confirmReturn({ invoice_guid: guidInvoice, navigation }));
    /// подтверждение накладной возврата
  };

  const addProd = () => {
    const forAddTovar = { invoice_guid: guidInvoice };
    navigation?.navigate("AddProdReturnSrceen", { forAddTovar });
    /// д0бавление товара в накладную возврата
  };

  const del = (product_guid) => {
    dispatch(deleteReturnProd({ product_guid, getData }));
    setModalItemGuid(null);
    /// удаление товара в накладную возврата
  };

  const status = listProdReturn?.[0]?.status === 0; /// 0 - не подтверждён

  const listData = listProdReturn?.[0]?.list;

  const totals = unitResultFN(listData);

  return (
    <>
      <View>
        <View style={styles.historyParent}>
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
                  visible={modalItemGuid === item?.guid}
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

        <Text style={styles.totalItemSumm}>
          Итого: {totals?.totalKg} кг и {totals?.totalSht} штук
        </Text>
        <Text style={styles.totalItemSumm}>
          Сумма: {sumSoputkaProds(listProdReturn?.[0]?.list)} сом
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

const styles = StyleSheet.create({
  historyParent: {
    minWidth: "100%",
    width: "100%",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.587)",
    maxHeight: "83%",
  },

  EveryInner: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingRight: 10,
  },

  mainDataInner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  titleNum: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.672)",
    borderColor: "rgba(47, 71, 190, 0.672)",
    borderWidth: 1,
    backgroundColor: "#d4dfee",
    padding: 3,
    paddingLeft: 7,
    paddingRight: 5,
    borderRadius: 5,
  },

  sum: {
    fontSize: 16,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
  },

  title: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 5,
  },

  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  sendBtn: {
    backgroundColor: "#fff",
    color: "#fff",
    width: "48%",
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    alignSelf: "center",
    fontSize: 16,
  },

  totalItemSumm: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingHorizontal: 10,
  },

  //////////////////// krestik
  krest: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  line: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  deg: { transform: [{ rotate: "45deg" }] },
  degMinus: { transform: [{ rotate: "-45deg" }] },
});
