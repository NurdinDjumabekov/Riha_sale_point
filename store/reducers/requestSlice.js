import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../env";
import {
  changeAcceptInvoiceTT,
  changeStateForCategory,
  changeTemporaryData,
  clearDataInputsInv,
  clearExpense,
  clearLogin,
} from "./stateSlice";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLocalData } from "./saveDataSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";

/// logInAccount
export const logInAccount = createAsyncThunk(
  "logInAccount",
  async function (props, { dispatch, rejectWithValue }) {
    const { dataLogin, navigation, data } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/login`,
        data: dataLogin,
      });
      if (response.status >= 200 && response.status < 300) {
        const { result, seller_guid, seller_fio, point_name, agent_guid } =
          response?.data;
        if (+result === 1) {
          // Сохраняю seller_guid в AsyncStorage
          await AsyncStorage.setItem("seller_guid", seller_guid);
          await AsyncStorage.setItem("seller_fio", seller_fio);
          await AsyncStorage.setItem("point_name", point_name);
          // await AsyncStorage.setItem("agent_guid", agent_guid); checkcheck
          await dispatch(getBalance(seller_guid));
          await getLocalDataUser({ changeLocalData, dispatch });
          // console.log(data, "logInAccount");
          if (data?.seller_guid) {
            await navigation.navigate("Main");
            dispatch(clearLogin());
          }
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getBalance
/// для получения баланса
export const getBalance = createAsyncThunk(
  "getBalance",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_debt?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data?.debt;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getHistoryBalance
/// для получения баланса
export const getHistoryBalance = createAsyncThunk(
  "getHistoryBalance",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_transactions?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyInvoice
export const getMyInvoice = createAsyncThunk(
  "getMyInvoice",
  /// для получения всех накладных
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoices?seller_guid=${seller_guid}&invoice_status=1`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getAcceptInvoice
////// принятые ТА накладные (для истории)
export const getAcceptInvoice = createAsyncThunk(
  "getAcceptInvoice",
  /// для получения всех накладных, которые одобрил админ (invoice_status=2)
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoices?seller_guid=${seller_guid}&invoice_status=2`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getAcceptProdInvoice
////// принятые ТT список товаров (история)
export const getAcceptProdInvoice = createAsyncThunk(
  "getAcceptProdInvoice",
  /// для получения всех накладных, которые одобрил админ (invoice_status=2)
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice?invoice_guid=${guidInvoice}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyEveryInvoice
export const getMyEveryInvoice = createAsyncThunk(
  "getMyEveryInvoice",
  /// для получения каждой накладной
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice?invoice_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        const data = response?.data?.[0];
        dispatch(
          changeAcceptInvoiceTT({
            invoice_guid: data?.guid,
            products: data?.list?.map((i) => {
              return {
                guid: i?.guid,
                is_checked: false,
                change: i?.count,
              };
            }),
          })
        );
        return data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// acceptInvoiceTT
export const acceptInvoiceTT = createAsyncThunk(
  "acceptInvoiceTT",
  /// для принятия накладной торговой точкой
  async function ({ data, navigation }, { rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/point_conf_inv`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        navigation.navigate("Main");
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getCategoryTT
export const getCategoryTT = createAsyncThunk(
  "getCategoryTT",
  /// для получения катеогрий товаров ТТ
  async function (props, { dispatch, rejectWithValue }) {
    const { checkComponent, seller_guid, type } = props;
    const urlLink = !checkComponent
      ? `${API}/tt/get_category_all` //// для сопутки
      : `${API}/tt/get_category?seller_guid=${seller_guid}`; //// для пр0дажи

    try {
      const response = await axios(urlLink);
      if (response.status >= 200 && response.status < 300) {
        if (type === "leftovers") {
          const initilalCateg = response?.data?.[0]?.category_guid;
          dispatch(getMyLeftovers({ seller_guid, initilalCateg }));
          //// для страницы остатков вызываю первую категорию
        } else if (type === "sale&&soputka") {
          ////// для продажи и с0путки
          const category_guid = response?.data?.[0]?.category_guid;
          const sedData = { guid: category_guid, seller_guid, checkComponent };
          dispatch(getProductTT(sedData));
          dispatch(changeStateForCategory(category_guid));
          //// get список продуктов сопутки по категориям
          //// сразу подставляю первую категорию
        }
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getProductTT
export const getProductTT = createAsyncThunk(
  "getProductTT",
  /// для получения продуктов
  async function (props, { dispatch, rejectWithValue }) {
    const { guid, seller_guid, checkComponent } = props;
    const urlLink = !checkComponent
      ? `${API}/tt/get_product_all?categ_guid=${guid}` //// для сопутки
      : `${API}/tt/get_product?categ_guid=${guid}&seller_guid=${seller_guid}`; //// для пр0дажи
    try {
      const response = await axios(urlLink);
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyLeftovers
export const getMyLeftovers = createAsyncThunk(
  "getMyLeftovers",
  async function (props, { dispatch, rejectWithValue }) {
    const { seller_guid, initilalCateg } = props;
    // console.log(props, "getMyLeftovers");
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_report_leftovers?seller_guid=${seller_guid}&categ_guid=${initilalCateg}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// createInvoiceTT
export const createInvoiceTT = createAsyncThunk(
  "createInvoiceTT",
  /// создание накладной торговый точкой (открытие кассы)
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice`,
        data: { seller_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data);
        return { codeid: response?.data?.codeid, guid: response?.data?.guid };
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// addProductInvoiceTT
export const addProductInvoiceTT = createAsyncThunk(
  /// добавление продукта(по одному) в накладную торговой точки
  "addProductInvoiceTT",
  async function (props, { dispatch, rejectWithValue }) {
    const { data, getData } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_product`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(clearDataInputsInv()); // очищаю { price: "", ves: ""}
        dispatch(changeTemporaryData({})); // очищаю активный продукт
        dispatch(changeStateForCategory({})); // очищаю активную категорию
        if (+response?.data?.result === 1) {
          setTimeout(() => {
            getData();
          }, 500);
        }
        return response?.data?.result;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// getListSoldProd
export const getListSoldProd = createAsyncThunk(
  /// список проданных товаров
  "getListSoldProd",
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_invoice_product?invoice_guid=${guidInvoice}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data?.[0]?.list, "response");
        return response?.data?.[0]?.list;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// deleteSoldProd
export const deleteSoldProd = createAsyncThunk(
  /// удаление данных из списока проданных товаров
  "deleteSoldProd",
  async function (props, { dispatch, rejectWithValue }) {
    const { product_guid, getData } = props;

    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/del_product`,
        data: { product_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => {
          getData();
        }, 200);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getProductEveryInvoice
/// список товаров каждой накладной ТT(типо истории)
export const getProductEveryInvoice = createAsyncThunk(
  "getProductEveryInvoice",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_invoice_product?invoice_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data?.[0];
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// checkStatusKassa /// delete
/// список накладных каждой ТT(типо истории, список касса ждя проверки)
export const checkStatusKassa = createAsyncThunk(
  "checkStatusKassa",
  async function ({ seller_guid, date }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_invoice?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        const containsDate = response?.data?.some(
          (item) => item.date_system === date
        );
        const obj = response?.data?.filter((item) => item.date_system === date);
        return {
          result: !containsDate,
          obj,
        }; /// true - касса открыта, false она закрыта
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// closeKassa ///delete
/// список товаров каждой накладной ТT(типо истории)
/// checkcheck
export const closeKassa = createAsyncThunk(
  "closeKassa",
  async function ({ guid, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/shift_end_invoice`,
        data: { invoice_guid: guid },
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "response?.data");
        setTimeout(() => {
          navigation.navigate("Main");
        }, 500);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/////////////////////////////// для страницы расходов ТТ ///////////////////////////////

/// getSelectExpense
/// список селектов расходов ТТ(их траты)
export const getSelectExpense = createAsyncThunk(
  "getSelectExpense",
  async function (info, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_expense_type`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "response?.data");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// addExpenseTT
export const addExpenseTT = createAsyncThunk(
  /// добавление продукта(по одному) в накладную торговой точки
  "addExpenseTT",
  async function ({ dataSend, getData }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/add_expense`,
        data: dataSend,
      });
      if (response.status >= 200 && response.status < 300) {
        getData();
        dispatch(clearExpense());
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getExpense
/// список расходов ТТ(их траты)
export const getExpense = createAsyncThunk(
  "getExpense",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_expenses?seller_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "response?.data");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/////////////////////////////// pay
///////////////////////////////////////////////////////

/// acceptMoney
export const acceptMoney = createAsyncThunk(
  /// Отплата ТТ
  "acceptMoney",
  async function (props, { dispatch, rejectWithValue }) {
    const { dataObj, closeModal, navigation } = props;
    console.log(props, "props");
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/point_oplata`,
        data: dataObj,
      });
      if (response.status >= 200 && response.status < 300) {
        closeModal();
        navigation?.navigate("Main");
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/////////////////////////////// return
///////////////////////////////////////////////////////

/// returnInvoice
export const returnInvoice = createAsyncThunk(
  /// возврат накладной ТТ
  "returnInvoice",
  async function ({ dataSend, getData }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/add_expense`,
        data: dataSend,
      });
      if (response.status >= 200 && response.status < 300) {
        getData();
        dispatch(clearExpense());
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getHistoryReturn
/// просмотр возврата товара у ТT
export const getHistoryReturn = createAsyncThunk(
  "getHistoryReturn",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_return?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// createInvoiceReturnTT
/// Создания накладной для возврата товара
export const createInvoiceReturnTT = createAsyncThunk(
  "createInvoiceReturnTT",
  async function (props, { dispatch, rejectWithValue }) {
    const { data, navigation, closeModal } = props;
    console.log(props, "createInvoiceReturnTT");
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_return`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "createInvoiceReturnTT");
        const { invoice_guid } = response?.data;
        closeModal();
        navigation?.navigate("ReturnProd", {
          invoice_guid,
        });
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// returnListProduct
/// список для возврата товара
export const returnListProduct = createAsyncThunk(
  "returnListProduct",
  async function ({ data, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_return_products`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        navigation.navigate("Main");
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getReturnHistory
/// история списка возврата товароов
export const getReturnHistory = createAsyncThunk(
  "getReturnHistory",
  async function (invoice_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_return_product?invoice_guid=${invoice_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/////////////////////////////// soputka ////////////////

/// getListAgents
/// Создания накладной для сопутки товара
export const getListAgents = createAsyncThunk(
  /// список товаров сопутки
  "getListAgents",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_agents?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInvoiceSoputkaTT = createAsyncThunk(
  "createInvoiceSoputkaTT",
  async function (props, { dispatch, rejectWithValue }) {
    const { dataObj, navigation } = props;
    // console.log(props);
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka`,
        data: dataObj,
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response?.data, "createInvoiceSoputkaTT");
        navigation?.navigate("AddProdSoputkaSrceen", {
          forAddTovar: response?.data,
        });
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// addProductSoputkaTT
export const addProductSoputkaTT = createAsyncThunk(
  /// добавление продукта(по одному) в накладную в сопуттку накладной
  "addProductSoputkaTT",
  async function (props, { dispatch, rejectWithValue }) {
    const { obj, getData } = props;
    const { guid, count, price, invoice_guid } = obj;
    // console.log(obj, "obj");
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka_product`,
        data: { guid, count, price, invoice_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(clearDataInputsInv()); // очищаю { price: "", ves: ""}
        dispatch(changeTemporaryData({})); // очищаю активный продукт
        dispatch(changeStateForCategory({})); ///  очищаю активную категорию
        if (+response?.data?.result === 1) {
          setTimeout(() => {
            getData();
          }, 500);
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// getListSoputkaProd
export const getListSoputkaProd = createAsyncThunk(
  /// список товаров сопутки
  "getListSoputkaProd",
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_soputka_product?invoice_guid=${guidInvoice}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "getListSoputkaProd");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// deleteSoputkaProd
export const deleteSoputkaProd = createAsyncThunk(
  /// удаление данных из списока сопутки товаров
  "deleteSoputkaProd",
  async function (props, { dispatch, rejectWithValue }) {
    const { product_guid, getData } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/del_soputka`,
        data: { product_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => {
          getData()
        }, 200);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// getHistorySoputka
export const getHistorySoputka = createAsyncThunk(
  /// список историй товаров сопутки
  "getHistorySoputka",
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_soputka?seller_guid=${guidInvoice}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// confirmSoputka
export const confirmSoputka = createAsyncThunk(
  /// подверждение товаров сопутки
  "confirmSoputka",
  async function ({ invoice_guid, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/confirm_invoice_soputka`,
        data: { invoice_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data,"confirmSoputka");
        if (+response?.data?.result === 1) {
          navigation.navigate("Main");
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  preloader: false,
  chech: "",
  /////// balance
  balance: 0,
  listHistoryBalance: [], //// список историй платежей ТТ

  listMyInvoice: [],
  listAcceptInvoice: [], /// список накладных , принятых ТT (история)
  listAcceptInvoiceProd: [], /// список продуктов накладных , принятых ТT (история)
  everyInvoice: {},
  listSellersPoints: [],
  listCategory: [], //  список категорий ТА
  listProductTT: [], //  список продуктов ТА (cписок прод-тов отсортированные селектами)
  listLeftovers: [], // список остатков
  listSoldProd: [], /// список проданных товаров

  listInvoiceEveryTT: [], /// список накладных каждой ТТ(типо истории)
  listCategExpense: [],
  listExpense: [],
  infoKassa: { guid: "", codeid: "" }, /// guid каждой накладной ТТ

  /////// return
  listHistoryReturn: [], //// ист0рия возврата
  listLeftoversForReturn: [], // список остатков (переделанный мною)
  listRevizors: [], //// список ревизоров
  listProdReturn: [], //// список возвращенных от ТT

  /////// soputka
  listAgents: [],
  listProdSoputka: [],
  listHistorySoputka: [],
};

const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
  extraReducers: (builder) => {
    //// logInAccount
    builder.addCase(logInAccount.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(logInAccount.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Неверный логин или пароль");
    });
    builder.addCase(logInAccount.pending, (state, action) => {
      state.preloader = true;
    });

    ///// getBalance
    builder.addCase(getBalance.fulfilled, (state, action) => {
      // state.preloader = false;
      state.balance = action.payload;
    });
    builder.addCase(getBalance.rejected, (state, action) => {
      state.error = action.payload;
      // state.preloader = false;
    });
    builder.addCase(getBalance.pending, (state, action) => {
      // state.preloader = true;
    });

    ///// getHistoryBalance
    builder.addCase(getHistoryBalance.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistoryBalance = action.payload;
    });
    builder.addCase(getHistoryBalance.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getHistoryBalance.pending, (state, action) => {
      state.preloader = true;
    });

    //// getMyInvoice
    builder.addCase(getMyInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listMyInvoice = action.payload;
    });
    builder.addCase(getMyInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getMyInvoice.pending, (state, action) => {
      state.preloader = true;
    });

    //// getMyEveryInvoice
    builder.addCase(getMyEveryInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.everyInvoice = action.payload;
    });
    builder.addCase(getMyEveryInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getMyEveryInvoice.pending, (state, action) => {
      state.preloader = true;
    });

    ///// acceptInvoiceTT
    builder.addCase(acceptInvoiceTT.fulfilled, (state, action) => {
      state.preloader = false;
      // Alert.alert("Принято!");
    });
    builder.addCase(acceptInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так!");
      state.preloader = false;
    });
    builder.addCase(acceptInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });

    //// getAcceptInvoice
    builder.addCase(getAcceptInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listAcceptInvoice = action.payload;
    });
    builder.addCase(getAcceptInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getAcceptInvoice.pending, (state, action) => {
      state.preloader = true;
    });

    ///// getAcceptProdInvoice
    builder.addCase(getAcceptProdInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listAcceptInvoiceProd = action.payload;
    });
    builder.addCase(getAcceptProdInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getAcceptProdInvoice.pending, (state, action) => {
      state.preloader = true;
    });

    //// createInvoiceTT
    builder.addCase(createInvoiceTT.fulfilled, (state, action) => {
      const { codeid, guid } = action.payload;
      state.preloader = false;
      state.infoKassa = {
        codeid,
        guid,
      };
    });
    builder.addCase(createInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так! Не удалось создать накладную");
      state.preloader = false;
    });
    builder.addCase(createInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getCategoryTT
    builder.addCase(getCategoryTT.fulfilled, (state, action) => {
      state.preloader = false;
      state.listCategory = action?.payload?.map(
        ({ category_name, category_guid }, ind) => ({
          label: `${ind + 1}. ${category_name}`,
          value: category_guid,
        })
      );
    });
    builder.addCase(getCategoryTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getCategoryTT.pending, (state, action) => {
      state.preloader = true;
    });

    ////// getProductTT
    builder.addCase(getProductTT.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProductTT = action.payload;
    });
    builder.addCase(getProductTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getProductTT.pending, (state, action) => {
      state.preloader = true;
    });

    //////// getMyLeftovers
    builder.addCase(getMyLeftovers.fulfilled, (state, action) => {
      state.preloader = false;
      state.listLeftovers = action.payload?.map((item, ind) => [
        `${ind + 1}. ${item.product_name}`,
        `${item.start_outcome}`,
        `${item.income}`,
        `${item.outcome}`,
        `${item.end_outcome}`,
      ]);
      state.listLeftoversForReturn = action.payload?.filter(
        (item) => item?.end_outcome !== 0
      ); ////// проверяю на наличие, если end_outcome === 0 (остаток товара), то не добалять ег ов массив для в0зврата товара
    });
    builder.addCase(getMyLeftovers.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getMyLeftovers.pending, (state, action) => {
      state.preloader = true;
    });

    ////// getProductEveryInvoice
    // builder.addCase(getProductEveryInvoice.fulfilled, (state, action) => {
    //   state.preloader = false;
    //   state.historyEveryInvoice = {
    //     status: action.payload?.status,
    //     list: action.payload?.list,
    //   };
    // });
    // builder.addCase(getProductEveryInvoice.rejected, (state, action) => {
    //   state.error = action.payload;
    //   state.preloader = false;
    //   Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    // });
    // builder.addCase(getProductEveryInvoice.pending, (state, action) => {
    //   state.preloader = true;
    // });

    /////// addProductInvoiceTT
    builder.addCase(addProductInvoiceTT.fulfilled, (state, action) => {
      /// 0 - error
      /// 1 - продукт добавлен
      /// 2 - Введенное количество товара больше доступного количества.
      state.preloader = false;
      +action.payload === 1
        ? "" // Alert.alert("Товар добавлен!")
        : Alert.alert(
            "Ошибка!",
            "Введенное количество товара больше доступного количества. Пожалуйста, введите корректное количество или вес"
          );
    });
    builder.addCase(addProductInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(addProductInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getListSoldProd
    builder.addCase(getListSoldProd.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSoldProd = action.payload;
    });
    builder.addCase(getListSoldProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listSoldProd = [];
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(getListSoldProd.pending, (state, action) => {
      state.preloader = true;
    });

    /////// deleteSoldProd
    builder.addCase(deleteSoldProd.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(deleteSoldProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось удалить...");
    });
    builder.addCase(deleteSoldProd.pending, (state, action) => {
      state.preloader = true;
    });

    /////// checkStatusKassa
    builder.addCase(checkStatusKassa.fulfilled, (state, action) => {
      state.preloader = false;
      state.infoKassa = action.payload?.obj?.[0];
    });
    builder.addCase(checkStatusKassa.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(checkStatusKassa.pending, (state, action) => {
      state.preloader = true;
    });

    ////// closeKassa /// checkcheck
    builder.addCase(closeKassa.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Касса закрыта");
    });
    builder.addCase(closeKassa.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось закрыть кассу");
    });
    builder.addCase(closeKassa.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getSelectExpense
    builder.addCase(getSelectExpense.fulfilled, (state, action) => {
      state.preloader = false;
      state.listCategExpense = action?.payload?.map(({ name, guid }, ind) => ({
        label: `${ind + 1}. ${name}`,
        value: guid,
      }));
    });
    builder.addCase(getSelectExpense.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getSelectExpense.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getExpense
    builder.addCase(getExpense.fulfilled, (state, action) => {
      state.preloader = false;
      state.listExpense = action?.payload;
    });
    builder.addCase(getExpense.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getExpense.pending, (state, action) => {
      state.preloader = true;
    });

    /////// addExpenseTT
    builder.addCase(addExpenseTT.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(addExpenseTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так!");
    });
    builder.addCase(addExpenseTT.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////////////////// return /////////////////////////
    //////// getHistoryReturn
    builder.addCase(getHistoryReturn.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistoryReturn = action.payload;
    });
    builder.addCase(getHistoryReturn.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getHistoryReturn.pending, (state, action) => {
      state.preloader = true;
    });

    //////// returnListProduct
    builder.addCase(returnListProduct.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(returnListProduct.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert(
        "Упс, что-то пошло не так! Не удалось сделать возврат накладной"
      );
    });
    builder.addCase(returnListProduct.pending, (state, action) => {
      state.preloader = true;
    });

    //////// acceptMoney
    builder.addCase(acceptMoney.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(acceptMoney.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось оплатить");
    });
    builder.addCase(acceptMoney.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////////getReturnHistory
    builder.addCase(getReturnHistory.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProdReturn = action.payload;
    });
    builder.addCase(getReturnHistory.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось оплатить");
    });
    builder.addCase(getReturnHistory.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////////createInvoiceSoputkaTT
    builder.addCase(createInvoiceSoputkaTT.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(createInvoiceSoputkaTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось создать накладную");
    });
    builder.addCase(createInvoiceSoputkaTT.pending, (state, action) => {
      state.preloader = true;
    });

    /////////////////getListAgents
    builder.addCase(getListAgents.fulfilled, (state, action) => {
      state.preloader = false;
      state.listAgents = action.payload;
    });
    builder.addCase(getListAgents.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось создать накладную");
    });
    builder.addCase(getListAgents.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////////addProductSoputkaTT
    builder.addCase(addProductSoputkaTT.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(addProductSoputkaTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось добавить товар");
    });
    builder.addCase(addProductSoputkaTT.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getListSoputkaProd
    builder.addCase(getListSoputkaProd.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProdSoputka = action.payload;
    });
    builder.addCase(getListSoputkaProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listProdSoputka = [];
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(getListSoputkaProd.pending, (state, action) => {
      state.preloader = true;
    });

    /////// deleteSoputkaProd
    builder.addCase(deleteSoputkaProd.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(deleteSoputkaProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось удалить ...");
    });
    builder.addCase(deleteSoputkaProd.pending, (state, action) => {
      state.preloader = true;
    });

    ///////getHistorySoputka
    builder.addCase(getHistorySoputka.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistorySoputka = action.payload;
    });
    builder.addCase(getHistorySoputka.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listHistorySoputka = [];
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(getHistorySoputka.pending, (state, action) => {
      state.preloader = true;
    });

    ////// confirmSoputka
    builder.addCase(confirmSoputka.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(confirmSoputka.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(confirmSoputka.pending, (state, action) => {
      state.preloader = true;
    });
  },

  reducers: {
    changePreloader: (state, action) => {
      state.preloader = action.payload;
    },
    changeListInvoices: (state, action) => {
      state.listMyInvoice = action.payload;
    },
    changeLeftovers: (state, action) => {
      state.listLeftovers = action.payload;
    },
    clearListProductTT: (state, action) => {
      state.listProductTT = [];
    },
    clearListCategory: (state, action) => {
      state.listCategory = [];
    },
    changeListSellersPoints: (state, action) => {
      state.listSellersPoints = action.payload;
    },
    clearListAgents: (state, action) => {
      state.listAgents = action.payload;
    },
  },
});
export const {
  changePreloader,
  changeListInvoices,
  changeLeftovers,
  clearListProductTT,
  clearListCategory,
  changeListSellersPoints,
  clearListAgents,
} = requestSlice.actions;

export default requestSlice.reducer;
