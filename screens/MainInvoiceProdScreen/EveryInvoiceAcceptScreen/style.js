import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parent: { maxHeight: "98%", paddingBottom: 50 },

  flatList: {
    minWidth: "100%",
    width: "100%",
    paddingTop: 8,
    marginBottom: 15,
  },

  results: { paddingTop: 10 },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingHorizontal: 10,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default styles;
