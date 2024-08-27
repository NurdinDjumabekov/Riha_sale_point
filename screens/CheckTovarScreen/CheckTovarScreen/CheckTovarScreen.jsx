////// hooks
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

///// tags
import { RefreshControl, View } from "react-native";
import { FlatList, Text } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";

///// requestSlice
import { clearListSellersPoints } from "../../../store/reducers/requestSlice";
import { getHistoryRevision } from "../../../store/reducers/requestSlice";
import { getSellersEveryPoint } from "../../../store/reducers/requestSlice";
import { changeLocalData } from "../../../store/reducers/saveDataSlice";

///// components
import { ModalWorkShop } from "../../../components/CheckProd/ModalWorkShop/ModalWorkShop";

///helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";
import { ListProdsRevision } from "../../../components/CheckProd/ListProdsRevision/ListProdsRevision";

////style
import styles from "./style";

export const CheckTovarScreen = ({ navigation }) => {
  //// ревизия (отображение списка ист0рий ревизии.
  //// btns для создания ревии и просмотра запросов других продавцов)

  const dispatch = useDispatch();

  const refAccord = useRef(null);

  const { data } = useSelector((state) => state.saveDataSlice);
  const { preloader, listHistoryRevision } = useSelector(
    (state) => state.requestSlice
  );

  const getData = async () => {
    dispatch(clearListSellersPoints());
    ///// очищаю список продавцов каждой точки

    const { seller_guid } = data;
    await getLocalDataUser({ changeLocalData, dispatch });

    ////// get список продавцов определенной точки
    await dispatch(getSellersEveryPoint(seller_guid));

    ////// get историю ревизии
    await dispatch(getHistoryRevision(seller_guid));
  };

  useEffect(() => {
    getData();
  }, []);

  const navLick = () => navigation.navigate("RevisionRequestScreen");

  const empty = listHistoryRevision?.length === 0;

  const createZakaz = useCallback((index) => {
    refAccord.current?.snapToIndex(index);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionBlock}>
          <ViewButton styles={styles.btn} onclick={() => createZakaz(0)}>
            Выбрать продавца для ревизии
          </ViewButton>
          <ViewButton styles={styles.btn} onclick={navLick}>
            Запросы других продавцов
          </ViewButton>
        </View>
        <Text style={styles.title}>История вашей ревизии</Text>
        {empty && <Text style={styles.noneData}>Список пустой</Text>}
        <View style={styles.blockList}>
          <FlatList
            contentContainerStyle={styles.flatListStyle}
            data={listHistoryRevision}
            renderItem={({ item }) => (
              <ListProdsRevision
                item={item}
                navigation={navigation}
                disable={true}
              />
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </View>
      <ModalWorkShop navigation={navigation} refAccord={refAccord} />
      {/* /////для выбора цехов*/}
    </>
  );
};
