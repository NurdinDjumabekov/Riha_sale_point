//// hooks
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//// tags
import { TouchableOpacity, View, Text } from "react-native";

//// fns
import { createInvoiceCheck } from "../../../store/reducers/requestSlice";
import { getWorkShopsForRevision } from "../../../store/reducers/requestSlice";

/////
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

////style
import styles from "./style";

export const ModalWorkShop = (props) => {
  //// модалка для выбора цеха и продавца для которого ревизия

  const { navigation, refAccord } = props;

  const dispatch = useDispatch();

  const refWorkShop = useRef();

  const { listSellersPoints, listWorkShop } = useSelector(
    (state) => state.requestSlice
  );

  const { data } = useSelector((state) => state.saveDataSlice);

  const [obj, setObj] = useState({ guid: "", guidWorkShop: "" });
  ///// guid - guid продавца  //// guidWorkShop - guid цеха

  const snapPointsWorks = useMemo(() => ["70%"], []);

  const shadowBlock = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        {...props}
      ></BottomSheetBackdrop>
    ),
    []
  );

  const closeSeller = () => refAccord.current?.close();
  const closeWorkShop = () => refWorkShop.current?.close();

  const selectSeller = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => choiceSeller(item?.guid)}
      >
        <Text style={styles.selectText}>{item?.fio}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    [obj]
  );

  const choiceSeller = (guid) => {
    setObj({ ...obj, guid });
    ////// get список актуальных цех0в продавца
    dispatch(getWorkShopsForRevision(guid));
    closeSeller();
    workShopOpen(0);
  };

  ////////////////// choice workshop

  const workShopOpen = useCallback((index) => {
    refWorkShop.current?.snapToIndex(index);
  }, []);

  const selectWorkShop = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => choiceWorkShop(item?.workshop_guid)}
      >
        <Text style={styles.selectText}>{item?.workshop}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    [obj]
  );

  const choiceWorkShop = (guidWorkShop) => {
    const dataSend = { seller_guid_to: obj?.guid, guidWorkShop, navigation };

    dispatch(
      createInvoiceCheck({ ...dataSend, seller_guid_from: data?.seller_guid })
    );

    setObj({ ...obj, guidWorkShop });

    //// закрываю аккардион listContrAgents
    closeWorkShop();
  };

  return (
    <>
      <BottomSheet
        ref={refAccord}
        index={-1}
        snapPoints={snapPointsWorks}
        enablePanDownToClose={true}
        backdropComponent={shadowBlock}
        onClose={closeSeller}
      >
        <View style={styles.parent}>
          <Text style={styles.titleSelect}>Выберите продавца для ревизии</Text>
          <BottomSheetFlatList
            data={listSellersPoints}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            renderItem={selectSeller}
            contentContainerStyle={styles.selectBlock}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        ref={refWorkShop}
        index={-1}
        snapPoints={snapPointsWorks}
        enablePanDownToClose={true}
        backdropComponent={shadowBlock}
        onClose={closeWorkShop}
      >
        <View style={styles.parent}>
          {listWorkShop?.length === 0 ? (
            <Text style={styles.noneData}>Список пустой</Text>
          ) : (
            <>
              <Text style={styles.titleSelect}>Выберите цех</Text>
              <BottomSheetFlatList
                data={listWorkShop}
                keyExtractor={(item, index) => `${item.guid}${index}`}
                renderItem={selectWorkShop}
                contentContainerStyle={styles.selectBlock}
              />
            </>
          )}
        </View>
      </BottomSheet>
    </>
  );
};
