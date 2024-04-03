import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSoldProd,
  getListSoldProd,
} from "../store/reducers/requestSlice";
import imgDel from "../assets/icons/del.png";
import ConfirmationModal from "../components/ConfirmationModal";

export const SoldProductScreen = ({ route }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { navigation, guidInvoice } = route.params;
  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    dispatch(getListSoldProd(guidInvoice));
  }, [guidInvoice]);

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
          <>
            <View style={{ paddingBottom: 200 }}>
              <FlatList
                contentContainerStyle={{
                  width: "100%",
                  paddingTop: 8,
                }}
                data={listSoldProd}
                renderItem={({ item, index }) => (
                  <View style={styles.container}>
                    <View style={styles.innerBlock}>
                      <View style={styles.mainData}>
                        <Text style={styles.titleNum}>{item.codeid} </Text>
                        <View>
                          <Text style={[styles.titleDate, styles.role]}>
                            {item?.product_name}
                          </Text>
                          <Text style={styles.titleDate}>
                            {item.date || "..."}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.mainDataArrow}>
                      <View>
                        <Text style={styles.status}>Продано</Text>
                        <Text style={styles.totalPrice}>
                          {item?.product_price} сом
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.arrow}
                        onPress={() => setModalItemGuid(item?.guid)}
                      >
                        <Image source={imgDel} style={styles.imgDel} />
                      </TouchableOpacity>
                    </View>
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
                  <RefreshControl
                    refreshing={preloader}
                    onRefresh={() => dispatch(getListSoldProd(guidInvoice))}
                  />
                }
              />
            </View>
          </>
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
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
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
    // color: "#2fce8e53",
    // backgroundColor: "rgba(12, 169, 70, 0.1)",
    borderRadius: 5,
    // padding: 5,
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
    width: "85%",
    // backgroundColor: "red",
    overflow: "hidden",
    height: 18,
  },

  totalPrice: {
    fontSize: 15,
    fontWeight: "400",
  },

  comments: {
    maxWidth: 230,
    fontSize: 12,
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
    // borderTopWidth: 3,
    // borderRightWidth: 3,
    // borderColor: "rgba(162, 178, 238, 0.439)",
    // borderRadius: 3,
    // transform: [{ rotate: "45deg" }],
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
});
