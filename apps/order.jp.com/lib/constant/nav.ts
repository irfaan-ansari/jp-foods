import {
  InboxLine,
  GraphUp,
  BillCheck,
  BookmarkSquare,
  Tag,
  CardTransfer,
} from "@solar-icons/react"

export const SIDEBAR_NAV = [
  {
    label: "",
    items: [
      {
        label: "Dashboard",
        icon: GraphUp,
        href: "/dashboard",
        items: [],
      },
    ],
  },
  {
    label: "Ordering",
    items: [
      { label: "Orders", icon: InboxLine, href: "/orders", items: [] },
      { label: "Catalog", icon: Tag, href: "/create/all", items: [] },
      {
        label: "Order Guides",
        icon: BookmarkSquare,
        href: "/create/guides",
        items: [],
      },
    ],
  },
  {
    label: "Billing",
    items: [
      { label: "Invoices", icon: BillCheck, href: "/invoices", items: [] },
      {
        label: "Transactions",
        icon: CardTransfer,
        href: "/transactions",
        items: [],
      },
    ],
  },
]
