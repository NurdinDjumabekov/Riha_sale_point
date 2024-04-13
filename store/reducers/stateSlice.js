import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLogin: {
    login: "tttt",
    password: "123",
  },
  acceptConfirmInvoice: {
    invoice_guid: "",
    products: [],
  }, // для подтверждения и принятия товаров ТА

  createEveryInvoiceTA: {
    seller_guid: "e7458a29-6f7f-4364-a96d-ed878812f0cf", /// delete
  }, // для создания каждой накладной ТА

  temporaryData: {}, ///// временные данные(после добавления сюда, они добавляются в список(listProductForTT))
  dataInputsInv: { price: "", ves: "" },
  listProductForTT: [],
  stateForCategory: {}, // состояние для хранения временной категории(подсветка категории)
  expense: {
    expense_type: "",
    comment: "",
    amount: "",
  }, /// данные суммы расходов каждой ТТ

  temporaryDataPay: {
    comment: "",
    amount: "",
    seller_guid: "",
    agent_guid: "",
    debit: 0,
  }, //// данные, которые будут отправлены с оплатой ТТ (оплата ревизору)

  createReturnInvoice: {
    /// для создания накладной возврата товара
    oper_guid: "",
    agent_guid: "",
    comment: "",
    stateModal: false,
  },

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
        login: "tttt",
        password: "123",
      };
    },
    changeAcceptInvoiceTA: (state, action) => {
      state.acceptConfirmInvoice = action.payload;
    },
    clearAcceptInvoiceTA: (state) => {
      state.acceptConfirmInvoice = { invoice_guid: "", products: [] };
    },
    changeEveryInvoiceTA: (state, action) => {
      state.createEveryInvoiceTA = action.payload;
    },
    clearEveryInvoiceTA: (state, action) => {
      state.createEveryInvoiceTA = {
        seller_guid: "e7458a29-6f7f-4364-a96d-ed878812f0cf",
      };
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

    changeTempDataPay: (state, action) => {
      state.temporaryDataPay = action.payload;
    },
    clearTempGDataPay: (state, action) => {
      state.temporaryDataPay = {
        comment: "",
        amount: "",
        seller_guid: "",
        agent_guid: "",
        debit: 0,
      };
    },

    changeReturnInvoice: (state, action) => {
      state.createReturnInvoice = action.payload;
    },

    cleareReturnInvoice: (state, action) => {
      state.createReturnInvoice = {
        oper_guid: "",
        agent_guid: "",
        comment: "",
        stateModal: false,
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
  changeAcceptInvoiceTA,
  clearAcceptInvoiceTA,
  changeEveryInvoiceTA,
  clearEveryInvoiceTA,
  changeTemporaryData,
  changeListProductForTT,
  addListProductForTT,
  removeListProductForTT,
  changeDataInputsInv,
  clearDataInputsInv,
  changeStateForCategory,
  changeExpense,
  clearExpense,
  changeTempDataPay,
  clearTempGDataPay,
  changeReturnInvoice,
  cleareReturnInvoice,
  changeReturnProd,
} = stateSlice.actions;

export default stateSlice.reducer;
