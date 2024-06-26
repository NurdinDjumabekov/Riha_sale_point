import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentFlatList: {
    maxHeight: "80%",
  },

  mainBlock: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(47, 71, 190, 0.287)",
    borderBottomWidth: 1,
  },

  more: {
    paddingVertical: 20,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
  },

  moreText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
  },

  name: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "45%",
    // backgroundColor: "blue",
    paddingRight: 15,
  },

  price: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "13%",
    // backgroundColor: "yellow",
    paddingRight: 10,
    color: "green",
  },

  count: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "19%",
    color: "green",
    // backgroundColor: "red",
  },

  countReturn: {
    width: "19%",
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    paddingVertical: 5,
    paddingHorizontal: 3,
    // paddingTop: 5,
    borderRadius: 5,
    // backgroundColor: "red",
  },

  countReturnText: {
    fontSize: 13,
    fontWeight: "400",
    color: "red",
  },

  input: {
    width: "18%",
  },
});

export default styles;
