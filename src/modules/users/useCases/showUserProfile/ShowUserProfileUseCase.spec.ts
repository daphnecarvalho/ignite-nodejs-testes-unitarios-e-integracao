import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile", () => {
  let usersRepositoryInMemory: IUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  
    usersRepositoryInMemory.create({
      id: "123456",
      name: "user",
      password: "password",
      email: "user@example.com",
    });
  });

  it("should be able to show user profile", async () => {
    const result = await showUserProfileUseCase.execute("123456");
    expect(result).toHaveProperty("id");
  });

  it("should not be able to show user profile if user does not exist", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});