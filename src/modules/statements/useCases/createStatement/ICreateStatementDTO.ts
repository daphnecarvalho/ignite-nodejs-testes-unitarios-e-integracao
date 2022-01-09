import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'id' |
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'sender_id'
>
