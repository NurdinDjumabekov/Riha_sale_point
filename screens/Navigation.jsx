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
import UserInfo from "../components/UserInfo";
import { StoreSpendingScreen } from "./StoreSpendingScreen";
import { SoldProductScreen } from "./SoldProductScreen";
import { AcceptInvoiceHistory } from "../components/InvoiceTT/AcceptInvoiceHistory";
import { EveryInvoiceAcceptScreen } from "./EveryInvoiceAcceptScreen";
import { PayMoneyScreen } from "./PayMoneyScreen";
import { ReturnScreen } from "./ReturnScreen";
import { ReturnProdScreen } from "./ReturnProdScreen";
import { EveryListInvoiceReturn } from "../components/ReturnProducts/EveryListInvoiceReturn";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Preloader />
        <Stack.Navigator
          screenOptions={{ headerStyle: { backgroundColor: "#fff" } }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
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
            <Stack.Screen
              name="InvoiceHistory"
              component={AcceptInvoiceHistory}
              options={{ title: "Список принятых накладных" }}
            />
            <Stack.Screen
              name="EveryInvoiceHistory"
              component={EveryInvoiceAcceptScreen}
            />
            {/* /////////////////////// Остатки ///////////////////////*/}
            <Stack.Screen
              name="Leftovers"
              component={LeftoversScreen}
              options={{ title: "Остатки" }}
            />
            {/* /////////////////////// Продажа ///////////////////////*/}
            <Stack.Screen name="Shipment" component={MyShipmentScreen} />
            <Stack.Screen
              name="SoldProduct"
              component={SoldProductScreen} /// список проданных товаров
              options={{ title: "Список продаж" }}
            />
            {/* /////////////////////// траты /////////////////////// */}
            <Stack.Screen
              name="Spending"
              component={StoreSpendingScreen}
              options={{ title: "Расходы" }}
            />
            {/* /////////////////////// оплата ТТ /////////////////////// */}
            <Stack.Screen
              name="PayMoney"
              component={PayMoneyScreen}
              options={{ title: "Оплата" }}
            />
            {/* /////////////////////// ReturnScreen /////////////////////// */}
            <Stack.Screen
              name="ReturnInvoice"
              component={ReturnScreen}
              options={{ title: "Возврат товара" }}
            />
            <Stack.Screen name="ReturnProd" component={ReturnProdScreen} />
            <Stack.Screen
              name="listReturnProd"
              component={EveryListInvoiceReturn}
            />
          </>
        </Stack.Navigator>
        <StatusBar theme="auto" />
      </NavigationContainer>
    </Provider>
  );
};
