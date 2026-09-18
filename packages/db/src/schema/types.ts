import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  customer,
  customerInvite,
  jobApplication,
  jobInvite,
} from "./application"
import {
  invitation,
  member,
  organization,
  session,
  team,
  teamMember,
  user,
} from "./auth"
import {
  lineItem,
  order,
  orderGuide,
  orderGuideItem,
  priceLevel,
  priceLevelItem,
  product,
  promotion,
  promotionTarget,
  taxRule,
} from "./organization"

/** applications */
export type CustomerApplicationSelectType = InferSelectModel<typeof customer>
export type CustomerApplicationInsertType = InferInsertModel<typeof customer>

export type CustomerInviteInsertType = InferInsertModel<typeof customerInvite>
export type CustomerInviteSelectType = InferSelectModel<typeof customerInvite>

export type JobApplicationInsertType = InferInsertModel<typeof jobApplication>
export type JobApplicationSelectType = InferSelectModel<typeof jobApplication>

export type JobInviteInsertType = InferInsertModel<typeof jobInvite>
export type JobInviteSelectType = InferSelectModel<typeof jobInvite>

/** auth */
export type UserInsertType = InferInsertModel<typeof user>
export type UserSelectType = InferSelectModel<typeof user>
export type SessionInsertType = InferInsertModel<typeof session>
export type SessionSelectType = InferSelectModel<typeof session>

export type OrganizationSelectType = InferSelectModel<typeof organization>
export type OrganizationInsertType = InferInsertModel<typeof organization>

export type MemberSelectType = InferSelectModel<typeof member>
export type MemberInsertType = InferInsertModel<typeof member>

export type TeamSelectType = InferSelectModel<typeof team>
export type TeamInsertType = InferInsertModel<typeof team>

export type TeamMemberSelectType = InferSelectModel<typeof teamMember>
export type TeamMemberInsertType = InferInsertModel<typeof teamMember>

export type InvitationSelectType = InferSelectModel<typeof invitation>
export type InvitationInsertType = InferInsertModel<typeof invitation>

/** main portal */
export type ProductInsertType = InferInsertModel<typeof product>
export type ProductSelectType = InferSelectModel<typeof product>

export type PriceLevelInsertType = InferInsertModel<typeof priceLevel>
export type PriceLevelSelectType = InferSelectModel<typeof priceLevel>

export type PriceLevelItemInsertType = InferInsertModel<typeof priceLevelItem>
export type PriceLevelItemSelectType = InferSelectModel<typeof priceLevelItem>

export type OrderSelectType = InferSelectModel<typeof order>
export type OrderInsertType = InferInsertModel<typeof order>
export type LineItemSelectType = InferSelectModel<typeof lineItem>
export type LineItemInsertType = InferInsertModel<typeof lineItem>

export type TaxRuleSelectType = InferSelectModel<typeof taxRule>
export type TaxRuleInsertType = InferInsertModel<typeof taxRule>

export type OrderGuideSelectType = InferSelectModel<typeof orderGuide>
export type OrderGuideInsertType = InferInsertModel<typeof orderGuide>

export type OrderGuideItemSelectType = InferSelectModel<typeof orderGuideItem>
export type OrderGuideItemInsertType = InferInsertModel<typeof orderGuideItem>

export type PromotionSelectType = InferSelectModel<typeof promotion>
export type PromotionInsertType = InferInsertModel<typeof promotion>

export type PromotionTargetSelectType = InferSelectModel<typeof promotionTarget>
export type PromotionTargetInsertType = InferInsertModel<typeof promotionTarget>
