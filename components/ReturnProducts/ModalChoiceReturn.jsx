import { ScrollView, StyleSheet, Text } from 'react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-native';
import { ViewButton } from '../../customsTags/ViewButton';
import { createInvoiceReturnTT } from '../../store/reducers/requestSlice';
import { useState } from 'react';
import { ChoiceAgents } from '../ChoiceAgents';

// const { listRevizors } = useSelector((state) => state.requestSlice);
// createReturnInvoice
////// delete
export const ModalChoiceReturn = (props) => {
  //// модалка создания накладной для возрата товара

  const dispatch = useDispatch();

  // const { createReturnInvoice } = useSelector((state) => state.stateSlice);
  const { modalState, setModalState, navigation } = props;

  const { listAgents } = useSelector((state) => state.requestSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const [obj, setObj] = useState({ comment: '', agent_guid: '' });

  const closeModal = () => {
    setModalState(false);
    setObj({ comment: '', agent_guid: '' });
  };

  const createInvoiceReturn = () => {
    if (obj?.agent_guid === '') {
      Alert.alert('Выберите агента');
    } else {
      const dataObj = { ...obj, seller_guid: data?.seller_guid };
      dispatch(createInvoiceReturnTT({ dataObj, navigation }));
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
          <Text style={styles.titleSelect}>Выберите агента</Text>
          <ScrollView style={styles.selectBlock}>
            {listAgents?.map((item) => (
              <ChoiceAgents
                item={item}
                setState={setObj}
                prev={obj}
                keyGuid={'agent_guid'}
                keyText={'agent'}
              />
            ))}
          </ScrollView>
          <TextInput
            style={styles.inputComm}
            value={obj?.comment?.toString()}
            onChangeText={(text) => setObj({ ...obj, comment: text })}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalInner: {
    backgroundColor: '#ebeef2',
    padding: 15,
    borderRadius: 10,
    width: '90%',
  },

  titleSelect: {
    fontSize: 17,
    fontWeight: '500',
  },

  sendBtn: {
    backgroundColor: '#fff',
    color: 'rgba(97 ,100, 239,0.7)',
    minWidth: '100%',
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    borderWidth: 1,
    borderColor: 'rgb(217 223 232)',
    marginTop: 10,
  },

  actionSendBtn: {
    paddingTop: 12,
    fontSize: 18,
    backgroundColor: 'rgba(97 ,100, 239,0.7)',
    color: '#fff',
  },

  selectBlock: {
    marginTop: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgb(217 223 232)',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    minHeight: 30,
    maxHeight: 180,
  },

  inputComm: {
    borderWidth: 1,
    borderColor: 'rgb(217 223 232)',
    height: 60,
    borderRadius: 8,
    padding: 10,
    paddingLeft: 15,
    marginTop: 10,
    height: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});
