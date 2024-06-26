/////// tags
import { TouchableOpacity, View, Text } from "react-native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/////// fns
import { clearListCategory } from "../../../store/reducers/requestSlice";
import { clearListProductTT } from "../../../store/reducers/requestSlice";
import { clearTemporaryData } from "../../../store/reducers/stateSlice";

/////// helpers
import { transformDate } from "../../../helpers/transformDate";

/////// components
import { EveryInvoiceSoputka } from "../../../components/Soputka/EveryInvoiceSoputka";

////style
import styles from "./style";

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
