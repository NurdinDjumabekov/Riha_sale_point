///// tags
import { Text, View, Alert } from "react-native";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput, Keyboard } from "react-native";

///hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////style
import styles from "./style.js";

////components
import { ViewButton } from "../../../customsTags/ViewButton.jsx";
import { getEveryProd } from "../../../store/reducers/requestSlice.js";
import { addProductInvoiceTT } from "../../../store/reducers/requestSlice.js";

const EverySaleProdScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const refInput = useRef(null);

  const { obj } = route.params;

  const { infoKassa } = useSelector((state) => state.requestSlice);
  const { data } = useSelector((state) => state.saveDataSlice);
  const { everyProdSale } = useSelector((state) => state.requestSlice);

  const [sum, setSum] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const onChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      // Проверяем, не является ли точка первым символом
      if (text === "." || text?.indexOf(".") === 0) {
        return;
      }
      setSum(text);
    }
  };

  useEffect(() => {
    if (!!obj?.guid) {
      setTimeout(() => {
        refInput?.current?.focus();
      }, 400);
    }
    dispatch(getEveryProd({ guid: obj?.guid, seller_guid: data?.seller_guid }));
    /////// получаю каждый прожуке для продажи
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const typeProd = `Введите ${
    everyProdSale?.unit_codeid == 1 ? "количество" : "вес"
  }`;

  const addInInvoice = () => {
    if (sum == "" || sum == 0) {
      Alert.alert(typeProd);
    } else {
      const { price, sale_price, count_type } = everyProdSale;
      const sendData = { guid: obj?.guid, count: sum, sale_price };
      const data = { invoice_guid: infoKassa?.guid, price, ...sendData };
      dispatch(addProductInvoiceTT({ data, navigation, count_type }));
      ///// продаю товар
    }
  };

  const onClose = () => navigation.goBack();

  const typeVes = {
    1: `Введите ${
      everyProdSale?.unit_codeid == 1 ? "итоговое количество" : "итоговый вес"
    } товара`,
    2: "Введите итоговую сумму товара",
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <Text style={styles.title}>{everyProdSale?.product_name}</Text>
      <TouchableOpacity style={styles.krest} onPress={onClose}>
        <View style={[styles.line, styles.deg]} />
        <View style={[styles.line, styles.degMinus]} />
      </TouchableOpacity>
      <Text style={styles.leftovers}>
        Остаток: {everyProdSale?.end_outcome} {everyProdSale?.unit}
      </Text>
      <View style={styles.addDataBlock}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputTitle}>
            Цена продажи {everyProdSale?.unit && `за ${everyProdSale?.unit}`}
          </Text>
          <TextInput
            style={styles.input}
            value={`${everyProdSale?.sale_price?.toString()} сом`}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputTitle}>
            {typeVes?.[+everyProdSale?.count_type]}
          </Text>
          <TextInput
            style={styles.input}
            ref={refInput}
            value={sum}
            onChangeText={onChange}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
      </View>
      {!isKeyboardVisible && (
        <ViewButton styles={styles.btnAdd} onclick={addInInvoice}>
          Продать товар
        </ViewButton>
      )}
    </KeyboardAvoidingView>
  );
};

export default EverySaleProdScreen;
