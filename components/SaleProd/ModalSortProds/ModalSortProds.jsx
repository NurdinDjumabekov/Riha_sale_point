////// hooks
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

/////// components
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

/////// tags
import { FlatList, Text, TouchableOpacity, View } from "react-native";

////// style
import styles from "./style.js";

/////// fns
import { getListSoldProd } from "../../../store/reducers/requestSlice.js";

////// helpers
import { listTimes } from "../../../helpers/Data.js";

const ModalSortProds = ({ props }) => {
  const dispatch = useDispatch();
  const { seller_guid, guidInvoice, refAccord, refPeriod } = props;

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

  const snapPointsWorks = useMemo(() => ["50%", "65%"], []);
  const closeDateBottom = () => refAccord.current?.close();

  const choicePeriod = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.everyList}
        onPress={() => clickDate(item)}
      >
        <Text style={styles.everyListText}>{item?.name}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const clickDate = ({ id }) => {
    closeDateBottom();
    dispatch(getListSoldProd({ guidInvoice, dateSort: id, seller_guid }));
  };

  const openDatePeriod = useCallback((index) => {
    refPeriod.current?.snapToIndex(index);
    closeDateBottom();
  }, []);

  return (
    <BottomSheet
      ref={refAccord}
      index={-1}
      snapPoints={snapPointsWorks}
      enablePanDownToClose={true}
      backdropComponent={shadowBlock}
      onClose={closeDateBottom}
    >
      <View style={styles.listDates}>
        <FlatList
          data={listTimes}
          keyExtractor={(item) => `${item.id}`}
          renderItem={choicePeriod}
          contentContainerStyle={styles.listDatesInner}
        />
        <TouchableOpacity
          style={styles.everyList}
          onPress={() => openDatePeriod(0)}
        >
          <Text style={styles.everyListText}>Выбрать период</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.everyList} onPress={closeDateBottom}>
          <Text style={styles.cancel}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default ModalSortProds;
