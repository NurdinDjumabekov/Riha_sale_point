//////// tags
import { Modal, Text, TouchableWithoutFeedback, Alert } from "react-native";
import { TouchableOpacity, View, TextInput } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

//////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

//////// fns
import { changeSearchProd } from "../../store/reducers/stateSlice";
import { clearTemporaryData } from "../../store/reducers/stateSlice";
import { changeTemporaryData } from "../../store/reducers/stateSlice";
import { addProductReturn } from "../../store/reducers/requestSlice";
import { addProductSoputkaTT } from "../../store/reducers/requestSlice";
import { getWorkShopsGorSale } from "../../store/reducers/requestSlice";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

///////// helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";

////style
import styles from "./style";

export const AddProductsInvoice = (props) => {
  const { location, forAddTovar } = props;

  //// для добавления продуктов в список в ревизии и сопутке
  ///  location тут каждая страница, исходя их страницы я делаю действия
  const dispatch = useDispatch();

  const refInput = useRef(null);

  const { data } = useSelector((state) => state.saveDataSlice);

  const { temporaryData } = useSelector((state) => state.stateSlice);

  const { infoKassa } = useSelector((state) => state.requestSlice);

  const onChange = (name, text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      dispatch(changeTemporaryData({ ...temporaryData, [name]: text }));
    }
  };

  const addInInvoice = () => {
    if (
      temporaryData?.price === "" ||
      temporaryData?.ves === "" ||
      temporaryData?.price == 0 ||
      temporaryData?.ves == 0
    ) {
      const text = `Введите цену и ${
        temporaryData?.unit_codeid == 1 ? "количество" : "вес"
      }`;
      Alert.alert(text);
    } else {
      const data = {
        guid: temporaryData?.guid,
        count: temporaryData?.ves,
        invoice_guid: infoKassa?.guid,
        price: temporaryData?.price,
        sale_price: temporaryData?.sale_price,
      };

      if (location === "AddProdSoputkaSrceen") {
        /// сопутка
        const obj = { ...data, ...forAddTovar };
        dispatch(addProductSoputkaTT({ obj, getData }));
      } else if (location === "AddProdReturnSrceen") {
        /// возврат
        const obj = { ...data, ...forAddTovar };
        dispatch(addProductReturn({ obj, getData }));
      }
    }
  };

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const sendData = { seller_guid: data?.seller_guid, type: "sale" };
    // ////// внутри есть getCategoryTT и getProductTT
    dispatch(getWorkShopsGorSale({ ...sendData, location }));

    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  }; /// для вызова категорий и продуктов

  const onClose = () => dispatch(clearTemporaryData());

  useEffect(() => {
    if (!!temporaryData?.guid) {
      setTimeout(() => {
        refInput?.current?.focus();
      }, 200);
    }
  }, [temporaryData?.guid]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!temporaryData?.guid}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.parennt}>
          <View style={styles.child}>
            <Text style={styles.title}>{temporaryData?.product_name}</Text>
            <TouchableOpacity style={styles.krest} onPress={() => onClose()}>
              <View style={[styles.line, styles.deg]} />
              <View style={[styles.line, styles.degMinus]} />
            </TouchableOpacity>
            {location === "SalePointScreen" && (
              <Text style={styles.leftovers}>
                Остаток: {temporaryData?.end_outcome} {temporaryData?.unit}
              </Text>
            )}
            <View style={styles.addDataBlock}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>Введите цену</Text>
                <TextInput
                  style={styles.input}
                  value={`${temporaryData?.price?.toString()} сом`}
                  onChangeText={(text) => onChange("price", text)}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>
                  Введите{" "}
                  {temporaryData?.unit_codeid == 1
                    ? "кол-во товара"
                    : "вес товара"}
                </Text>
                <TextInput
                  style={styles.input}
                  ref={refInput}
                  value={temporaryData?.ves}
                  onChangeText={(text) => onChange("ves", text)}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
            </View>
            <ViewButton styles={styles.btnAdd} onclick={addInInvoice}>
              Добавить
            </ViewButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
