import { View, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeAcceptInvoiceTA } from "../store/reducers/stateSlice";

export const InputDifference = ({ guidProduct, guidInvoice }) => {
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);
  const dispatch = useDispatch();

  const checkInput = (text) => {
    if (/^\d*\.?\d*$/.test(text) || text === "") {
      dispatch(
        changeAcceptInvoiceTA({
          ...acceptConfirmInvoice,
          invoice_guid: guidInvoice,
          products: acceptConfirmInvoice?.products?.map((i) => ({
            ...i,
            change: i?.guid === guidProduct ? text : i?.change,
          })),
        })
      );
    }
  };

  const changeCount = acceptConfirmInvoice.products?.filter(
    (item) => item.guid === guidProduct
  );

  // console.log(changeCount?.[0]?.change);
  // console.log(acceptConfirmInvoice, "acceptConfirmInvoice");

  return (
    <View style={styles.standartBox}>
      <TextInput
        style={styles.input}
        value={changeCount?.[0]?.change?.toString()}
        onChangeText={checkInput}
        keyboardType="numeric"
        maxLength={8}
      />
      <View style={styles.standartBox__inner}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  standartBox: {
    position: "relative",
    width: 60,
    height: 30,
    borderWidth: 1,
    borderColor: "rgb(206 217 230)",
    borderRadius: 7,
    margin: 5,
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },
  standartBox__inner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: 3,
  },
});
