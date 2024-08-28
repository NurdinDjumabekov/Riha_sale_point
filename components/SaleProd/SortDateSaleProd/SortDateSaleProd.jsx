////// hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

/////// tags
import { Image, Text } from "react-native";
import { TouchableOpacity, Modal } from "react-native";
import { TouchableWithoutFeedback, View } from "react-native";

/////// components
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";

////// imgs
import dateIcon from "../../../assets/images/date.png";

/////// style
import styles from "./style.js";

/////// fns
import { getListSoldProd } from "../../../store/reducers/requestSlice.js";

/////// helpers
import { transformDateTime } from "../../../helpers/transformDate.js";
import { ViewButton } from "../../../customsTags/ViewButton.jsx";

const SortDateSaleProd = ({ guidInvoice, seller_guid }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(getToday());
  const [open, setOpen] = useState(false);

  const openDate = () => setOpen(true);
  const closeDate = () => setOpen(false);

  const onChange = (date) => setStartDate(date);

  const clickBtnDate = () => {
    const dateSort = transformDateTime(startDate); //// форматирую время
    dispatch(getListSoldProd({ guidInvoice, dateSort, seller_guid })); //// отправка запроса для get данных
    closeDate(false);
  };

  return (
    <>
      <View style={styles.dateSort}>
        <TouchableOpacity style={styles.btnDate} onPress={openDate}>
          <Image style={styles.btnDateIcon} source={dateIcon} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={closeDate}
      >
        <TouchableWithoutFeedback onPress={closeDate}>
          <View style={styles.calendar}>
            <View style={styles.calendarInner}>
              <DatePicker
                current={startDate} // Отображаем текущую дату
                selected={startDate} // Выделяем текущую дату
                onSelectedChange={(date) => onChange(date)}
                mode="calendar"
                selectedTextColor="#fff" // Цвет текста для выделенной даты
                selectedBackgroundColor="#007bff" // Цвет фона для выделенной даты
                maximumDate={getToday()}
                locale="ru"
              />
              <ViewButton onclick={clickBtnDate} styles={styles.actionBtn}>
                Найти
              </ViewButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SortDateSaleProd;
