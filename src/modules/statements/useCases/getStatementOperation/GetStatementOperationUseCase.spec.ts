import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Get Statement Operation", () => {
  let statementsRepositoryInMemory: IStatementsRepository;
  let usersRepositoryInMemory: IUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
  
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeAll(async () => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  
    usersRepositoryInMemory.create({
      id: "123456",
      name: "user",
      password: "password",
      email: "user@example.com",
    });

    const statement = await statementsRepositoryInMemory.create({
      id: "123456",
      user_id: "123456",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "description"
    });
  });

  it("should be able to get statement operation", async () => {
    const result = await getStatementOperationUseCase.execute({ 
      user_id: "123456",
      statement_id: "123456"
    });
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit");
  });

  it("should not be able to get statement if user does not exist", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ 
        user_id: "user_id",
        statement_id: "123456"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement if statement is not found", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ 
        user_id: "123456",
        statement_id: "statement_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});