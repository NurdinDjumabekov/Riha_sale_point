/////// tags
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/////// fns
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { clearTemporaryData } from "../store/reducers/stateSlice";

/////// helpers
import { transformDate } from "../helpers/transformDate";

/////// components
import { EveryInvoiceSoputka } from "../components/Soputka/EveryInvoiceSoputka";

export const AddProdSoputkaSrceen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { forAddTovar } = route.params; //// хранятся данные накладной сапутки

  useEffect(() => {
    defaultActive();
    navigation.setOptions({ title: `${transformDate(new Date())}` });

    return () => {
      dispatch(clearListCategory());
      dispatch(clearListProductTT());
      //// очищаю список категорий и товаров
    };
  }, []);

  const defaultActive = () => dispatch(clearTemporaryData()); // очищаю активный продукт

  const listProdSale = () => {
    const obj = { guidInvoice: forAddTovar?.invoice_guid };
    navigation.navigate("SoputkaProductScreen", obj);
  };

  return (
    <View style={styles.parentBlock}>
      <TouchableOpacity onPress={listProdSale} style={styles.arrow}>
        <Text style={styles.textBtn}>Список сопутствующих товаров</Text>
        <View style={styles.arrowInner}></View>
      </TouchableOpacity>
      <EveryInvoiceSoputka navigation={navigation} forAddTovar={forAddTovar} />
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
