<template>
  <button class="rounded" :class="[textColor, bgColor]" @click="buttonClick">button</button>
</template>

<script>
export default {
  name: 'AppButton',
  emits: ['onButtonClick'],
  props: {
    bgColor: {
      type: String,
      default: 'bg-blue-500'
    },
    textColor: {
      type: String,
      default: 'bg-white'
    }
  },
  setup(props, { emit }) {

    const buttonClick = () => {
      emit('onButtonClick', event);
    }

    return { buttonClick }
  }
}
</script>

<style scoped>

</style>
