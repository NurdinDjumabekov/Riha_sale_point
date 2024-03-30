import {
  SafeAreaView,
  StyleSheet,
  Modal,
  Text,
  View,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  createInvoiceTT,
  getAllSellersPoint,
  getInvoiceEveryTA,
} from "../store/reducers/requestSlice";
import { useEffect, useState } from "react";
import { ViewButton } from "../customsTags/ViewButton";
import {
  changeEveryInvoiceTA,
  clearEveryInvoiceTA,
} from "../store/reducers/stateSlice";
import { EveryInvoiceTA } from "../components/TAComponents/EveryInvoiceTA";

export const MyShipmentScreen = ({ navigation }) => {
  const { preloader, listSellersPoints, listInvoiceEveryTA } = useSelector(
    (state) => state.requestSlice
  );
  const { createEveryInvoiceTA } = useSelector((state) => state.stateSlice);
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);

  const seller_guid = "93C7B683-048A-49D2-9E0A-23F31D563C23";

  // useEffect(() => {
  //   getData();
  //   dispatch(
  //     changeEveryInvoiceTA({
  //       ...createEveryInvoiceTA,
  //       seller_guid: listSellersPoints?.[0]?.value,
  //     })
  //   );
  // }, []);

  const getData = () => {
    dispatch(getAllSellersPoint(seller_guid));
    dispatch(getInvoiceEveryTA(seller_guid));
  };

  // const changeSelect = (guid) => {
  //   dispatch(
  //     changeEveryInvoiceTA({
  //       ...createEveryInvoiceTA,
  //       seller_guid: guid,
  //     })
  //   );
  // };

  const changeComm = (text) => {
    dispatch(
      changeEveryInvoiceTA({
        ...createEveryInvoiceTA,
        comment: text,
      })
    );
  };

  const closeModal = () => {
    setModalState(false);
    dispatch(clearEveryInvoiceTA());
  };

  const createAppInvoiceTA = () => {
    dispatch(createInvoiceTT({ data: createEveryInvoiceTA, navigation }));
    dispatch(clearEveryInvoiceTA());
    // console.log(createEveryInvoiceTA,"createEveryInvoiceTA");
    // if (createEveryInvoiceTA?.seller_guid === "") {
    //   Alert.alert("Выберите торговую точку!");
    // } else {
    // }
  };

  // console.log(listInvoiceEveryTA, "listInvoiceEveryTA");
  // console.log(listSellersPoints, "listSellersPoints");
  // console.log(createEveryInvoiceTA, "createEveryInvoiceTA");

  const FlatListStyle = {
    minWidth: "100%",
    width: "100%",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.587)",
  };
  return (
    <>
      <View style={styles.parentBlock}>
        <SafeAreaView>
          <View style={{ padding: 10 }}>
            <ViewButton
              styles={[styles.sendBtn, styles.sendBtnMore]}
              onclick={() => setModalState(true)}
            >
              + Открыть кассу
            </ViewButton>
          </View>
          {listInvoiceEveryTA?.length === 0 ? (
            <Text style={styles.noneData}>Список накладных пустой</Text>
          ) : (
            <FlatList
              contentContainerStyle={FlatListStyle}
              data={listInvoiceEveryTA}
              renderItem={({ item }) => (
                <EveryInvoiceTA obj={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item.codeid}
              refreshControl={
                <RefreshControl
                  refreshing={preloader}
                  onRefresh={() => getData()}
                />
              }
            />
          )}
        </SafeAreaView>
      </View>
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
            {/* <Text style={styles.titleSelect}>Создание накладной</Text> */}
            {/* <Text style={styles.titleSelect}>Открыть кассу </Text> */}
            {/* <View style={styles.selectBlock}>
              <FlatList
                contentContainerStyle={{
                  minWidth: "100%",
                  width: "100%",
                }}
                data={listSellersPoints}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.selectBlockInner,
                      createEveryInvoiceTA?.seller_guid === item?.value &&
                        styles.activeSelect,
                    ]}
                    onPress={() => changeSelect(item?.value)}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        createEveryInvoiceTA?.seller_guid === item?.value &&
                          styles.activeSelectText,
                      ]}
                    >
                      {item?.label}
                    </Text>
                  </TouchableOpacity>
                )}
                // keyExtractor={(item) => item.value}
              />
            </View> */}
            <TextInput
              style={styles.inputComm}
              value={createEveryInvoiceTA.comment}
              onChangeText={changeComm}
              placeholder="Описание"
              multiline={true} // Многострочное поле для комментариев
              numberOfLines={4} // Опционально: количество отображаемых строк
            />
            <ViewButton
              styles={{ ...styles.sendBtn, ...styles.actionSendBtn }}
              onclick={createAppInvoiceTA}
            >
              Открыть
            </ViewButton>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    backgroundColor: "#ebeef2",
  },

  modalOuter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  noneData: {
    flex: 1,
    height: 500,
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
  },

  modalInner: {
    backgroundColor: "#ebeef2",
    padding: 15,
    borderRadius: 10,
    width: "90%",
  },

  titleSelect: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },

  sendBtn: {
    backgroundColor: "#fff",
    color: "rgba(97 ,100, 239,0.7)",
    minWidth: "100%",
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: 600,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    marginTop: 10,
  },
  sendBtnMore: {
    marginBottom: 10,
  },
  actionSendBtn: {
    paddingTop: 12,
    fontSize: 18,
    // backgroundColor: "rgba(95, 230, 165, 0.99)",
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    color: "#fff",
  },
  imgIcon: {
    width: 35,
    height: 35,
  },
  selectBlock: {
    marginTop: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    minHeight: 70,
    maxHeight: 250,
  },

  selectBlockInner: {
    minWidth: "100%",
    // backgroundColor: "red",
    // paddingTop: 10,
    // paddingBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    backgroundColor: "#fff",
    borderRadius: 3,
  },

  activeSelect: {
    backgroundColor: "rgba(47, 71, 190, 0.672)",
  },

  selectText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.672)",
  },

  activeSelectText: {
    color: "#fff",
  },

  inputComm: {
    borderWidth: 1,
    borderColor: "rgb(217 223 232)",
    borderRadius: 8,
    padding: 10,
    paddingLeft: 15,
    marginTop: 10,
    height: 100,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
});
