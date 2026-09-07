import {
  Rocket,
  UsersGroupTwoRounded,
  InboxLine,
  Tag,
  User,
  SettingsMinimalistic,
  UsersGroupRounded,
  ShieldKeyhole,
  Logout,
  BillCheck,
  Library,
  GraphUp,
  Letter,
  Dollar,
  TagPrice,
  UserCheck,
  CardTransfer,
  Buildings2,
  ChatLine,
} from "@solar-icons/react"

export const ORG_NAV = [
  {
    label: "",
    items: [
      { label: "Dashboard", icon: GraphUp, href: "/org/dashboard", items: [] },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", icon: InboxLine, href: "/org/orders", items: [] },
      { label: "Invoices", icon: BillCheck, href: "/org/invoices", items: [] },
      {
        label: "Transactions",
        icon: CardTransfer,
        href: "/org/transactions",
        items: [],
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", icon: Tag, href: "/org/products", items: [] },
      {
        label: "Order Guides",
        icon: Library,
        href: "/org/order-guides",
        items: [],
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Marketing",
        icon: Rocket,
        href: "#",
        items: [
          {
            label: "Promotions",
            href: "/org/promotions",
          },
          {
            label: "Messaging",
            href: "/org/messaging",
          },
        ],
      },
      {
        label: "Customers",
        icon: UsersGroupTwoRounded,
        href: "/org/customers",
        items: [],
      },
    ],
  },
]

export const SETTINGS_NAV = [
  {
    label: "Organization",
    items: [
      {
        label: "General",
        href: "/org/settings/general",
        icon: SettingsMinimalistic,
        items: [],
      },
      {
        label: "Members",
        href: "/org/settings/members",
        icon: UsersGroupRounded,
        items: [],
      },
      {
        label: "Invitations",
        href: "/org/settings/invitations",
        icon: Letter,
        items: [],
      },
      {
        label: "Tax Rules",
        href: "/org/settings/tax-rules",
        icon: Dollar,
        items: [],
      },
      {
        label: "Price Levels",
        href: "/org/settings/price-levels",
        icon: TagPrice,
        items: [],
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        label: "Users",
        href: "/settings/users",
        icon: UsersGroupRounded,
        items: [],
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "General",
        href: "/settings/account",
        icon: UserCheck,
        items: [],
      },
      {
        label: "Security",
        href: "/settings/security",
        icon: ShieldKeyhole,
        items: [],
      },
      {
        label: "Logout",
        href: "#",
        icon: Logout,
        items: [],
      },
    ],
  },
]

export const CRM_NAV = [
  {
    label: "",
    items: [
      {
        label: "Dashboard",
        icon: GraphUp,
        href: "/crm/dashboard",
        items: [],
      },
    ],
  },
  {
    label: "Submissions",
    items: [
      {
        label: "Customers",
        href: "/crm/customers",
        icon: Buildings2,
        items: [],
      },
      {
        label: "Candidates",
        href: "/crm/candidates",
        icon: UsersGroupRounded,
        items: [],
      },
      {
        label: "Catalog Inquiry",
        href: "/crm/catalog-inquiries",
        icon: Tag,
        items: [],
      },
      {
        label: "Contact",
        href: "/crm/contact",
        icon: ChatLine,
        items: [],
      },
    ],
  },
]

export const FLEET_NAV = [
  {
    label: "",
    items: [
      {
        label: "Dashboard",
        icon: GraphUp,
        href: "/application/dashboard",
        items: [],
      },
    ],
  },
  {
    label: "Application",
    items: [
      {
        label: "Customer",
        href: "/application/customer",
        icon: User,
        items: [],
      },
    ],
  },
  {
    label: "Invites",
    items: [
      {
        label: "Customer",
        href: "/application/customer/invites",
        icon: User,
        items: [],
      },
    ],
  },
  {
    label: "Enquiry",
    items: [
      {
        label: "Catalog",
        href: "/application/catalog-inquiries",
        icon: User,
        items: [],
      },
    ],
  },
]
