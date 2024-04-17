import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";
import { useState } from "react";
import { createInvoiceSoputkaTT } from "../../store/reducers/requestSlice";

export const ModalCreateSoputka = (props) => {
  //// модалка для созданя с0путки

  const { modalState, setModalState, navigation } = props;

  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  const closeModal = () => {
    setModalState(false);
    setComment("");
  };

  const { data } = useSelector((state) => state.saveDataSlice);

  const create = () => {
    dispatch(
      createInvoiceSoputkaTT({
        navigation,
        data: { comment, seller_guid: data?.seller_guid },
      })
    );
    closeModal();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalState}
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        style={styles.modalOuter}
        activeOpacity={1}
        onPress={closeModal} // Закрыть модальное окно
      >
        <View style={styles.modalInner} onPress={() => setModalState(true)}>
          <TextInput
            style={styles.inputComm}
            value={comment?.toString()}
            onChangeText={(text) => setComment(text)}
            placeholder="Ваш комментарий"
            multiline={true}
            numberOfLines={4}
          />
          <ViewButton styles={styles.sendBtn} onclick={create}>
            + Создать
          </ViewButton>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

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
