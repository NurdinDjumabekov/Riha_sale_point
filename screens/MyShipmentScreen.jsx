import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  createInvoiceTT,
  getInvoiceEveryTT,
} from "../store/reducers/requestSlice";
import { useEffect } from "react";
import { ViewButton } from "../customsTags/ViewButton";
import {
  changeStateForCategory,
  clearEveryInvoiceTA,
} from "../store/reducers/stateSlice";
import { EveryInvoice } from "./EveryInvoice";

export const MyShipmentScreen = ({ navigation }) => {
  const { createEveryInvoiceTA } = useSelector((state) => state.stateSlice);
  const { isOpenKassa } = useSelector((state) => state.requestSlice);
  const dispatch = useDispatch();

  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(getInvoiceEveryTT(seller_guid));
  };

  const createAppInvoiceTA = () => {
    dispatch(createInvoiceTT({ data: createEveryInvoiceTA, navigation }));
    defaultFN();
  };

  const defaultFN = () => {
    dispatch(clearEveryInvoiceTA()); // очищаю активный продукт
    dispatch(changeStateForCategory("0")); /// категория будет "все"
  };

  return (
    <>
      <View style={styles.parentBlock}>
        {isOpenKassa ? (
          <View style={{ padding: 10 }}>
            <ViewButton
              styles={[styles.sendBtn, styles.sendBtnMore]}
              onclick={createAppInvoiceTA}
            >
              + Открыть кассу
            </ViewButton>
          </View>
        ) : (
          <EveryInvoice
            navigation={navigation}
            codeid="444"
            guid="yourGuidValue"
            date="01.04.2024"
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    backgroundColor: "#ebeef2",
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
});

// import {
//   SafeAreaView,
//   StyleSheet,
//   Modal,
//   Text,
//   View,
//   TextInput,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createInvoiceTT,
//   getInvoiceEveryTT,
// } from "../store/reducers/requestSlice";
// import { useEffect, useState } from "react";
// import { ViewButton } from "../customsTags/ViewButton";
// import {
//   changeEveryInvoiceTA,
//   changeStateForCategory,
//   clearEveryInvoiceTA,
// } from "../store/reducers/stateSlice";
// import { EveryInvoiceTT } from "../components/TAComponents/EveryInvoiceTT";
// import { transformDate } from "../helpers/transformDate";

// export const MyShipmentScreen = ({ navigation }) => {
//   const { preloader, listInvoiceEveryTT } = useSelector(
//     (state) => state.requestSlice
//   );
//   const { createEveryInvoiceTA } = useSelector((state) => state.stateSlice);
//   const dispatch = useDispatch();
//   const [modalState, setModalState] = useState(false);

//   const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = () => {
//     dispatch(getInvoiceEveryTT(seller_guid));
//   };

//   const changeComm = (text) => {
//     dispatch(
//       changeEveryInvoiceTA({
//         ...createEveryInvoiceTA,
//         comment: text,
//       })
//     );
//   };

//   const closeModal = () => {
//     setModalState(false);
//     dispatch(clearEveryInvoiceTA());
//   };

//   const createAppInvoiceTA = () => {
//     dispatch(createInvoiceTT({ data: createEveryInvoiceTA, navigation }));
//     dispatch(clearEveryInvoiceTA()); // очищаю активный продукт
//     dispatch(changeStateForCategory("0")); /// категория будет "все"
//     setModalState(false);
//     // console.log(createEveryInvoiceTA,"createEveryInvoiceTA");
//     // if (createEveryInvoiceTA?.seller_guid === "") {
//     //   Alert.alert("Выберите торговую точку!");
//     // } else {
//     // }
//   };

//   // console.log(listInvoiceEveryTT, "listInvoiceEveryTT");
//   // console.log(listSellersPoints, "listSellersPoints");
//   // console.log(createEveryInvoiceTA, "createEveryInvoiceTA");

//   const FlatListStyle = {
//     minWidth: "100%",
//     width: "100%",
//     paddingBottom: 20,
//     borderTopWidth: 1,
//     borderColor: "rgba(47, 71, 190, 0.587)",
//   };

//   return (
//     <>
//       <View style={styles.parentBlock}>
//         <SafeAreaView>
//           <View style={{ padding: 10 }}>
//             <ViewButton
//               styles={[styles.sendBtn, styles.sendBtnMore]}
//               onclick={() => setModalState(true)}
//             >
//               Открыть кассу на {transformDate(new Date())}
//             </ViewButton>
//           </View>
//           {listInvoiceEveryTT?.length === 0 ? (
//             <Text style={styles.noneData}>Список накладных пустой</Text>
//           ) : (
//             <View style={{ paddingBottom: 180 }}>
//               <FlatList
//                 contentContainerStyle={FlatListStyle}
//                 data={listInvoiceEveryTT}
//                 renderItem={({ item }) => (
//                   <EveryInvoiceTT obj={item} navigation={navigation} />
//                 )}
//                 keyExtractor={(item) => item.codeid}
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={preloader}
//                     onRefresh={() => getData()}
//                   />
//                 }
//               />
//             </View>
//           )}
//         </SafeAreaView>
//       </View>
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalState}
//         onRequestClose={closeModal}
//       >
//         <TouchableOpacity
//           style={styles.modalOuter}
//           activeOpacity={1}
//           onPress={closeModal} // Закрыть модальное окно
//         >
//           <View style={styles.modalInner} onPress={() => setModalState(true)}>
//             <TextInput
//               style={styles.inputComm}
//               value={createEveryInvoiceTA.comment}
//               onChangeText={changeComm}
//               placeholder="Описание"
//               multiline={true} // Многострочное поле для комментариев
//               numberOfLines={4} // Опционально: количество отображаемых строк
//             />
//             <ViewButton
//               styles={{ ...styles.sendBtn, ...styles.actionSendBtn }}
//               onclick={createAppInvoiceTA}
//             >
//               Открыть
//             </ViewButton>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   parentBlock: {
//     flex: 1,
//     backgroundColor: "#ebeef2",
//   },

