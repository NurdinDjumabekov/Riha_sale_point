import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  selectBlockInner: {
    minWidth: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    backgroundColor: "#f5f5f5",
    borderRadius: 3,
    marginVertical: 1,
    backgroundColor: "rgba(199, 210, 254, 0.718)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    alignItems: "center",
  },

  selectText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.672)",
    maxWidth: "90%",
  },

  titleSelect: {
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  selectBlock: {
    marginTop: 5,
    marginBottom: 10,
    borderStyle: "solid",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingBottom: 20,
  },

  parent: {
    flex: 1,
    paddingBottom: 20,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(47, 71, 190, 0.482)",
    height: 13,
    width: 13,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },

  noneData: {
    paddingTop: 200,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});

export default styles;
