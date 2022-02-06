<template>
    <div class="text-center m-4 shadow-md transform hover:-translate-y-1 hover:shadow-lg transition duration-200 lg:rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-t from-green-600 to-green-400 h-36 text-center"></div>

      <img v-if="tractorImage"
           :src="require(`@/assets/images/${tractorImage}`)"
           alt="tractor-image"
           class="mb-4 rounded-full border-8 border-white shadow-lg mx-auto -mt-24"
           width="200"/>

      <div class="flex flex-col justify-evenly text-center mt-6">
        <div class="font-bold mb-4">
          <div class=" text-gray-400">
            Serial Number
          </div>
          <div class="text-xl">
            {{ tractor.serialNumber }}
          </div>
        </div>
        <div class="font-bold">
          <div class=" text-gray-400">
            Total Working Hours
          </div>
          <div class="text-xl">
            {{ tractor.totalWorkingHoursCounter }}
          </div>
        </div>
      </div>

      <router-link :to="`/tractor/${tractor.id}/?perPage=${perPage}`"
                   class="inline-block font-bold bg-green-500 hover:bg-green-600 text-white transition duration-200 rounded-xl my-6 px-10 py-2 shadow">
        Overview
      </router-link>
    </div>
</template>

<script>
import { usePaginationStore } from '../../store/pagination';
import { storeToRefs } from 'pinia';

export default {
  name: 'Tractor',
  props: {
    tractor: {
      type: Object,
      required: true
    },
    tractorImage: {
      type: String
    }
  },
  setup() {
    const paginationStore = usePaginationStore();
    const { perPage } = storeToRefs(paginationStore);

    return { perPage }
  }
}
</script>

<style scoped>

</style>
