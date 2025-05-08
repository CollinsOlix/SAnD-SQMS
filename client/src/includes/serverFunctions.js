const SERVER_URL = "http://localhost:5000";
// const SERVER_URL = "https://sdnxn5zx-5000.euw.devtunnels.ms/";
export const getServiceDetails = async (branch, service) => {
  let staffBoardDeets;
  if (branch && service) {
    try {
      await fetch(`${SERVER_URL}/staff/get-service-details`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch,
          service,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          staffBoardDeets = data;
        });
      return staffBoardDeets;
    } catch (err) {
      console.error("Error getting service details: ", err);
      return null;
    }
  }
};

//
export const getServicesInBranch = async (branch) => {
  let services;
  try {
    await fetch(`${SERVER_URL}/get-services`, {
      method: "POST",

      body: JSON.stringify({ branch }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        services = data;
      });
    return services;
  } catch (err) {
    console.error("Error Fetching Services in Branch: ", err);
  }
};

export const fetchBranchAnalytics = async (branch) => {
  let analyticsData;
  await fetch(`${SERVER_URL}/admin/analytics/branch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branch,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Analytics : ", data);
      analyticsData = data;
    });
  return analyticsData;
  return { staff: {}, history: [], services: [] };
};

export const removeServiceFunction = async (branch, service) => {
  let respMessage;
  try {
    await fetch(`${SERVER_URL}/admin/remove-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        branch,
        service,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        respMessage = data;
      });
  } catch (err) {
    console.error("Error removing service: ", err);
  }
  return respMessage;
};

export const fetchStaffFromBranch = async (branch) => {
  let allStaff;
  try {
    await fetch(`${SERVER_URL}/admin/fetch-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        branch,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        allStaff = data;
      });
  } catch (err) {
    console.error("Error fetching staff: ", err);
  }
  return allStaff;
};

export const fetchAllTransactionsFromBranch = async (branch, id, name) => {
  let respData;
  let history = await fetch(`${SERVER_URL}/admin/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branch,
      id,
      name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      respData = data;
    });
  console.log("history: ", history);
  console.log("history: ", respData);
  return respData;
};

export const fetchServiceAnalytics = async (branch, service) => {
  let respData;
  await fetch(`${SERVER_URL}/admin/service-analytics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branch,
      service,
    }),
  })
    .then((response) => response.json())
    .then((data) => (respData = data));
  console.log(respData);
  return respData;
};
