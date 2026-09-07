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
        disabled: false,
        items: [],
      },
    ],
  },
  {
    label: "Ordering",
    items: [
      {
        label: "Orders",
        icon: InboxLine,
        href: "/orders",
        items: [],
        disabled: false,
      },
      {
        label: "Catalog",
        icon: Tag,
        href: "/create/all",
        items: [],
        disabled: false,
      },
      {
        label: "Order Guides",
        icon: BookmarkSquare,
        href: "/create/guides",
        disabled: false,
        items: [],
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        label: "Invoices",
        icon: BillCheck,
        href: "/invoices",
        disabled: true,
        items: [],
      },
      {
        label: "Transactions",
        icon: CardTransfer,
        href: "/transactions",
        disabled: true,
        items: [],
      },
    ],
  },
]
