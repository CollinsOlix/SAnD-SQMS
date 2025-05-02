const SERVER_URL = "http://localhost:5000";
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

export const fetchBranchAnalytics = async () => {
  await fetch(`${SERVER_URL}/admin/analytics/branch`);
};
