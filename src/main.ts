import { createApp } from 'vue'
import '@/assets/css/style.css'
import App from '@/App.vue'
import router from '@/router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css'
import StockAppPresets from './presets';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: StockAppPresets,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    },
  },
});
app.directive('tooltip', Tooltip);
app.use(ToastService);
app.use(router);
app.mount('#app');