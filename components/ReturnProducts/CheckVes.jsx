import { View, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeReturnProd } from "../../store/reducers/stateSlice";

export const CheckVes = ({ guidProduct }) => {
  ///// изменение веса для в0врата накладной
  const { returnProducts } = useSelector((state) => state.stateSlice);
  const dispatch = useDispatch();

  const checkInput = (text) => {
    if (/^\d*\.?\d*$/.test(text) || text === "") {
      dispatch(
        changeReturnProd({
          ...returnProducts,
          products: returnProducts?.products?.map((i) => ({
            ...i,
            count: i?.guid === guidProduct ? text : i?.count,
          })),
        })
      );
    }
  };

  const changeCount = returnProducts?.products?.filter(
    (item) => item?.guid === guidProduct
  );

  return (
    <View style={styles.standartBox}>
      <TextInput
        style={styles.input}
        value={changeCount?.[0]?.count?.toString()}
        onChangeText={checkInput}
        keyboardType="numeric"
        maxLength={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  standartBox: {
    position: "relative",
    width: 55,
    height: 25,
    borderWidth: 1,
    borderColor: "rgb(206 217 230)",
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  input: {
    fontSize: 14,
    color: "red",
  },
});
