import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "Users",
    "UserId",
    "Packages",
    "PackageId",
    "Customers",
    "CustomerId",
  ],
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "user/users",
      providesTags: ["Users"],
    }),
    getUserId: build.query({
      query: (id) => `user/${id}`,
      providesTags: ["UserId"],
    }),
    getPackages: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "package/packages",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Packages"],
    }),
    getPackageId: build.query({
      query: (id) => `package/packageid/${id}`,
      providesTags: ["PackageId"],
    }),
    getCustomers: build.query({      
      query: ({ page, pageSize, sort, search }) => ({
        url: "customer/customers",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Customers"],
    }),
    getCustomerId: build.query({
      query: (id) => `customer/customerid/${id}`,
      providesTags: ["CustomerId"],
    }),
    getProvinces: build.query({
      query: () => "location/provinces",
      providesTags: ["Provinces"],
    }),
    getDistricts: build.query({      
      query: ({pr_id}) =>({
        url: "location/districts",
        method: "GET",
        params: {pr_id}
      }),
      providesTags:["Districts"]
    })
    // getTransactions: build.query({
    //   query: ({ page, pageSize, sort, search }) => ({
    //     url: "client/transactions",
    //     method: "GET",
    //     params: { page, pageSize, sort, search },
    //   }),
    //   providesTags: ["Transactions"],
    // }),

  }),
});

export const {
  useGetUserIdQuery,
  useGetUsersQuery,
  useGetPackagesQuery,
  useGetPackageIdQuery,
  useGetCustomersQuery,
  useGetCustomerIdQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,

  // useGetTransactionsQuery,
  // useGetGeographyQuery,
  // useGetSalesQuery,
  // useGetAdminsQuery,
  // useGetUserPerformanceQuery,
  // useGetDashboardQuery,
} = api;
