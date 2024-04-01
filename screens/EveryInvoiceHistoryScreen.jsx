import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  closeKassa,
  getProductEveryInvoice,
} from "../store/reducers/requestSlice";
import { ViewButton } from "../customsTags/ViewButton";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";

export const EveryInvoiceHistoryScreen = ({ route, navigation }) => {
  const [modal, setModal] = useState(false);
  //// каждый продукт накладной (типо истории)
  const { obj, title } = route.params;
  const seller_guid = "93C7B683-048A-49D2-9E0A-23F31D563C23";

  const dispatch = useDispatch();

  const { historyEveryInvoice } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    dispatch(getProductEveryInvoice(obj.guid));
    navigation.setOptions({
      title,
    });
  }, []);

  const totalSum = historyEveryInvoice?.list.reduce((total, item) => {
    return +item.price * +item.count + total;
  }, 0);

  const addProduct = () => {
    navigation.navigate("everyInvoice", {
      codeid: obj?.codeid,
      guid: seller_guid,
      date: obj?.date_system,
    });
    dispatch(changeStateForCategory("0")); /// категория будет "все"
    dispatch(changeTemporaryData({})); /// очищаю активный продукт
  };

  const status = {
    0: "Касса открыта",
    1: "Касса закрыта",
  };

  // console.log(obj);

  const statusObj = +historyEveryInvoice?.status;

  const isCheck = +historyEveryInvoice?.status === 0; // if касса открыта

  return (
    <>
      <View>
        <View style={styles.statusBlock}>
          <Text style={[styles.status, statusObj !== 1 && styles.green]}>
            {status?.[statusObj]} ({obj?.date_system})
          </Text>
        </View>

        {isCheck && (
          <View style={styles.actionBlock}>
            <ViewButton
              onclick={() => setModal(true)}
              styles={styles.closeKassa}
            >
              Закрыть кассу
            </ViewButton>
            <ViewButton onclick={addProduct} styles={styles.addProd}>
              Добавить товар
            </ViewButton>
          </View>
        )}
        {historyEveryInvoice?.list?.length === 0 ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <>
            <View style={{ paddingBottom: isCheck ? 320 : 200 }}>
              <FlatList
                contentContainerStyle={{
                  width: "100%",
                  paddingTop: 8,
                }}
                data={historyEveryInvoice?.list}
                renderItem={({ item, index }) => (
                  <View style={styles.everyProd}>
                    <View style={styles.everyProdChild}>
                      <View style={styles.everyTitle}>
                        <Text style={styles.titleHistory}>
                          {index + 1}. {item.product_name}
                        </Text>
                      </View>
                      <View style={styles.everyProdInner}>
                        {/* <Text style={styles.koll}>Кол-во (вес): {item.change}</Text> */}
                        <Text style={styles.priceHistory}>
                          Цена: {item.price} сом
                        </Text>
                        <Text style={styles.koll}>
                          Кол-во (вес): {item.count}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.blockSumm}>
                      <Text style={styles.summ}>
                        Сумма: {+item.price * +item.count}сом
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.codeid}
              />
              <View style={styles.blockSumm}>
                <Text style={styles.result}>Итого: {totalSum} сом </Text>
              </View>
            </View>
          </>
        )}
      </View>

      <ConfirmationModal
        visible={modal}
        message="Закрыть кассу ?"
        onYes={() => dispatch(closeKassa({ guid: obj.guid, navigation }))}
        onNo={() => setModal(false)}
        onClose={() => setModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    paddingBottom: 200,
  },
  statusBlock: {
    // backgroundColor: "red",
    padding: 10,
    paddingTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontSize: 20,
    fontWeight: "500",
    color: "red",
  },

  green: { color: "green" },

  actionBlock: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closeKassa: {
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    fontSize: 16,
    minWidth: "47%",
    paddingBottom: 8,
    paddingTop: 8,
    color: "#fff",
    marginTop: 0,
    marginRight: 20,
    borderRadius: 5,
  },

  addProd: {
    backgroundColor: "green",
    fontSize: 16,
    minWidth: "47%",
    paddingBottom: 8,
    paddingTop: 8,
    color: "#fff",
    marginTop: 0,
    marginRight: 20,
    borderRadius: 5,
  },

  everyProd: {
    padding: 10,
    paddingRight: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(162, 178, 238, 0.439)",
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },

  everyProdChild: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  everyTitle: {
    width: "62%",
    // backgroundColor: "red",
  },

  titleHistory: {
    color: "#222",
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.887)",
  },

  everyProdInner: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    width: "35%",
  },

  priceHistory: {
    color: "#222",
    fontSize: 13,
    fontWeight: "500",
    width: "70%",
    // color: "rgba(205, 70, 92, 0.756)",
    color: "rgba(12, 169, 70, 0.486)",
  },
  koll: {
    color: "rgba(12, 169, 70, 0.486)",
    color: "rgba(205, 70, 92, 0.756)",
  },

  blockSumm: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  summ: {
    paddingRight: 20,
    paddingTop: 10,
    fontSize: 15,
    fontWeight: "500",
    width: "35%",
  },

  result: {
    color: "#222",
    fontSize: 18,
    fontWeight: "500",
    // width: "36%",
    paddingRight: 20,
    paddingTop: 10,
    paddingLeft: 2,
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
