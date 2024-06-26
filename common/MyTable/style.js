import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentFlatList: { maxHeight: "75%" },

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

  more: { paddingVertical: 20, backgroundColor: "rgba(212, 223, 238, 0.47)" },

  moreText: { fontWeight: "600", color: "#000", fontSize: 14 },

  name: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "55%",
    paddingRight: 15,
  },

  price: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "22%",
    paddingRight: 10,
  },

  count: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "21%",
  },
});

export default styles;
