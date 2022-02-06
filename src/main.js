import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSortDown, faChevronLeft, faPlus, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/assets/tailwind.css';

const app = createApp(App)

library.add(faSortDown, faChevronLeft, faPlus, faLeaf)

app.use(createPinia())
    .use(router)
    .component('FontAwesomeIcon', FontAwesomeIcon)
    .mount('#app')
