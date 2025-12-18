import { api } from "../api/baseApi";

export const selleManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET digital card with promotions
    // ---------------------------------------
    findDigitalCard: builder.query({
      query: (cardCode) => ({
        url: `/add-promotion/find?cardCode=${cardCode}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // POST request approval for promotion
    // ---------------------------------------
    requestPromotionApproval: builder.mutation({
      query: (body) => ({
        url: `/sell/promotion/request-approval`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // GET merchants list
    // ---------------------------------------
    getMerchants: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/sell/merchant?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // GET today's sales/transactions
    // ---------------------------------------
    getTodaysSells: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/sell/merchant?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useLazyFindDigitalCardQuery,
  useRequestPromotionApprovalMutation,
  useGetMerchantsQuery,
  useGetTodaysSellsQuery,
} = selleManagementApi;
