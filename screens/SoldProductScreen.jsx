import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSoldProd,
  getListSoldProd,
} from "../store/reducers/requestSlice";
import ConfirmationModal from "../components/ConfirmationModal";
import { formatCount } from "../helpers/amounts";

export const SoldProductScreen = ({ route }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  // console.log(guidInvoice, "guidInvoice");

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );

  const getData = () => dispatch(getListSoldProd(guidInvoice));

  useEffect(() => {
    getData();
  }, [guidInvoice]);

  const del = (product_guid) => {
    dispatch(deleteSoldProd({ product_guid, getData }));
    setModalItemGuid(null);
  };

  if (listSoldProd?.length === 0) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  // console.log(listSoldProd, "listSoldProd");

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listSoldProd}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <View style={styles.parentBlock}>
              <View style={styles.mainData}>
                <Text style={styles.titleNum}>{index + 1} </Text>
                <View>
                  <Text style={styles.titleDate}>{item.date || "..."}</Text>
                  <Text style={styles.totalPrice}>
                    {item?.product_price} сом х {item?.count} {item?.unit} ={" "}
                    {formatCount(item?.total)} сом
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
              message="Отменить продажу ?"
              onYes={() => del(item.guid)}
              onNo={() => setModalItemGuid(null)}
              onClose={() => setModalItemGuid(null)}
            />
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={getData} />
        }
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

  // status: {
  //   color: "rgba(12, 169, 70, 0.9)",
  // },

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

  flatList: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 40,
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
