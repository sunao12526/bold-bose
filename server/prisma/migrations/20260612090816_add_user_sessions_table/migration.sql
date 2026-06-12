-- CreateTable
CREATE TABLE "system_user_sessions" (
    "id" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "ip" VARCHAR(50) NOT NULL,
    "user_agent" VARCHAR(500),
    "browser" VARCHAR(50),
    "os" VARCHAR(50),
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_sessions_token_key" ON "system_user_sessions"("token");
