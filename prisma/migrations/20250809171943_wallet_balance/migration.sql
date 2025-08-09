-- CreateTable
CREATE TABLE "wallet_with_balance" (
    "walletId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "wallet_with_balance_pkey" PRIMARY KEY ("walletId")
);
