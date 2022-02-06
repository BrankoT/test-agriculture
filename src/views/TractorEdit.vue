<template>
  <div v-if="newTractorRowData" class="shadow-2xl rounded-2xl overflow-scroll bg-white">
    <app-header :title="`Tractor serial number: ${newTractorRowData.serialNumber }`" :sub-title="newTractorRowData.dateTime">
      <template v-slot:button>
        <button @click="goBack" class="font-bold bg-white hover:bg-gray-200 transition duration-200 shadow px-4 py-2 md:ml-4 mt-4 md:mt-0 rounded-xl">
          <FontAwesomeIcon :icon="['fas', 'chevron-left']"/>
          Back
        </button>
      </template>
    </app-header>

      <div class="overflow-x-scroll">
        <div class="table-height flex flex-col whitespace-nowrap">
          <div v-for="(tractorHeaderColumn, index) in tableHeaderColumns" :key="tractorHeaderColumn" class="flex">

            <div class="flex items-center px-2 py-2 cursor-pointer transition duration-200 font-bold whitespace-pre-wrap w-1/2" :class="[index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200']">
              {{ tractorHeaderColumn }}
            </div>

            <div class="flex justify-center items-center text-center p-2 cursor-pointer transition duration-200 whitespace-pre-wrap w-1/2"
                 :class="[
                 index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                  errors.find(fieldName => fieldName === csvToJson[tractorHeaderColumn]) ? 'hover:bg-red-50' : 'hover:bg-green-50',
                  unEditableColumns(tractorHeaderColumn) ? 'cursor-not-allowed' : 'cursor-pointer',
                ]"
                 @click="!errors.length ? showEdit(csvToJson[tractorHeaderColumn]) : null"
            >

              <input v-if="!unEditableColumns(tractorHeaderColumn) && editingField === csvToJson[tractorHeaderColumn]"
                     @blur="checkInputField(csvToJson[tractorHeaderColumn])"
                     @input="errors = []"
                     v-model="newTractorRowData[csvToJson[tractorHeaderColumn]]"
                     type="text"
                     v-focus
                     class="px-2 w-full focus:outline-none border-2 text-center"
                     :class="[errors.find(fieldName => fieldName === csvToJson[tractorHeaderColumn]) ? 'border-red-500' : 'focus:border-green-500']">

              <div class="flex justify-between items-center" v-else>{{ newTractorRowData[csvToJson[tractorHeaderColumn]] }}</div>
            </div>

          </div>
        </div>
      </div>

    <div class="bg-gray-100 font-bold p-4 flex justify-between items-center">
      <button class="font-bold bg-white hover:bg-gray-200 transition duration-200 shadow px-4 py-2 rounded-xl"
              :class="[isEqual || errors.length ? 'cursor-not-allowed' : '']"
              @click="!isEqual && !errors.length ? saveEditTractor() : null">
        Confirm
      </button>
    </div>

  </div>
</template>

<script>
import { useTractorStore } from '../../store/tractor';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import useCsv from '../composables/useCsv';
import AppHeader from "../components/common/AppHeader";

export default {
  name: 'TractorEdit',
  components: {AppHeader},
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      }
    }
  },
  setup() {
    const tractorStore = useTractorStore();
    const { csvToJson, tableHeaderColumns } = useCsv();
    const { tractor, tractorPoint } = storeToRefs(tractorStore);
    const router = useRouter();
    const route = useRoute();
    const editingField = ref('');
    const newTractorRowData = ref(null)
    const errors = ref([])

    onMounted(async () => {
      await tractorStore.fetchTractor(route.params.tractorId);
      await tractorStore.fetchTractorPoint(route.params.tractorId, route.params.pointId);
      if (!tractorPoint.value) {
        goBack()
      }

      newTractorRowData.value = {...tractorPoint.value};
    });

    const goBack = () => {
      newTractorRowData.value = null;
      router.push({ name: 'Tractor'});
    }

    const saveEditTractor = () => {
      tractorStore.updateTractorPoint({tractorId: tractor.value.id, tractorPoint: newTractorRowData.value})
      if (newTractorRowData.value.totalWorkingHoursCounter > tractor.value.totalWorkingHoursCounter) {
        tractorStore.updateTractor({tractorId: tractor.value.id, totalWorkingHoursCounter: newTractorRowData.value.totalWorkingHoursCounter})
      }
      goBack();
    }

    const showEdit = (column) => {
      editingField.value = column
    }

    const checkInputField = (column) => {
      if (newTractorRowData.value[column] === '') {
        return errors.value.push(column)
      }

      if (column === 'gpsLongitude' && !(Math.abs(newTractorRowData.value[column]) <= 180)) {
        return errors.value.push(column)
      }

      if (column === 'gpsLatitude' && !(Math.abs(newTractorRowData.value[column]) <= 90)) {
        return errors.value.push(column)
      }

      editingField.value = '';
    }

    const unEditableColumns = (column) => {
      console.log(column)
      return [tableHeaderColumns.value[0], tableHeaderColumns.value[1]].includes(column)
    }

    const isEqual = computed(() => {
      delete tractorPoint.value.createdAt
      delete newTractorRowData.value.createdAt

      const tractorPointValues = Object.values(tractorPoint.value)
      const newTractorRowDataValues = Object.values(newTractorRowData.value)

      let newValue = false

      newTractorRowDataValues.forEach(value => {
        if (!tractorPointValues.includes(value)) {
          newValue = true
        }
      })

      return newTractorRowDataValues.length === tractorPointValues.length && !newValue
    });

    return {
      tractorPoint,
      csvToJson,
      tableHeaderColumns,
      newTractorRowData,
      editingField,
      errors,
      isEqual,
      goBack,
      saveEditTractor,
      showEdit,
      checkInputField,
      unEditableColumns
    }
  }
}
</script>

<style lang="scss">
.table-height {
  height: 350px;
}
</style>
