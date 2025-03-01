<template>
  <vs-popper
    ref="popperRef"
    v-model:visible="dropMenuVisible"
    trigger="click"
    placement="bottom"
    :animation="optionsAnimation"
    :flip="false"
    :fit="fit"
    :hide-after="hideAfter"
    :show-after="showAfter"
    :loading="loading"
    :popper-class="[ns.e('content'), useBaseComponent(color)]"
    :popper-style="colorCssVar"
    :show-arrow="false"
    :offset="0"
    :process-before-open="processBeforeOpen"
    :process-before-close="processBeforeClose"
    persistent
    @show="handleMenuEnter"
  >
    <div
      ref="selectWrapper"
      v-click-outside:[popperPaneRef]="handleClose"
      :class="selectKls"
      :style="selectStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="toggleMenu"
    >
      <div v-if="multiple" ref="chips" :class="[ns.e('chips')]">
        <vs-chip
          v-for="(item, cIndex) in selectedArray"
          :key="cIndex + 'chip'"
          :shape="shape"
          :disabled="selectDisabled || item.isDisabled"
          :hit="item.hit"
          @close="deleteTag(item.value)"
        >
          {{ item.currentLabel }}
        </vs-chip>

        <input
          v-if="filter && !selectDisabled"
          ref="input"
          v-model="query"
          type="text"
          :class="[
            ns.e('input-filter'),
            ns.is('disabled', selectDisabled),
            ns.be('chips', 'input'),
          ]"
          :placeholder="states.selectedLabel ? '' : states.query ?? ''"
          :disabled="selectDisabled"
          @focus="handleFocus"
          @blur="handleBlur"
          @mouseenter="handleTarget('input-filter')"
          @mouseleave="handleTarget(null)"
          @keyup="managePlaceholder"
          @keydown.down.prevent="navigateOptions('next')"
          @keydown.up.prevent="navigateOptions('prev')"
          @keydown.esc="handleKeydownEscape"
          @keydown.enter.stop.prevent="selectOption"
          @keydown.delete="deletePrevTag"
          @keydown.tab="visible = false"
          @compositionstart="handleComposition"
          @compositionupdate="handleComposition"
          @compositionend="handleComposition"
          @input="debouncedQueryChange"
        />
      </div>
      <input
        :id="inputId"
        ref="reference"
        v-model="states.selectedLabel"
        :class="[ns.e('input'), ns.is('multiple', multiple)]"
        :readonly="readonly"
        @focus="handleFocus"
        @blur="handleBlur"
        @mouseenter="handleTarget('input-filter', !readonly)"
        @mouseleave="handleTarget(null)"
        @input="debouncedOnInputChange"
        @paste="debouncedOnInputChange"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc="handleKeydownEscape"
        @keydown.tab="states.visible = false"
      />

      <label
        v-if="label"
        :for="inputId"
        :class="[
          ns.e('label'),
          ns.is(
            'placeholder',
            labelFloat &&
              !dropMenuVisible &&
              (isEqual(modelValue, notValue) ||
                (!modelValue && modelValue != 0))
          ),
        ]"
      >
        {{ label }}
      </label>

      <span
        v-if="!multiple && !labelFloat && states.currentPlaceholder"
        :class="[ns.e('placeholder'), ns.is('hidden', !!modelValue)]"
      >
        {{ states.currentPlaceholder }}
      </span>

      <icon-loading v-if="loading" class="vs-select__loading" />

      <vs-icon :class="ns.e('arrow')" size="14"><chevron-down /></vs-icon>

      <transition name="v-clearable">
        <span
          v-if="showClose"
          :class="ns.e('clearable')"
          @click="handleClearClick"
        >
          <icon-close hover="less" scale="0.675" />
        </span>
      </transition>

      <vs-collapse-transition
        v-for="(messageType, index) in messageTypes"
        :key="index"
      >
        <div
          v-if="$slots[`message-${messageType}`]"
          :class="[ns.e('message'), ns.em('message', messageType)]"
        >
          <slot :name="`message-${messageType}`" />
        </div>
      </vs-collapse-transition>
    </div>

    <template #content>
      <vs-scrollbar
        v-show="states.options.size > 0 && !loading"
        max-height="200"
        thickness="3"
        :wrap-class="[
          ns.e('options'),
          ns.is(
            'empty',
            !allowCreate && Boolean(query) && states.filteredOptionsCount === 0
          ),
        ]"
        :native="nativeScrollbar"
        @mouseleave="hoverIndex = -1"
      >
        <vs-option v-if="showNewOption" :value="query" :created="true" />
        <slot />
      </vs-scrollbar>

      <template
        v-if="
          emptyText &&
          (!allowCreate ||
            loading ||
            (allowCreate && states.options.size === 0))
        "
      >
        <slot v-if="$slots.empty" name="empty" />
        <p v-else :class="ns.em('options', 'empty')">
          {{ emptyText }}
        </p>
      </template>
    </template>
  </vs-popper>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, reactive } from 'vue'
