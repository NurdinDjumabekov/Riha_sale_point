import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmSoputka,
  deleteSoputkaProd,
  getListSoputkaProd,
} from "../store/reducers/requestSlice";
import ConfirmationModal from "../components/ConfirmationModal";
import { ViewButton } from "../customsTags/ViewButton";
import { sumSoputkaProds } from "../helpers/amounts";

export const SoputkaProductScreen = ({ route, navigation }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно
  const [modalConfirm, setModalConfirm] = useState(false);

  const { preloader, listProdSoputka } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => getData(), [guidInvoice]);

  const getData = () => dispatch(getListSoputkaProd(guidInvoice));

  const del = (product_guid) => {
    dispatch(deleteSoputkaProd({ product_guid, getData }));
    setModalItemGuid(null);
    ////// удаление продуктов сопутки
  };

  // const { invoice_guid } = listProdSoputka?.[0];

  const confirmBtn = () => {
    dispatch(confirmSoputka({ invoice_guid: guidInvoice, navigation }));
    ///// подтверждение накладной сопутки
  };

  const none = listProdSoputka?.[0]?.list?.length === 0;
  const moreOne = listProdSoputka?.[0]?.list?.length > 0;

  return (
    <View>
      {none ? (
        <Text style={styles.noneData}>Список пустой</Text>
      ) : (
        <View style={{ paddingBottom: 150 }}>
          <FlatList
            contentContainerStyle={styles.flatList}
            data={listProdSoputka?.[0]?.list}
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
                        {item?.product_price} х {item?.count} = {item?.total}{" "}
                        сом
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
            keyExtractor={(item) => item?.codeid}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
          <Text style={styles.totalItemSumm}>
            Общая сумма: {sumSoputkaProds(listProdSoputka?.[0]?.list)} сом
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
  },

  parentBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    paddingRight: 0,
    borderRadius: 5,
  },

  titleDate: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 16,
    color: "rgba(47, 71, 190, 0.672)",
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "#222",
    marginTop: 10,
  },

  price: {
    fontSize: 15,
    fontWeight: "400",
  },

  totalPrice: {
    fontSize: 14,
    fontWeight: "500",
    // marginTop: 15,
    color: "rgba(12, 169, 70, 0.9)",
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },

  flatList: { width: "100%", paddingTop: 8 },

  totalItemSumm: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingHorizontal: 10,
    paddingVertical: 10,
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

  sendBtn: {
    backgroundColor: "#fff",
    color: "#fff",
    minWidth: "95%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    marginTop: 20,
    alignSelf: "center",
  },
});
