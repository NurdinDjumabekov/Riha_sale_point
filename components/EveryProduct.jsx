import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeDataInputsInv,
  changeTemporaryData,
} from "../store/reducers/stateSlice";
import { AddProductsTA } from "./TAComponents/AddProductsTA";
import { useRoute } from "@react-navigation/native";

export const EveryProduct = (props) => {
  const route = useRoute();

  const { obj, index, checkComponent, forAddTovar } = props;

  const dispatch = useDispatch();
  const { temporaryData } = useSelector((state) => state.stateSlice);

  const addInTemporary = () => {
    dispatch(changeTemporaryData(obj));
    if (route?.name === "Shipment") {
      dispatch(changeDataInputsInv({ price: obj?.sale_price, ves: "" }));
    } else {
      dispatch(changeDataInputsInv({ price: obj?.product_price, ves: "" }));
    }
  };

  console.log(route.name, "useRoute");

  const isCheck = temporaryData?.guid === obj?.guid;

  return (
    <TouchableOpacity
      onPress={addInTemporary}
      style={[styles.block, styles.blockMain, isCheck && styles.activeBlock]}
    >
      <View style={styles.blockMainInner}>
        <View>
          <View style={styles.mainContent}>
            <Text style={[styles.title, isCheck && styles.activeTitle]}>
              {index + 1}.{" "}
            </Text>
            <Text
              style={[
                styles.title,
                isCheck && styles.activeTitle,
                styles.width85,
              ]}
            >
              {obj?.product_name}
            </Text>
          </View>
        </View>
        {!isCheck && <View style={styles.arrow}></View>}
      </View>
      {Object.keys(temporaryData).length !== 0 && (
        <AddProductsTA
          productGuid={obj.guid}
          obj={obj}
          isCheck={isCheck}
          checkComponent={checkComponent}
          forAddTovar={forAddTovar}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blockMain: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },

  blockMainInner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "99%",
  },
  block: {
    backgroundColor: "#fff",
    minWidth: "100%",
    borderRadius: 5,
    borderBottomWidth: 2,
    borderColor: "rgb(217 223 232)",
  },

  mainContent: {
    display: "flex",
    flexDirection: "row",
  },

  activeBlock: {
    backgroundColor: "rgba(184, 196, 246, 0.99)",
    borderColor: "rgba(184, 196, 246, 0.99)",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: 16,
    fontWeight: "400",
    color: "#222",
  },

  activeTitle: {
    color: "#fff",
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 15,
    width: 15,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
    marginTop: 5,
  },

  width85: { width: "85%" },
});
