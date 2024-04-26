import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ViewButton } from "../../customsTags/ViewButton";
import {
  changeDataInputsInv,
  changeTemporaryData,
} from "../../store/reducers/stateSlice";
import {
  addProductInvoiceTT,
  addProductSoputkaTT,
  getCategoryTT,
} from "../../store/reducers/requestSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { Modal } from "react-native";
import { Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

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
      Alert.alert("Введите цену и вес (кол-во)!");
    } else {
      const data = {
        guid: productGuid,
        count: dataInputsInv?.ves,
        price: dataInputsInv?.price,
        invoice_guid: infoKassa?.guid,
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
    const dataObj = {
      checkComponent,
      seller_guid: data?.seller_guid,
      type: "sale&&soputka",
    };
    await dispatch(getCategoryTT(dataObj));
  }; /// для вызова категорий и продуктов

  const onClose = () => {
    dispatch(changeTemporaryData({}));
  };

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
            {checkComponent && isCheck && (
              <Text style={styles.leftovers}>Остаток: {obj.end_outcome}</Text>
            )}
            <View style={styles.addDataBlock}>
              <TextInput
                style={styles.input}
                value={dataInputsInv?.price?.toString()}
                onChangeText={(text) => onChange("price", text)}
                keyboardType="numeric"
                placeholder="Цена"
                maxLength={8}
              />
              <TextInput
                style={styles.input}
                value={dataInputsInv?.ves}
                onChangeText={(text) => onChange("ves", text)}
                keyboardType="numeric"
                placeholder="Вес"
                maxLength={8}
              />
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
  },

  child: {
    backgroundColor: "rgba(184, 196, 246, 0.99)",
    padding: 15,
    paddingVertical: 30,
    borderRadius: 5,
  },
  addDataBlock: {
    width: "80%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    width: "48%",
    borderRadius: 5,
  },
  btnAdd: {
    backgroundColor: "rgba(95, 230, 165, 0.99)",
    color: "#fff",
    minWidth: "28%",
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 5,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    fontSize: 18,
    marginTop: 10,
  },
});
