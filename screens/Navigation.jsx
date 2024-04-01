import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "./LoginScreen";
import { MainScreen } from "./MainScreen";
import { Provider } from "react-redux";
import { store } from "../store/index";
import { StatusBar } from "expo-status-bar";
import { Preloader } from "../components/Preloader";
import { MyApplicationScreen } from "./MyApplicationScreen";
import { MyShipmentScreen } from "./MyShipmentScreen";
import { LogOut } from "../components/LogOut";
import { LeftoversScreen } from "./LeftoversScreen";
import { DetailedInvoice } from "./DetailedInvoice";
import { EveryInvoice } from "./EveryInvoice";
import { EveryInvoiceHistoryScreen } from "./EveryInvoiceHistoryScreen";
import { StyleSheet, Text } from "react-native";
import UserInfo from "../components/UserInfo";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Preloader />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#fff", /// f2f2f2
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            // options={{ title: "Вход" }}
            options={{ headerShown: false }}
          />
          <>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={({ navigation }) => ({
                title: "",
                headerLeft: () => <UserInfo />,
                headerRight: () => <LogOut navigation={navigation} />,
              })}
            />
            {/* /////////////////////// Main ///////////////////////*/}
            <Stack.Screen
              name="Application"
              component={MyApplicationScreen}
              options={{ title: "Список накладных" }}
            />
            <Stack.Screen name="detailedInvoice" component={DetailedInvoice} />
            {/* /////////////////////// Остатки ///////////////////////*/}
            <Stack.Screen
              name="Leftovers"
              component={LeftoversScreen}
              options={{ title: "Остатки" }}
            />
            {/* /////////////////////// Отгрузки ///////////////////////*/}
            <Stack.Screen
              name="Shipment"
              component={MyShipmentScreen}
              options={{ title: "Отгрузки" }}
            />
            <Stack.Screen
              name="everyInvoiceHistoryScreen"
              component={EveryInvoiceHistoryScreen}
            />
            <Stack.Screen
              name="everyInvoice"
              component={EveryInvoice}
              options={({ route }) => ({
                headerRight: () => (
                  <Text style={styles.date}>{route.params?.invoiceDate}</Text>
                ),
              })}
            />
            {/* /////////////////////// Отгрузки /////////////////////// */}
          </>
        </Stack.Navigator>
        <StatusBar theme="auto" />
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.591)",
  },
});
