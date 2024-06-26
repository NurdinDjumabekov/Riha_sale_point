import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentBlock: { flex: 1, backgroundColor: "#ebeef2", padding: 10 },

  selectBlock: {
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 5,
    position: "relative",
    width: "55%",
  },

  select: {
    backgroundColor: "#f5f5f5",
    height: 45,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 12,
    width: 12,
    borderRadius: 2,
    marginRight: 20,
    position: "absolute",
    right: 5,
    top: 13,
    transform: [{ rotate: "135deg" }],
  },

  inputBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },

  input: {
    backgroundColor: "#f5f5f5",
    height: 45,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    width: "20%",
  },

  width100: { width: "100%" },

  addBtn: {
    minWidth: "19%",
    fontSize: 26,
    lineHeight: 30,
    paddingBottom: 0,
    paddingTop: 8,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    color: "#fff",
    height: 45,
  },

  mainTitle: { fontSize: 20, fontWeight: "600", paddingVertical: 15 },
});

export default styles;
