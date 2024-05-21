////// hooks
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

///// tags
import { RefreshControl, StyleSheet, View } from "react-native";
import { FlatList, Text } from "react-native";
import { ViewButton } from "../../customsTags/ViewButton";

///// requestSlice
import { clearListSellersPoints } from "../../store/reducers/requestSlice";
import { getHistoryRevision } from "../../store/reducers/requestSlice";
import { getSellersEveryPoint } from "../../store/reducers/requestSlice";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

///// components
import { ModalWorkShop } from "../../components/CheckProd/ModalWorkShop";

///helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { ListProdsRevision } from "./ListProdsRevision";

export const CheckTovarScreen = ({ navigation }) => {
  //// ревизия (отображение списка ист0рий ревизии.
  //// btns для создания ревии и просмотра запросов других продавцов)

  const dispatch = useDispatch();

  const refAccord = useRef(null);

  const [workShop, setWorkShop] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);
  const { preloader, listHistoryRevision } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
  }, []);

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

  const navLick = () => navigation.navigate("RevisionRequest");

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
      <ModalWorkShop
        modalState={workShop}
        setModalState={setWorkShop}
        navigation={navigation}
        refAccord={refAccord}
      />
      {/* /////для выбора цехов*/}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatListStyle: {
    minWidth: "100%",
    width: "100%",
    paddingBottom: 20,
  },

  actionBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "100%",
    gap: 20,
  },

  btn: {
    fontSize: 14,
    color: "#fff",
    width: "43%",
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 8,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 15,
    marginBottom: 15,
  },

  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 3,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  blockList: {
    flex: 1,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
