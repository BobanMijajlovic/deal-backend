import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '@app/common/decorators';
import { JwtRtGuard } from '@app/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() id: number) {
    return this.authService.logout(id);
  }

  @Public()
  @Get('refresh')
  @UseGuards(JwtRtGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() id: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(id, refreshToken);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  signedUser(@GetCurrentUserId() id: number) {
    return this.authService.getUser(id);
  }
}
