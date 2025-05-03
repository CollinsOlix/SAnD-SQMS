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
        "View Queue Analytics": {
          icon: (
            <AnalyticsIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
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

export { actionServices };
