import { TeamSelectType, UserSelectType } from "@jp/db"

export type Team = TeamSelectType & {
  salesRep: Pick<UserSelectType, "id" | "name" | "image">
  teamMembers: {
    id: string
    userId: string
    name: string
    image: string
  }[]
}
