import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateNewUserDto } from './users.dto';
import { UsersMicroserviceService } from './user.microservice.service';

@Controller()
export class UsersMicroserviceController {
  constructor(private usersMicroserviceService: UsersMicroserviceService) {}

  @MessagePattern({ cmd: 'createNewUser' })
  async createNewUser(@Payload() createNewUserInfo: CreateNewUserDto) {
    const { email } = createNewUserInfo;
    const userExists =
      await this.usersMicroserviceService.findUserByEmail(email);
    if (!!userExists) return 'email is already registered';

    const newUser =
      await this.usersMicroserviceService.createNewUser(createNewUserInfo);
    return newUser;
  }

  @MessagePattern({ cmd: 'checkUserExistance' })
  async checkUserExistance(@Payload() email: string) {
    return await this.usersMicroserviceService.findUserByEmail(email);
  }
}
