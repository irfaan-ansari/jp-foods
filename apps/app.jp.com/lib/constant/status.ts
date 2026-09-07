import { CheckCircle, ClockCircle } from "@solar-icons/react"
import {
  Circle,
  CircleOff,
  FileEdit,
  FileText,
  MessageCircle,
  PauseOctagon,
  Send,
  Lock,
  Archive,
  Ban,
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
  under_review: {
    label: "Under Review",
    color: "#8B5CF6",
    icon: FileEdit,
  },
  active: {
    label: "Active",
    color: "#22C55E",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: CircleOff,
  },
  on_hold: {
    label: "On Hold",
    color: "#3B82F6",
    icon: ClockCircle,
  },
  submitted: {
    label: "Submitted",
    color: "#F59E0B",
    icon: Send,
  },
  abandoned: {
    label: "Abandoned",
    color: "#F59E0B",
    icon: PauseOctagon,
  },
  interview: {
    label: "Interview",
    color: "#8B5CF6",
    icon: MessageCircle,
  },
  pending: {
    label: "Agreement",
    color: "#3B82F6",
    icon: ClockCircle,
  },
  hired: {
    label: "Hired",
    color: "#22C55E",
    icon: CheckCircle,
  },
  invited: {
    label: "Invited",
    color: "#F59E0B",
    icon: Send,
  },
  applied: {
    label: "Applied",
    color: "#3B82F6",
    icon: FileText,
  },
  private: {
    label: "Private",
    color: "#6366F1",
    icon: Lock,
  },
  archived: {
    label: "Archived",
    color: "#71717A",
    icon: Archive,
  },
  approved: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
  },
  converted: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
  },
  revoked: {
    label: "Revoked",
    color: "#71717A",
    icon: Ban,
  },

  inactive: {
    label: "Inactive",
    color: "#EF4444",
    icon: CircleOff,
  },
  unpaid: {
    label: "Unpaid",
    color: "#F59E0B",
    icon: ClockCircle,
  },
  paid: {
    label: "Paid",
    color: "#22C55E",
    icon: CheckCircle,
  },
  partially_paid: {
    label: "Partially Paid",
    color: "#F59E0B",
    icon: CircleOff,
  },
  overdue: {
    label: "Overdue",
    color: "#EF4444",
    icon: CircleOff,
  },
  owner: {
    label: "Owner",
    color: "#16A34A",
  },
  admin: {
    label: "Admin",
    color: "#7C3AED",
  },
  manager: {
    label: "Manager",
    color: "#2563EB",
  },
  sales: {
    label: "Sales",
    color: "#EC4899",
  },
  member: {
    label: "Member",
    color: "#06B6D4",
  },
  user: {
    label: "User",
    color: "#6B7280",
  },
  customer: {
    label: "Customer",
    color: "#F59E0B",
  },
  banned: {
    label: "Banned",
    color: "#F59E0B",
  },
}
