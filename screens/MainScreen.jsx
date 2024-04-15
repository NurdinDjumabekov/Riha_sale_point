import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ViewContainer } from "../customsTags/ViewContainer";
import { dataCategory } from "../helpers/Data";
import { EveryCategory } from "../components/EveryCategory";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { getBalance } from "../store/reducers/requestSlice";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";

export const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);
  const { preloader, balance } = useSelector((state) => state.requestSlice);

  // const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useFocusEffect(
    useCallback(() => {
      getData();
      // console.log("restartBalance");
    }, [])
  );

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getBalance(data?.seller_guid));
  };

  console.log(data,"data");

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
            // keyExtractor={(item) => item.codeid}
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

const styles = StyleSheet.create({
  parentBlock: {
    minWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  flatList: {
    minWidth: "100%",
    alignItems: "center",
    gap: 20,
    paddingBottom: 10,
  },
  balance: {
    width: "97%",
    alignSelf: "center",
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    paddingVertical: 10,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  balanceText: {
    lineHeight: 18,
    fontWeight: "700",
    color: "#fff",
    fontSize: 17,
  },

  balanceNum: {
    fontWeight: "500",
    color: "#fff",
    fontSize: 17,
    marginTop: 5,
  },

  balanceHistory: {
    fontWeight: "400",
    color: "#fff",
    fontSize: 18,
    lineHeight: 20,
  },

  balanceInner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
    height: 10,
    width: 10,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
  },
});