//   modalOuter: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },

//   noneData: {
//     flex: 1,
//     height: 500,
//     paddingTop: 250,
//     textAlign: "center",
//     fontSize: 20,
//   },

//   modalInner: {
//     backgroundColor: "#ebeef2",
//     padding: 15,
//     borderRadius: 10,
//     width: "90%",
//   },

//   titleSelect: {
//     fontSize: 20,
//     fontWeight: "500",
//     marginBottom: 10,
//   },

//   sendBtn: {
//     backgroundColor: "#fff",
//     color: "rgba(97 ,100, 239,0.7)",
//     minWidth: "100%",
//     paddingTop: 10,
//     borderRadius: 10,
//     fontWeight: 600,
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     marginTop: 10,
//   },
//   sendBtnMore: {
//     marginBottom: 10,
//   },
//   actionSendBtn: {
//     paddingTop: 12,
//     fontSize: 18,
//     // backgroundColor: "rgba(95, 230, 165, 0.99)",
//     backgroundColor: "rgba(97 ,100, 239,0.7)",
//     color: "#fff",
//   },
//   imgIcon: {
//     width: 35,
//     height: 35,
//   },
//   selectBlock: {
//     marginTop: 15,
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     borderRadius: 5,
//     backgroundColor: "#f0f0f0",
//     minHeight: 70,
//     maxHeight: 250,
//   },

//   selectBlockInner: {
//     minWidth: "100%",
//     // backgroundColor: "red",
//     // paddingTop: 10,
//     // paddingBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     backgroundColor: "#fff",
//     borderRadius: 3,
//   },

//   activeSelect: {
//     backgroundColor: "rgba(47, 71, 190, 0.672)",
//   },

//   selectText: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "rgba(47, 71, 190, 0.672)",
//   },

//   activeSelectText: {
//     color: "#fff",
//   },

//   inputComm: {
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     borderRadius: 8,
//     padding: 10,
//     paddingLeft: 15,
//     marginTop: 10,
//     height: 100,
//     fontSize: 16,
//     textAlignVertical: "top",
//     backgroundColor: "#fff",
//   },
// });
