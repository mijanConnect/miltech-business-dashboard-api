import { api } from "../api/baseApi";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET promo details
    // ---------------------------------------
    getPromoDetails: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/promo-merchant?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Promo"],
    }),
  }),
});

export const { useGetPromoDetailsQuery } = customerApi;
