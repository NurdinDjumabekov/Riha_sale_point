////// hooks
import { useState } from "react";
import { useDispatch } from "react-redux";
// import ru from "date-fns/locale/ru";

/////// components
// import NavMenu from "../../../common/NavMenu/NavMenu";
// import DatePicker, { registerLocale } from "react-datepicker";
import DatePicker from "react-native-modern-datepicker";
import { getToday, getFormatedDate } from "react-native-modern-datepicker";

////// imgs
import dateIcon from "../../../assets/images/date.png";

/////// style
import styles from "./style.js";

// import { transformDateTime } from "../../../helpers/transformDate";
import { getListSoldProd } from "../../../store/reducers/requestSlice";
import {
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Modal } from "react-native";

// registerLocale("ru", ru);

const SortDateSaleProd = ({ guidInvoice, seller_guid, navigation }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(getToday());
  const [open, setOpen] = useState(false);

  const openDate = () => setOpen(true);
  const closeDate = () => setOpen(false);

  const onChange = (date) => {
    setStartDate(date);
    // const dateSort = transformDateTime(date); //// форматирую время
    // dispatch(getListSoldProd({ guidInvoice, dateSort, seller_guid })); //// отправка запроса для get данных
    // closeDate(false);
  };

  console.log(startDate, "startDate");

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
          <View style={styles.calendare}>
            <DatePicker
              current={startDate} // Отображаем текущую дату
              selected={startDate} // Выделяем текущую дату
              onSelectedChange={(date) => onChange(date)}
              mode="calendar"
              selectedTextColor="#fff" // Цвет текста для выделенной даты
              selectedBackgroundColor="#007bff" // Цвет фона для выделенной даты
              customStyles={{
                selectedDay: {
                  backgroundColor: "#007bff", // цвет фона для выбранного дня
                  color: "#fff", // цвет текста для выбранного дня
                },
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SortDateSaleProd;
