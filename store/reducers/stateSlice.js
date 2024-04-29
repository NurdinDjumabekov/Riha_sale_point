import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLogin: {
    login: "",
    password: "",
  },

  acceptConfirmInvoice: {
    invoice_guid: "",
    products: [],
  }, // для подтверждения и принятия товаров ТА

  temporaryData: {}, ///// временные данные(после добавления сюда, они добавляются в список(listProductForTT))
  dataInputsInv: { price: "", ves: "" },
  listProductForTT: [],
  stateForCategory: {}, // состояние для хранения временной категории(подсветка категории)

  activeSelectCategory: "",
  /// хранение активной категории, для сортировки товаров(храню guid категории)

  searchProd: "", /// для текста поиска продуктов

  expense: {
    expense_type: "",
    comment: "",
    amount: "",
  }, /// данные суммы расходов каждой ТТ

  returnProducts: {
    //// для возврата списка товаров
    invoice_guid: "",
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

    changeStateForCategory: (state, action) => {
      state.stateForCategory = action.payload;
    },

    changeActiveSelectCategory: (state, action) => {
      state.activeSelectCategory = action.payload;
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

    changeReturnProd: (state, action) => {
      state.returnProducts = action.payload;
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
  changeStateForCategory,
  changeActiveSelectCategory,
  changeSearchProd,
  changeExpense,
  clearExpense,
  changeReturnProd,
} = stateSlice.actions;

export default stateSlice.reducer;
