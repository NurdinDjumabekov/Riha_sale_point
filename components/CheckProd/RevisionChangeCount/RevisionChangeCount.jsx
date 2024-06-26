///// tags
import { Text, View, TextInput, Modal } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";

///// hooks
import { useDispatch, useSelector } from "react-redux";

///// fns
import { changeListActionLeftovers } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

const RevisionChangeCount = ({ objTemporary, setObjTemporary, inputRef }) => {
  const dispatch = useDispatch();

  const { listActionLeftovers } = useSelector((state) => state.requestSlice);

  const onClose = () => setObjTemporary({});

  const changeCount = () => {
    const guidProd = objTemporary?.change_end_outcome;
    const products = listActionLeftovers?.map((i) => ({
      ...i,
      change_end_outcome:
        i?.guid == objTemporary?.guid ? +guidProd : +i?.change_end_outcome,
    }));

    dispatch(changeListActionLeftovers(products));
    ///// для ревизии накладной с продуктами
    onClose();
  };

  const onChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setObjTemporary({ ...objTemporary, change_end_outcome: text });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!objTemporary?.guid}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.parennt}>
          <View style={styles.child}>
            <Text style={styles.title}>{objTemporary?.product_name} </Text>
            <TouchableOpacity style={styles.krest} onPress={() => onClose()}>
              <View style={[styles.line, styles.deg]} />
              <View style={[styles.line, styles.degMinus]} />
            </TouchableOpacity>
            <View style={styles.addDataBlock}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>
                  Введите{" "}
                  {objTemporary?.unit_codeid == 1
                    ? "кол-во товара"
                    : "вес товара"}{" "}
                  ({objTemporary?.unit})
                </Text>
                <TextInput
                  style={styles.input}
                  value={objTemporary?.change_end_outcome?.toString()}
                  onChangeText={(text) => onChange(text)}
                  keyboardType="numeric"
                  maxLength={8}
                  ref={inputRef}
                />
              </View>
              <ViewButton styles={styles.btnAdd} onclick={changeCount}>
                Изменить
              </ViewButton>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RevisionChangeCount;
