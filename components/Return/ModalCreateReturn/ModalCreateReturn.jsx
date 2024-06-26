import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////tags
import { FlatList, Text, View } from "react-native";
import { Modal, TouchableOpacity, TextInput } from "react-native";
import { Alert } from "react-native";

/////components
import { ViewButton } from "../../../customsTags/ViewButton";
import { ChoiceAgents } from "../ChoiceAgents";

////redux
import { createInvoiceReturn } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

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
