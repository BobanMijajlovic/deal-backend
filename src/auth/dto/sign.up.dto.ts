import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class SignUpDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export default SignUpDto;
