import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type {
  SysDictData,
  ListDictDataDto,
  CreateDictDataDto,
  UpdateDictDataDto,
} from '@/apis/types/system/dict-data';

/**
 * 查询字典数据列表
 */
export function listDictData(params: Partial<ListDictDataDto>) {
  return request<Pagination<SysDictData>>('/system/dict/data/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 添加字典数据
 */
export function addDictData(params: Partial<CreateDictDataDto>) {
  return request('/system/dict/data/add', {
    method: RequestEnum.POST,
    data: params,
  });
}

/**
 * 更新字典数据
 */
export function updateDictData(params: Partial<UpdateDictDataDto>) {
  return request('/system/dict/data/update', {
    method: RequestEnum.PUT,
    data: params,
  });
}

/**
 * 删除字典数据
 */
export function deleteDictData(postIds: React.Key) {
  return request(`/system/dict/data/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  });
}

/**
 * 获取字典数据详情
 */
export function infoDictData(postId: React.Key) {
  return request<SysDictData>(`/system/dict/data/info/${postId}`, {
    method: RequestEnum.GET,
  });
}

/**
 * 根据字典类型查询字典数据列表
 */
export function getDictDataList(type: string) {
  return request<SysDictData[]>(`/system/dict/data/options/${type}`, {
    method: RequestEnum.GET,
  });
}
