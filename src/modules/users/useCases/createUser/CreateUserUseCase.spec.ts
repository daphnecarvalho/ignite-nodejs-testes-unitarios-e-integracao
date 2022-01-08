import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("Create User", () => {
  let usersRepositoryInMemory: IUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "user",
      password: "password",
      email: "user@example.com",
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create a new user if the email is already in use", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user",
        password: "password",
        email: "user@example.com",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});