import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateInitialTables1700000000001 implements MigrationInterface {
  name = 'CreateInitialTables1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de tokens de sesión
    await queryRunner.createTable(
      new Table({
        name: 'tokens_sesion',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rnc',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'fechaExpiracion',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'activo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaCreacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'fechaActualizacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices para tokens_sesion
    await queryRunner.createIndex(
      'tokens_sesion',
      new Index('IDX_tokens_sesion_rnc_activo', ['rnc', 'activo'])
    );
    await queryRunner.createIndex(
      'tokens_sesion',
      new Index('IDX_tokens_sesion_token_activo', ['token', 'activo'])
    );

    // Crear tabla de comprobantes electrónicos
    await queryRunner.createTable(
      new Table({
        name: 'comprobantes_electronicos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'trackId',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'rncEmisor',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'encf',
            type: 'varchar',
            length: '13',
            isNullable: false,
          },
          {
            name: 'tipoECF',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'razonSocialEmisor',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'rncComprador',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },
          {
            name: 'razonSocialComprador',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'montoTotal',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'totalITBIS',
            type: 'decimal',
            precision: 18,
            scale: 2,
            default: 0,
          },
          {
            name: 'estado',
            type: 'integer',
            default: 3, // EN_PROCESO
          },
          {
            name: 'mensajeEstado',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaEmision',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'fechaRecepcion',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'fechaProcesamiento',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'xmlOriginal',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'xmlRespuesta',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'nombreArchivoOriginal',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'nombreArchivoRespuesta',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'secuenciaUtilizada',
            type: 'boolean',
            default: false,
          },
          {
            name: 'requiereAprobacion',
            type: 'boolean',
            default: false,
          },
          {
            name: 'requiereAcuseRecibo',
            type: 'boolean',
            default: false,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaCreacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'fechaActualizacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices para comprobantes_electronicos
    await queryRunner.createIndex(
      'comprobantes_electronicos',
      new Index('IDX_comprobantes_rnc_encf', ['rncEmisor', 'encf'])
    );
    await queryRunner.createIndex(
      'comprobantes_electronicos',
      new Index('IDX_comprobantes_trackId', ['trackId'])
    );
    await queryRunner.createIndex(
      'comprobantes_electronicos',
      new Index('IDX_comprobantes_estado_fecha', ['estado', 'fechaRecepcion'])
    );

    // Crear tabla de secuencias NCF
    await queryRunner.createTable(
      new Table({
        name: 'secuencias_ncf',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rncEmisor',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'tipoECF',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'secuenciaDesde',
            type: 'varchar',
            length: '13',
            isNullable: false,
          },
          {
            name: 'secuenciaHasta',
            type: 'varchar',
            length: '13',
            isNullable: false,
          },
          {
            name: 'secuenciaActual',
            type: 'varchar',
            length: '13',
            isNullable: false,
          },
          {
            name: 'cantidadAutorizada',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'cantidadUtilizada',
            type: 'integer',
            default: 0,
          },
          {
            name: 'cantidadDisponible',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'fechaAutorizacion',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'fechaVencimiento',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'activa',
            type: 'boolean',
            default: true,
          },
          {
            name: 'anulada',
            type: 'boolean',
            default: false,
          },
          {
            name: 'motivoAnulacion',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'fechaAnulacion',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'montoMaximo',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'observaciones',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaCreacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'fechaActualizacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices para secuencias_ncf
    await queryRunner.createIndex(
      'secuencias_ncf',
      new Index('IDX_secuencias_rnc_tipo', ['rncEmisor', 'tipoECF'])
    );
    await queryRunner.createIndex(
      'secuencias_ncf',
      new Index('IDX_secuencias_rnc_tipo_activa', ['rncEmisor', 'tipoECF', 'activa'])
    );

    // Crear tabla de contribuyentes
    await queryRunner.createTable(
      new Table({
        name: 'contribuyentes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rnc',
            type: 'varchar',
            length: '11',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'razonSocial',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'nombreComercial',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'tipoDocumento',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'direccion',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'telefono',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'activo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'esEmisorElectronico',
            type: 'boolean',
            default: false,
          },
          {
            name: 'esReceptorElectronico',
            type: 'boolean',
            default: false,
          },
          {
            name: 'fechaInicioActividad',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fechaFinActividad',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'fechaUltimaActualizacion',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'observaciones',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaCreacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'fechaActualizacion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices para contribuyentes
    await queryRunner.createIndex(
      'contribuyentes',
      new Index('IDX_contribuyentes_rnc', ['rnc'], { isUnique: true })
    );
    await queryRunner.createIndex(
      'contribuyentes',
      new Index('IDX_contribuyentes_estado_fecha', ['estado', 'fechaActualizacion'])
    );

    // Crear tabla de logs de transacciones
    await queryRunner.createTable(
      new Table({
        name: 'logs_transacciones',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rnc',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },
          {
            name: 'trackId',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'encf',
            type: 'varchar',
            length: '13',
            isNullable: true,
          },
          {
            name: 'tipoOperacion',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'nivel',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'mensaje',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'contexto',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'endpoint',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'metodoHttp',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'codigoRespuesta',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'tiempoRespuesta',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'requestBody',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'responseBody',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'archivoNombre',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'archivoTamaño',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'certificadoSerial',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'exito',
            type: 'boolean',
            default: false,
          },
          {
            name: 'stackTrace',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fechaTransaccion',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices para logs_transacciones
    await queryRunner.createIndex(
      'logs_transacciones',
      new Index('IDX_logs_rnc_fecha', ['rnc', 'fechaTransaccion'])
    );
    await queryRunner.createIndex(
      'logs_transacciones',
      new Index('IDX_logs_trackId', ['trackId'])
    );
    await queryRunner.createIndex(
      'logs_transacciones',
      new Index('IDX_logs_tipo_fecha', ['tipoOperacion', 'fechaTransaccion'])
    );
    await queryRunner.createIndex(
      'logs_transacciones',
      new Index('IDX_logs_nivel_fecha', ['nivel', 'fechaTransaccion'])
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tablas en orden inverso
    await queryRunner.dropTable('logs_transacciones');
    await queryRunner.dropTable('contribuyentes');
    await queryRunner.dropTable('secuencias_ncf');
    await queryRunner.dropTable('comprobantes_electronicos');
    await queryRunner.dropTable('tokens_sesion');
  }
}
