<template>
  <div class="center">
    <vs-button
      type="shadow"
      icon
      @click="openNotification(null, null, `<i class='bx bxs-time'></i>`)"
    >
      <i class="bx bx-border-radius b-r" />
      <i class="bx bxs-time" />
    </vs-button>
    <vs-button
      type="flat"
      icon
      @click="
        openNotification(null, 'primary', `<i class='bx bxs-user-pin'></i>`)
      "
    >
      <i class="bx bx-border-radius b-r" />
      <i class="bx bxs-user-pin" />
    </vs-button>
    <vs-button
      type="flat"
      color="success"
      icon
      @click="
        openNotification(
          'top-right',
          'success',
          `<i class='bx bx-select-multiple' ></i>`
        )
      "
    >
      <i class="bx bx-border-radius t-r" />
      <i class="bx bx-select-multiple" />
    </vs-button>
    <vs-button
      type="flat"
      color="danger"
      icon
      @click="
        openNotification('top-left', 'danger', `<i class='bx bxs-bug'></i>`)
      "
    >
      <i class="bx bx-border-radius t-l" />
      <i class="bx bxs-bug" />
    </vs-button>
    <vs-button
      type="flat"
      color="warn"
      icon
      @click="
        openNotification('bottom-left', 'warn', `<i class='bx bx-error' ></i>`)
      "
    >
      <i class="bx bx-border-radius b-l" />
      <i class="bx bx-error" />
    </vs-button>
    <vs-button
      type="flat"
      color="dark"
      icon
      @click="
        openNotification(
          'bottom-center',
          'dark',
          `<i class='bx bx-folder-open'></i>`
        )
      "
    >
      <i class="bx bx-border-bottom" />
      <i class="bx bx-folder-open" />
    </vs-button>
    <vs-button
      type="flat"
      color="#7d33ff"
      icon
      @click="
        openNotification('top-center', '#7d33ff', `<i class='bx bx-bell' ></i>`)
      "
    >
      <i class="bx bx-border-top" />
      <i class="bx bx-bell" />
    </vs-button>
    <vs-button
      type="flat"
      color="rgb(59,222,200)"
      icon
      @click="
        openNotification(
          null,
          'rgb(59,222,200)',
          `<i class='bx bx-calendar' ></i>`
        )
      "
    >
      <i class="bx bx-border-radius b-r" />
      <i class="bx bx-calendar" />
    </vs-button>
  </div>
</template>

<script lang="ts" setup>
import { VsNotification } from 'vuesax-alpha'

const openNotification = (position = null, color, icon) => {
  VsNotification({
    icon,
    color,
    position,
    title: 'Documentation Vuesax-alpha',
    text: 'These documents refer to the latest version of Vuesax-alpha, to see the documents of the previous versions you can do it here 👉 Vuesax4.0',
  })
}
</script>

<style scoped lang="scss">
.vs-button {
  margin: 10px;
}
i {
  margin: 2px;
  font-size: 1.2rem;
  transform-origin: center;
  &.b-r {
    transform: rotate(90deg);
  }
  &.t-r {
    transform: rotate(0deg);
  }
  &.t-l {
    transform: rotate(-90deg);
  }
  &.b-l {
    transform: rotate(-180deg);
  }
}
</style>
