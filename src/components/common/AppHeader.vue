<template>
<!--  <header class="p-4 bg-gray-100 flex flex-col md:flex-row justify-between items-center">-->
  <header class="p-4 bg-gray-100 flex flex-col md:flex-row justify-between items-center">
    <div class="text-center md:text-left">
      <h1 v-if="title" class="font-bold text-3xl">{{ title }}</h1>
      <span v-if="subTitle" class="text-green-600 font-bold">{{ subTitle }}</span>
    </div>
    <slot name="button"></slot>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    }
  }
}
</script>

<style scoped>

</style>
