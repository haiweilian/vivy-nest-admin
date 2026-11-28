-- 仅初始化 AI 业务表，系统用户、角色、菜单和权限仍由 vivy-system 的 MySQL 管理。

/*
 Navicat Premium Dump SQL

 Source Server         : vivy
 Source Server Type    : PostgreSQL
 Source Server Version : 170011 (170011)
 Source Host           : localhost:5432
 Source Catalog        : vivy_ai
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170011 (170011)
 File Encoding         : 65001

 Date: 28/11/2026 14:33:07
*/

-- ----------------------------
-- Table structure for ai_model
-- ----------------------------
DROP TABLE IF EXISTS "public"."ai_model";
CREATE TABLE "public"."ai_model" (
  "id" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
  "provider" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "vendor" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "model_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "model_code" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "base_url" varchar(2048) COLLATE "pg_catalog"."default" NOT NULL,
  "secret_key" varchar(256) COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(1) COLLATE "pg_catalog"."default" NOT NULL DEFAULT '1'::character varying,
  "create_by" varchar(50) COLLATE "pg_catalog"."default",
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_by" varchar(50) COLLATE "pg_catalog"."default",
  "update_time" timestamp(6) NOT NULL DEFAULT now()
);

ALTER TABLE "public"."ai_model" OWNER TO "postgres";
COMMENT ON COLUMN "public"."ai_model"."id" IS '模型配置ID';
COMMENT ON COLUMN "public"."ai_model"."provider" IS '模型适配器';
COMMENT ON COLUMN "public"."ai_model"."vendor" IS '模型来源';
COMMENT ON COLUMN "public"."ai_model"."model_name" IS '模型显示名称';
COMMENT ON COLUMN "public"."ai_model"."model_code" IS '模型调用标识';
COMMENT ON COLUMN "public"."ai_model"."base_url" IS '模型服务地址';
COMMENT ON COLUMN "public"."ai_model"."secret_key" IS '模型接口密钥';
COMMENT ON COLUMN "public"."ai_model"."status" IS '状态（0启用 1停用）';
COMMENT ON COLUMN "public"."ai_model"."create_by" IS '创建者';
COMMENT ON COLUMN "public"."ai_model"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."ai_model"."update_by" IS '更新者';
COMMENT ON COLUMN "public"."ai_model"."update_time" IS '更新时间';

-- ----------------------------
-- Indexes structure for table ai_model
-- ----------------------------
CREATE INDEX "idx_ai_model_status_provider" ON "public"."ai_model" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "provider" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ai_model
-- ----------------------------
ALTER TABLE "public"."ai_model" ADD CONSTRAINT "ai_model_pkey" PRIMARY KEY ("id");
