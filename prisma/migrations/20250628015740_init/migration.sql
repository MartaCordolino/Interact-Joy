-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `perfil` ENUM('autista', 'responsavel', 'especialista') NOT NULL,
    `cpf` VARCHAR(14) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idade` INTEGER NULL,
    `faixa_etaria` ENUM('faixa_7_9', 'faixa_10_12') NULL,
    `nivel_suporte` ENUM('leve', 'moderado', 'intenso') NULL,
    `responsavel_id` INTEGER NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialistas_criancas` (
    `especialista_id` INTEGER NOT NULL,
    `crianca_id` INTEGER NOT NULL,

    PRIMARY KEY (`especialista_id`, `crianca_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jogos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `categoria` VARCHAR(50) NULL,
    `url_path` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conquistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_crianca` INTEGER NOT NULL,
    `id_jogo` INTEGER NOT NULL,
    `tipo_conquista` ENUM('trofeu', 'medalha') NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `data_conquista` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `conquistas_id_crianca_data_conquista_idx`(`id_crianca`, `data_conquista`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `progresso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_crianca` INTEGER NOT NULL,
    `id_jogo` INTEGER NOT NULL,
    `porcentagem` INTEGER NOT NULL DEFAULT 0,
    `tentativas` INTEGER NOT NULL DEFAULT 0,
    `ultimo_acesso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `progresso_id_crianca_id_jogo_idx`(`id_crianca`, `id_jogo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planos_assinatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `tipo` ENUM('mensal', 'anual') NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fim` DATETIME(3) NULL,

    UNIQUE INDEX `planos_assinatura_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_responsavel_id_fkey` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialistas_criancas` ADD CONSTRAINT `especialistas_criancas_especialista_id_fkey` FOREIGN KEY (`especialista_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialistas_criancas` ADD CONSTRAINT `especialistas_criancas_crianca_id_fkey` FOREIGN KEY (`crianca_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conquistas` ADD CONSTRAINT `conquistas_id_crianca_fkey` FOREIGN KEY (`id_crianca`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conquistas` ADD CONSTRAINT `conquistas_id_jogo_fkey` FOREIGN KEY (`id_jogo`) REFERENCES `jogos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progresso` ADD CONSTRAINT `progresso_id_crianca_fkey` FOREIGN KEY (`id_crianca`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progresso` ADD CONSTRAINT `progresso_id_jogo_fkey` FOREIGN KEY (`id_jogo`) REFERENCES `jogos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planos_assinatura` ADD CONSTRAINT `planos_assinatura_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
