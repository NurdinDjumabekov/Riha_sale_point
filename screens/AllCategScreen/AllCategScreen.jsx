///// tags
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";
import { ViewContainer } from "../../customsTags/ViewContainer";

///// hooks
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

/////  components
import { EveryCategory } from "../../components/AllCategory/EveryCategory";

////// helpers
import { dataCategory } from "../../helpers/Data";
import { getLocalDataUser } from "../../helpers/returnDataUser";

///// fns
import { getBalance } from "../../store/reducers/requestSlice";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

////style
import styles from "./style";

export const AllCategScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);
  const { preloader, balance } = useSelector((state) => state.requestSlice);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getBalance(data?.seller_guid));
  };

  const goPage = () => navigation.navigate("HistoryBalance");

  return (
    <ViewContainer>
      <SafeAreaView>
        <View style={styles.parentBlock}>
          <TouchableOpacity style={styles.balance} onPress={goPage}>
            <View>
              <View style={styles.balanceInner}>
                <Text style={styles.balanceText}>Баланс</Text>
                <View style={styles.arrow}></View>
              </View>
              <Text style={styles.balanceNum}>{balance || 0} сом</Text>
            </View>
            <Text style={styles.balanceHistory}>История</Text>
          </TouchableOpacity>
          <FlatList
            contentContainerStyle={styles.flatList}
            data={dataCategory}
            renderItem={({ item }) => (
              <EveryCategory obj={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </SafeAreaView>
    </ViewContainer>
  );
};
