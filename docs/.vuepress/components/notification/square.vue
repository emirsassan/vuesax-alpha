<template>
  <div class="center">
    <vs-button
      type="shadow"
      shape="square"
      icon
      @click="openNotification(null, '')"
    >
      <i class="bx bx-border-radius b-r" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      icon
      @click="openNotification(null, 'primary')"
    >
      <i class="bx bx-border-radius b-r" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="success"
      icon
      @click="openNotification('top-right', 'success')"
    >
      <i class="bx bx-border-radius t-r" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="danger"
      icon
      @click="openNotification('top-left', 'danger')"
    >
      <i class="bx bx-border-radius t-l" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="warn"
      icon
      @click="openNotification('bottom-left', 'warn')"
    >
      <i class="bx bx-border-radius b-l" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="dark"
      icon
      @click="openNotification('bottom-center', 'dark')"
    >
      <i class="bx bx-border-bottom" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="#7d33ff"
      icon
      @click="openNotification('top-center', '#7d33ff')"
    >
      <i class="bx bx-border-top" />
    </vs-button>
    <vs-button
      type="border"
      shape="square"
      color="rgb(59,222,200)"
      icon
      @click="openNotification(null, 'rgb(59,222,200)')"
    >
      <i class="bx bx-border-radius b-r" />
    </vs-button>
  </div>
</template>
<script lang="ts" setup>
import { VsNotification } from 'vuesax-alpha'

const openNotification = (position = null, color) => {
  VsNotification({
    shape: 'square',
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
