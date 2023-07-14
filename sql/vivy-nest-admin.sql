/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : vivy-nest-admin

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 13/07/2023 16:53:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
  `dept_id` int NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` int NOT NULL COMMENT '父部门ID',
  `dept_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门名称',
  `dept_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
BEGIN;
INSERT INTO `sys_dept` VALUES (100, 0, '总公司', 0, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (101, 100, '深圳分公司', 1, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (102, 100, '长沙分公司', 2, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (103, 101, '研发部门', 1, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (104, 101, '市场部门', 2, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (105, 101, '测试部门', 3, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (106, 101, '财务部门', 4, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (107, 101, '运维部门', 5, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (108, 102, '市场部门', 1, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
INSERT INTO `sys_dept` VALUES (109, 102, '财务部门', 2, '0', '0', 'admin', '2023-05-22 22:06:31.000000', 'admin', '2023-05-22 22:06:31.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data` (
  `dict_id` int NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  `dict_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典类型',
  `dict_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典标签',
  `dict_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典键值',
  `dict_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '字典状态（0正常 1停用）',
  `css_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表格回显样式',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_data` VALUES (1, 'sys_user_sex', '男', '0', 1, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (2, 'sys_user_sex', '女', '1', 2, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (3, 'sys_user_sex', '其他', '2', 3, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (4, 'sys_yes_no', '是', '0', 1, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (5, 'sys_yes_no', '否', '1', 2, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (6, 'sys_normal_disable', '正常', '0', 1, '0', NULL, 'success', '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-27 19:22:44.497558', NULL);
INSERT INTO `sys_dict_data` VALUES (7, 'sys_normal_disable', '停用', '1', 2, '0', NULL, 'danger', '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-27 19:23:03.405119', NULL);
INSERT INTO `sys_dict_data` VALUES (8, 'sys_oper_status', '成功', '0', 1, '0', NULL, 'success', '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-27 19:22:47.330950', NULL);
INSERT INTO `sys_dict_data` VALUES (9, 'sys_oper_status', '失败', '1', 2, '0', NULL, 'danger', '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-27 19:23:01.279594', NULL);
INSERT INTO `sys_dict_data` VALUES (10, 'sys_oper_type', '其它', '0', 99, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (11, 'sys_oper_type', '查询', '1', 1, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (12, 'sys_oper_type', '新增', '2', 2, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (13, 'sys_oper_type', '修改', '3', 3, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (14, 'sys_oper_type', '删除', '4', 4, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (15, 'sys_oper_type', '授权', '5', 5, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (16, 'sys_oper_type', '导出', '6', 6, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (17, 'sys_oper_type', '导入', '7', 7, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (18, 'sys_oper_type', '强退', '8', 8, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (19, 'sys_oper_type', '生成代码', '9', 9, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
INSERT INTO `sys_dict_data` VALUES (20, 'sys_oper_type', '清空数据', '10', 10, '0', NULL, NULL, '0', 'admin', '2023-05-22 22:27:48.000000', 'admin', '2023-05-22 22:27:48.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
  `dict_id` int NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  `dict_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典名称',
  `dict_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典类型',
  `dict_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '字典状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_type` VALUES (1, '用户性别', 'sys_user_sex', 1, '0', '0', 'admin', '2023-05-22 22:26:19.000000', 'admin', '2023-05-22 22:26:19.000000', NULL);
INSERT INTO `sys_dict_type` VALUES (2, '系统是否', 'sys_yes_no', 2, '0', '0', 'admin', '2023-05-22 22:26:19.000000', 'admin', '2023-05-22 22:26:19.000000', NULL);
INSERT INTO `sys_dict_type` VALUES (3, '系统开关', 'sys_normal_disable', 3, '0', '0', 'admin', '2023-05-22 22:26:19.000000', 'admin', '2023-05-22 22:26:19.000000', NULL);
INSERT INTO `sys_dict_type` VALUES (4, '操作状态', 'sys_oper_status', 4, '0', '0', 'admin', '2023-05-22 22:26:19.000000', 'admin', '2023-05-22 22:26:19.000000', NULL);
INSERT INTO `sys_dict_type` VALUES (5, '操作类型', 'sys_oper_type', 5, '0', '0', 'admin', '2023-05-22 22:26:19.000000', 'admin', '2023-05-22 22:26:19.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
  `login_id` int NOT NULL AUTO_INCREMENT COMMENT '登录ID',
  `login_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户账号',
  `login_type` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '登录类型(enum LoginType)',
  `login_status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '登录状态(enum OperStatus)',
  `login_ip` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '主机地址',
  `login_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '登录地点',
  `login_message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '登录信息',
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户代理',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_login_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `menu_id` int NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` int NOT NULL COMMENT '父菜单ID',
  `menu_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `menu_type` char(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `menu_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '组件路径',
  `query` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由参数',
  `permission` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单图标',
  `is_visible` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '是否显示（0是 1否）',
  `is_link` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '是否为外链（0是 1否）',
  `is_frame` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '是否为内嵌（0是 1否）',
  `is_cache` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '是否缓存（0是 1否）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1041 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 'M', 1, '0', 'system', NULL, NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (100, 1, '用户管理', 'C', 1, '0', 'user', 'system/user/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (101, 1, '角色管理', 'C', 2, '0', 'role', 'system/role/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (102, 1, '菜单管理', 'C', 3, '0', 'menu', 'system/menu/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (103, 1, '部门管理', 'C', 4, '0', 'dept', 'system/dept/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (104, 1, '岗位管理', 'C', 5, '0', 'post', 'system/post/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (105, 1, '字典管理', 'C', 6, '0', 'dict', 'system/dict/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (106, 1, '参数设置', 'C', 7, '0', 'config', 'system/config/index', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (107, 1, '日志管理', 'M', 8, '0', 'log', NULL, NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (500, 107, '登录日志', 'C', 1, '0', 'login', 'system/log/login', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (501, 107, '操作日志', 'C', 2, '0', 'operation', 'system/log/operation', NULL, NULL, NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1000, 100, '用户查询', 'F', 1, '0', NULL, NULL, NULL, 'system:user:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1001, 100, '用户新增', 'F', 2, '0', NULL, NULL, NULL, 'system:user:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1002, 100, '用户修改', 'F', 3, '0', NULL, NULL, NULL, 'system:user:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1003, 100, '用户删除', 'F', 4, '0', NULL, NULL, NULL, 'system:user:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1004, 100, '用户导出', 'F', 5, '0', NULL, NULL, NULL, 'system:user:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1005, 100, '用户导入', 'F', 6, '0', NULL, NULL, NULL, 'system:user:import', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1006, 100, '重置密码', 'F', 7, '0', NULL, NULL, NULL, 'system:user:resetPwd', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1007, 101, '角色查询', 'F', 1, '0', NULL, NULL, NULL, 'system:role:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1008, 101, '角色新增', 'F', 2, '0', NULL, NULL, NULL, 'system:role:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1009, 101, '角色修改', 'F', 3, '0', NULL, NULL, NULL, 'system:role:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1010, 101, '角色删除', 'F', 4, '0', NULL, NULL, NULL, 'system:role:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1011, 101, '角色导出', 'F', 5, '0', NULL, NULL, NULL, 'system:role:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1012, 102, '菜单查询', 'F', 1, '0', NULL, NULL, NULL, 'system:menu:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1013, 102, '菜单新增', 'F', 2, '0', NULL, NULL, NULL, 'system:menu:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1014, 102, '菜单修改', 'F', 3, '0', NULL, NULL, NULL, 'system:menu:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1015, 102, '菜单删除', 'F', 4, '0', NULL, NULL, NULL, 'system:menu:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1016, 103, '部门查询', 'F', 1, '0', NULL, NULL, NULL, 'system:dept:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1017, 103, '部门新增', 'F', 2, '0', NULL, NULL, NULL, 'system:dept:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1018, 103, '部门修改', 'F', 3, '0', NULL, NULL, NULL, 'system:dept:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1019, 103, '部门删除', 'F', 4, '0', NULL, NULL, NULL, 'system:dept:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1020, 104, '岗位查询', 'F', 1, '0', NULL, NULL, NULL, 'system:post:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1021, 104, '岗位新增', 'F', 2, '0', NULL, NULL, NULL, 'system:post:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1022, 104, '岗位修改', 'F', 3, '0', NULL, NULL, NULL, 'system:post:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1023, 104, '岗位删除', 'F', 4, '0', NULL, NULL, NULL, 'system:post:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1024, 104, '岗位导出', 'F', 5, '0', NULL, NULL, NULL, 'system:post:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1025, 105, '字典查询', 'F', 1, '0', NULL, NULL, NULL, 'system:dict:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1026, 105, '字典新增', 'F', 2, '0', NULL, NULL, NULL, 'system:dict:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1027, 105, '字典修改', 'F', 3, '0', NULL, NULL, NULL, 'system:dict:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1028, 105, '字典删除', 'F', 4, '0', NULL, NULL, NULL, 'system:dict:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1029, 105, '字典导出', 'F', 5, '0', NULL, NULL, NULL, 'system:dict:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1030, 106, '参数查询', 'F', 1, '0', NULL, NULL, NULL, 'system:config:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1031, 106, '参数新增', 'F', 2, '0', NULL, NULL, NULL, 'system:config:add', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1032, 106, '参数修改', 'F', 3, '0', NULL, NULL, NULL, 'system:config:update', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1033, 106, '参数删除', 'F', 4, '0', NULL, NULL, NULL, 'system:config:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1034, 106, '参数导出', 'F', 5, '0', NULL, NULL, NULL, 'system:config:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1035, 500, '操作日志查询', 'F', 1, '0', NULL, NULL, NULL, 'system:operlog:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1036, 500, '操作日志删除', 'F', 2, '0', NULL, NULL, NULL, 'system:operlog:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1037, 500, '操作日志导出', 'F', 3, '0', NULL, NULL, NULL, 'system:operlog:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1038, 501, '登录日志查询', 'F', 1, '0', NULL, NULL, NULL, 'system:loginlog:query', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1039, 501, '登录日志删除', 'F', 2, '0', NULL, NULL, NULL, 'system:loginlog:delete', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
INSERT INTO `sys_menu` VALUES (1040, 501, '登录日志导出', 'F', 3, '0', NULL, NULL, NULL, 'system:loginlog:export', NULL, '0', '1', '1', '1', '0', 'admin', '2023-05-22 20:48:33.000000', 'admin', '2023-06-11 15:49:26.102926', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log` (
  `oper_id` int NOT NULL AUTO_INCREMENT COMMENT '操作ID',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '模块标题',
  `oper_type` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '操作类型(enum OperType)',
  `oper_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作人员',
  `oper_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '方法名称',
  `oper_ip` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '主机地址',
  `oper_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '操作地点',
  `oper_status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '操作状态(enum OperStatus)',
  `request_url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '请求URL',
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '请求方式',
  `request_param` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '请求参数',
  `request_result` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '请求返回结果',
  `request_errmsg` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '请求错误消息',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`oper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_oper_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post` (
  `post_id` int NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `post_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位名称',
  `post_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位编码',
  `post_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '岗位状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
BEGIN;
INSERT INTO `sys_post` VALUES (1, '董事长', 'CEO', 1, '0', '0', 'admin', '2023-05-22 22:14:32.000000', 'admin', '2023-05-22 22:14:32.000000', NULL);
INSERT INTO `sys_post` VALUES (2, '项目经理', 'SE', 2, '0', '0', 'admin', '2023-05-22 22:14:32.000000', 'admin', '2023-05-22 22:14:32.000000', NULL);
INSERT INTO `sys_post` VALUES (3, '人力资源', 'HR', 3, '0', '0', 'admin', '2023-05-22 22:14:32.000000', 'admin', '2023-05-22 22:14:32.000000', NULL);
INSERT INTO `sys_post` VALUES (4, '普通员工', 'USER', 4, '0', '0', 'admin', '2023-05-22 22:14:32.000000', 'admin', '2023-05-22 22:14:32.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `role_id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色编码',
  `role_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'admin', 1, '0', '0', 'admin', '2023-05-22 22:18:41.000000', 'admin', '2023-05-22 22:18:41.000000', NULL);
INSERT INTO `sys_role` VALUES (2, '普通角色', 'common', 2, '0', '0', 'admin', '2023-05-22 22:18:41.000000', 'admin', '2023-05-22 22:18:41.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept` (
  `role_id` int NOT NULL COMMENT '用户ID',
  `dept_id` int NOT NULL COMMENT '部门ID',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`role_id`,`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_dept` VALUES (2, 100, '2023-05-22 22:30:47.000000', '2023-05-22 22:30:47.000000');
INSERT INTO `sys_role_dept` VALUES (2, 101, '2023-05-22 22:30:47.000000', '2023-05-22 22:30:47.000000');
INSERT INTO `sys_role_dept` VALUES (2, 105, '2023-05-22 22:30:47.000000', '2023-05-22 22:30:47.000000');
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` int NOT NULL COMMENT '菜单ID',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` VALUES (2, 1, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 100, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 101, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 102, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 103, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 104, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 105, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 106, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 107, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 500, '2023-05-22 20:53:59.000000', '2023-05-22 20:53:59.000000');
INSERT INTO `sys_role_menu` VALUES (2, 501, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1000, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1001, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1002, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1003, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1004, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1005, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1006, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1007, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1008, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1009, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1010, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1011, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1012, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1013, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1014, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1015, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1016, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1017, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1018, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1019, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1020, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1021, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1022, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1023, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1024, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1025, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1026, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1027, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1028, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1029, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1030, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1031, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1032, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1033, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1034, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1035, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1036, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1037, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1038, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1039, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
INSERT INTO `sys_role_menu` VALUES (2, 1040, '2023-05-22 20:54:00.000000', '2023-05-22 20:54:00.000000');
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` int DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户账号',
  `nick_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `user_type` char(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户邮箱',
  `phonenumber` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `sex` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '用户状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IDX_9d0ba62d30b6362c5651c6c261` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` VALUES (1, 103, 'admin', '管理员', '00', 'admin@vivy.com', '18688888888', '0', 'https://avatars.githubusercontent.com/u/130282596?s=200&v=4', '$2b$10$r1Eul7Lc388k9rphYYt9uO0k1LWw.3ArgbX0VrhjjG1h4lDjBq9tq', '0', '0', 'admin', '2023-05-22 22:13:10.000000', 'admin', '2023-05-22 22:13:10.000000', NULL);
INSERT INTO `sys_user` VALUES (2, 105, 'test', '测试员', '00', 'test@vivy.com', '18666666666', '0', 'https://avatars.githubusercontent.com/u/130282596?s=200&v=4', '$2b$10$r1Eul7Lc388k9rphYYt9uO0k1LWw.3ArgbX0VrhjjG1h4lDjBq9tq', '0', '0', 'admin', '2023-05-22 22:13:10.000000', 'admin', '2023-05-22 22:13:10.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post` (
  `user_id` int NOT NULL COMMENT '用户ID',
  `post_id` int NOT NULL COMMENT '岗位ID',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_post` VALUES (1, 1, '2023-05-22 22:22:02.000000', '2023-05-22 22:22:02.000000');
INSERT INTO `sys_user_post` VALUES (2, 2, '2023-05-22 22:22:02.000000', '2023-05-22 22:22:02.000000');
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` int NOT NULL COMMENT '用户ID',
  `role_id` int NOT NULL COMMENT '角色ID',
  `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_role` VALUES (1, 1, '2023-05-22 22:22:02.000000', '2023-05-22 22:22:02.000000');
INSERT INTO `sys_user_role` VALUES (2, 2, '2023-05-22 22:22:02.000000', '2023-05-29 20:17:14.973502');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
