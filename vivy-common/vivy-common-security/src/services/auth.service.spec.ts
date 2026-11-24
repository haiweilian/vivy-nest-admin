import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import {
  NotLoginException,
  NotPermissionException,
  NotRoleException,
  SecurityContext,
  SysLoginUser,
  UserConstants,
} from '@vivy-common/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Logical } from '../enums/logical.enum.js'
import { AuthService } from './auth.service.js'

describe('AuthService', () => {
  const context = {
    getToken: vi.fn<() => string>(),
    getLoginUser: vi.fn<() => SysLoginUser>(),
  }
  let module: TestingModule
  let service: AuthService
  let loginUser: SysLoginUser

  beforeEach(async () => {
    loginUser = Object.assign(new SysLoginUser(), {
      userId: 1,
      userName: 'tester',
      roles: ['user'],
      permissions: ['system:user:read'],
    })
    context.getToken.mockReturnValue('test-token')
    context.getLoginUser.mockReturnValue(loginUser)

    module = await Test.createTestingModule({
      providers: [AuthService, { provide: SecurityContext, useValue: context }],
    }).compile()
    service = module.get(AuthService)
  })

  afterEach(async () => {
    await module?.close()
  })

  it('rejects a missing token before looking up the login session', () => {
    context.getToken.mockReturnValue('')

    expect(() => service.getLoginUser()).toThrow(NotLoginException)
    expect(context.getLoginUser).not.toHaveBeenCalled()
  })

  it('rejects an expired or invalid login session', () => {
    context.getLoginUser.mockReturnValue(undefined)

    expect(() => service.getLoginUser()).toThrow(NotLoginException)
  })

  it('returns the login user from the injected security context', () => {
    expect(service.getLoginUser()).toBe(loginUser)
  })

  it('rejects a role that the user does not hold', () => {
    expect(service.hasRole('user')).toBe(true)
    expect(() => service.checkRole('auditor')).toThrow(NotRoleException)
  })

  it('allows a super role to satisfy any required role', () => {
    loginUser.roles = [UserConstants.SUPER_ROLE_CODE]

    expect(() => service.checkRole('auditor')).not.toThrow()
  })

  it('requires every role for AND and accepts one matching role for OR', () => {
    const value = ['user', 'auditor']

    expect(() => service.checkRoleLogical({ value, logical: Logical.AND })).toThrow(NotRoleException)
    expect(() => service.checkRoleLogical({ value, logical: Logical.OR })).not.toThrow()
  })

  it('requires every permission for AND and accepts one matching permission for OR', () => {
    const value = ['system:user:read', 'system:user:write']

    expect(() => service.checkPermissioniLogical({ value, logical: Logical.AND })).toThrow(NotPermissionException)
    expect(() => service.checkPermissioniLogical({ value, logical: Logical.OR })).not.toThrow()
  })

  it('allows the super permission to satisfy any required permission', () => {
    loginUser.permissions = [UserConstants.SUPER_ROLE_PERMISSION]

    expect(() => service.checkPermission('system:user:write')).not.toThrow()
  })
})
