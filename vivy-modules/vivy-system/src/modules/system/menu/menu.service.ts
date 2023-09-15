import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeUtils, BaseStatusEnums, MenuConstants, IdentityUtils } from '@vivy-common/core'
import { Repository } from 'typeorm'
import { SysRoleMenu } from '@/modules/system/role/entities/sys-role-menu.entity'
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto'
import { SysMenu } from './entities/sys-menu.entity'
import { MenuTreeVo, RouterTreeVo } from './vo/menu.vo'

/**
 * 菜单管理
 * @author vivy
 */
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenu)
    private menuRepository: Repository<SysMenu>,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>
  ) {}

  /**
   * 查询菜单树结构
   */
  async tree(): Promise<MenuTreeVo[]> {
    const list = await this.menuRepository.find({
      order: {
        menuSort: 'ASC',
      },
    })
    return TreeUtils.listToTree<MenuTreeVo>(list, {
      id: 'menuId',
      pid: 'parentId',
    })
  }

  /**
   * 添加菜单
   * @param menu 菜单信息
   */
  async add(menu: CreateMenuDto): Promise<void> {
    await this.menuRepository.insert(menu)
  }

  /**
   * 更新菜单
   * @param menu 菜单信息
   */
  async update(menu: UpdateMenuDto): Promise<void> {
    await this.menuRepository.update(menu.menuId, menu)
  }

  /**
   * 删除菜单
   * @param menuId 菜单ID
   */
  async delete(menuId: number): Promise<void> {
    await this.menuRepository.delete(menuId)
  }

  /**
   * 菜单详情
   * @param menuId 菜单ID
   * @returns 菜单详情
   */
  async info(menuId: number): Promise<SysMenu> {
    return this.menuRepository.findOneBy({ menuId })
  }

  /**
   * 是否存在子节点
   * @param menuId 菜单ID
   * @return true 存在 / false 不存在
   */
  async checkMenuExistChild(deptId: number): Promise<boolean> {
    const count = await this.menuRepository.countBy({ parentId: deptId })
    return count > 0
  }

  /**
   * 检查是否存在角色
   * @param menuId 菜单ID
   * @return true 存在 / false 不存在
   */
  async checkMenuExistRole(menuId: number): Promise<boolean> {
    const count = await this.roleMenuRepository.countBy({ menuId })
    return count > 0
  }

  /**
   * 查询菜单选项树
   * @returns 菜单选项树
   */
  async optionTree(): Promise<MenuTreeVo[]> {
    const list = await this.menuRepository.find({
      select: ['menuId', 'menuName', 'parentId'],
      order: {
        menuSort: 'ASC',
      },
      where: {
        status: BaseStatusEnums.NORMAL,
      },
    })
    return TreeUtils.listToTree<MenuTreeVo>(list, {
      id: 'menuId',
      pid: 'parentId',
    })
  }

  /**
   * 根据用户ID查询菜单列表
   * @param userId 用户ID
   * @returns 用户菜单列表
   */
  async selectMenuByUserId(userId: number): Promise<SysMenu[]> {
    return this.menuRepository
      .createQueryBuilder('m')
      .leftJoin('sys_role_menu', 'rm', 'm.menu_id = rm.menu_id')
      .leftJoin('sys_user_role', 'ur', 'rm.role_id = ur.role_id')
      .leftJoin('sys_role', 'r', 'ur.role_id = r.role_id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('m.status = :status', { status: BaseStatusEnums.NORMAL })
      .andWhere('r.status = :status', { status: BaseStatusEnums.NORMAL })
      .distinct()
      .getMany()
  }

  /**
   * 查询用户菜单信息
   * @param userId 用户ID
   * @returns 用户菜单信息
   */
  async selectUserMenuTree(userId: number): Promise<MenuTreeVo[]> {
    let menus: SysMenu[] = []

    if (IdentityUtils.isAdmin(userId)) {
      menus = await this.menuRepository
        .createQueryBuilder('m')
        .where('m.status = :status', { status: BaseStatusEnums.NORMAL })
        .andWhere('m.menu_type IN (:...menuType)', { menuType: [MenuConstants.TYPE_DIR, MenuConstants.TYPE_MENU] })
        .orderBy('m.menu_sort', 'ASC')
        .getMany()
    } else {
      menus = await this.menuRepository
        .createQueryBuilder('m')
        .leftJoin('sys_role_menu', 'rm', 'm.menu_id = rm.menu_id')
        .leftJoin('sys_user_role', 'ur', 'rm.role_id = ur.role_id')
        .leftJoin('sys_role', 'r', 'ur.role_id = r.role_id')
        .where('ur.user_id = :userId', { userId })
        .andWhere('m.status = :status', { status: BaseStatusEnums.NORMAL })
        .andWhere('r.status = :status', { status: BaseStatusEnums.NORMAL })
        .andWhere('m.menu_type IN (:...menuType)', { menuType: [MenuConstants.TYPE_DIR, MenuConstants.TYPE_MENU] })
        .orderBy('m.menu_sort', 'ASC')
        .distinct()
        .getMany()
    }

    return TreeUtils.listToTree<MenuTreeVo>(menus, {
      id: 'menuId',
      pid: 'parentId',
    })
  }

  /**
   * 构建前端 UmiMax 所需要的路由
   * @param 菜单列表
   * @returns 路由列表
   */
  buildUmiMaxRouters(menus: MenuTreeVo[]): RouterTreeVo[] {
    const routers: RouterTreeVo[] = []

    for (const menu of menus) {
      const router = new RouterTreeVo()
      router.name = menu.menuName
      router.path = this.getRouterPath(menu)
      router.icon = menu.icon
      router.component = menu.component
      router.locale = false
      router.hideInMenu = menu.isVisible === BaseStatusEnums.ABNORMAL
      router.children = menu.children && this.buildUmiMaxRouters(menu.children)
      routers.push(router)
    }

    return routers
  }

  /**
   * 获取路由路径
   * @param menu 菜单信息
   */
  private getRouterPath(menu: MenuTreeVo): string {
    if (
      menu.parentId === null &&
      menu.isLink === BaseStatusEnums.ABNORMAL &&
      menu.isFrame === BaseStatusEnums.ABNORMAL
    ) {
      return `/${menu.path}`
    } else {
      return menu.path
    }
  }
}
