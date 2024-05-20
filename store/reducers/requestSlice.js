import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../env";
import {
  changeAcceptInvoiceTT,
  changeActiveSelectCategory,
  changeActiveSelectWorkShop,
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

/// getWorkShopsGorSale
/// get все цеха
export const getWorkShopsGorSale = createAsyncThunk(
  "getWorkShopsGorSale",
  async function (props, { dispatch, rejectWithValue }) {
    const { seller_guid } = props;
    try {
      const response = await axios(
        `${API}/tt/get_leftover_workshop?seller_guid=${seller_guid}`
      );
      if (response.status >= 200 && response.status < 300) {
        const { workshop_guid } = response?.data?.[0];
        await dispatch(changeActiveSelectWorkShop(workshop_guid));
        await dispatch(getCategoryTT({ ...props, workshop_guid }));
        return response.data;
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
    const { location, seller_guid, type, workshop_guid } = props;
    console.log(location, "location");

    const check = location == "Shipment" || location == "AddProdReturnSrceen"; ///// продажа и возрат

    const urlLink = check
      ? `${API}/tt/get_category?seller_guid=${seller_guid}&workshop_guid=${workshop_guid}` //// для пр0дажи и возрата
      : `${API}/tt/get_category_all`; //// для сопутки

    try {
      const response = await axios(urlLink);
      if (response.status >= 200 && response.status < 300) {
        const category_guid = response.data?.[0]?.category_guid || "";
        dispatch(changeActiveSelectCategory(category_guid)); /// исользую в продаже и в остатках

        if (type === "leftovers") {
          await dispatch(getMyLeftovers({ seller_guid, category_guid }));
          //// для страницы остатков вызываю первую категорию
        } else if (type === "sale") {
          ////// для продажи и с0путки
          const sedData = { guid: category_guid, seller_guid, location };
          await dispatch(getProductTT(sedData));
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
    const { guid, seller_guid, location } = props;

    const check = location == "Shipment" || location == "AddProdReturnSrceen"; ///// продажа и возрат

    const urlLink = check
      ? `${API}/tt/get_product?categ_guid=${guid}&seller_guid=${seller_guid}` ///// продажа и возрат
      : `${API}/tt/get_product_all?categ_guid=${guid}`; //// для сопутки
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

/// searchProdTT
export const searchProdTT = createAsyncThunk(
  "searchProdTT",
  /// для поиска товаров
  async function (props, { dispatch, rejectWithValue }) {
    const { searchProd, seller_guid, location, type } = props;
    const check = location === "Shipment" || location === "AddProdReturnSrceen";
    const urlLink = check
      ? `${API}/tt/get_product?search=${searchProd}&seller_guid=${seller_guid}&type=${type}` //// для пр0дажи и возврата
      : `${API}/tt/get_product_all?search=${searchProd}`; //// для сопутки
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
    const { seller_guid, category_guid } = props;
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_report_leftovers?seller_guid=${seller_guid}&categ_guid=${category_guid}`,
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

/// getActionsLeftovers
////// get остатки для возврата и ревизии накладной
export const getActionsLeftovers = createAsyncThunk(
  "getActionsLeftovers",
  async function (props, { dispatch, rejectWithValue }) {
    const { seller_guid, agent_guid } = props;
    // console.log(props, "props getActionsLeftovers");
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_report_leftovers?seller_guid=${seller_guid}&agent_guid=${agent_guid}`,
        // url: `${API}/tt/get_report_leftovers?seller_guid=${seller_guid}&categ_guid=0`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data);
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
///// check (только для врозврата надо сдлеать)

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
        if (+response?.data?.result === 1) {
          dispatch(clearDataInputsInv()); // очищаю { price: "", ves: ""}
          dispatch(changeTemporaryData({})); // очищаю активный продукт

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
//////checkcheck
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

/////////////////////////////// Return ///////////////////////////////
////////////////////////////////////////////////////////////////////////

/// createInvoiceReturn
export const createInvoiceReturn = createAsyncThunk(
  /// создание накладной для возврата
  "createInvoiceReturn",
  async function (props, { dispatch, rejectWithValue }) {
    const { dataObj, navigation } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka`,
        data: dataObj,
      });
      if (response.status >= 200 && response.status < 300) {
        navigation?.navigate("AddProdReturnSrceen", {
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

/// addProductReturn
export const addProductReturn = createAsyncThunk(
  /// добавление продукта(по одному) в накладную в возвврата
  "addProductReturn",
  async function (props, { dispatch, rejectWithValue }) {
    const { guid, count, price, invoice_guid } = props?.obj;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka_product`,
        data: { guid, count, price, invoice_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(changeTemporaryData({})); // очищаю активный продукт
        if (+response?.data?.result === 1) {
          dispatch(clearDataInputsInv()); // очищаю { price: "", ves: ""}
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// getListReturnProd
export const getListReturnProd = createAsyncThunk(
  /// список товаров сопутки (истр0ия сопутки)
  "getListReturnProd",
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_soputka_product?invoice_guid=${guidInvoice}`,
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

//// deleteReturnProd
export const deleteReturnProd = createAsyncThunk(
  /// удаление данных из списока возврата товаров
  "deleteReturnProd",
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

//// getHistoryReturn
export const getHistoryReturn = createAsyncThunk(
  /// список историй товаров возврата
  "getHistoryReturn",
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

//// confirmReturn
export const confirmReturn = createAsyncThunk(
  /// подверждение товаров сопутки
  "confirmReturn",
  async function ({ invoice_guid, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/confirm_invoice_soputka`,
        data: { invoice_guid },
      });
      if (response.status >= 200 && response.status < 300) {
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

/////////////////////////////// soputka ////////////////////////////////
////////////////////////////////////////////////////////////////////////

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

/// createInvoiceSoputkaTT
export const createInvoiceSoputkaTT = createAsyncThunk(
  /// создание накладной для сопутки
  "createInvoiceSoputkaTT",
  async function (props, { dispatch, rejectWithValue }) {
    const { dataObj, navigation } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka`,
        data: dataObj,
      });
      if (response.status >= 200 && response.status < 300) {
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
    const { guid, count, price, invoice_guid } = props?.obj;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_soputka_product`,
        data: { guid, count, price, invoice_guid },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(changeTemporaryData({})); // очищаю активный продукт
        if (+response?.data?.result === 1) {
          dispatch(clearDataInputsInv()); // очищаю { price: "", ves: ""}
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
  /// список товаров сопутки (истр0ия сопутки)
  "getListSoputkaProd",
  async function (guidInvoice, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_soputka_product?invoice_guid=${guidInvoice}`,
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
        getData();
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

/////////////////////// ревизия  ////////////////////////////////////

/// getSellersEveryPoint
/// список продавцов каждой точки
export const getSellersEveryPoint = createAsyncThunk(
  "getSellersEveryPoint",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_sellers?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data?.sellers;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getWorkShopsForRevision
/// get все актульные цеха для определенного продавца
export const getWorkShopsForRevision = createAsyncThunk(
  "getWorkShopsForRevision",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios(
        `${API}/tt/get_leftover_workshop?seller_guid=${seller_guid}`
      );
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data, "getWorkShopsForRevision");
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// createInvoiceCheck
/// Создания накладной для ревизии товара
export const createInvoiceCheck = createAsyncThunk(
  "createInvoiceCheck",
  async function (props, { dispatch, rejectWithValue }) {
    const { seller_guid_to, seller_guid_from } = props;
    const { navigation, guidWorkShop } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_revision_invoice`,
        data: {
          seller_guid_to,
          seller_guid_from,
          comment: "",
        },
      });
      if (response.status >= 200 && response.status < 300) {
        const { invoice_guid, result } = response?.data;
        if (+result === 1) {
          navigation?.navigate("InvoiceCheckScreen", {
            invoice_guid,
            guidWorkShop,
            seller_guid_to,
          });
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getLeftoversForCheck
/// get остатки разделенные по цехам для ревизии
export const getLeftoversForCheck = createAsyncThunk(
  "getLeftoversForCheck",
  async function (props, { dispatch, rejectWithValue }) {
    const { seller_guid, guidWorkShop } = props;

    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_report_leftovers?seller_guid=${seller_guid}&workshop_guid=${guidWorkShop}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// sendCheckListProduct
/// список для ревизии товара
export const sendCheckListProduct = createAsyncThunk(
  "sendCheckListProduct",
  async function (props, { dispatch, rejectWithValue }) {
    const { actionsProducts, navigation } = props;

    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_revision_product`,
        data: actionsProducts,
      });
      if (response.status >= 200 && response.status < 300) {
        if (+response?.data?.result === 1) {
          navigation.navigate("Main");
        } else {
          // Alert.alert("Не удалооь")
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getRevisionRequest
/// get список запрос0в других пр0давцов для подтверждения ревизии
export const getRevisionRequest = createAsyncThunk(
  "getRevisionRequest",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_revision?seller_guid=${seller_guid}&type=2`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getHistoryRevision
/// просмотр ревизии товара у ТT
export const getHistoryRevision = createAsyncThunk(
  "getHistoryRevision",
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_revision?seller_guid=${seller_guid}&type=1`,
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

/// getEveryRevisionRequest
/// get каждый запрос других пр0давцов для подтверждения ревизии
export const getEveryRevisionRequest = createAsyncThunk(
  "getEveryRevisionRequest",
  async function (invoice_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice_revision_product?invoice_guid=${invoice_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// acceptInvoiceRevision
/// подтверждение ревизии продавцов
export const acceptInvoiceRevision = createAsyncThunk(
  "acceptInvoiceRevision",
  async function (props, { dispatch, rejectWithValue }) {
    const { invoice_guid, navigation } = props;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/set_revision_invoice_status`,
        data: { invoice_guid, status: 2 },
      });
      if (response.status >= 200 && response.status < 300) {
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

  listAgents: [], //// список агентов

  listMyInvoice: [], ///// список накладных для принятия
  listAcceptInvoice: [], /// список накладных , принятых ТT (история)
  listAcceptInvoiceProd: [], /// список продуктов накладных , принятых ТT (история)
  everyInvoice: {}, //// каждая накладная
  listWorkShopSale: [], //// список цехов для продаж
  listCategory: [], //  список категорий ТА
  listProductTT: [], //  список продуктов ТА (cписок прод-тов отсортированные селектами)
  listLeftovers: [], // список остатков
  listSoldProd: [], /// список проданных товаров

  listInvoiceEveryTT: [], /// список накладных каждой ТТ(типо истории)
  listCategExpense: [],
  listExpense: [],
  infoKassa: { guid: "", codeid: "" }, /// guid каждой накладной ТТ

  listActionLeftovers: [],
  // список остатков (переделанный мною) для возврата накладной и ревизии

  /////// return ///////
  listProdReturn: [], //// список сопутки
  listHistoryReturn: [], //// список истории сопутки

  /////// soputka ///////
  listProdSoputka: [], //// список сопутки
  listHistorySoputka: [], //// список истории сопутки

  //////// ревизия //////////
  listHistoryRevision: [], //// ист0рия возврата
  listWorkShop: [], //// список цехов
  listSellersPoints: [], //// список продавцов
  listRequestRevision: [], //// список запросов  других пр0давцов для подтверждения ревизии
  everyRequestRevision: [], //// каждый запрос других пр0давцов для подтверждения ревизии
  ///// внутри есть один обьек вложенный
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
      Alert.alert("Накладная успешно принята!");
    });
    builder.addCase(acceptInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так!");
      state.preloader = false;
    });
    builder.addCase(acceptInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });

    ///// getWorkShopsGorSale
    builder.addCase(getWorkShopsGorSale.fulfilled, (state, action) => {
      state.preloader = false;
      state.listWorkShopSale = action?.payload?.map(
        ({ workshop, workshop_guid }, ind) => ({
          label: `${ind + 1}. ${workshop}`,
          value: workshop_guid,
        })
      );
    });
    builder.addCase(getWorkShopsGorSale.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так!");
      state.preloader = false;
    });
    builder.addCase(getWorkShopsGorSale.pending, (state, action) => {
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
      state.infoKassa = { codeid, guid };
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

    //////// searchProdTT
    builder.addCase(searchProdTT.fulfilled, (state, action) => {
      // state.preloader = false;
      state.listProductTT = action.payload;
      if (action.payload?.length === 0) {
        Alert.alert("По вашему запросу ничего не найдено (");
      }
    });
    builder.addCase(searchProdTT.rejected, (state, action) => {
      state.error = action.payload;
      // state.preloader = false;
    });
    builder.addCase(searchProdTT.pending, (state, action) => {
      // state.preloader = true;
    });

    //////// getMyLeftovers
    builder.addCase(getMyLeftovers.fulfilled, (state, action) => {
      state.preloader = false;
      state.listLeftovers = action?.payload?.map((item, ind) => [
        `${ind + 1}. ${item?.product_name}`,
        `${item?.start_outcome}`,
        `${item?.income}`,
        `${item?.outcome}`,
        `${item?.end_outcome}`,
      ]);
    });
    builder.addCase(getMyLeftovers.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getMyLeftovers.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getActionsLeftovers
    builder.addCase(getActionsLeftovers.fulfilled, (state, action) => {
      state.preloader = false;
      state.listActionLeftovers = action.payload?.filter(
        (item) => item?.end_outcome !== 0
      );
      ////// проверяю на наличие, если end_outcome === 0 (остаток товара),
      ////// то не добалять его в массив для в0зврата товара
    });
    builder.addCase(getActionsLeftovers.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getActionsLeftovers.pending, (state, action) => {
      state.preloader = true;
    });

    /////// addProductInvoiceTT
    builder.addCase(addProductInvoiceTT.fulfilled, (state, action) => {
      /// 0 - error
      /// 1 - продукт добавлен
      /// 2 - Введенное количество товара больше доступного количества.
      state.preloader = false;
      +action.payload === 1
        ? Alert.alert("Товар продан!")
        : Alert.alert(
            "Ошибка!",
            "Введенное количество товара больше доступного вам количества."
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

    //////////////////////////// return /////////////////////////

    ////////////////createInvoiceReturn
    builder.addCase(createInvoiceReturn.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(createInvoiceReturn.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось создать накладную");
    });
    builder.addCase(createInvoiceReturn.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////////addProductReturn
    builder.addCase(addProductReturn.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(addProductReturn.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось добавить товар");
    });
    builder.addCase(addProductReturn.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getListReturnProd
    builder.addCase(getListReturnProd.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProdReturn = action.payload;
    });
    builder.addCase(getListReturnProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listProdReturn = [];
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(getListReturnProd.pending, (state, action) => {
      state.preloader = true;
    });

    /////// deleteReturnProd
    builder.addCase(deleteReturnProd.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(deleteReturnProd.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось удалить ...");
    });
    builder.addCase(deleteReturnProd.pending, (state, action) => {
      state.preloader = true;
    });

    ///////getHistoryReturn
    builder.addCase(getHistoryReturn.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistoryReturn = action.payload;
    });
    builder.addCase(getHistoryReturn.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listHistoryReturn = [];
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(getHistoryReturn.pending, (state, action) => {
      state.preloader = true;
    });

    ////// confirmReturn
    builder.addCase(confirmReturn.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(confirmReturn.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert(
        "Упс, что-то пошло не так! Попробуйте перезайти в приложение..."
      );
    });
    builder.addCase(confirmReturn.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////////////////// pay /////////////////////////

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

    //////////////////////////// soputka /////////////////////////

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

    //////////////////////////// ревизия /////////////////////////
    //////// createInvoiceCheck
    builder.addCase(createInvoiceCheck.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(createInvoiceCheck.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось создать накладную");
    });
    builder.addCase(createInvoiceCheck.pending, (state, action) => {
      state.preloader = true;
    });

    //////// getHistoryRevision
    builder.addCase(getHistoryRevision.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistoryRevision = action.payload;
    });
    builder.addCase(getHistoryRevision.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getHistoryRevision.pending, (state, action) => {
      state.preloader = true;
    });

    ///////// getWorkShopsForRevision
    builder.addCase(getWorkShopsForRevision.fulfilled, (state, action) => {
      state.preloader = false;
      state.listWorkShop = action?.payload?.map((item) => ({
        ...item,
        guidWorkShop: item?.guid,
      }));
    });
    builder.addCase(getWorkShopsForRevision.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getWorkShopsForRevision.pending, (state, action) => {
      state.preloader = true;
    });

    ///////// getSellersEveryPoint
    builder.addCase(getSellersEveryPoint.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSellersPoints = action.payload;
    });
    builder.addCase(getSellersEveryPoint.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getSellersEveryPoint.pending, (state, action) => {
      state.preloader = true;
    });

    /////// getLeftoversForCheck
    builder.addCase(getLeftoversForCheck.fulfilled, (state, action) => {
      state.preloader = false;
      state.listActionLeftovers = action.payload?.filter(
        (item) => item?.end_outcome !== 0
      );
      ////// проверяю на наличие, если end_outcome === 0 (остаток товара),
      ////// то не добалять его в массив для в0зврата товара
    });
    builder.addCase(getLeftoversForCheck.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getLeftoversForCheck.pending, (state, action) => {
      state.preloader = true;
    });

    //////// sendCheckListProduct
    builder.addCase(sendCheckListProduct.fulfilled, (state, action) => {
      state.preloader = false;
      // Alert.alert("Товары были успешно отправлены");
    });
    builder.addCase(sendCheckListProduct.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(sendCheckListProduct.pending, (state, action) => {
      state.preloader = true;
    });

    //////// getRevisionRequest
    builder.addCase(getRevisionRequest.fulfilled, (state, action) => {
      state.preloader = false;
      state.listRequestRevision = action.payload;
    });
    builder.addCase(getRevisionRequest.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getRevisionRequest.pending, (state, action) => {
      state.preloader = true;
    });

    ////////// getEveryRevisionRequest
    builder.addCase(getEveryRevisionRequest.fulfilled, (state, action) => {
      state.preloader = false;
      state.everyRequestRevision = action?.payload?.[0];
    });
    builder.addCase(getEveryRevisionRequest.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getEveryRevisionRequest.pending, (state, action) => {
      state.preloader = true;
    });

    /////////// acceptInvoiceRevision
    builder.addCase(acceptInvoiceRevision.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Накладная ревизии успешно подтверждена!");
    });
    builder.addCase(acceptInvoiceRevision.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert(
        "Упс, что-то пошло не так! Не удалось подтвердить накладную!"
      );
    });
    builder.addCase(acceptInvoiceRevision.pending, (state, action) => {
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
    clearLeftovers: (state, action) => {
      state.listLeftovers = [];
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
    clearListSellersPoints: (state, action) => {
      state.listSellersPoints = [];
    },
    changeListActionLeftovers: (state, action) => {
      state.listActionLeftovers = [];
    },
    clearListAgents: (state, action) => {
      state.listAgents = action.payload;
    },
  },
});

export const {
  changePreloader,
  changeListInvoices,
  clearLeftovers,
  clearListProductTT,
  clearListCategory,
  changeListSellersPoints,
  clearListSellersPoints,
  changeListActionLeftovers,
  clearListAgents,
} = requestSlice.actions;

export default requestSlice.reducer;
