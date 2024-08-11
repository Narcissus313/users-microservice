import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from './user.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewUserDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersMicroserviceService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject('TCP_SERVICE') private natsClient: ClientProxy,
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

  async updateUser(upateUserCredentials: UpdateUserDto) {
    const { email, password } = upateUserCredentials;
    const targetUser = await this.userRepository.findOneBy({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    targetUser.password = hashedPassword;
    await this.userRepository.save(targetUser);
    await lastValueFrom(this.natsClient.send({ cmd: 'deleteUserOtps' }, email));
    return targetUser;
  }
}
