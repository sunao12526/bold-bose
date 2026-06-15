import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username!: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password!: string;

  @IsNotEmpty({ message: '验证码标识不能为空' })
  captchaKey!: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captchaCode!: string;
}
