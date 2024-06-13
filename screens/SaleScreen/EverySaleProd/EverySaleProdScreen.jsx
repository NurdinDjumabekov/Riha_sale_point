///// tags
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native";

///hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////style
import styles from "./style.js";

////components
import { ViewButton } from "../../../customsTags/ViewButton";
import { addProductInvoiceTT } from "../../../store/reducers/requestSlice";

const EverySaleProdScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const refInput = useRef(null);

  const { obj } = route.params;

  const { infoKassa } = useSelector((state) => state.requestSlice);

  const [sum, setSum] = useState("");

  const onChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setSum(text);
    }
  };

  useEffect(() => {
    if (!!obj?.guid) {
      setTimeout(() => {
        refInput?.current?.focus();
      }, 200);
    }
  }, [obj?.guid]);

  console.log(obj);

  const confText = `Недостаточное кол-во товара, у вас остаток ${obj?.end_outcome} ${obj?.unit}`;

  const addInInvoice = () => {
    if (sum == "" || sum == 0) {
      Alert.alert(`Введите ${obj?.unit_codeid == 1 ? "количество" : "вес"}`);
    } else if (+obj?.end_outcome < sum) {
      Alert.alert(confText);
    } else {
      const { guid, ves, price, sale_price } = obj;
      const sendData = { guid, ves: sum, price, sale_price };
      const data = { invoice_guid: infoKassa?.guid, ...sendData };
      dispatch(addProductInvoiceTT({ data }));
      ///// продаю товар
    }
  };

  const onClose = () => navigation.navigate(-1);

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>{obj?.product_name}</Text>
      <TouchableOpacity style={styles.krest} onPress={() => onClose()}>
        <View style={[styles.line, styles.deg]} />
        <View style={[styles.line, styles.degMinus]} />
      </TouchableOpacity>
      <Text style={styles.leftovers}>
        Остаток: {obj?.end_outcome} {obj?.unit}
      </Text>
      <View style={styles.addDataBlock}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputTitle}>
            Цена продажи {obj?.unit && `за ${obj?.unit}`}
          </Text>
          <TextInput
            style={styles.input}
            value={`${obj?.price?.toString()} сом`}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputTitle}>Введите итоговую сумму товара</Text>
          <TextInput
            style={styles.input}
            ref={refInput}
            value={obj?.ves}
            onChangeText={onChange}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
      </View>
      <ViewButton styles={styles.btnAdd} onclick={addInInvoice}>
        Продать товар
      </ViewButton>
    </View>
  );
};

export default EverySaleProdScreen;
