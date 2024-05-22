import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  createInvoiceCheck,
  getWorkShopsForRevision,
} from "../../store/reducers/requestSlice";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { View } from "react-native";

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
    console.log(guid, "guid");
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

    //// закрываю аккардион
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

const styles = StyleSheet.create({
  selectBlockInner: {
    minWidth: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginVertical: 1,
    backgroundColor: "rgba(199, 210, 254, 0.718)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    alignItems: "center",
  },

  selectText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.672)",
    maxWidth: "90%",
  },

  titleSelect: {
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  selectBlock: {
    marginTop: 5,
    marginBottom: 10,
    borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "rgb(217 223 232)",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingBottom: 20,
  },

  parent: {
    flex: 1,
    paddingBottom: 20,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
    height: 16,
    width: 16,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },

  noneData: {
    paddingTop: 200,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
