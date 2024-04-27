import { StyleSheet, Text } from "react-native";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeReturnInvoice,
  cleareReturnInvoice,
} from "../../store/reducers/stateSlice";
import { Modal } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";
import { FlatList } from "react-native";
import { createInvoiceReturnTT } from "../../store/reducers/requestSlice";

export const ModalChoiceReturn = ({ navigation }) => {
  //// модалка создания накладной для возрата товара
  const dispatch = useDispatch();

  const { listRevizors } = useSelector((state) => state.requestSlice);
  const { createReturnInvoice } = useSelector((state) => state.stateSlice);

  const closeModal = () => dispatch(cleareReturnInvoice());

  const openModal = () => {
    dispatch(changeReturnInvoice({ ...createReturnInvoice, stateModal: true }));
  };

  // const changeSelect = (oper_guid) => {
  //   dispatch(changeReturnInvoice({ ...createReturnInvoice, oper_guid }));
  // };

  const changeComm = (text) => {
    dispatch(
      changeReturnInvoice({
        ...createReturnInvoice,
        comment: text,
      })
    );
  };
  console.log(createReturnInvoice, "createReturnInvoice");

  const createInvoiceReturn = () => {
    // if (createReturnInvoice?.oper_guid === "") {
    //   Alert.alert("Выберите админа!");
    // } else {
    // }
    const { stateModal, ...data } = createReturnInvoice;
    dispatch(createInvoiceReturnTT({ data, navigation, closeModal }));
  };

  const widthMax = { minWidth: "100%", width: "100%" };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={createReturnInvoice?.stateModal}
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        style={styles.modalOuter}
        activeOpacity={1}
        onPress={closeModal}
      >
        <View style={styles.modalInner} onPress={openModal}>
          <Text style={styles.titleSelect}>Выберите агента</Text>
          <View style={styles.selectBlock}>
            <FlatList
              contentContainerStyle={widthMax}
              data={listRevizors}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.selectBlockInner,
                    createReturnInvoice?.oper_guid === item?.guid &&
                      styles.activeSelect,
                  ]}
                  onPress={() => changeSelect(item?.guid)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      createReturnInvoice?.oper_guid === item?.guid &&
                        styles.activeSelectText,
                    ]}
                  >
                    {item?.fio}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <TextInput
            style={styles.inputComm}
            value={createReturnInvoice?.comment}
            onChangeText={changeComm}
            placeholder="Ваш комментарий"
            multiline={true}
            numberOfLines={4}
          />
          <ViewButton
            styles={{ ...styles.sendBtn, ...styles.actionSendBtn }}
            onclick={createInvoiceReturn}
          >
            Создать накладную
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
    width: "90%",
  },

  titleSelect: {
    fontSize: 17,
    fontWeight: "500",
  },

  sendBtn: {
    backgroundColor: "#fff",
    color: "rgba(97 ,100, 239,0.7)",
    minWidth: "100%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    marginTop: 10,
  },

  actionSendBtn: {
    paddingTop: 12,
    fontSize: 18,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    color: "#fff",
  },

  selectBlock: {
    marginTop: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    minHeight: 30,
    maxHeight: 250,
  },

  selectBlockInner: {
    minWidth: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    backgroundColor: "#fff",
    borderRadius: 3,
  },

  activeSelect: {
    backgroundColor: "rgba(47, 71, 190, 0.672)",
  },

  selectText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.672)",
  },

  activeSelectText: {
    color: "#fff",
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
});
