import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeUtils, BaseStatusEnums } from '@vivy-common/core'
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
    private userRepository: Repository<SysUser>
  ) {}

  /**
   * 查询部门树结构
   */
  async tree(): Promise<DeptTreeVo[]> {
    const list = await this.deptRepository.find({
      order: {
        deptSort: 'ASC',
      },
    })
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
    await this.deptRepository.insert(dept)
  }

  /**
   * 更新部门
   * @param dept 部门信息
   * @param deptId 部门ID
   */
  async update(deptId: number, dept: UpdateDeptDto): Promise<void> {
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
    const list = await this.deptRepository.find({
      select: ['deptId', 'deptName', 'parentId'],
      order: {
        deptSort: 'ASC',
      },
      where: {
        status: BaseStatusEnums.NORMAL,
      },
    })
    return TreeUtils.listToTree<DeptTreeVo>(list, {
      id: 'deptId',
      pid: 'parentId',
    })
  }
}
