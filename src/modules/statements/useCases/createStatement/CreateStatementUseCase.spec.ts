import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

describe("Create Statement", () => {
  let statementsRepositoryInMemory: IStatementsRepository;
  let usersRepositoryInMemory: IUsersRepository;
  let createStatementUseCase: CreateStatementUseCase;
  
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer',
  }

  beforeAll(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  
    usersRepositoryInMemory.create({
      id: "123456",
      name: "user",
      password: "password",
      email: "user@example.com",
    });
  });

  it("should be able to create a new deposit", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "123456",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "description"
    };

    const result = await createStatementUseCase.execute(statement);
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit");
  });

  it("should be able to create a new withdraw", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "123456",
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "description"
    };

    const result = await createStatementUseCase.execute(statement);
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("withdraw");
  });

  it("should not be able to create a new statement when user is not found", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_id",
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new withdraw when there are insufficient funds", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "123456",
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});