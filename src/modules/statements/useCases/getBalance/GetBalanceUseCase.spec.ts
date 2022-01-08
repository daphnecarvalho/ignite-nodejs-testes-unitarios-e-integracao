import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get Balance", () => {
  let statementsRepositoryInMemory: IStatementsRepository;
  let usersRepositoryInMemory: IUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;
  
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeAll(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  
    usersRepositoryInMemory.create({
      id: "123456",
      name: "user",
      password: "password",
      email: "user@example.com",
    });
  });

  it("should be able to get balance of user when there is no statements", async () => {
    const result = await getBalanceUseCase.execute({ user_id: "123456" });
    expect(result).toHaveProperty("balance");
    expect(result.statement).toEqual([]);
  });

  it("should be able to get balance of user when there are statements", async () => {
    statementsRepositoryInMemory.create({ 
        user_id: "123456", 
        amount: 200,
        description: "description",
        type: OperationType.DEPOSIT
    });
    
    const result = await getBalanceUseCase.execute({ user_id: "123456" });
    expect(result).toHaveProperty("balance");
    expect(result.balance).toEqual(200);
    expect(result.statement.length).toEqual(1);
  });

  it("should not be able to get balance if user does not exist", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});