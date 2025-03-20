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
          onClick: addService,
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
          onClick: addBranch,
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
        },
      },
      {
        "Assign a service to a Queue": {
          icon: (
            <AddIcon
              sx={{
                fontSize: 70,
              }}
            />
          ),
          onClick: addBranch,
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
          onClick: addBranch,
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
          onClick: addBranch,
        },
      },
    ],
  },
];

export { actionServices };
