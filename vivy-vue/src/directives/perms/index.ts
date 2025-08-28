import type { Directive, DirectiveBinding } from 'vue'
import { hasPerms } from '@/utils/auth'

export const perms: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding
    if (value) {
      !hasPerms(value) && el.parentNode?.removeChild(el)
    } else {
      throw new Error("[Directive: perms]: need perms! Like v-perms=\"['btn.add','btn.edit']\"")
    }
  },
}
