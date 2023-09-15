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

 Date: 08/08/2023 16:07:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
  `dept_id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` bigint DEFAULT NULL COMMENT '父部门ID',
  `dept_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门名称',
  `dept_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
BEGIN;
INSERT INTO `sys_dept` VALUES (100, NULL, '总公司', 0, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (101, 100, '深圳分公司', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (102, 100, '长沙分公司', 2, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (103, 101, '研发部门', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (104, 101, '市场部门', 2, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (105, 101, '测试部门', 3, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (106, 101, '财务部门', 4, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (107, 101, '运维部门', 5, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (108, 102, '市场部门', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dept` VALUES (109, 102, '财务部门', 2, '0', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data` (
  `dict_id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  `dict_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典类型',
  `dict_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典标签',
  `dict_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典键值',
  `dict_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '字典状态（0正常 1停用）',
  `css_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表格回显样式',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`dict_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典数据表';

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_data` VALUES (1, 'sys_user_sex', '男', '0', 1, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (2, 'sys_user_sex', '女', '1', 2, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (3, 'sys_user_sex', '其他', '2', 3, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (4, 'sys_yes_no', '是', '0', 1, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (5, 'sys_yes_no', '否', '1', 2, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (6, 'sys_normal_disable', '正常', '0', 1, '0', NULL, 'success', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (7, 'sys_normal_disable', '停用', '1', 2, '0', NULL, 'danger', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (8, 'sys_success_failure', '成功', '0', 1, '0', NULL, 'success', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (9, 'sys_success_failure', '失败', '1', 2, '0', NULL, 'danger', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (10, 'sys_oper_type', '其它', '0', 99, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (11, 'sys_oper_type', '查询', '1', 1, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (12, 'sys_oper_type', '新增', '2', 2, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (13, 'sys_oper_type', '修改', '3', 3, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (14, 'sys_oper_type', '删除', '4', 4, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (15, 'sys_oper_type', '授权', '5', 5, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (16, 'sys_oper_type', '导出', '6', 6, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (17, 'sys_oper_type', '导入', '7', 7, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (18, 'sys_oper_type', '强退', '8', 8, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (19, 'sys_oper_type', '生成代码', '9', 9, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_data` VALUES (20, 'sys_oper_type', '清空数据', '10', 10, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
  `dict_id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  `dict_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典名称',
  `dict_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典类型',
  `dict_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '字典状态（0正常 1停用）',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`dict_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典类型表';

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_type` VALUES (1, '用户性别', 'sys_user_sex', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_type` VALUES (2, '系统是否', 'sys_yes_no', 2, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_type` VALUES (3, '系统开关', 'sys_normal_disable', 3, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_type` VALUES (4, '系统成败', 'sys_success_failure', 4, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_dict_type` VALUES (5, '操作类型', 'sys_oper_type', 5, '0', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
  `login_id` bigint NOT NULL AUTO_INCREMENT COMMENT '登录ID',
  `login_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户账号',
  `login_type` char(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录类型',
  `login_status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录状态',
  `login_ip` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主机地址',
  `login_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录地点',
  `login_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录信息',
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户代理',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

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
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` bigint DEFAULT NULL COMMENT '父菜单ID',
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
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单权限表';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
-- 一级菜单
INSERT INTO `sys_menu` VALUES (1, NULL, '系统管理', 'M', 1, '0', 'system',                                        NULL, NULL, NULL, 'SettingOutlined', '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (2, NULL, '系统监控', 'M', 2, '0', 'monitor',                                       NULL, NULL, NULL, 'FundOutlined',    '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (3, NULL, '系统工具', 'M', 3, '0', 'tool',                                          NULL, NULL, NULL, 'ToolOutlined',    '0', '0', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (4, NULL, '项目源码', 'M', 4, '0', 'https://github.com/haiweilian/vivy-nest-admin', NULL, NULL, NULL, 'LinkOutlined',    '0', '0', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 二级菜单
INSERT INTO `sys_menu` VALUES (100, 1, '用户管理', 'C', 1,  '0', 'user',       'system/user/index',          NULL, 'system:user:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (101, 1, '角色管理', 'C', 2,  '0', 'role',       'system/role/index',          NULL, 'system:role:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (102, 1, '菜单管理', 'C', 3,  '0', 'menu',       'system/menu/index',          NULL, 'system:menu:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (103, 1, '部门管理', 'C', 4,  '0', 'dept',       'system/dept/index',          NULL, 'system:dept:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (104, 1, '岗位管理', 'C', 5,  '0', 'post',       'system/post/index',          NULL, 'system:post:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (105, 1, '字典管理', 'C', 6,  '0', 'dict',       'system/dict/index',          NULL, 'system:dict:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (106, 1, '字典数据', 'C', 7,  '0', 'dict/:type', 'system/dict/$type/index',    NULL, 'system:dict:list',    NULL, '1', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (107, 1, '参数设置', 'C', 8,  '0', 'config',     'system/config/index',        NULL, 'system:config:list',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (108, 1, '通知公告', 'C', 9,  '0', 'notice',     'system/notice/index',        NULL, 'system:notice:list',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (109, 1, '日志管理', 'M', 10, '0', 'log',         NULL,                        NULL,  NULL,                 NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (110, 2, '在线用户', 'C', 1,  '0', 'online',     'monitor/online/index',       NULL, 'monitor:online:list', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (111, 2, '定时任务', 'C', 2,  '0', 'job',        'monitor/job/index',          NULL, 'monitor:job:list',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (112, 3, '代码生成', 'C', 1,  '0', 'gen',        'tool/gen/index',             NULL, 'tool:gen:list',       NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (113, 3, '系统接口', 'C', 2,  '0', 'swagger',    'tool/swagger/index',         NULL, 'tool:swagger:list',   NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 三级菜单
INSERT INTO `sys_menu` VALUES (500, 109, '登录日志', 'C', 1, '0', 'login',     'system/log/login/index',     NULL, 'system:loginlog:list', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (501, 109, '操作日志', 'C', 2, '0', 'operation', 'system/log/operation/index', NULL, 'system:operlog:list',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 用户管理按钮
INSERT INTO `sys_menu` VALUES (1000, 100, '用户查询', 'F', 1, '0', NULL, NULL, NULL, 'system:user:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1001, 100, '用户新增', 'F', 2, '0', NULL, NULL, NULL, 'system:user:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1002, 100, '用户修改', 'F', 3, '0', NULL, NULL, NULL, 'system:user:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1003, 100, '用户删除', 'F', 4, '0', NULL, NULL, NULL, 'system:user:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1004, 100, '用户导出', 'F', 5, '0', NULL, NULL, NULL, 'system:user:export', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1005, 100, '用户导入', 'F', 6, '0', NULL, NULL, NULL, 'system:user:import', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 角色管理按钮
INSERT INTO `sys_menu` VALUES (1006, 101, '角色查询', 'F', 1, '0', NULL, NULL, NULL, 'system:role:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1007, 101, '角色新增', 'F', 2, '0', NULL, NULL, NULL, 'system:role:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1008, 101, '角色修改', 'F', 3, '0', NULL, NULL, NULL, 'system:role:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1009, 101, '角色删除', 'F', 4, '0', NULL, NULL, NULL, 'system:role:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 菜单管理按钮
INSERT INTO `sys_menu` VALUES (1010, 102, '菜单查询', 'F', 1, '0', NULL, NULL, NULL, 'system:menu:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1011, 102, '菜单新增', 'F', 2, '0', NULL, NULL, NULL, 'system:menu:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1012, 102, '菜单修改', 'F', 3, '0', NULL, NULL, NULL, 'system:menu:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1013, 102, '菜单删除', 'F', 4, '0', NULL, NULL, NULL, 'system:menu:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 部门管理按钮
INSERT INTO `sys_menu` VALUES (1014, 103, '部门查询', 'F', 1, '0', NULL, NULL, NULL, 'system:dept:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1015, 103, '部门新增', 'F', 2, '0', NULL, NULL, NULL, 'system:dept:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1016, 103, '部门修改', 'F', 3, '0', NULL, NULL, NULL, 'system:dept:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1017, 103, '部门删除', 'F', 4, '0', NULL, NULL, NULL, 'system:dept:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 岗位管理按钮
INSERT INTO `sys_menu` VALUES (1018, 104, '岗位查询', 'F', 1, '0', NULL, NULL, NULL, 'system:post:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1019, 104, '岗位新增', 'F', 2, '0', NULL, NULL, NULL, 'system:post:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1020, 104, '岗位修改', 'F', 3, '0', NULL, NULL, NULL, 'system:post:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1021, 104, '岗位删除', 'F', 4, '0', NULL, NULL, NULL, 'system:post:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 字典管理按钮
INSERT INTO `sys_menu` VALUES (1022, 105, '字典查询', 'F', 1, '0', NULL, NULL, NULL, 'system:dict:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1023, 105, '字典新增', 'F', 2, '0', NULL, NULL, NULL, 'system:dict:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1024, 105, '字典修改', 'F', 3, '0', NULL, NULL, NULL, 'system:dict:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1025, 105, '字典删除', 'F', 4, '0', NULL, NULL, NULL, 'system:dict:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 参数设置按钮
INSERT INTO `sys_menu` VALUES (1026, 107, '参数查询', 'F', 1, '0', NULL, NULL, NULL, 'system:config:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1027, 107, '参数新增', 'F', 2, '0', NULL, NULL, NULL, 'system:config:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1028, 107, '参数修改', 'F', 3, '0', NULL, NULL, NULL, 'system:config:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1029, 107, '参数删除', 'F', 4, '0', NULL, NULL, NULL, 'system:config:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 通知公告按钮
INSERT INTO `sys_menu` VALUES (1030, 108, '公告查询', 'F', 1, '0', NULL, NULL, NULL, 'system:notice:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1031, 108, '公告新增', 'F', 2, '0', NULL, NULL, NULL, 'system:notice:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1032, 108, '公告修改', 'F', 3, '0', NULL, NULL, NULL, 'system:notice:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1033, 108, '公告删除', 'F', 4, '0', NULL, NULL, NULL, 'system:notice:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 操作日志按钮
INSERT INTO `sys_menu` VALUES (1034, 500, '操作日志查询', 'F', 1, '0', NULL, NULL, NULL, 'system:operlog:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1035, 500, '操作日志删除', 'F', 2, '0', NULL, NULL, NULL, 'system:operlog:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 登录日志按钮
INSERT INTO `sys_menu` VALUES (1036, 501, '登录日志查询', 'F', 1, '0', NULL, NULL, NULL, 'system:loginlog:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1037, 501, '登录日志删除', 'F', 2, '0', NULL, NULL, NULL, 'system:loginlog:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 在线用户按钮
INSERT INTO `sys_menu` VALUES (1038, 110, '在线查询', 'F', 1, '0', NULL, NULL, NULL, 'monitor:online:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1039, 110, '在线强退', 'F', 2, '0', NULL, NULL, NULL, 'monitor:online:logout', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());

-- 定时任务按钮
INSERT INTO `sys_menu` VALUES (1040, 111, '任务查询', 'F', 1, '0', NULL, NULL, NULL, 'monitor:job:query',  NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1041, 111, '任务新增', 'F', 2, '0', NULL, NULL, NULL, 'monitor:job:add',    NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1042, 111, '任务修改', 'F', 3, '0', NULL, NULL, NULL, 'monitor:job:update', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_menu` VALUES (1043, 111, '任务删除', 'F', 4, '0', NULL, NULL, NULL, 'monitor:job:delete', NULL, '0', '1', '1', '1', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log` (
  `oper_id` bigint NOT NULL AUTO_INCREMENT COMMENT '操作ID',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模块标题',
  `oper_type` char(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型',
  `oper_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作人员',
  `oper_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '方法名称',
  `oper_ip` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主机地址',
  `oper_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作地点',
  `oper_status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作状态',
  `request_url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '请求URL',
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '请求方式',
  `request_param` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求参数',
  `request_result` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求返回结果',
  `request_errmsg` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求错误消息',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`oper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

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
  `post_id` bigint NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `post_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位名称',
  `post_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位编码',
  `post_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '岗位状态（0正常 1停用）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位信息表';

-- ----------------------------
-- Records of sys_post
-- ----------------------------
BEGIN;
INSERT INTO `sys_post` VALUES (1, '董事长', 'CEO', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_post` VALUES (2, '项目经理', 'SE', 2, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_post` VALUES (3, '人力资源', 'HR', 3, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_post` VALUES (4, '普通员工', 'USER', 4, '0', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `role_id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色编码',
  `role_sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色信息表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'admin', 1, '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_role` VALUES (2, '普通角色', 'common', 2, '0', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept` (
  `role_id` bigint NOT NULL COMMENT '用户ID',
  `dept_id` bigint NOT NULL COMMENT '部门ID',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`role_id`,`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色和部门关联表 角色1-N部门';

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_dept` VALUES (2, 100, sysdate(), sysdate());
INSERT INTO `sys_role_dept` VALUES (2, 101, sysdate(), sysdate());
INSERT INTO `sys_role_dept` VALUES (2, 105, sysdate(), sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色和菜单关联表 角色1-N菜单';

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` VALUES (2, 1, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 4, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 100, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 101, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 102, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 103, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 104, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 105, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 106, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 107, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 108, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 109, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 500, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 501, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1000, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1001, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1002, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1003, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1004, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1005, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1006, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1007, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1008, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1009, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1010, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1011, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1012, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1013, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1014, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1015, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1016, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1017, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1018, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1019, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1020, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1021, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1022, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1023, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1024, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1025, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1026, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1027, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1028, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1029, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1030, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1031, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1032, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1033, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1034, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1035, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1036, sysdate(), sysdate());
INSERT INTO `sys_role_menu` VALUES (2, 1037, sysdate(), sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` bigint DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户账号',
  `nick_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `user_type` char(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户邮箱',
  `phonenumber` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `sex` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '2' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '用户状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IDX_9d0ba62d30b6362c5651c6c261` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` VALUES (1, NULL, 'admin', '管理员', '00', 'admin@vivy.com', '18688888888', '0', 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg', '$2b$10$r1Eul7Lc388k9rphYYt9uO0k1LWw.3ArgbX0VrhjjG1h4lDjBq9tq', '0', '0', 'admin', sysdate(), 'admin', sysdate());
INSERT INTO `sys_user` VALUES (2, 105, 'test', '测试员', '00', 'test@vivy.com', '18666666666', '0', 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg', '$2b$10$r1Eul7Lc388k9rphYYt9uO0k1LWw.3ArgbX0VrhjjG1h4lDjBq9tq', '0', '0', 'admin', sysdate(), 'admin', sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `post_id` bigint NOT NULL COMMENT '岗位ID',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户与岗位关联表 用户1-N岗位';

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_post` VALUES (1, 1, sysdate(), sysdate());
INSERT INTO `sys_user_post` VALUES (2, 2, sysdate(), sysdate());
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户和角色关联表 用户1-N角色';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_role` VALUES (1, 1, sysdate(), sysdate());
INSERT INTO `sys_user_role` VALUES (2, 2, sysdate(), sysdate());
COMMIT;

-- ----------------------------
-- Table structure for gen_table
-- ----------------------------
DROP TABLE IF EXISTS `gen_table`;
CREATE TABLE `gen_table` (
  `table_id` int NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '表名称',
  `table_comment` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '表描述',
  `sub_table_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '关联子表的表名',
  `sub_table_fk_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '子表关联的外键名',
  `class_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '实体类名称',
  `template_category` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '生成模板分类',
  `business_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '生成业务名',
  `function_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '生成功能名',
  `function_author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '生成功能作者',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`table_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代码生成业务表';

-- ----------------------------
-- Records of gen_table
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for gen_table_column
-- ----------------------------
DROP TABLE IF EXISTS `gen_table_column`;
CREATE TABLE `gen_table_column` (
  `column_id` int NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_id` int NOT NULL COMMENT '归属表编号',
  `column_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '列名称',
  `column_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '列类型',
  `column_sort` int NOT NULL DEFAULT '0' COMMENT '列顺序',
  `column_comment` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '列描述',
  `is_pk` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否主键（0是 1否）',
  `is_increment` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否自增（0是 1否）',
  `is_required` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否必填（0是 1否）',
  `is_insert` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否为插入字段（0是 1否）',
  `is_edit` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否编辑字段（0是 1否）',
  `is_list` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否列表字段（0是 1否）',
  `is_query` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '是否查询字段（0是 1否）',
  `field_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '属性名称',
  `tslang_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'TS类型',
  `javalang_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'JAVA类型',
  `query_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '查询方式',
  `html_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '显示类型',
  `dict_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '字典类型',
  `create_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建者',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新者',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`column_id`),
  KEY `table_fk` (`table_id`),
  CONSTRAINT `table_fk` FOREIGN KEY (`table_id`) REFERENCES `gen_table` (`table_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代码生成业务表字段';

-- ----------------------------
-- Records of gen_table
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
