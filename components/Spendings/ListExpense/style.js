import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    minHeight: "100%",
    paddingBottom: 180,
  },

  everyProd: {
    padding: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.107)",
  },

  everyProdInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    maxWidth: "95%",
  },

  comment: {
    fontSize: 14,
    fontWeight: "400",
  },

  date: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(47, 71, 190, 0.687)",
  },

  sum: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(12, 169, 70, 0.9)",
  },

  blockTitle: { width: "60%" },

  flatlist: { width: "100%", paddingTop: 8 },

  commentAdmin: {
    fontSize: 16,
    marginTop: 10,
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },

  red: { color: "red" },

  green: { color: "rgba(12, 169, 70, 0.9)" },
});

export default styles;
