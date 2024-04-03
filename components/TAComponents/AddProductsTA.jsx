import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ViewButton } from "../../customsTags/ViewButton";
import { changeDataInputsInv } from "../../store/reducers/stateSlice";
import {
  addProductInvoiceTT,
  getCategoryTT,
  getProductTA,
} from "../../store/reducers/requestSlice";

export const AddProductsTA = ({ productGuid }) => {
  //// для добавления продуктов в список
  const dispatch = useDispatch();
  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  const { dataInputsInv } = useSelector((state) => state.stateSlice);
  const { infoKassa } = useSelector((state) => state.requestSlice);

  const addInInvoice = () => {
    if (
      dataInputsInv.price === "" ||
      dataInputsInv.ves === "" ||
      dataInputsInv.price == 0 ||
      dataInputsInv.ves == 0
    ) {
      Alert.alert("Введите цену и вес (кол-во)!");
    } else {
      const data = {
        guid: productGuid,
        count: dataInputsInv?.ves,
        price: dataInputsInv?.price,
        invoice_guid: infoKassa?.guid,
      };
      dispatch(addProductInvoiceTT({ data, getData }));
      // console.log(data,"data");
    }
  };

  const getData = async () => {
    await dispatch(getCategoryTT(seller_guid));
    await dispatch(
      getProductTA({
        guid: "0",
        seller_guid,
      })
    ); /// 0 - все продукты
  }; /// для вызова категорий и продуктов

  // console.log(dataInputsInv, "dataInputsInv");

  return (
    <View style={styles.addDataBlock}>
      <TextInput
        style={styles.input}
        value={dataInputsInv?.price?.toString()}
        onChangeText={(text) =>
          dispatch(changeDataInputsInv({ ...dataInputsInv, price: text }))
        }
        keyboardType="numeric"
        placeholder="Цена"
      />
      <TextInput
        style={styles.input}
        value={dataInputsInv.ves}
        onChangeText={(text) =>
          dispatch(changeDataInputsInv({ ...dataInputsInv, ves: text }))
        }
        keyboardType="numeric"
        placeholder="Вес"
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
