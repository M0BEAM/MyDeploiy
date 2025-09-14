import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(name: string, email: string, password: string, role: string = 'user') {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) throw new BadRequestException('Email already exists');
  
    return this.userService.createUser(name, email, password, role);
  }
  
  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string, res: any) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 3600000 });
    return { message: 'Logged in successfully', user: { id: user.id, email: user.email, role: user.role } };
  }
  

  async logout(res: any) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logged out successfully' });
  }
}
