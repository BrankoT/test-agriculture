<template>
  <div v-if="tractor" class="shadow-2xl rounded-2xl overflow-scroll bg-white relative">
    <app-header :title="`Tractor serial number: ${tractor.serialNumber }`">
      <template v-slot:button>
        <div class="flex">
          <button @click="router.push({ name: 'Home' })"
                  class="font-bold bg-white hover:bg-gray-200 transition duration-200 shadow px-4 py-2 md:ml-4 mt-4 md:mt-0 rounded-xl mr-2"
          >
            <FontAwesomeIcon :icon="['fas', 'chevron-left']"/>
            Back
          </button>
        </div>
      </template>
    </app-header>

    <div class="loading absolute inset-0 bg-gray-900 bg-opacity-60" v-if="loading">
      <div class="flex justify-center items-center h-full">
        <FontAwesomeIcon :icon="['fas', 'leaf']" size="4x" class="text-white"/>
      </div>
    </div>

    <table v-else class="table-height table-auto border-collapse block overflow-x-auto">
      <thead>
        <tr>
          <th class="px-4 py-2 bg-gray-200 sticky top-0"></th>
          <th v-for="tractorHeaderColumn in tableHeaderColumns"
              :key="tractorHeaderColumn"
              class="whitespace-nowrap px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 transition duration-200 sticky top-0"
              @click="sortColumn(csvToJson[tractorHeaderColumn])">
            <div class="flex justify-between items-center">
              {{ tractorHeaderColumn }}
              <template v-if="currentSort === csvToJson[tractorHeaderColumn]">
                <FontAwesomeIcon class="ml-4" :icon="['fas', 'sort-down']" :rotation="currentSortDirection === 'asc' ? '180' : null"/>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="getNewSortedColumn.length">
        <tr v-for="(tractorBodyRow, index) in getNewSortedColumn" :key="tractorBodyRow" :class="[index % 2 === 0 ? 'bg-gray-50' : 'bg-white']">
          <td class="whitespace-nowrap px-2 py-2 text-center font-bold">{{ index + 1 }}</td>
          <td v-for="tractorBodyColumn in tableHeaderColumns"
              :key="tractorBodyColumn"
              :class="['whitespace-nowrap px-4 py-2 text-center', tractorBodyColumn === tableHeaderColumns[0] ? 'text-green-600 hover:text-green-800 transition duration-200 cursor-pointer' : '']"
              @click="tractorBodyColumn === tableHeaderColumns[0] ? editRow(tractorBodyRow) : null">
            {{ tractorBodyRow[csvToJson[tractorBodyColumn]] }}
          </td>
        </tr>
      </tbody>

      <template v-else>
        <div class="flex justify-center items-center h-full">No data</div>
      </template>
    </table>

    <div class="bg-gray-100 font-bold p-2 md:p-4 flex justify-between items-center">
      <Pagination @back="goBack"
                  @next="goNext"
                  @changeNumberOfPages="changeNumberOfPages"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :per-page-options="perPageOptions"
                  :data="tractorPoints"
      />
    </div>

    <div class="relative">
      <div class="relative" id="map"></div>
      <div @click.stop.prevent class="absolute bg-white tractor-control shadow-lg top-4 right-4 px-2 py-1 rounded-xl">
        <label for="route" class="font-bold">Move Tractor:</label>
        <input type="range"
               id="route"
               class="w-full"
               @input="changeActiveIndex($event.target.value)"
               :value="activeIndex"
               :min="0"
               :max="getNewData.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useTractorStore } from '../../store/tractor';
import { usePaginationStore } from '../../store/pagination';
import useCsv from '../composables/useCsv';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import Pagination from '../components/Pagination';
import leaflet from 'leaflet';
import AppHeader from "../components/common/AppHeader";

