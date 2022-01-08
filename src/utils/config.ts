import dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    break;
  default:
    path = `${__dirname}/../../.env`;
}
dotenv.config({ path: path });