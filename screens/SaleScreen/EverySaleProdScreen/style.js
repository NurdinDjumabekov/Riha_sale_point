import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    position: "relative",
    backgroundColor: "#ebeef2",
    paddingHorizontal: 10,
    paddingVertical: 25,
    paddingBottom: 60,
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

  blockAction: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
  },

  twoAction: {
    maxWidth: "100%",
    width: "auto",
  },

  btnAdd: {
    color: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    minWidth: 110,
    width: 110,
    margin: 0,
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
