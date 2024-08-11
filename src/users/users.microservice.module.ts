import { Module } from '@nestjs/common';
import { UsersMicroserviceController } from './users.microservice.controller';
import { UsersMicroserviceService } from './user.microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.enitity';
import { TcpClientModule } from 'src/tcp-client/tcp.client.module';

@Module({
  imports: [TcpClientModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersMicroserviceController],
  providers: [UsersMicroserviceService],
})
export class UsersModule {}
