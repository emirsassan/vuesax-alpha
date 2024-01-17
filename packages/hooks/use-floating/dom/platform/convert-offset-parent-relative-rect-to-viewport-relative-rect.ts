import { createCoords } from '@vuesax-alpha/hooks/use-floating/utils'
import {
  getDocumentElement,
  getNodeName,
  getNodeScroll,
  isHTMLElement,
  isOverflowElement,
} from '@vuesax-alpha/hooks/use-floating/utils/dom'

import { getBoundingClientRect } from '../utils/get-bounding-client-rect'
import { getScale } from './get-scale'
import type { Rect, Strategy } from '@vuesax-alpha/hooks/use-floating/utils'

export function convertOffsetParentRelativeRectToViewportRelativeRect({
  rect,
  offsetParent,
  strategy,
}: {
  rect: Rect
  offsetParent: Element | Window
  strategy: Strategy
}): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent)
  const documentElement = getDocumentElement(offsetParent)

  if (offsetParent === documentElement) {
    return rect
  }

  let scroll = { scrollLeft: 0, scrollTop: 0 }
  let scale = createCoords(1)
  const offsets = createCoords(0)

  if (
    isOffsetParentAnElement ||
    (!isOffsetParentAnElement && strategy !== 'fixed')
  ) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent)
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent)
      scale = getScale(offsetParent)
      offsets.x = offsetRect.x + offsetParent.clientLeft
      offsets.y = offsetRect.y + offsetParent.clientTop
    }
  }

  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y,
  }
}
