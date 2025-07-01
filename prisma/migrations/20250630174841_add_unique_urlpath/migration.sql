/*
  Warnings:

  - A unique constraint covering the columns `[url_path]` on the table `jogos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `jogos_url_path_key` ON `jogos`(`url_path`);
