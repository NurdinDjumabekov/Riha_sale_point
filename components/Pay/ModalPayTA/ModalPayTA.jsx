////// tags
import { Alert, FlatList, Text, View } from "react-native";
import { Modal, TextInput, TouchableOpacity } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";

///// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

//////fns
import { acceptMoney } from "../../../store/reducers/requestSlice";

//////componets
import { ChoiceAgents } from "../../../common/ChoiceAgents/ChoiceAgents";

////style
import styles from "./style";

export const ModalPayTA = ({ modalState, setModalState, navigation }) => {
  //// модалка для оплаты ТТ
  const dispatch = useDispatch();

  const [obj, setObj] = useState({ comment: "", amount: "", agent_guid: "" });

  const { data } = useSelector((state) => state.saveDataSlice);
  const { listAgents } = useSelector((state) => state.requestSlice);

  const closeModal = () => {
    setModalState(false);
    setObj({ comment: "", amount: "", agent_guid: "" });
  };

  const onChange = (text, type) => {
    if (type === "amount") {
      if (/^-?\d*\.?\d*$/.test(text)) {
        setObj({ ...obj, amount: text });
      }
    } else {
      setObj({ ...obj, comment: text });
    }
  };

  const sendMoney = () => {
    ///// отплачиваю деньги как ТТ ревизору
    if (!obj?.amount) {
      Alert.alert("Введите сумму");
    } else if (!obj?.agent_guid) {
      Alert.alert("Выберите агента");
    } else {
      const dataObj = { ...obj, seller_guid: data?.seller_guid };
      dispatch(acceptMoney({ dataObj, closeModal, navigation }));
      // if (temporaryGuidPoint?.debit < temporaryGuidPoint?.amount) {
      //   Alert.alert("Введенная вами сумма больше зарабатка торговой точки!");
      // } else {
      // }
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
            style={styles.inputNum}
            value={obj?.amount?.toString()}
            onChangeText={(e) => onChange(e, "amount")}
            placeholder="Сумма"
            keyboardType="numeric"
            maxLength={8}
          />
          <TextInput
            style={styles.inputComm}
            value={obj?.comment}
            onChangeText={(e) => onChange(e, "comment")}
            placeholder="Ваш комментарий"
            multiline={true}
            numberOfLines={4}
          />
          <ViewButton styles={styles.sendBtn} onclick={sendMoney}>
            Оплатить
          </ViewButton>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
