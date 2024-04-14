import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeAcceptInvoiceTT } from "../store/reducers/stateSlice";

export const CheckBoxTable = ({ guidProduct, guidInvoice }) => {
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);
  // console.log(acceptConfirmInvoice, "acceptConfirmInvoice");
  const dispatch = useDispatch();

  const isCheck = acceptConfirmInvoice?.products?.some(
    (item) => item?.guid === guidProduct && item?.is_checked === true
  );
  const checkGuid = () => {
    dispatch(
      changeAcceptInvoiceTT({
        ...acceptConfirmInvoice,
        invoice_guid: guidInvoice,
        products: acceptConfirmInvoice?.products?.map((i) => ({
          ...i,
          is_checked: i?.guid === guidProduct ? !i?.is_checked : i?.is_checked,
        })),
      })
    );
  };

  // console.log(isCheck);
  // console.log(guidProduct, "guidProduct");

  return (
    <TouchableOpacity onPress={checkGuid}>
      <View style={[styles.standartBox, isCheck && styles.checkedBox]}>
        {isCheck && (
          <View style={styles.standartBox__inner}>
            <View style={styles.checkmark}></View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  standartBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "rgb(206 217 230)",
    borderRadius: 7,
    margin: 5,
  },
  checkedBox: {
    backgroundColor: "rgb(206 217 230)",
  },
  standartBox__inner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: 3,
  },
  checkmark: {
    width: 10,
    height: 18,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
    transform: [{ rotate: "45deg" }],
  },
});
