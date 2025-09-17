-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('TO_LISTEN', 'LISTENING', 'LISTENED');

-- CreateTable
CREATE TABLE "public"."Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'TO_LISTEN',
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);
