import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////tags
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Modal, TouchableOpacity, TextInput } from "react-native";
import { Alert } from "react-native";

/////components
import { ViewButton } from "../../customsTags/ViewButton";
import { ChoiceAgents } from "../ChoiceAgents";

////redux
import { createInvoiceReturn } from "../../store/reducers/requestSlice";

export const ModalCreateReturn = (props) => {
  //// модалка для созданя возврата накладной

  const { modalState, setModalState, navigation } = props;

  const dispatch = useDispatch();

  const [obj, setObj] = useState({ comment: "", agent_guid: "" });

  const closeModal = () => {
    setModalState(false);
    setObj({ comment: "", agent_guid: "" });
  };

  const { data } = useSelector((state) => state.saveDataSlice);

  const { listAgents } = useSelector((state) => state.requestSlice);

  const create = () => {
    if (obj?.agent_guid === "") {
      Alert.alert("Выберите агента");
    } else {
      const dataObj = { ...obj, seller_guid: data?.seller_guid };
      dispatch(createInvoiceReturn({ navigation, dataObj }));
      closeModal();
    }
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
          <Text style={styles.titleSelect}>Выберите агента</Text>
          <View style={styles.selectBlock}>
            <FlatList
              data={listAgents}
              renderItem={({ item }) => (
                <ChoiceAgents
                  item={item}
                  setState={setObj}
                  prev={obj}
                  keyGuid={"agent_guid"}
                  keyText={"agent"}
                />
              )}
              keyExtractor={(item, index) => `${item.guid}${index}`}
            />
          </View>
          <TextInput
            style={styles.inputComm}
            value={obj?.comment?.toString()}
            onChangeText={(text) => setObj({ ...obj, comment: text })}
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

  titleSelect: {
    fontSize: 17,
    fontWeight: "500",
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

  selectBlock: {
    marginTop: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    minHeight: 40,
    maxHeight: 180,
  },
});
