import { IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 新增
 */
export class CreateMenuDto {
  /** 父菜单ID */
  @IsOptional()
  @IsInt()
  parentId: number = 0

  /** 菜单名称 */
  @IsNotEmpty()
  @MaxLength(50)
  menuName: string

  /** 菜单类型（M目录 C菜单 F按钮） */
  @IsNotEmpty()
  @MaxLength(1)
  menuType: string

  /** 显示顺序 */
  @IsOptional()
  @IsInt()
  menuSort: number

  /** 菜单状态（0正常 1停用） */
  @IsOptional()
  @MaxLength(1)
  status: string

  /** 路由地址 */
  @IsOptional()
  @MaxLength(255)
  path: string

  /** 组件路径 */
  @IsOptional()
  @MaxLength(255)
  component: string

  /** 路由参数 */
  @IsOptional()
  @MaxLength(255)
  query: string

  /** 权限标识 */
  @IsOptional()
  @MaxLength(100)
  permission: string

  /** 菜单图标 */
  @IsOptional()
  @MaxLength(100)
  icon: string

  /** 是否显示（0是 1否） */
  @IsOptional()
  @MaxLength(1)
  isVisible: string

  /** 是否为外链（0是 1否） */
  @IsOptional()
  @MaxLength(1)
  isLink: string

  /** 是否为内嵌（0是 1否） */
  @IsOptional()
  @MaxLength(1)
  isFrame: string

  /** 是否缓存（0是 1否） */
  @IsOptional()
  @MaxLength(1)
  isCache: string

  /** 备注 */
  @IsOptional()
  @MaxLength(500)
  remark: string
}

/**
 * 更新
 */
export class UpdateMenuDto extends CreateMenuDto {
  /** 菜单ID */
  @IsNotEmpty()
  @IsInt()
  menuId: number
}
