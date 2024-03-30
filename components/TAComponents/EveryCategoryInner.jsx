import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProductTA } from "../../store/reducers/requestSlice";
import {
  changeStateForCategory,
  changeTemporaryData,
} from "../../store/reducers/stateSlice";

export const EveryCategoryInner = ({ obj, index }) => {
  //// список категорий(для сортироваки данных ТА)
  const dispatch = useDispatch();

  const seller_guid = "93C7B683-048A-49D2-9E0A-23F31D563C23";

  const { stateForCategory } = useSelector((state) => state.stateSlice);

  const changeSelect = () => {
    dispatch(getProductTA({ guid: obj?.value, seller_guid }));
    dispatch(changeStateForCategory(obj?.value));
    dispatch(changeTemporaryData({}));
  };

  // console.log(obj, "obj");

  const isTrue = stateForCategory === obj?.value;

  return (
    <>
      <TouchableOpacity
        style={[styles.container, isTrue && styles.activeCateg]}
        onPress={changeSelect}
      >
        <Text style={[styles.titleNum, isTrue && { color: "#fff" }]}>
          {index}
          {obj.label}
        </Text>
        <View style={[styles.arrow, isTrue && styles.activeArrow]}></View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingBottom: 13,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleNum: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.672)",
  },

  activeCateg: {
    backgroundColor: "rgba(47, 71, 190, 0.672)",
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
  },
  activeArrow: {
    borderColor: "#fff",
  },
});
