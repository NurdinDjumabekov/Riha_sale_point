import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";
import { useState } from "react";
import { ChoiceAgents } from "../ChoiceAgents";
import { createInvoiceCheck } from "../../store/reducers/requestSlice";

export const ModalWorkShop = (props) => {
  //// модалка для выбора цеха и продавца для которого ревизия

  const { modalState, setModalState, navigation } = props;

  const dispatch = useDispatch();

  const { listSellersPoints, listWorkShop } = useSelector(
    (state) => state.requestSlice
  );

  const { data } = useSelector((state) => state.saveDataSlice);

  const [obj, setObj] = useState({ guid: "", guidWorkShop: "" });
  ///// guid - guid продавца  //// guidWorkShop - guid цеха

  const closeModal = () => {
    setModalState(false);
    setObj({ guid: "", guidWorkShop: "" });
  };

  const createInvoiceReturn = () => {
    if (obj?.guid === "") {
      Alert.alert("Выберите продавца");
    } else if (obj?.guidWorkShop === "") {
      Alert.alert("Выберите цех");
    } else {
      const dataSend = {
        seller_guid_to: obj?.guid, //// от какого продавца ревизия
        seller_guid_from: data?.seller_guid, //// какому продавцу ревизия
        guidWorkShop: obj?.guidWorkShop,
        navigation,
      };

      dispatch(createInvoiceCheck(dataSend));
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
        onPress={closeModal}
      >
        <View style={styles.modalInner} onPress={() => setModalState(true)}>
          <Text style={styles.titleSelect}>Выберите продавца</Text>
          <ScrollView style={styles.selectBlock}>
            {listSellersPoints?.map((item) => (
              <ChoiceAgents
                item={item}
                setState={setObj}
                prev={obj}
                keyGuid={"guid"}
                keyText={"fio"}
              />
            ))}
          </ScrollView>
          <Text style={styles.titleSelect}>Выберите цех</Text>
          <ScrollView style={styles.selectBlock}>
            {listWorkShop?.map((item) => (
              <ChoiceAgents
                item={item}
                setState={setObj}
                prev={obj}
                keyGuid={"guidWorkShop"}
                keyText={"name"}
              />
            ))}
          </ScrollView>

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
    marginTop: 5,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    minHeight: 30,
    maxHeight: 150,
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
