<script setup>
import { ref } from "vue";
import { getOrderStatus } from "@/services/api";

const orderNumber = ref("");
const order = ref(null);
const loading = ref(false);
const error = ref("");

const statusSteps = [
  'Przyjęto zgłoszenie',
  'Analiza dokumentacji',
  'Pomiary terenowe',
  'Opracowanie kameralne',
  'Weryfikacja w urzędzie',
  'Gotowe do odbioru'
];

const statusMapping = {
  'Przyjęto zgłoszenie': 1,
  'Analiza dokumentacji': 2,
  'Pomiary terenowe': 3,
  'Opracowanie kameralne': 4,
  'Weryfikacja w urzędzie': 5,
  'Gotowe do odbioru': 6,
  'Zakończono': 6
};

const getStatusIndex = (status) => {
  return statusMapping[status] || 0;
};

const checkStatus = async () => {
  if (!orderNumber.value.trim()) return;
  
  loading.value = true;
  error.value = "";
  order.value = null;
  
  try {
    const data = await getOrderStatus(orderNumber.value.trim());
    if (data) {
      order.value = data;
    } else {
      error.value = "Nie znaleziono zlecenia o podanym numerze. Sprawdź czy numer jest poprawny (np. G-001/2026).";
    }
  } catch (err) {
    error.value = "Wystąpił błąd podczas sprawdzania statusu. Spróbuj ponownie później.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-6 max-w-4xl">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold font-Rubik text-navyBlue mb-4">Sprawdź status swojego zlecenia</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">Wpisz numer swojego zlecenia otrzymany od geodety, aby zobaczyć aktualny etap prac.</p>
        <div class="w-20 h-1.5 bg-yellowMain mx-auto mt-6 rounded-full"></div>
      </div>

      <!-- Search Box -->
      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl mb-10 border border-gray-100">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-grow">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="orderNumber"
              @keyup.enter="checkStatus"
              type="text" 
              placeholder="Wpisz numer zlecenia (np. G-001/2026)" 
              class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-yellowMain focus:outline-none transition-colors text-lg font-medium"
            />
          </div>
          <button 
            @click="checkStatus"
            :disabled="loading"
            class="bg-navyBlue text-white px-10 py-4 rounded-2xl font-bold hover:bg-yellowMain hover:text-navyBlue transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? 'Sprawdzanie...' : 'Szukaj' }}
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-4 italic text-center md:text-left">
          Przykładowy numer: <span class="cursor-pointer hover:text-yellowMain underline" @click="orderNumber = 'G-001/2026'; checkStatus()">G-001/2026</span>
        </p>
      </div>

      <!-- Result Section -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="order" class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-yellowMain/20">
          <div class="bg-navyBlue p-6 text-white flex justify-between items-center flex-wrap gap-4">
            <div>
              <p class="text-yellowMain text-xs uppercase font-bold tracking-widest mb-1">Status Zlecenia</p>
              <h3 class="text-2xl font-bold font-Rubik">{{ order.orderNumber }}</h3>
            </div>
            <div class="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
              <p class="text-[10px] uppercase opacity-70">Ostatnia aktualizacja</p>
              <p class="font-bold">{{ new Date(order.lastUpdate).toLocaleDateString('pl-PL') }}</p>
            </div>
          </div>

          <div class="p-8">
            <div class="mb-10">
              <h4 class="text-xl font-bold text-navyBlue mb-2">{{ order.projectName }}</h4>
              <p v-if="order.notes" class="text-gray-600 bg-gray-50 p-4 rounded-2xl italic border-l-4 border-yellowMain">
                "{{ order.notes }}"
              </p>
            </div>

            <!-- Progress Bar (Desktop & Mobile Responsive) -->
            <div class="py-4">
              <!-- Desktop Horizontal Stepper -->
              <div class="hidden md:block relative pt-10 pb-4">
                <div class="h-2 bg-gray-100 rounded-full w-full absolute top-[52px]"></div>
                <div 
                  class="h-2 bg-yellowMain rounded-full absolute top-[52px] transition-all duration-1000 ease-out"
                  :style="{ width: ((getStatusIndex(order.status) - 1) / 5 * 100) + '%' }"
                ></div>

                <div class="flex justify-between relative">
                  <div v-for="(step, i) in statusSteps" :key="i" class="flex flex-col items-center group w-1/6">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center mb-3 z-10 transition-all duration-500"
                      :class="[
                        getStatusIndex(order.status) > i + 1 ? 'bg-navyBlue text-white' : 
                        getStatusIndex(order.status) === i + 1 ? 'bg-yellowMain text-navyBlue scale-125 shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-300'
                      ]"
                    >
                      <i :class="[
                        getStatusIndex(order.status) > i + 1 ? 'pi pi-check' : 
                        getStatusIndex(order.status) === i + 1 ? 'pi pi-sync pi-spin' : 'pi pi-circle-fill text-[8px]'
                      ]"></i>
                    </div>
                    <span 
                      class="text-xs font-bold text-center leading-tight transition-colors px-1"
                      :class="getStatusIndex(order.status) >= i + 1 ? 'text-navyBlue' : 'text-gray-300'"
                    >
                      {{ step }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mobile Vertical Stepper -->
              <div class="md:hidden flex flex-col space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <!-- Active line for vertical -->
                <div 
                  class="absolute left-[15px] top-2 w-0.5 bg-yellowMain transition-all duration-1000 ease-out origin-top"
                  :style="{ height: ((getStatusIndex(order.status) - 1) / 5 * 100) + '%' }"
                ></div>

                <div v-for="(step, i) in statusSteps" :key="i" class="flex items-center gap-4 relative">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 flex-shrink-0"
                    :class="[
                      getStatusIndex(order.status) > i + 1 ? 'bg-navyBlue text-white' : 
                      getStatusIndex(order.status) === i + 1 ? 'bg-yellowMain text-navyBlue scale-110 shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-300'
                    ]"
                  >
                    <i :class="[
                      getStatusIndex(order.status) > i + 1 ? 'pi pi-check' : 
                      getStatusIndex(order.status) === i + 1 ? 'pi pi-sync pi-spin' : 'pi pi-circle-fill text-[6px]'
                    ]" class="text-[10px]"></i>
                  </div>
                  <div class="flex flex-col">
                    <span 
                      class="text-sm font-bold transition-colors"
                      :class="getStatusIndex(order.status) >= i + 1 ? 'text-navyBlue' : 'text-gray-300'"
                    >
                      {{ step }}
                    </span>
                    <span v-if="getStatusIndex(order.status) === i + 1" class="text-[10px] text-yellowMain font-bold uppercase tracking-wider">Aktualny etap</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="order.status === 'Zakończono'" class="mt-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 justify-center font-bold">
              <i class="pi pi-verified text-xl"></i>
              To zlecenie zostało pomyślnie zakończone.
            </div>
            <div v-if="order.status === 'Gotowe do odbioru'" class="mt-8 p-6 bg-yellowMain/10 text-navyBlue rounded-2xl flex flex-col md:flex-row items-center gap-6 border-2 border-yellowMain border-dashed">
              <div class="w-16 h-16 bg-yellowMain rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-gift text-2xl"></i>
              </div>
              <div>
                <p class="font-bold text-lg">Dokumentacja jest gotowa!</p>
                <p class="text-sm opacity-80">Zapraszamy do biura w godzinach otwarcia w celu odbioru dokumentów.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Error Message -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="error" class="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 border border-red-100">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
          <p class="font-medium">{{ error }}</p>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 900px;
}
</style>
