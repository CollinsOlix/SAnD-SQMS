import AddIcon from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function addBranch() {
  console.log("Add Branch");
}
function addService() {
  console.log("Add Service");
}
const actionServices = [
  {
    "Manage Branch and Services": [
      {
        "Add Branch": {
          icon: (
            <AddIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
          action: "Add Branch",
          requiresSuperAdmin: true,
        },
      },
      {
        "Remove a Branch": {
          icon: (
            <Delete
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
          action: "Remove a Branch",
          requiresSuperAdmin: true,
        },
      },
      {
        "Add Service": {
          icon: (
            <AddIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "Add a Service",
          onClick: addService,
          requiresSuperAdmin: false,
        },
      },
      {
        "Remove a Service": {
          icon: (
            <Delete
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "Remove a Service",
          onClick: addBranch,
          requiresSuperAdmin: false,
        },
      },
      {
        "Add Staff": {
          icon: (
            <SupportAgentIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "Assign Staff to a Service",
          onClick: addBranch,
          requiresSuperAdmin: false,
        },
      },
      {
        "Add Admin": {
          icon: (
            <SupervisorAccountIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
          requiresSuperAdmin: true,
        },
      },
    ],
  },
  {
    "Manage Queue": [
      {
        "Add New Queue": {
          icon: (
            <AddIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
          action: "Add Queue",
          requiresSuperAdmin: false,
        },
      },
      {
        "Remove a Queue": {
          icon: (
            <Delete
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
          action: "Remove Queue",
          requiresSuperAdmin: false,
        },
      },
    ],
  },
  {
    "View Analytics": [
      {
        "View Service Analytics": {
          icon: (
            <AnalyticsIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "View Service Analytics",
          onClick: addBranch,
          requiresSuperAdmin: false,
        },
      },
      {
        "View Staff Analytics": {
          icon: (
            <AnalyticsIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "View Staff Analytics",
          onClick: addBranch,
          requiresSuperAdmin: false,
        },
      },
      {
        "View Branch Analytics": {
          icon: (
            <AnalyticsIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          action: "Branch Analytics",
          onClick: addBranch,
          requiresSuperAdmin: false,
        },
      },
    ],
  },
];

export function getStartOfWeek(inputDate) {
  const date = new Date(inputDate);

  // Get day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
  const day = date.getDay();

  // Calculate how many days to subtract to get Monday
  // If Sunday (0), shift back 6 days, else shift back (day - 1) days
  const diff = day === 0 ? -6 : 1 - day;

  // Create new date for Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  // Reset time to midnight
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function getStartOfMonth(inputDate) {
  const date = new Date(inputDate);

  // Set the date to the first day of the month
  date.setDate(1);

  // Reset time to midnight
  date.setHours(0, 0, 0, 0);

  return date;
}

export function initializeMonth(year, month) {
  let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let monthDays = {};

  let numberOfDays = new Date(year, month + 1, 0);
  let dayOne = new Date(year, month, 1);
  dayOne = dayOne.toLocaleDateString("en-US", { weekday: "short" });
  numberOfDays = numberOfDays.getDate();

  //
  //
  let newWeekDays = weekDays.splice(
    0,
    weekDays.findIndex((i) => i === dayOne)
  );
  weekDays = weekDays.concat(newWeekDays);
  let i = 0,
    j = 0;
  while (i < numberOfDays) {
    monthDays[`${i + 1} ${weekDays[j]}`] = 0;
    if (j === 6) {
      j = 0;
      i++;
      continue;
    }
    i++;
    j++;
  }
  return monthDays;
}

export function getAllHistoryForThisMonth(historyArray) {
  let monthObj = initializeMonth(
    new Date().getFullYear(),
    new Date().getMonth()
  );
  let thisMonthsHistory = historyArray.filter(
    (item, index) =>
      new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1e6
      ).getMonth() >= new Date().getMonth()
  );

  //
  //
  console.log("THis: ", thisMonthsHistory);
  thisMonthsHistory.forEach((item) => {
    let date = new Date(item.date.seconds * 1000 + item.date.nanoseconds / 1e6);

    monthObj[
      `${date.getDate()} ${date.toLocaleDateString("en-US", {
        weekday: "short",
      })}`
    ]++;
  });
  console.log(monthObj);
  return monthObj;
}

export { actionServices };
