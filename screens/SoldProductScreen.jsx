import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSoldProd,
  getListSoldProd,
} from "../store/reducers/requestSlice";
import ConfirmationModal from "../components/ConfirmationModal";

export const SoldProductScreen = ({ route }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { navigation, guidInvoice } = route.params;
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
  }, [guidInvoice]);

  const getData = () => {
    dispatch(getListSoldProd(guidInvoice));
  };

  const del = (guid) => {
    dispatch(deleteSoldProd({ guid, guidInvoice }));
    setModalItemGuid(null);
  };

  console.log(listSoldProd, "listSoldProd12222");

  return (
    <>
      <View>
        {listSoldProd?.length === 0 ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={{ paddingBottom: 200 }}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={listSoldProd}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <View style={styles.parentBlock}>
                    <View style={styles.innerBlock}>
                      <Text style={styles.titleDate}>{item.date || "..."}</Text>

                      <View style={styles.mainData}>
                        <Text style={styles.titleNum}>{item.codeid} </Text>
                        <View>
                          <Text style={[styles.titleDate, styles.role]}>
                            {item?.product_name}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.mainDataArrow}>
                      <View>
                        <Text style={styles.status}>Продано</Text>
                        <Text style={styles.price}>
                          {item?.product_price} сом
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.krest}
                        onPress={() => setModalItemGuid(item?.guid)}
                      >
                        <View style={[styles.line, styles.deg]} />
                        <View style={[styles.line, styles.degMinus]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.totalPrice}>
                    {item?.product_price} х {item?.count} = {item?.total} сом
                  </Text>
                  <ConfirmationModal
                    visible={modalItemGuid === item.guid}
                    message="Отменить продажу ?"
                    onYes={() => del(item.guid)}
                    onNo={() => setModalItemGuid(null)}
                    onClose={() => setModalItemGuid(null)}
                  />
                </View>
              )}
              keyExtractor={(item) => item?.codeid}
              refreshControl={
                <RefreshControl refreshing={preloader} onRefresh={getData} />
              }
            />
          </View>
        )}
      </View>
    </>
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  innerBlock: {
    display: "flex",
    width: "60%",
    gap: 5,
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
    lineHeight: 17,
  },

  status: {
    color: "rgba(12, 169, 70, 0.9)",
  },

  role: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
    width: "60%",
  },

  price: {
    fontSize: 15,
    fontWeight: "400",
  },

  totalPrice: {
    fontSize: 17,
    fontWeight: "500",
    marginTop: 15,
    color: "rgba(12, 169, 70, 0.9)",
  },

  comments: {
    maxWidth: 230,
    fontSize: 12,
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },

  mainDataArrow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    width: "35%",
  },

  arrow: {
    height: 26,
    width: 26,
  },

  imgDel: {
    width: "100%",
    height: "100%",
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

  //////////////////// krestik
  krest: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
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
