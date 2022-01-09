import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, sender_id }: ICreateStatementDTO) {
    if(type === 'transfer' && sender_id && user_id === sender_id) {
      throw new CreateStatementError.InvalidOperation();
    }
    
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw' || type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    // Save statement for user who received funds
    if(type === 'transfer') {
      await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description,
        sender_id
      });
    }

    // Save statement for user who transfered funds
    const statementOperation = await this.statementsRepository.create({
      user_id: String(sender_id),
      type,
      amount,
      description,
    });

    return statementOperation;
  }
}
