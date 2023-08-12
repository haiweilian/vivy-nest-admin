/**
 * 角色权限
 * @access 从角色表生成
 */
declare type AccessRole = 'admin' | 'common'

/**
 * 权限码权限
 * @access 从菜单表生成
 */
declare type AccessPermission =
  | 'system:user:query'
  | 'system:user:add'
  | 'system:user:update'
  | 'system:user:delete'
  | 'system:user:export'
  | 'system:user:import'
  | 'system:role:query'
  | 'system:role:add'
  | 'system:role:update'
  | 'system:role:delete'
  | 'system:role:export'
  | 'system:menu:query'
  | 'system:menu:add'
  | 'system:menu:update'
  | 'system:menu:delete'
  | 'system:dept:query'
  | 'system:dept:add'
  | 'system:dept:update'
  | 'system:dept:delete'
  | 'system:post:query'
  | 'system:post:add'
  | 'system:post:update'
  | 'system:post:delete'
  | 'system:post:export'
  | 'system:dict:query'
  | 'system:dict:add'
  | 'system:dict:update'
  | 'system:dict:delete'
  | 'system:dict:export'
  | 'system:config:query'
  | 'system:config:add'
  | 'system:config:update'
  | 'system:config:delete'
  | 'system:config:export'
  | 'system:operlog:query'
  | 'system:operlog:delete'
  | 'system:operlog:export'
  | 'system:loginlog:query'
  | 'system:loginlog:delete'
  | 'system:loginlog:export'
