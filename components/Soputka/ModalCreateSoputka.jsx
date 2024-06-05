////hooks
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////tags
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";

////fns
import { createInvoiceCheck } from "../../store/reducers/requestSlice";
import { getWorkShopsForRevision } from "../../store/reducers/requestSlice";

/////
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

export const ModalCreateSoputka = (props) => {
  //// модалка для выбора контрагентов и агентов в сопутке

  const { navigation, refAccord } = props;

  const dispatch = useDispatch();

  const refAgentContr = useRef(null);

  const { listSellersPoints, listContrAgents } = useSelector(
    (state) => state.requestSlice
  );

  const { data } = useSelector((state) => state.saveDataSlice);

  const [obj, setObj] = useState({ guid: "", guidWorkShop: "" });
  ///// guid - guid продавца  //// guidWorkShop - guid цеха

  const snapPointsWorks = useMemo(() => ["70%"], []);

  ////////////////// выбор контрагента

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
  const closeContrAgents = () => refAgentContr.current?.close();

  const selectAgents = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => choiceAgent(item?.guid)}
      >
        <Text style={styles.selectText}>{item?.fio}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    [obj]
  );

  const choiceAgent = (guid) => {
    setObj({ ...obj, guid });
    ////// get список актуальных цех0в продавца
    dispatch(getWorkShopsForRevision(guid));
    closeSeller();
    contrAgentOpen(0);
  };

  ////////////////// выбор агента

  const contrAgentOpen = useCallback((index) => {
    refAgentContr.current?.snapToIndex(index);
  }, []);

  const selectContrAgents = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => createInvoiceSoputka(item?.workshop_guid)}
        /////
      >
        <Text style={styles.selectText}>{item?.workshop}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    [obj]
  );

  const createInvoiceSoputka = (guidWorkShop) => {
    const dataSend = { seller_guid_to: obj?.guid, guidWorkShop, navigation };

    dispatch(
      createInvoiceCheck({ ...dataSend, seller_guid_from: data?.seller_guid })
    );

    setObj({ ...obj, guidWorkShop });

    //// закрываю аккардион
    closeContrAgents();
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
          <Text style={styles.titleSelect}>Выберите контрагент</Text>
          <BottomSheetFlatList
            data={listSellersPoints}
            keyExtractor={(item, index) => `${item?.guid}${index}`}
            renderItem={selectAgents}
            contentContainerStyle={styles.selectBlock}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        ref={refAgentContr}
        index={-1}
        snapPoints={snapPointsWorks}
        enablePanDownToClose={true}
        backdropComponent={shadowBlock}
        onClose={closeContrAgents}
      >
        <View style={styles.parent}>
          {listContrAgents?.length === 0 ? (
            <Text style={styles.noneData}>Список пустой</Text>
          ) : (
            <>
              <Text style={styles.titleSelect}>Выберите агента</Text>
              <BottomSheetFlatList
                data={listContrAgents}
                keyExtractor={(item, index) => `${item.guid}${index}`}
                renderItem={selectContrAgents}
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
    borderRadius: 3,
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
    borderColor: "rgba(47, 71, 190, 0.482)",
    height: 13,
    width: 13,
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

// import { useState } from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { Modal, Alert } from "react-native";
// import { TouchableOpacity, TextInput } from "react-native";
// import { ViewButton } from "../../customsTags/ViewButton";
// import { createInvoiceSoputkaTT } from "../../store/reducers/requestSlice";
// import { ChoiceAgents } from "../ChoiceAgents";

// export const ModalCreateSoputka = (props) => {
//   //// модалка для созданя с0путки

//   const { modalState, setModalState, navigation } = props;

//   const dispatch = useDispatch();

//   const [obj, setObj] = useState({ comment: "", agent_guid: "" });

//   const closeModal = () => {
//     setModalState(false);
//     setObj({ comment: "", agent_guid: "" });
//   };

//   const { data } = useSelector((state) => state.saveDataSlice);

//   const { listAgents } = useSelector((state) => state.requestSlice);

//   const create = () => {
//     if (obj?.agent_guid === "") {
//       Alert.alert("Выберите агента");
//     } else {
//       const dataObj = { ...obj, seller_guid: data?.seller_guid };
//       dispatch(createInvoiceSoputkaTT({ navigation, dataObj }));
//       closeModal();
//     }
//   };

//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={modalState}
//       onRequestClose={closeModal}
//     >
//       <TouchableOpacity
//         style={styles.modalOuter}
//         activeOpacity={1}
//         onPress={closeModal} // Закрыть модальное окно
//       >
//         <View style={styles.modalInner} onPress={() => setModalState(true)}>
//           <Text style={styles.titleSelect}>Выберите агента</Text>
//           <View style={styles.selectBlock}>
//             <FlatList
//               data={listAgents}
//               renderItem={({ item }) => (
//                 <ChoiceAgents
//                   item={item}
//                   setState={setObj}
//                   prev={obj}
//                   keyGuid={"agent_guid"}
//                   keyText={"agent"}
//                 />
//               )}
//               keyExtractor={(item, index) => `${item.guid}${index}`}
//             />
//           </View>

//           <TextInput
//             style={styles.inputComm}
//             value={obj?.comment?.toString()}
//             onChangeText={(text) => setObj({ ...obj, comment: text })}
//             placeholder="Ваш комментарий"
//             multiline={true}
//             numberOfLines={4}
//           />
//           <ViewButton styles={styles.sendBtn} onclick={create}>
//             + Создать
//           </ViewButton>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOuter: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },

//   modalInner: {
//     backgroundColor: "#ebeef2",
//     padding: 15,
//     borderRadius: 10,
//     width: "95%",
//   },

//   titleSelect: {
//     fontSize: 17,
//     fontWeight: "500",
//   },

//   inputComm: {
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     height: 60,
//     borderRadius: 8,
//     padding: 10,
//     paddingLeft: 15,
//     marginTop: 10,
//     height: 120,
//     fontSize: 16,
//     textAlignVertical: "top",
//     backgroundColor: "#fff",
//   },

//   sendBtn: {
//     backgroundColor: "#fff",
//     color: "#fff",
//     minWidth: "100%",
//     paddingTop: 10,
//     borderRadius: 10,
//     fontWeight: 600,
//     backgroundColor: "rgba(12, 169, 70, 0.9)",
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     marginTop: 20,
//   },

//   selectBlock: {
//     marginTop: 5,
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "rgb(217 223 232)",
//     borderRadius: 5,
//     backgroundColor: "#f0f0f0",
//     minHeight: 40,
//     maxHeight: 180,
//   },
// });
