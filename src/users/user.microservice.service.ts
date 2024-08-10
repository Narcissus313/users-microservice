import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersMicroserviceService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewUser(createNewUserInfo: CreateNewUserDto) {
    const newUserPassword = createNewUserInfo.password;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newUserPassword, saltOrRounds);
    Object.assign(createNewUserInfo, {
      password: hashedPassword,
    });

    const newUser = this.userRepository.create(createNewUserInfo);
    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string) {
    const targetUser = await this.userRepository.findOneBy({ email });
    return targetUser;
  }
}
