<template>
  <div class="shadow-2xl lg:rounded-2xl overflow-scroll bg-white">
    <app-header title="Welcome to Tractor - Overview">
      <template v-slot:button>
        <!-- remove *** v-if="false" *** and upload button will appear, but make sure csv file has same structure as those in task -->
        <button v-if="false"
                class="font-bold bg-white hover:bg-gray-200 transition duration-200 shadow px-4 py-2 rounded-xl md:ml-4 mt-4 md:mt-0"
                @click="chooseFile"
        >
          <FontAwesomeIcon :icon="['fas', 'plus']" />
          New tractor
        </button>
      </template>
    </app-header>
    <input v-show="false" type="file" id="file" @change="uploadFile($event.target.files)"/>

    <div v-for="(tractor, index) in tractors"
         :key="tractor.id"
         class="w-full lg:w-1/3 xl:w1/4 inline-block bg-white">
      <Tractor :tractor="tractor" :tractor-image="index <= 2 ? `tractor-${index + 1}.png` : null"/>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useTractorStore } from '../../store/tractor';
import useCsv from '../composables/useCsv';
import Tractor from '../components/Tractor'
import { storeToRefs } from 'pinia';
import AppHeader from "../components/common/AppHeader";

export default {
  name: 'Home',
  components: {
    AppHeader,
    Tractor
  },
  setup() {
    const tractorStore = useTractorStore();
    const { csvToJson } = useCsv();
    const { tractors } = storeToRefs(tractorStore);

    onMounted(async () => {
      await tractorStore.fetchTractors();
    });

    const chooseFile = () => {
      const file = document.getElementById('file');

      if (file) {
        file.click();
      }
    }
    const uploadFile = (data) => {
      let fileReader = new FileReader()

      fileReader.readAsText(data[0]);
      fileReader.onload = (event) => processCsv(event.target.result);
    }

    const processCsv = async csv => {
      // split csv in rows
      const rows = csv.split('\n');

      // remove unnecessary empty row at the end of rows array
      if (rows[rows.length - 1] === "") {
        rows.pop();
      }

      // make keys from first row for tractor points you will create later
      const keys = rows[0].split(';');

      // make values from every other row
      const values = rows.slice(1);

      const tractorInfo = values[values.length - 1].split(';')

      let tractor = null

      if (tractorInfo.length) {
        // create tractor
        tractor = await tractorStore.addTractor({
          dateTime: tractorInfo[0],
          serialNumber: tractorInfo[1],
          totalWorkingHoursCounter: tractorInfo[4]
        });

        // create tractor points
        // let resultArray = []

        for (const element of values) {
          // make array from every csv line
          const row = element.split(';')

          // make key/value object
          let result = {};
          keys.forEach((key, i) => result[csvToJson.value[key]] = row[i]);

          // create tractor points
          await tractorStore.addTractorPoints({ id: tractor.id, points: result })
          // resultArray.push(result)
        }
      }
    }

    return {
      chooseFile,
      uploadFile,
      tractors
    }
  }
};
</script>
