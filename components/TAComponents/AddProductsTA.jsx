//////// tags
import { Modal, Text, TouchableWithoutFeedback } from "react-native";
import { Alert, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

//////// hooks
import { useDispatch, useSelector } from "react-redux";

//////// fns
import {
  changeDataInputsInv,
  changeSearchProd,
  changeTemporaryData,
} from "../../store/reducers/stateSlice";
import {
  addProductInvoiceTT,
  addProductSoputkaTT,
  getWorkShopsGorSale,
} from "../../store/reducers/requestSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

export const AddProductsTA = (props) => {
  const { productGuid, checkComponent, forAddTovar, isCheck, obj } = props;

  //// для добавления продуктов в список
  ///  checkComponent - true значит сопутка false - продажа
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { dataInputsInv } = useSelector((state) => state.stateSlice);
  const { infoKassa } = useSelector((state) => state.requestSlice);

  const onChange = (name, text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      dispatch(changeDataInputsInv({ ...dataInputsInv, [name]: text }));
    }
  };

  const addInInvoice = () => {
    if (
      dataInputsInv?.price === "" ||
      dataInputsInv?.ves === "" ||
      dataInputsInv?.price == 0 ||
      dataInputsInv?.ves == 0
    ) {
      Alert.alert(
        `Введите цену и ${obj?.unit_codeid == 1 ? "количество" : "вес"}`
      );
    } else {
      const data = {
        guid: productGuid,
        count: dataInputsInv?.ves,
        invoice_guid: infoKassa?.guid,
        price: obj?.product_price, //// цена изначальная (без добаки %)
        sale_price: dataInputsInv?.price, //// цена с добавкой  %
      };
      if (checkComponent) {
        /// продажа
        dispatch(addProductInvoiceTT({ data, getData }));
      } else {
        /// сопутка
        const obj = { ...data, ...forAddTovar };
        dispatch(addProductSoputkaTT({ obj, getData }));
      }
    }
  };

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const sendData = { seller_guid: data?.seller_guid, type: "sale" };
    // ////// внутри есть getCategoryTT и getProductTT
    dispatch(getWorkShopsGorSale({ ...sendData, checkComponent }));

    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  }; /// для вызова категорий и продуктов

  const onClose = () => dispatch(changeTemporaryData({}));

  console.log(dataInputsInv, "dataInputsInv");
  console.log(obj, "obj");

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isCheck}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.parennt}>
          <View style={styles.child}>
            <Text style={styles.title}>{obj?.product_name}</Text>
            <TouchableOpacity style={styles.krest} onPress={() => onClose()}>
              <View style={[styles.line, styles.deg]} />
              <View style={[styles.line, styles.degMinus]} />
            </TouchableOpacity>
            {checkComponent && isCheck && (
              <Text style={styles.leftovers}>
                Остаток: {obj?.end_outcome} {obj?.unit}
              </Text>
            )}
            <View style={styles.addDataBlock}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>Введите цену</Text>
                <TextInput
                  style={styles.input}
                  // value={`${dataInputsInv?.price?.toString()} сом`}
                  value={dataInputsInv?.price?.toString()}
                  onChangeText={(text) => onChange("price", text)}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>
                  Введите{" "}
                  {obj?.unit_codeid == 1 ? "кол-во товара" : "кг товара"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={dataInputsInv?.ves}
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
