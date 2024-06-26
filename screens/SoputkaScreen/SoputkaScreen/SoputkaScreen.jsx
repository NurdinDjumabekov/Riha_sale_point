////// hooks
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/////tags
import { Text, View, RefreshControl } from "react-native";
import { SafeAreaView, FlatList } from "react-native";

/////components
import { AllHistoryInvoice } from "../../../common/AllHistoryInvoice";
import { ModalCreateSoputka } from "../../../components/Soputka/ModalCreateSoputka";
import { ViewButton } from "../../../customsTags/ViewButton";

/////redux
import { getListContrAgents } from "../../../store/reducers/requestSlice";
import { clearListAgents } from "../../../store/reducers/requestSlice";
import { clearListCategory } from "../../../store/reducers/requestSlice";
import { clearListProductTT } from "../../../store/reducers/requestSlice";
import { getHistorySoputka } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

export const SoputkaScreen = ({ navigation }) => {
  //// Сопуткаа
  const dispatch = useDispatch();

  const refAccord = useRef(null);

  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader } = useSelector((state) => state.requestSlice);
  const { listHistorySoputka } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    getData();

    return () => {
      dispatch(clearListCategory());
      dispatch(clearListProductTT());
      dispatch(clearListAgents());
      //// очищаю список категорий,агентов и товаров
    };
  }, []);

  const getData = () => {
    dispatch(getHistorySoputka(data?.seller_guid));
    dispatch(getListContrAgents()); /// get список контрагентов
  };

  const openModal = useCallback((index) => {
    refAccord.current?.snapToIndex(index);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.soputkaBlock}>
          <ViewButton styles={styles.soputka} onclick={() => openModal(0)}>
            + Создать накладную для сопутки
          </ViewButton>
        </View>
        <View style={styles.selectBlock}>
          <Text style={styles.title}>История сопутки</Text>
          <FlatList
            data={listHistorySoputka}
            renderItem={({ item, index }) => (
              <AllHistoryInvoice
                item={item}
                index={index}
                keyLink={"SoputkaProdHistoryScreen"}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </SafeAreaView>
      <ModalCreateSoputka navigation={navigation} refAccord={refAccord} />
    </>
  );
};
