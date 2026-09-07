import {
  AlertCircle,
  CheckCircle,
  Circle,
  CircleDashed,
  Clock3,
  RotateCcw,
} from "lucide-react"

export const STATUS_MAP = {
  new: {
    label: "New",
    color: "#F59E0B",
    icon: Circle,
  },
  all: {
    label: "All",
    color: "#A1A1AA",
    icon: Circle,
  },
  in_progress: {
    label: "In Progress",
    icon: CircleDashed,
    color: "#F59E0B",
  },
  delayed: {
    label: "Delayed",
    icon: AlertCircle,
    color: "#EF4444",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "#22C55E",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    color: "#EF4444",
  },

  // test

  unpaid: {
    label: "Unpaid",
    icon: Clock3,
    color: "#F59E0B", // Amber
  },
  due: {
    label: "Due",
    icon: Clock3,
    color: "#3B82F6", // Blue
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    color: "#EF4444", // Red
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    color: "#22C55E", // Green
  },

  //

  failed: {
    label: "Failed",
    icon: AlertCircle,
    color: "#EF4444",
  },
  refunded: {
    label: "Refunded",
    icon: RotateCcw,
    color: "#06B6D4",
  },
}
