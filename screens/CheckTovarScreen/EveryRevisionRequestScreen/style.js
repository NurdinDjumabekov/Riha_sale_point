import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  main: { flex: 1, paddingBottom: 60 },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,
    paddingTop: 5,
  },

  parent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 4,
    paddingHorizontal: 10,
  },

  actionBlock: {
    borderTopColor: "#222",
    borderTopWidth: 1,
    paddingTop: 14,
  },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingVertical: 5,
    marginHorizontal: 10,
  },

  titleDate: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    paddingVertical: 8,
  },

  sendBtn: {
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    color: "#fff",
    minWidth: "95%",
    alignSelf: "center",
  },
});

export default styles;
