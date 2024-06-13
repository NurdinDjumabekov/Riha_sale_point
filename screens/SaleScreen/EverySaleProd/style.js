import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    position: "relative",
    backgroundColor: "#ebeef2",
    paddingHorizontal: 10,
    paddingVertical: 25,
  },

  leftovers: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.591)",
    marginVertical: 5,
  },

  title: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 10,
    maxWidth: "85%",
  },

  addDataBlock: { width: "100%", alignSelf: "center" },

  inputTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 15,
    color: "#222",
    marginBottom: 5,
    paddingLeft: 2,
  },

  inputBlock: { width: "100%", marginTop: 20 },

  input: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 45,
    width: "100%",
    borderRadius: 5,
    borderColor: "rgb(217 223 232)",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  btnAdd: {
    color: "#fff",
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 8,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    fontSize: 18,
    marginTop: 20,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    minWidth: "100%",
  },

  //////////////////// krestik
  krest: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "absolute",
    right: 0,
    top: 20,
  },

  line: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  deg: { transform: [{ rotate: "45deg" }] },
  degMinus: { transform: [{ rotate: "-45deg" }] },
});

export default styles;
