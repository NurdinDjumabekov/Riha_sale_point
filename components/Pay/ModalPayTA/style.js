import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalInner: {
    backgroundColor: "#ebeef2",
    padding: 15,
    borderRadius: 10,
    width: "95%",
  },

  titleSelect: {
    fontSize: 17,
    fontWeight: "500",
  },

  selectBlock: {
    marginVertical: 10,
    marginTop: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    minHeight: 40,
    maxHeight: 180,
  },

  inputNum: {
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 8,
    padding: 10,
    paddingVertical: 8,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  inputComm: {
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    height: 60,
    borderRadius: 8,
    padding: 10,
    paddingLeft: 15,
    marginTop: 10,
    height: 120,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },

  sendBtn: {
    backgroundColor: "#fff",
    color: "#fff",
    minWidth: "100%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    marginTop: 20,
  },
});

export default styles;
