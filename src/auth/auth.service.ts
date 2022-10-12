import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { hash, verify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(body: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    // If user doesnot exist throw exception
    if (!user) {
      throw new ForbiddenException('Incorrect Credentials');
    }
    // Check password
    const pwMatched = await verify(user.hash, body.password);
    // If password is incorrect throw exception
    if (!pwMatched) {
      throw new ForbiddenException('Incorrect Credentials');
    }
    // return user
    return this.tokenSignature(user.id, user.email);
  }

  async signUp(body: AuthDto) {
    const hashedPassword = await hash(body.password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: body.email,
          hash: hashedPassword,
        },
      });

      return this.tokenSignature(newUser.id, newUser.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with that email already exists');
        }
      }
      throw error;
    }
  }
  async tokenSignature(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
