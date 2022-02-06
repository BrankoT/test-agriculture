<template>
  <div>
    <button class="font-bold bg-white transition duration-200 shadow px-4 py-2 mr-2 md:mr-2 rounded-xl"
            :class="[currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-200']"
            @click="goBack">
      Previous
    </button>
    <button class="font-bold bg-white transition duration-200 shadow px-4 py-2 ml-1 md:ml-2 rounded-xl"
            :class="[data.length < perPage ? 'cursor-not-allowed' : 'hover:bg-gray-200']"
            @click="goNext">
      Next
    </button>
  </div>
  <div class="flex items-center">
    <span class="mr-2">Per page:</span>
    <select @change="emit('changeNumberOfPages', $event.target.value)"
            class="focus:outline-none text-center font-bold hover:bg-gray-200 px-4 py-2 cursor-pointer appearance-none shadow rounded-xl">
      <option v-for="perPageOption in perPageOptions"
              :key="perPageOption"
              :value="perPageOption"
              :selected="perPageOption === perPage">
        {{ perPageOption }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    perPageOptions: {
      type: Array,
      required: true,
      validator: options => options.every(option => typeof option === 'number')
    },
    perPage: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  emits: ['back', 'next', 'changeNumberOfPages'],
  setup(props, { emit }) {
    const goBack = () => {
      if (props.currentPage === 1) return;
      emit('back')
    }

    const goNext = () => {
      if (props.data.length < props.perPage) return;
      emit('next')
    }

    return {
      goBack,
      goNext,
      emit
    }
  }
}
</script>
