import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { changeTemporaryData } from "../store/reducers/stateSlice";

export const EveryProduct = (props) => {
  const { obj, index, navigation } = props;

  const addInTemporary = () => {
    navigation.navigate("EverySaleProdScreen", { obj });
  };

  return (
    <TouchableOpacity onPress={addInTemporary} style={styles.blockMain}>
      <View style={styles.blockMainInner}>
        <View>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{index + 1}. </Text>
            <Text style={[styles.title, styles.width85]}>
              {obj?.product_name}
            </Text>
          </View>
        </View>
        <View style={styles.arrow}></View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blockMain: {
    minWidth: "100%",
    borderRadius: 5,
    borderBottomWidth: 2,
    borderColor: "rgb(217 223 232)",
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

  mainContent: {
    display: "flex",
    flexDirection: "row",
  },

  title: {
    fontSize: 16,
    fontWeight: "400",
    color: "#222",
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
