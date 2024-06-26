///// tags
import { TouchableWithoutFeedback } from "react-native";
import { Modal, View, Text } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

//// style
import styles from "./style";

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
