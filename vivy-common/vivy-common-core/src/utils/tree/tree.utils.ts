interface TreeConfig {
  id: string
  pid: string
  children: string
}

const DEFAULT_CONFIG: TreeConfig = {
  id: 'id',
  pid: 'pid',
  children: 'children',
}

/**
 * 树结构操作方法
 */
export class TreeUtils {
  /**
   * 获取配置
   * @param config 配置
   * @returns 合并后的配置
   */
  static getConfig(config: Partial<TreeConfig>): TreeConfig {
    return Object.assign({}, DEFAULT_CONFIG, config)
  }

  /**
   * 列表转树
   * @param list 原始列表数据
   * @param config 配置
   * @returns 转换后的树数据
   */
  static listToTree<T = any>(list: any[], config: Partial<TreeConfig> = {}): T[] {
    const conf = TreeUtils.getConfig(config)
    const nodeMap = new Map()
    const result: T[] = []
    const { id, pid, children } = conf

    for (const node of list) {
      node[children] = node[children] || []
      nodeMap.set(node[id], node)
    }

    for (const node of list) {
      const parent = nodeMap.get(node[pid])
      ;(parent ? parent[children] : result).push(node)
    }

    return result
  }

  /**
   * 树转列表
   * @param tree 原始树数据
   * @param config 配置
   * @returns 转换后的列表数据
   */
  static treeToList<T = any>(tree: any[], config: Partial<TreeConfig> = {}): T[] {
    const conf = TreeUtils.getConfig(config) as TreeConfig
    const result: any[] = [...tree]
    const { children } = conf

    for (let i = 0; i < result.length; i++) {
      if (!result[i][children!]) continue
      result.splice(i + 1, 0, ...result[i][children!])
    }

    return result
  }

  /**
   * 递归遍历树结构
   * @param tree 树
   * @param callBack 回调
   * @param parentNode 父节点
   */
  static eachTree<T = any>(tree: any[], callBack: (item: T, parent?: T) => any, parent?: T) {
    tree.forEach((item) => {
      const newNode = callBack(item, parent) || item
      if (item.children) {
        TreeUtils.eachTree(item.children, callBack, newNode)
      }
    })
  }
}
