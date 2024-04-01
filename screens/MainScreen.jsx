import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
} from "react-native";
import { ViewContainer } from "../customsTags/ViewContainer";
import { dataCategory } from "../helpers/Data";
import { EveryCategory } from "../components/EveryCategory";
import { useDispatch, useSelector } from "react-redux";
import { changePreloader } from "../store/reducers/requestSlice";

export const MainScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.saveDataSlice);
  const { preloader } = useSelector((state) => state.requestSlice);
  const dispatch = useDispatch();

  const chnagePreloader = () => {
    dispatch(changePreloader(true));
    setTimeout(() => {
      dispatch(changePreloader(false));
    }, 1000);
  };

  // console.log(token, "tokenm");

  return (
    <View style={{ paddingTop: 20, backgroundColor: "#ebeef2" }}>
      <ViewContainer>
        <SafeAreaView>
          <View style={styles.parentBlock}>
            <FlatList
              contentContainerStyle={{
                minWidth: "100%",
                alignItems: "center",
                gap: 20,
                paddingBottom: 10,
              }}
              data={dataCategory}
              renderItem={({ item }) => (
                <EveryCategory obj={item} navigation={navigation} />
              )}
              // keyExtractor={(item) => item.codeid}
              numColumns={2}
              refreshControl={
                <RefreshControl
                  refreshing={preloader}
                  onRefresh={() => chnagePreloader()}
                />
              }
            />
          </View>
        </SafeAreaView>
      </ViewContainer>
    </View>
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
});
