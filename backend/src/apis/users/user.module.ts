import { User } from 'src/apis/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [JwtAccessStrategy, UserResolver, UserService],
})
export class UserModule {}
