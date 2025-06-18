-- CreateTable
CREATE TABLE "PatientNote" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientNote_doctorId_idx" ON "PatientNote"("doctorId");

-- CreateIndex
CREATE INDEX "PatientNote_patientId_idx" ON "PatientNote"("patientId");

-- AddForeignKey
ALTER TABLE "PatientNote" ADD CONSTRAINT "PatientNote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientNote" ADD CONSTRAINT "PatientNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
