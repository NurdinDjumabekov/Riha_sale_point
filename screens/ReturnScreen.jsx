import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHistoryReturn,
  getListAgents,
} from '../store/reducers/requestSlice';
import { ViewButton } from '../customsTags/ViewButton';
import { FlatList } from 'react-native';
import { ModalChoiceReturn } from '../components/ReturnProducts/ModalChoiceReturn';
import { EveryInvoiceReturn } from '../components/ReturnProducts/EveryInvoiceReturn';
import { Text } from 'react-native';
import { changeLocalData } from '../store/reducers/saveDataSlice';
import { getLocalDataUser } from '../helpers/returnDataUser';

export const ReturnScreen = ({ navigation }) => {
  //// возрат товара
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);
  const { preloader, listHistoryReturn } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getHistoryReturn(data?.seller_guid));
    await dispatch(getListAgents(data?.seller_guid));
  };

  const empty = listHistoryReturn?.length !== 0;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.returnBlock}>
          <ViewButton
            styles={styles.return}
            onclick={() => setModalState(true)}
          >
            + Создать накладную для возврата товара
          </ViewButton>
        </View>
        {empty && <Text style={styles.title}>История возврата товара </Text>}
        <View style={styles.blockList}>
          <FlatList
            contentContainerStyle={styles.flatListStyle}
            data={listHistoryReturn}
            renderItem={({ item }) => (
              <EveryInvoiceReturn obj={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.codeid}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </View>
      <ModalChoiceReturn
        modalState={modalState}
        setModalState={setModalState}
        navigation={navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatListStyle: {
    minWidth: '100%',
    width: '100%',
    paddingBottom: 20,
    // borderTopWidth: 1,
    // borderColor: "rgba(47, 71, 190, 0.587)",
  },

  returnBlock: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: '100%',
  },

  return: {
    fontSize: 16,
    color: '#fff',
    minWidth: '95%',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: 'rgba(97 ,100, 239,0.7)',
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 3,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
  },

  blockList: {
    flex: 1,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
});
