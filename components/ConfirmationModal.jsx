import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Modal, View, Text } from "react-native";
import { ViewButton } from "../customsTags/ViewButton";

const ConfirmationModal = ({ visible, message, onYes, onNo, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.parent}>
          <View style={styles.container}>
            <Text style={styles.title}>{message}</Text>
            <View style={styles.buttonContainer}>
              <ViewButton onclick={onYes} styles={[styles.btns, styles.green]}>
                Да
              </ViewButton>
              <ViewButton onclick={onNo} styles={[styles.btns, styles.red]}>
                Нет
              </ViewButton>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
    maxWidth: "90%",
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },

  btns: {
    color: "#fff",
    elevation: 2,
    fontSize: 20,
    width: 90,
    paddingBottom: 8,
    paddingTop: 6,
  },

  red: { backgroundColor: "red" },

  green: { backgroundColor: "green" },
});
