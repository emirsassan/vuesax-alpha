import { getNodeName, isNode } from '@vuesax-alpha/hooks/use-floating/utils/dom'
import type { ComponentPublicInstance } from 'vue-demi'

import type { MaybeElement } from '../types'

function isComponentPublicInstance(
  target: unknown
): target is ComponentPublicInstance {
  return target != null && Object.prototype.hasOwnProperty.call(target, '$el')
}

export function unwrapElement<T>(target: MaybeElement<T>) {
  if (isComponentPublicInstance(target)) {
    const element = target.$el as Exclude<
      MaybeElement<T>,
      ComponentPublicInstance
    >

    return isNode(element) && getNodeName(element) === '#comment'
      ? null
      : element
  }

  return target as Exclude<MaybeElement<T>, ComponentPublicInstance>
}
