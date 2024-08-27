import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingBottom: 60,
  },

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

  titleDate: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    paddingVertical: 8,
  },

  total: {
    borderTopColor: "#222",
    borderTopWidth: 1,
    paddingTop: 8,
  },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingVertical: 5,
    marginHorizontal: 10,
  },

  actionBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  acceptBtn: {
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    color: "#fff",
    width: "47%",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 2,
  },

  rejectBtn: {
    backgroundColor: "red",
    color: "#fff",
    width: "47%",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 2,
  },
});

export default styles;