import { toRefs, unrefElement, useResizeObserver } from '@vueuse/core'
import { isEqual } from 'lodash-unified'
import { ClickOutside as vClickOutside } from '@vuesax-alpha/directives'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import VsIcon, { IconClose, IconLoading } from '@vuesax-alpha/components/icon'
import VsCollapseTransition from '@vuesax-alpha/components/collapse-transition'
import VsScrollbar from '@vuesax-alpha/components/scrollbar'
import VsPopper from '@vuesax-alpha/components/popper'
import { ChevronDown } from '@vuesax-alpha/icons-vue'
import { useBaseComponent, useColor, useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import VsOption from './option.vue'
import VsChip from './chip.vue'
import { selectContextKey, selectRegisterKey } from './tokens'
import { selectEmits, selectProps } from './select'
import { useSelect, useSelectStates } from './useSelect'
import type { SelectOptionContext } from './tokens'

defineOptions({
  name: 'VsSelect',
})

const messageTypes = ['success', 'warn', 'danger', 'primary', 'dark']

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const ns = useNamespace('select')

const states = useSelectStates(props)

const color = useColor('primary')

const colorCssVar = computed(() =>
  ns.cssVar({
    color: getVsColor(color.value),
  })
)

const optionsAnimation = computed(() => ns.b())

const {
  showNewOption,
  debouncedQueryChange,
  managePlaceholder,
  deletePrevTag,
  deleteTag,
  handleClearClick,
  showClose,
  inputId,
  emptyText,
  readonly,
  input,
  reference,

  chips,
  popperRef,
  selectDisabled,
  selectWrapper,
  handleMouseEnter,
  handleMouseLeave,
  handleTarget,
  selectOption,
  handleComposition,
  navigateOptions,
  handleKeydownEscape,
  dropMenuVisible,
  debouncedOnInputChange,
  handleFocus,
  handleBlur,
  toggleMenu,
  handleMenuEnter,
  handleResize,
  setSelected,
  handleClose,
  onOptionCreate,
  onOptionDestroy,
  handleOptionSelect,
  focus,
  blur,

  processBeforeOpen,
  processBeforeClose,

  queryChange,

  optionsArray,
  cachedOptionsArray,
  selectedArray,
} = useSelect(props, states, emit)

const { visible, hoverIndex, query } = toRefs(states)

// @ts-ignore - directive: v-click-outside element
const popperPaneRef = computed(() => {
  return unrefElement(popperRef.value?.contentRef)
})

if (props.multiple && !Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, [])
}

if (!props.multiple && Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, '')
}

const selectKls = computed(() => [
  ns.is('block', props.block),

  ns.b(),
  ns.em('state', props.state),
  ns.is('open', dropMenuVisible.value),
  ns.is('hovering', states.mouseEnter),
  ns.is('focus', states.softFocus),
  ns.is('disabled', selectDisabled.value),
  ns.is('multiple', props.multiple),
  ns.is('loading', props.loading),
  ns.is(popperRef.value?.popperPlacement ?? 'bottom'),
  { [ns.m('has-label')]: props.label || props.labelFloat },
])

const selectStyle = computed(() => [colorCssVar.value])

onMounted(() => {
  states.cachedPlaceHolder = states.currentPlaceholder = props.placeholder
  if (
    props.multiple &&
    Array.isArray(props.modelValue) &&
    props.modelValue.length > 0
  ) {
    states.currentPlaceholder = ''
  }
  useResizeObserver(selectWrapper, handleResize)

  setSelected()
})

provide(
  selectContextKey,
  reactive({
    props,
    states,
    queryChange,
    hoverIndex,
    selectWrapper,
    selectedArray,
    optionsArray,
    cachedOptionsArray,
    handleTarget,
    setSelected,
    handleOptionSelect,
  })
)

provide(selectRegisterKey, (option: SelectOptionContext) => {
  option.index = states.optionsCount

  onOptionCreate(option.value, option)

  return {
    updateOption: (newOption: SelectOptionContext) => {
      onOptionDestroy(option.value, option)
      onOptionCreate(newOption.value, newOption)
    },
    unregister: () => {
      const doesSelected = selectedArray.value.some(
        (e) => e.value == option.value
      )
      // if option is not selected, remove it from cache
      nextTick(() => {
        if (
          states.cachedOptions.get(option.value) === option &&
          !doesSelected
        ) {
          states.cachedOptions.delete(option.value)
        }
      })
      onOptionDestroy(option.value, option)
    },
  }
})

defineExpose({
  /** focus to select */
  focus,

  /** blur select */
  blur,
})
</script>
