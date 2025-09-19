import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString, Min, Max } from 'class-validator';
import { TipoECF, EstadoComprobante } from '../../shared/enums/DGIIEnums';

export class RecepcionECFDTO {
  @IsString()
  @IsNotEmpty()
  rncEmisor: string;

  @IsString()
  @IsNotEmpty()
  nombreArchivo: string;
}

export class ConsultaEstadoDTO {
  @IsOptional()
  @IsString()
  trackId?: string;

  @IsOptional()
  @IsString()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rnc?: string;

  @IsOptional()
  @IsString()
  @Length(13, 13)
  @Matches(/^\d+$/, { message: 'eNCF debe contener solo números' })
  encf?: string;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsEnum(EstadoComprobante)
  estado?: EstadoComprobante;
}

export class ConsultaTrackIdsDTO {
  @IsString()
  @IsNotEmpty()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rnc: string;

  @IsOptional()
  @IsString()
  @Length(13, 13)
  @Matches(/^\d+$/, { message: 'eNCF debe contener solo números' })
  encf?: string;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}

export class ConsultaDirectorioDTO {
  @IsOptional()
  @IsString()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rnc?: string;

  @IsOptional()
  @IsDateString()
  fechaActualizacion?: string;
}

export class AprobacionComercialDTO {
  @IsString()
  @IsNotEmpty()
  rncEmisor: string;

  @IsString()
  @IsNotEmpty()
  nombreArchivo: string;
}

export class AnulacionRangoDTO {
  @IsString()
  @IsNotEmpty()
  @Length(9, 11)
  @Matches(/^\d+$/, { message: 'RNC debe contener solo números' })
  rncEmisor: string;

  @IsEnum(TipoECF)
  tipoECF: TipoECF;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^\d+$/, { message: 'Secuencia desde debe contener solo números' })
  secuenciaDesde: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^\d+$/, { message: 'Secuencia hasta debe contener solo números' })
  secuenciaHasta: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 255)
  motivoAnulacion: string;
}
