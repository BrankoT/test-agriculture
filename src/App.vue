<template>
  <div class="h-full mx-auto md:w-10/12 lg:w-3/4 xl:w-2/3 flex flex-col justify-center p-2">
<!--  <div class="h-full mx-auto">-->
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body, #app {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
