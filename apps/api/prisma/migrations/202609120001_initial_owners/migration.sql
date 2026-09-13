CREATE TABLE "Owner" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "referralCode" TEXT NOT NULL,
  "referredById" TEXT,
  "phoneVerifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Owner_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Owner_no_self_referral" CHECK ("referredById" IS NULL OR "referredById" <> "id")
);
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");
CREATE UNIQUE INDEX "Owner_phone_key" ON "Owner"("phone");
CREATE UNIQUE INDEX "Owner_referralCode_key" ON "Owner"("referralCode");
CREATE INDEX "Owner_referredById_idx" ON "Owner"("referredById");
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
