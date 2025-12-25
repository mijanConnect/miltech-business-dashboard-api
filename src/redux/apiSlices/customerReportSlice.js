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
    // ---------------------------------------
    // EXPORT Report
    // ---------------------------------------
    exportCustomerReport: builder.mutation({
      queryFn: async (queryParams, { getState }) => {
        try {
          const token = localStorage.getItem("token");
          const baseUrl = "http://10.10.7.8:5004/api/v1";

          // Build URL with query parameters
          const params = new URLSearchParams();
          if (queryParams && Array.isArray(queryParams)) {
            queryParams.forEach((param) => {
              params.append(param.name, param.value);
            });
          }

          const url = `/report-analytics/business-customer/export${
            params.toString() ? "?" + params.toString() : ""
          }`;

          const response = await fetch(`${baseUrl}${url}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Export API Error:", response.status, errorText);
            return {
              error: {
                status: response.status,
                data: errorText || "Failed to export report",
              },
            };
          }

          const blob = await response.blob();
          console.log("Export successful, blob size:", blob.size);
          return { data: blob };
        } catch (error) {
          console.error("Export error:", error);
          return {
            error: {
              status: 500,
              data: error.message || "Network error occurred",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetCustomerReportQuery, useExportCustomerReportMutation } =
  customerReportApi;