export default {
  name: 'Tractor',
  components: {
    AppHeader,
    Pagination
  },
  setup() {
    const tractorStore = useTractorStore();
    const paginationStore = usePaginationStore();
    const { tractor, tractorPoints } = storeToRefs(tractorStore);
    const {
      getNewData,
      getNewSortedColumn,
      currentSort,
      currentSortDirection,
      perPage,
      perPageOptions,
      currentPage,
      firstDocument,
      lastDocument,
      loading,
    } = storeToRefs(paginationStore);
    const { csvToJson, tableHeaderColumns } = useCsv();
    const route = useRoute();
    const router = useRouter();
    const activeIndex = ref(0);
    const map = ref(null);
    const mapMarker = ref(null);

    onMounted(async () => {
      loading.value = true
      await tractorStore.fetchTractor(route.params.tractorId);

      if (Object.keys(route.query).length) {
        perPage.value = parseInt(route.query.perPage)
        await tractorStore.fetchTractorPoints(route.params.tractorId, null, route.query.perPage, 'next');
      } else {
        await tractorStore.fetchTractorPoints(route.params.tractorId, null, perPage.value, 'next');
        await router.push({name: 'Tractor', query: {perPage: perPage.value}})
      }

      createMap();
      changeActiveIndex(0)
      loading.value = false
    });

    const createMap = () => {
      // set map view with lat/lon of the first tractor point
      map.value = leaflet.map('map').setView([getNewData.value[0].gpsLatitude, getNewData.value[0].gpsLongitude], 16);

      const tileOptions = {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYmFuY3VsYSIsImEiOiJja3o0cWljZTEwYXg4Mm9wNGlkYzAxeWV5In0.teaBouiDeI5Y6zpO9dS5xw'
      }

      leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmFuY3VsYSIsImEiOiJja3o0cWljZTEwYXg4Mm9wNGlkYzAxeWV5In0.teaBouiDeI5Y6zpO9dS5xw', tileOptions).addTo(map.value);

      // draw route
      let coordinates = [];
      getNewData.value.forEach((data) => coordinates.push([data.gpsLatitude, data.gpsLongitude]));
      leaflet.polyline([coordinates]).addTo(map.value);
    }

    // when the tractor control changes recreate marker on map
    const changeActiveIndex = (index) => {
      activeIndex.value = index

      if (mapMarker.value) {
        map.value.removeLayer(mapMarker.value)
      }

      if (getNewData.value.length) {
        mapMarker.value = leaflet.marker([getNewData.value[activeIndex.value].gpsLatitude, getNewData.value[activeIndex.value].gpsLongitude])
        mapMarker.value.addTo(map.value)

        map.value.setView([getNewData.value[activeIndex.value].gpsLatitude, getNewData.value[activeIndex.value].gpsLongitude])
      }
    }

    const editRow = (row) => {
      tractorStore.editTractorRow(row);
      router.push({name: 'TractorEdit', params: { tractorId: tractor.value.id, pointId: row.id}})
    }

    const sortColumn = (column) => {
      paginationStore.sortTableColumn(column)
    }

    // fetch previous portion of tractor data
    const goBack = async () => {
      loading.value = true
      await tractorStore.fetchTractorPoints(route.params.tractorId, firstDocument.value.createdAt, perPage.value, 'back');
      currentPage.value = currentPage.value - 1;
      loading.value = false
    }

    // fetch next portion of tractor data
    const goNext = async () => {
      loading.value = true
      const tractorPointsResponse = await tractorStore.fetchTractorPoints(route.params.tractorId, lastDocument.value.createdAt, perPage.value, 'next');

      if (tractorPointsResponse.length) {
        currentPage.value = currentPage.value + 1;
      }
      loading.value = false
    }

    const changeNumberOfPages = async (numberOfPages) => {
      loading.value = true
      if (perPageOptions.value.includes(parseInt(numberOfPages))) {
        perPage.value = parseInt(numberOfPages)
      } else {
        perPage.value = perPageOptions.value[0]
      }

      await tractorStore.fetchTractorPoints(route.params.tractorId, null, perPage.value, 'next');
      await router.push({name: 'Tractor', query: {perPage: perPage.value}})
      currentPage.value = 1

      let coordinates = [];
      getNewData.value.forEach(data => coordinates.push([data.gpsLatitude, data.gpsLongitude]));
      leaflet.polyline([coordinates]).addTo(map.value);
      loading.value = false
    }

    watch(currentPage, (newValue, oldValue) => {
      console.log('perPage.value', perPage.value)
      // when the page changes remove old markers on map
      map.value.removeLayer(mapMarker.value)

      // draw route
      let coordinates = [];
      getNewData.value.forEach(data => coordinates.push([data.gpsLatitude, data.gpsLongitude]));
      leaflet.polyline([coordinates]).addTo(map.value);

      // set tractor control according to page navigation
      changeActiveIndex(oldValue > newValue ? perPage.value - 1 : 0)
    })

    return {
      router,
      tractor,
      tractorPoints,
      csvToJson,
      tableHeaderColumns,
      currentSort,
      currentSortDirection,
      getNewData,
      getNewSortedColumn,
      perPage,
      perPageOptions,
      currentPage,
      activeIndex,
      editRow,
      sortColumn,
      goBack,
      goNext,
      changeNumberOfPages,
      changeActiveIndex,
      loading
    }
  }

}
</script>

<style lang="scss">
#map {
  height: 300px;
}
.table-height {
  height: 350px;
}
.tractor-control {
  z-index: 9998;
}
.loading {
  z-index: 9999;
  animation: pulse 2s ease 0s infinite;

}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
