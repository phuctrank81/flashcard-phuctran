import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { User } from "./user.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { EmailService } from "./email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, "users")
    private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException("Email da ton tai");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    const emailSent = await this.emailService.sendVerificationEmail(
      dto.email,
      verificationToken,
      dto.username,
    );

    return {
      message: "Dang ky thanh cong! Vui long kiem tra email de xac thuc tai khoan",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
      emailSent,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException("Sai email hoac mat khau");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Sai email hoac mat khau");
    }

    return {
      message: "Dang nhap thanh cong",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException("Token xac thuc khong hop le");
    }

    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException("Token xac thuc khong hop le hoac da het han");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return {
      message: "Email da duoc xac thuc thanh cong!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }
}
