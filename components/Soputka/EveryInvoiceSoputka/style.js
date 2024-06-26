import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  parentBlock: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },

  blockSelectProd: {
    flex: 1,
  },

  textTovar: {
    color: "#fff",
    padding: 8,
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 1,
    paddingBottom: 9,
    paddingTop: 9,
    backgroundColor: "rgba(47, 71, 190, 0.672)",
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});

export default styles;
