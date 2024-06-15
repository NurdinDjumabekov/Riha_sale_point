//////// tags
import { Modal, Text, TouchableWithoutFeedback } from "react-native";
import { Alert, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

//////// hooks
import { useDispatch, useSelector } from "react-redux";

//////// fns
import { changeSearchProd } from "../../store/reducers/stateSlice";
import { clearTemporaryData } from "../../store/reducers/stateSlice";
import { changeTemporaryData } from "../../store/reducers/stateSlice";
import { addProductReturn } from "../../store/reducers/requestSlice";
import { addProductSoputkaTT } from "../../store/reducers/requestSlice";
import { getWorkShopsGorSale } from "../../store/reducers/requestSlice";

///////// helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { useEffect, useRef } from "react";

export const AddProductsTA = (props) => {
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
      }, 1000);
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
            {location === "Shipment" && (
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

const styles = StyleSheet.create({
  parennt: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  leftovers: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.591)",
    marginVertical: 5,
  },

  child: {
    padding: 15,
    paddingVertical: 20,
    paddingBottom: 25,
    borderRadius: 5,
    backgroundColor: "#ebeef2",
    position: "relative",
  },

  title: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 10,
    maxWidth: "85%",
  },

  addDataBlock: {
    width: "95%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  inputTitle: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 15,
    color: "#222",
    marginBottom: 5,
    paddingLeft: 2,
  },

  inputBlock: {
    width: "48%",
  },

  input: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    width: "100%",
    borderRadius: 5,
    borderColor: "rgb(217 223 232)",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  btnAdd: {
    color: "#fff",
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 8,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    fontSize: 18,
    marginTop: 10,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
  },

  //////////////////// krestik
  krest: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "absolute",
    right: 0,
    top: 20,
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
