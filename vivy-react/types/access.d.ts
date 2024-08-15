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
  | 'system:user:list'
  | 'system:role:list'
  | 'system:menu:list'
  | 'system:dept:list'
  | 'system:post:list'
  | 'system:dict:list'
  | 'system:dict:type'
  | 'system:config:list'
  | 'system:notice:list'
  | 'monitor:online:list'
  | 'monitor:job:list'
  | 'tool:gen:list'
  | 'tool:swagger:list'
  | 'system:loginlog:list'
  | 'system:operlog:list'
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
  | 'system:dict:query'
  | 'system:dict:add'
  | 'system:dict:update'
  | 'system:dict:delete'
  | 'system:config:query'
  | 'system:config:add'
  | 'system:config:update'
  | 'system:config:delete'
  | 'system:notice:query'
  | 'system:notice:add'
  | 'system:notice:update'
  | 'system:notice:delete'
  | 'monitor:operLog:query'
  | 'monitor:operLog:delete'
  | 'monitor:loginLog:query'
  | 'monitor:loginLog:delete'
  | 'monitor:onlineUser:query'
  | 'monitor:onlineUser:logout'
  | 'monitor:job:query'
  | 'monitor:job:add'
  | 'monitor:job:update'
  | 'monitor:job:delete'
