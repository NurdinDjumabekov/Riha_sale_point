import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./style.js";
import { getListSoldProd } from "../../../store/reducers/requestSlice.js";
import {
  transformDate,
  transformDatePeriod,
} from "../../../helpers/transformDate.js";
import { ViewButton } from "../../../customsTags/ViewButton.jsx";

const ModalSortPeriodProds = ({ props }) => {
  const dispatch = useDispatch();
  const { seller_guid, guidInvoice, refPeriod } = props;

  const shadowBlock = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [lookStartDate, setLookStartDate] = useState(false);
  const [lookEndDate, setLookEndDate] = useState(false);

  const snapPointsWorks = useMemo(() => ["40%", "50%"], []);
  const closeDateBottom = () => refPeriod.current?.close();

  const clickDate = () => {
    closeDateBottom();
    const dateSort = `${transformDatePeriod(startDate)}-${transformDatePeriod(
      endDate
    )}`;
    dispatch(getListSoldProd({ guidInvoice, dateSort, seller_guid }));
  };

  const openStartDateModal = () => setLookStartDate(true);
  const openEndDateModal = () => setLookEndDate(true);

  const handleStartDateChange = (e, selectedDate) => {
    setLookStartDate(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (e, selectedDate) => {
    setLookEndDate(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <>
      <BottomSheet
        ref={refPeriod}
        index={-1}
        snapPoints={snapPointsWorks}
        enablePanDownToClose={true}
        backdropComponent={shadowBlock}
        onClose={closeDateBottom}
      >
        <View style={styles.listDates}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Начало истории</Text>
            <TouchableOpacity onPress={openStartDateModal}>
              <Text style={styles.period}>{transformDate(startDate)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Конец истории</Text>
            <TouchableOpacity onPress={openEndDateModal}>
              <Text style={styles.period}>{transformDate(endDate)}</Text>
            </TouchableOpacity>
          </View>

          <ViewButton onclick={clickDate} styles={styles.btns}>
            Готово
          </ViewButton>
        </View>
      </BottomSheet>

      {lookStartDate && (
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <RNDateTimePicker
            value={startDate}
            onChange={handleStartDateChange}
            display="spinner"
            positiveButton={{ label: "Выбрать", textColor: "green" }}
            locale="ru-RU"
            maximumDate={new Date()}
            themeVariant="light"
          />
        </View>
      )}

      {lookEndDate && (
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <RNDateTimePicker
            value={endDate}
            onChange={handleEndDateChange}
            display="spinner"
            positiveButton={{ label: "Выбрать", textColor: "green" }}
            locale="ru-RU"
            maximumDate={new Date()}
            themeVariant="light"
          />
        </View>
      )}
    </>
  );
};

export default ModalSortPeriodProds;
