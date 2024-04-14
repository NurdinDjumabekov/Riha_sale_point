import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProductTT } from "../../store/reducers/requestSlice";
import {
  changeStateForCategory,
  changeTemporaryData,
} from "../../store/reducers/stateSlice";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";

export const EveryCategoryInner = ({ obj, index }) => {
  //// список категорий(для сортироваки данных ТА)
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);
  const { stateForCategory } = useSelector((state) => state.stateSlice);

  // const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";
  const changeSelect = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(
      getProductTT({ guid: obj?.value, seller_guid: data?.seller_guid })
    );
    await dispatch(changeStateForCategory(obj?.value));
    await dispatch(changeTemporaryData({}));
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
