import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class ObtenerSemillaDTO {
  @IsString()
  @IsNotEmpty()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rnc: string;
}

export class ValidarSemillaDTO {
  @IsString()
  @IsNotEmpty()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rnc: string;

  @IsString()
  @IsNotEmpty()
  semillaFirmada: string;
}

export class RenovarTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class RevocarTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
