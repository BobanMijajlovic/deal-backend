import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export default SignInDto;
