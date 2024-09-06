import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  listDates: {
    padding: 20,
    position: "relative",
    height: 270,
  },

  everyList: { padding: 10 },

  everyListText: { fontSize: 16, textAlign: "center", fontWeight: "500" },

  cancel: {
    color: "rgba(61, 154, 247, 0.972)",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },

  titleBlock: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: { fontSize: 16 },

  period: {
    fontSize: 19,
    textAlign: "center",
    fontWeight: "500",
    textDecorationColor: "red",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: "rgba(47, 71, 190, 0.591)",
  },

  btns: {
    width: "100%",
    backgroundColor: "#77a64b",
    color: "#fff",
    fontSize: 16,
    paddingTop: 10,
    borderRadius: 8,
    marginTop: 40,
    position: "absolute",
    bottom: 10,
    zIndex: 10,
    alignSelf: "center",
  },
});

export default styles;
