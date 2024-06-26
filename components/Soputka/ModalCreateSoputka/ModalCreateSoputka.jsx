////hooks
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////tags
import { TouchableOpacity, View, Text } from "react-native";

////fns
import {
  createInvoiceSoputkaTT,
  getListAgentsSorting,
} from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

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

  const { listContrAgents } = useSelector((state) => state.requestSlice);

  const { listAgents } = useSelector((state) => state.requestSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const [obj, setObj] = useState({ contragent_guid: "", agent_guid: "" });
  ///// contragent_guid - guid контрагента  //// agent_guid - guid агента

  const snapPointsWorks = useMemo(() => ["70%"], []);

  ////////////////// выбор контрагента

  const closeAgents = () => refAccord.current?.close();
  const closeContrAgents = () => refAgentContr.current?.close();

  const selectContrAgents = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => choiceAgent(item?.guid)}
      >
        <Text style={styles.selectText}>{item?.name}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    []
  );

  const choiceAgent = (guid) => {
    setObj({ ...obj, contragent_guid: guid });
    ////// get список актуальных агентов для торговой точки
    dispatch(getListAgentsSorting(guid));
    closeAgents();
    contrAgentOpen(0);
  };

  const contrAgentOpen = useCallback((index) => {
    refAgentContr.current?.snapToIndex(index);
  }, []);

  ////////////////// выбор агента

  const selectAgents = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.selectBlockInner}
        onPress={() => createInvoiceSoputka(item?.guid)}
      >
        <Text style={styles.selectText}>{item?.fio}</Text>
        <View style={styles.arrow} />
      </TouchableOpacity>
    ),
    [obj]
  );

  const createInvoiceSoputka = (agent_guid) => {
    const { seller_guid } = data;
    const dataObj = { comment: "", seller_guid, agent_guid };
    dispatch(createInvoiceSoputkaTT({ navigation, dataObj }));

    setObj({ ...obj, agent_guid });

    //// закрываю аккардион
    closeContrAgents();
    closeAgents();
  };

  /////// тень для модалки
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

  return (
    <>
      <BottomSheet
        ref={refAccord}
        index={-1}
        snapPoints={snapPointsWorks}
        enablePanDownToClose={true}
        backdropComponent={shadowBlock}
        onClose={closeAgents}
      >
        <View style={styles.parent}>
          <Text style={styles.titleSelect}>Выберите контрагент</Text>
          <BottomSheetFlatList
            data={listContrAgents}
            keyExtractor={(item, index) => `${item?.guid}${index}`}
            renderItem={selectContrAgents}
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
          {listAgents?.length === 0 ? (
            <Text style={styles.noneData}>Список пустой</Text>
          ) : (
            <>
              <Text style={styles.titleSelect}>Выберите агента</Text>
              <BottomSheetFlatList
                data={listAgents}
                keyExtractor={(item, index) => `${item.guid}${index}`}
                renderItem={selectAgents}
                contentContainerStyle={styles.selectBlock}
              />
            </>
          )}
        </View>
      </BottomSheet>
    </>
  );
};
