import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  everyProd: {
    padding: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.107)",
    width: "97%",
    alignSelf: "center",
  },

  everyProdInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  blockTitle: { width: "67%" },

  blockTitleInner: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },

  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.687)",
    lineHeight: 17,
  },

  type: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(12, 169, 70, 0.9)",
    lineHeight: 15,
    marginTop: 5,
  },

  comment: { fontSize: 14, fontWeight: "400", marginTop: 5 },

  status: { width: "27%" },

  sum: { fontSize: 15, fontWeight: "400", color: "rgba(12, 169, 70, 0.9)" },

  good: { color: "rgba(12, 169, 70, 0.9)", fontSize: 15, fontWeight: "500" },
});
export default styles;
