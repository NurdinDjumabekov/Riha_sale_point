import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentFlatList: { flex: 1, width: "100%" },

  mainBlock: {
    paddingHorizontal: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(47, 71, 190, 0.287)",
    borderBottomWidth: 1,
  },

  more: {
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    borderTopColor: "rgba(47, 71, 190, 0.287)",
    borderTopWidth: 1,
  },

  moreText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 11,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    lineHeight: 12,
    paddingVertical: 12,
  },

  name: {
    fontSize: 11,
    fontWeight: "400",
    color: "#222",
    width: "28%",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  ostatokStart: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "16%",
    paddingHorizontal: 3,
    paddingLeft: 4,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  prihod: {
    fontSize: 12,
    fontWeight: "400",
    width: "16%",
    color: "green",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  rashod: {
    fontSize: 12,
    fontWeight: "400",
    width: "15%",
    color: "red",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  ostatokEnd: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "16%",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  price: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "10%",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },
});

export default styles;
