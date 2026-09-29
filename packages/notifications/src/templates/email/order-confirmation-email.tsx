import { Button, Column, Row, Section, Text } from "react-email"
import { EmailLayout } from "./email-layout"

interface OrderConfirmationEmailProps {
  name: string
  orderId: number | string
  company: string
  items: {
    id: number | string
    title: string
    itemCode?: string | null
    quantity: string | number
    unitLabel?: string | null
    subtotal: string | number
  }[]
  subtotal: string | number
  taxAmount: string | number
  discount?: string | number
  charges?: { type: string; amount: string | number } | null
  total: string | number
}

const money = (value: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value))

export const OrderConfirmationEmail = ({
  name,
  orderId,
  company,
  items,
  subtotal,
  taxAmount,
  discount = 0,
  charges,
  total,
}: OrderConfirmationEmailProps) => {
  return (
    <EmailLayout
      template="customer"
      heading="Order received"
      preview={`We’ve received your order #${orderId}. View your items and delivery details.`}
    >
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="text-text mb-3 text-base font-semibold">
          Hello {name},
        </Text>
        <Text className="text-sm leading-6">
          Thank you for ordering with Jimenez Produce. We have received your
          order for <strong>{company}</strong> and will prepare it for delivery.
        </Text>

        <Text className="text-text mb-3 text-base font-semibold">
          Your order
        </Text>
        <Row className="border-b border-border">
          <Column className="pb-3 text-xs font-semibold text-muted">
            Item
          </Column>
          <Column
            align="right"
            className="pb-3 text-xs font-semibold text-muted"
          >
            Amount
          </Column>
        </Row>
        {items.map((item) => (
          <Row key={item.id} className="border-b border-border">
            <Column className="py-3 pr-4 align-top">
              <Text className="text-text m-0 text-sm font-semibold">
                {item.title}
              </Text>
              <Text className="m-0 mt-1 text-xs leading-5 text-muted">
                {item.itemCode && <>{item.itemCode} · </>}
                {item.quantity} {item.unitLabel}
              </Text>
            </Column>
            <Column
              align="right"
              className="py-3 align-top text-sm whitespace-nowrap"
            >
              {money(item.subtotal)}
            </Column>
          </Row>
        ))}

        <Section className="mt-4">
          <Row>
            <Column className="py-1 text-sm text-muted">Subtotal</Column>
            <Column align="right" className="py-1 text-sm">
              {money(subtotal)}
            </Column>
          </Row>
          <Row>
            <Column className="py-1 text-sm text-muted">Tax</Column>
            <Column align="right" className="py-1 text-sm">
              {money(taxAmount)}
            </Column>
          </Row>
          {Number(discount) > 0 && (
            <Row>
              <Column className="py-1 text-sm text-muted">Discount</Column>
              <Column align="right" className="py-1 text-sm">
                −{money(discount)}
              </Column>
            </Row>
          )}
          {charges && (
            <Row>
              <Column className="py-1 text-sm text-muted">
                {charges.type}
              </Column>
              <Column align="right" className="py-1 text-sm">
                {money(charges.amount)}
              </Column>
            </Row>
          )}
          <Row className="border-t border-border">
            <Column className="pt-4 text-base font-bold">Order total</Column>
            <Column align="right" className="pt-4 text-base font-bold">
              {money(total)}
            </Column>
          </Row>
        </Section>

        <Button
          href="https://jimenezproduce.com/orders"
          className="bg-brand mt-6 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          View order
        </Button>

        <Text className="mt-6 text-sm leading-6">
          This email confirms receipt of your order and is not an invoice. If
          you need help, reply to this email and include your order number.
        </Text>
      </Section>
    </EmailLayout>
  )
}

OrderConfirmationEmail.PreviewProps = {
  name: "Alex Morgan",
  orderId: 10482,
  company: "Example Market",
  items: [
    {
      id: 1,
      title: "Roma Tomatoes",
      itemCode: "PRD-101",
      quantity: 2,
      unitLabel: "cases",
      subtotal: "48.00",
    },
    {
      id: 2,
      title: "Beef Brisket",
      itemCode: "PRD-205",
      quantity: 1,
      unitLabel: "case",
      subtotal: "120.00",
    },
  ],
  subtotal: "168.00",
  taxAmount: "8.40",
  charges: { type: "Fuel charge", amount: "15.00" },
  total: "191.40",
} satisfies OrderConfirmationEmailProps

export default OrderConfirmationEmail
