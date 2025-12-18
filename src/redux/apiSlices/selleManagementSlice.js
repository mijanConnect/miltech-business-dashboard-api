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
  }),
});

export const {
  useLazyFindDigitalCardQuery,
  useRequestPromotionApprovalMutation,
} = selleManagementApi;
