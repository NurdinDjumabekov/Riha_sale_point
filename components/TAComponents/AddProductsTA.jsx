import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ViewButton } from "../../customsTags/ViewButton";
import { changeDataInputsInv } from "../../store/reducers/stateSlice";
import {
  addProductInvoiceTT,
  addProductSoputkaTT,
  getCategoryTT,
  getProductTT,
} from "../../store/reducers/requestSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

export const AddProductsTA = ({ productGuid, checkComponent, forAddTovar }) => {
  //// для добавления продуктов в список
  ///  checkComponent - true значит сопутка
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
        dispatch(
          addProductSoputkaTT({ obj: { ...data, ...forAddTovar }, getData })
        );
      }
    }
  };

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(
      getCategoryTT({ checkComponent, seller_guid: data?.seller_guid })
    );
    await dispatch(
      getProductTT({
        guid: "0",
        seller_guid: data?.seller_guid,
        checkComponent,
      })
    ); /// 0 - все продукты
  }; /// для вызова категорий и продуктов

  return (
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
      <ViewButton styles={styles.btnAdd} onclick={addInInvoice}>
        Добавить
      </ViewButton>
    </View>
  );
};

const styles = StyleSheet.create({
  addDataBlock: {
    minWidth: "100%",
    backgroundColor: "rgba(184, 196, 246, 0.99)",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  input: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    width: "33%",
    borderRadius: 5,
  },
  btnAdd: {
    backgroundColor: "rgba(95, 230, 165, 0.99)",
    color: "#fff",
    minWidth: "28%",
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 5,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    fontSize: 16,
    marginTop: 0,
  },
});
