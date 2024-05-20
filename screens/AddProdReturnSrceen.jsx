import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { changeTemporaryData } from "../store/reducers/stateSlice";
import { transformDate } from "../helpers/transformDate";
import { EveryInvoiceReturn } from "../components/Return/EveryInvoiceReturn";

export const AddProdReturnSrceen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { forAddTovar } = route.params; //// хранятся данные накладной сапутки

  useEffect(() => {
    defaultActive();
    navigation.setOptions({
      title: `${transformDate(new Date())}`,
    });

    return () => {
      dispatch(clearListCategory());
      dispatch(clearListProductTT());
      //// очищаю список категорий и товаров
    };
  }, []);

  const defaultActive = () => dispatch(changeTemporaryData({}));
  // очищаю активный продукт

  const listProdReturn = () => {
    navigation.navigate("ReturnProductScreen", {
      guidInvoice: forAddTovar?.invoice_guid,
    });
  };

  return (
    <View style={styles.parentBlock}>
      <TouchableOpacity onPress={listProdReturn} style={styles.arrow}>
        <Text style={styles.textBtn}>Список товаров для возврата</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <EveryInvoiceReturn navigation={navigation} forAddTovar={forAddTovar} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    backgroundColor: "#ebeef2",
  },
  arrow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "rgba(12, 169, 70, 0.486)",
    marginBottom: 0,
  },
  arrowInner: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
    height: 15,
    width: 15,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
    marginTop: 5,
  },
  textBtn: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
});
