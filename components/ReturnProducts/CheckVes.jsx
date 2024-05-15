import { View, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeActionsProducts } from "../../store/reducers/stateSlice";

export const CheckVes = ({ guidProduct }) => {
  ///// изменение веса для в0врата и ревизии накладной
  const dispatch = useDispatch();
  
  const { actionsProducts } = useSelector((state) => state.stateSlice);

  const checkInput = (text) => {
    if (/^\d*\.?\d*$/.test(text) || text === "") {
      const products = actionsProducts?.products?.map((i) => ({
        ...i,
        count: i?.guid === guidProduct ? text : i?.count,
      }));
      dispatch(changeActionsProducts({ ...actionsProducts, products }));
      ///// для возврата и ревизии накладной с продуктами
    }
  };

  const changeCount = actionsProducts?.products?.filter(
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
