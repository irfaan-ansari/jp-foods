// Sample support details until the support team provides production contacts.

export const SUPPORT_TOPICS = [
  {
    title: "Orders & delivery",
    description: "Review order details, delivery dates, and the latest status.",
    href: "/orders",
    action: "View your orders",
    icon: "orders",
  },
  {
    title: "Invoices & payments",
    description:
      "Find invoices and review the amounts associated with your account.",
    href: "/invoices",
    action: "View invoices",
    icon: "invoices",
  },
  {
    title: "Your account",
    description: "Update your business details and manage your team members.",
    href: "/settings/general",
    action: "Manage account",
    icon: "account",
  },
] as const

export const SUPPORT_FAQS = [
  {
    question: "How do I place an order?",
    answer:
      "Select New order from the dashboard, browse available products, and add the quantities you need. Review your items, delivery details, and total before placing the order.",
    href: "/create/all",
    action: "Start an order",
  },
  {
    question: "Where can I check my delivery status?",
    answer:
      "Open Orders and select an order to see its current status and scheduled delivery details. If you need an update about a delivery, contact the support team with your order number.",
    href: "/orders",
    action: "Go to orders",
  },
  {
    question: "Can I change or cancel an order?",
    answer:
      "Open the order and check the available actions. Changes and cancellations depend on its current status. If the option is no longer available, contact support with the order number and the changes you need.",
  },
  {
    question: "What should I do if an item is missing or damaged?",
    answer:
      "Keep your order number, the affected product names, and quantities handy. Contact support and include photos when relevant so the team can review the issue.",
  },
  {
    question: "Where can I find my invoices?",
    answer:
      "Visit Invoices to review the invoices available for your account. If you have a question about a charge, include the invoice number when contacting support.",
    href: "/invoices",
    action: "Go to invoices",
  },
  {
    question: "How do I update my contact information?",
    answer:
      "Visit Profile to update your personal details. Business information and team access can be managed from Settings.",
    href: "/profile",
    action: "Open profile",
  },
]
