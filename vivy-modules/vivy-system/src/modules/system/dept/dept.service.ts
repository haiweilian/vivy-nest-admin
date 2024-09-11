import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeUtils, BaseStatusEnum, SecurityContext, IdentityUtils, ServiceException } from '@vivy-common/core'
import { DataScope, DataScopeService } from '@vivy-common/datascope'
import { isEmpty } from 'class-validator'
import { Repository } from 'typeorm'
import { SysUser } from '@/modules/system/user/entities/sys-user.entity'
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto'
import { SysDept } from './entities/sys-dept.entity'
import { DeptTreeVo } from './vo/dept.vo'

/**
 * 部门管理
 * @author vivy
 */
@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDept)
    private deptRepository: Repository<SysDept>,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,

    private securityContext: SecurityContext,
    private dataScopeService: DataScopeService
  ) {}

  /**
   * 数据范围部门列表查询构造
   */
  @DataScope({ deptAlias: 'd' })
  private dsDeptQueryBuilder() {
    const dsSql = this.dataScopeService.sql(this.dsDeptQueryBuilder)
    return this.deptRepository.createQueryBuilder('d').andWhere(dsSql).orderBy('d.deptSort', 'ASC')
  }

  /**
   * 查询部门树结构
   */
  async tree(): Promise<DeptTreeVo[]> {
    const list = await this.dsDeptQueryBuilder().getMany()
    return TreeUtils.listToTree<DeptTreeVo>(list, {
      id: 'deptId',
      pid: 'parentId',
    })
  }

  /**
   * 添加部门
   * @param dept 部门信息
   */
  async add(dept: CreateDeptDto): Promise<void> {
    dept.ancestors = `0`
    if (dept.parentId) {
      const parent = await this.deptRepository.findOneBy({ deptId: dept.parentId })
      dept.ancestors = `${parent.ancestors},${parent.deptId}`
    }

    await this.deptRepository.insert(dept)
  }

  /**
   * 更新部门
   * @param dept 部门信息
   * @param deptId 部门ID
   */
  async update(deptId: number, dept: UpdateDeptDto): Promise<void> {
    dept.ancestors = `0`
    if (dept.parentId) {
      const parent = await this.deptRepository.findOneBy({ deptId: dept.parentId })
      dept.ancestors = `${parent.ancestors},${parent.deptId}`
    }

    await this.deptRepository.update(deptId, dept)
  }

  /**
   * 删除部门
   * @param deptId 部门ID
   */
  async delete(deptId: number): Promise<void> {
    await this.deptRepository.delete(deptId)
  }

  /**
   * 部门详情
   * @param deptId 部门ID
   * @returns 部门详情
   */
  async info(deptId: number): Promise<SysDept> {
    return this.deptRepository.findOneBy({ deptId })
  }

  /**
   * 校验是否有部门数据权限，检验失败抛出错误
   * @param deptId 部门ID
   */
  async checkDeptDataScope(deptId: number) {
    if (isEmpty(deptId)) return
    if (IdentityUtils.isAdmin(this.securityContext.getUserId())) return

    const count = await this.dsDeptQueryBuilder().andWhere({ deptId }).getCount()
    if (count <= 0) throw new ServiceException('没有权限访问部门数据')
  }

  /**
   * 是否存在子节点
   * @param deptId 部门ID
   * @return true 存在 / false 不存在
   */
  async checkDeptExistChild(deptId: number): Promise<boolean> {
    const count = await this.deptRepository.countBy({ parentId: deptId })
    return count > 0
  }

  /**
   * 检查是否存在用户
   * @param deptId 部门ID
   * @return true 存在 / false 不存在
   */
  async checkDeptExistUser(deptId: number): Promise<boolean> {
    const count = await this.userRepository.countBy({ deptId })
    return count > 0
  }

  /**
   * 查询部门选项树
   * @returns 部门选项树
   */
  async treeOptions(): Promise<DeptTreeVo[]> {
    const list = await this.dsDeptQueryBuilder()
      .andWhere({
        status: BaseStatusEnum.NORMAL,
      })
      .getMany()
    return TreeUtils.listToTree<DeptTreeVo>(list, {
      id: 'deptId',
      pid: 'parentId',
    })
  }
}
