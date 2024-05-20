import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLogin: { login: "", password: "" },

  acceptConfirmInvoice: { invoice_guid: "", products: [] },
  // для подтверждения и принятия товаров ТА

  temporaryData: {}, ///// временные данные(после добавления сюда, они добавляются в список(listProductForTT))

  dataInputsInv: { price: "", ves: "" },

  listProductForTT: [],

  activeSelectCategory: "",
  /// хранение активной категории, для сортировки товаров(храню guid категории)

  activeSelectWorkShop: "",
  /// хранение активного Цеха для сортировки категорий(храню guid Цеха)

  searchProd: "", /// для текста поиска продуктов

  expense: {
    expense_type: "",
    comment: "",
    amount: "",
  }, /// данные суммы расходов каждой ТТ

  actionsProducts: {
    //// для возврата и ревизии списка товаров
    invoice_guid: "",
    agent_guid: "",
    products: [],
  },
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    changeDataLogin: (state, action) => {
      state.dataLogin = action.payload;
    },
    clearLogin: (state) => {
      state.dataLogin = {
        login: "",
        password: "",
      };
    },
    changeAcceptInvoiceTT: (state, action) => {
      state.acceptConfirmInvoice = action.payload;
    },

    clearAcceptInvoiceTT: (state) => {
      state.acceptConfirmInvoice = { invoice_guid: "", products: [] };
    },

    changeTemporaryData: (state, action) => {
      state.temporaryData = action.payload;
    },

    changeListProductForTT: (state, action) => {
      state.listProductForTT = action.payload;
    },

    addListProductForTT: (state, action) => {
      state.listProductForTT = [...state.listProductForTT, action.payload];
    },

    removeListProductForTT: (state, action) => {
      const indexToRemove = state.listProductForTT.findIndex(
        (item) => item.guid === action.payload?.guid
      );
      if (indexToRemove !== -1) {
        state.listProductForTT.splice(indexToRemove, 1);
      }
    },

    changeDataInputsInv: (state, action) => {
      state.dataInputsInv = action.payload;
    },

    clearDataInputsInv: (state, action) => {
      state.dataInputsInv = { price: "", ves: "" };
    },

    changeActiveSelectCategory: (state, action) => {
      state.activeSelectCategory = action.payload;
    },

    changeActiveSelectWorkShop: (state, action) => {
      state.activeSelectWorkShop = action.payload;
    },

    changeSearchProd: (state, action) => {
      state.searchProd = action.payload;
    },

    changeExpense: (state, action) => {
      state.expense = action.payload;
    },
    clearExpense: (state, action) => {
      state.expense = {
        expense_type: "",
        comment: "",
        amount: "",
      };
    },

    changeActionsProducts: (state, action) => {
      state.actionsProducts = action.payload;
    },

    clearActionsProducts: (state, action) => {
      state.actionsProducts = {
        invoice_guid: "",
        agent_guid: "",
        products: [],
      };
    },
  },
});
export const {
  changeDataLogin,
  clearLogin,
  changeAcceptInvoiceTT,
  clearAcceptInvoiceTT,
  changeTemporaryData,
  changeListProductForTT,
  addListProductForTT,
  removeListProductForTT,
  changeDataInputsInv,
  clearDataInputsInv,
  changeActiveSelectCategory,
  changeActiveSelectWorkShop,
  changeSearchProd,
  changeExpense,
  clearExpense,
  changeActionsProducts,
  clearActionsProducts,
} = stateSlice.actions;

export default stateSlice.reducer;
