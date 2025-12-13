import { api } from "../api/baseApi";

export const customerReportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET Report
    // ---------------------------------------
    getCustomerReport: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/business-customer?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["CustomerReport"],
    }),
  }),
});

export const { useGetCustomerReportQuery } = customerReportApi;
