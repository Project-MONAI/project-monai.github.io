// Vue 3 Model Zoo Application
const { createApp, ref, computed, onMounted, watch } = Vue;
const { createRouter, createWebHashHistory, useRouter, useRoute } = VueRouter;

// TagFilter Component
const TagFilter = {
  props: ['activeTag', 'modelCounts'],
  emits: ['update:activeTag'],
  template: `
    <div class="flex w-full" role="group">
      <button
        type="button"
        @click="$emit('update:activeTag', 'all')"
        :class="[
          'flex-1 px-6 py-3 font-medium rounded-l-lg border-2 transition-all duration-300',
          activeTag === 'all' 
            ? 'bg-brand-primary text-white border-brand-primary' 
            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white'
        ]"
      >
        All Models ({{ modelCounts.total }})
      </button>
      <button
        type="button"
        @click="$emit('update:activeTag', 'bundle')"
        :class="[
          'flex-1 px-6 py-3 font-medium border-t-2 border-b-2 -mx-px transition-all duration-300',
          activeTag === 'bundle' 
            ? 'bg-brand-primary text-white border-brand-primary' 
            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white'
        ]"
      >
        MONAI Bundles ({{ modelCounts.bundle }})
      </button>
      <button
        type="button"
        @click="$emit('update:activeTag', 'hf')"
        :class="[
          'flex-1 px-6 py-3 font-medium rounded-r-lg border-2 transition-all duration-300',
          activeTag === 'hf' 
            ? 'bg-brand-primary text-white border-brand-primary' 
            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white'
        ]"
      >
        HuggingFace ({{ modelCounts.hf }})
      </button>
    </div>
  `
};

// ModelCard Component
const ModelCard = {
  props: ['model', 'modelId'],
  computed: {
    isMonaiBundle() {
      if (!this.model.download_url) return false;
      const isFromMonaiHF = this.model.download_url.includes('huggingface.co/MONAI');
      const isVilaM3 = this.model.model_name && this.model.model_name.toLowerCase().includes('vila');
      return isFromMonaiHF && !isVilaM3;
    }
  },
  template: `
    <div class="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col hover:border-brand-primary hover:shadow-md transition-all duration-200 group">
      <div class="flex items-start justify-between mb-3 gap-2">
        <h3 class="text-base font-semibold text-gray-800 group-hover:text-brand-primary transition-colors truncate flex-1" :title="model.model_name">{{ model.model_name }}</h3>
        <span v-if="model.version" class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">v{{ model.version }}</span>
      </div>
      
      <p class="text-gray-600 mb-4 flex-grow overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;" :title="model.description">{{ model.description }}</p>
      
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <span v-if="isMonaiBundle" class="text-xs font-medium px-2 py-1 bg-brand-light text-brand-dark rounded">MONAI Bundle</span>
          <span v-else class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">HuggingFace</span>
        </div>
        
        <router-link 
          :to="'/model/' + modelId"
          class="text-brand-primary hover:text-brand-dark font-medium transition-colors inline-flex items-center group/link"
        >
          <span>View Details</span>
          <svg class="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
    </div>
  `
};

// Model List View
const ModelListView = {
  components: { TagFilter, ModelCard },
  setup() {
    const models = ref({});
    const activeTag = ref('all');
    const searchQuery = ref('');
    const loading = ref(true);
    const error = ref(null);

    const isMonaiBundle = (model) => {
      if (!model.download_url) return false;
      // MONAI Bundle: from https://huggingface.co/MONAI but NOT VILA-M3 models
      const isFromMonaiHF = model.download_url.includes('huggingface.co/MONAI');
      const isVilaM3 = model.model_name && model.model_name.toLowerCase().includes('vila');
      return isFromMonaiHF && !isVilaM3;
    };

    const filteredModels = computed(() => {
      if (!models.value || Object.keys(models.value).length === 0) return [];
      
      return Object.entries(models.value).filter(([modelId, model]) => {
        // First filter by tag
        if (activeTag.value !== 'all') {
          const isBundle = isMonaiBundle(model);
          if (activeTag.value === 'bundle' && !isBundle) return false;
          if (activeTag.value === 'hf' && isBundle) return false;
        }
        
        // Then filter by search query
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          const nameMatch = model.model_name && model.model_name.toLowerCase().includes(query);
          const descMatch = model.description && model.description.toLowerCase().includes(query);
          const idMatch = modelId.toLowerCase().includes(query);
          return nameMatch || descMatch || idMatch;
        }
        
        return true;
      });
    });

    const modelCounts = computed(() => {
      if (!models.value) return { total: 0, bundle: 0, hf: 0 };
      
      // Filter models by search query first
      const searchFiltered = Object.entries(models.value).filter(([modelId, model]) => {
        if (!searchQuery.value.trim()) return true;
        
        const query = searchQuery.value.toLowerCase();
        const nameMatch = model.model_name && model.model_name.toLowerCase().includes(query);
        const descMatch = model.description && model.description.toLowerCase().includes(query);
        const idMatch = modelId.toLowerCase().includes(query);
        return nameMatch || descMatch || idMatch;
      });
      
      // Then count by type
      const searchFilteredModels = searchFiltered.map(([_, model]) => model);
      const bundleModels = searchFilteredModels.filter(m => isMonaiBundle(m));
      const hfModels = searchFilteredModels.filter(m => !isMonaiBundle(m));
      
      return {
        total: searchFilteredModels.length,
        bundle: bundleModels.length,
        hf: hfModels.length
      };
    });

    onMounted(async () => {
      try {
        const response = await fetch('model_data.json');
        if (!response.ok) throw new Error('Failed to fetch model data');
        models.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      models,
      activeTag,
      searchQuery,
      loading,
      error,
      filteredModels,
      modelCounts
    };
  },
  template: `
    <div>
      <!-- Hero Section -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div class="pr-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-8 relative inline-block pb-2">
                MONAI Model Zoo
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"></span>
              </h1>
              <div class="prose max-w-none">
                <p class="text-base leading-relaxed text-gray-600">
                  Discover and download state-of-the-art medical imaging models in the MONAI Bundle format.
                </p>
                <p class="text-base leading-relaxed text-gray-600">
                  The MONAI Model Zoo is a collection of pre-trained medical imaging models, ready for research and clinical deployment. Each model is packaged in the
                  <a class="text-brand-primary hover:text-brand-dark transition-colors mx-1" href="https://docs.monai.io/en/latest/bundle_intro.html" target="_blank" rel="noopener noreferrer">MONAI Bundle</a>
                  format, ensuring reproducibility and ease of use.
                </p>
                <p class="text-base leading-relaxed text-gray-600">
                  Our models cover a wide range of medical imaging tasks, from segmentation to classification, and are validated through rigorous testing and real-world applications. Whether you're a researcher, clinician, or developer, you'll find models that can accelerate your medical AI journey.
                </p>
              </div>
              <div class="mt-8 flex flex-wrap gap-4">
                <a href="https://github.com/Project-MONAI/model-zoo" target="_blank" class="px-6 py-2.5 rounded-lg bg-brand-primary text-white hover:bg-brand-dark transition-colors inline-flex items-center gap-2 group">
                  <span>Contribute a Model</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </a>
                <a href="https://docs.monai.io/en/latest/bundle_intro.html" target="_blank" class="px-6 py-2.5 rounded-lg bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span>Learn More</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="hidden lg:block pl-8">
              <div class="relative w-full max-w-lg">
                <img class="w-full h-auto rounded-lg" src="assets/img/community_header.png" alt="MONAI Model Zoo Illustration">
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="text-center py-24">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent"></div>
        <p class="mt-6 text-gray-600 text-base">Loading models...</p>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <div class="bg-red-50 rounded-lg p-8 inline-block">
          <p class="text-red-600 text-base">Error loading models: {{ error }}</p>
        </div>
      </div>

      <div v-else>
        <!-- Filter Section -->
        <section class="py-12 bg-gray-50">
          <div class="container mx-auto px-4">
            <div class="text-center">
              <h2 class="text-lg font-bold text-gray-800 mb-2">Browse Models</h2>
              <p class="text-gray-600 mb-8">Search and filter to find the models you need</p>
              
              <!-- Search and Filter Container -->
              <div class="max-w-2xl mx-auto space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search by name, description, or ID..."
                    class="w-full px-6 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                  >
                  <svg class="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- Tag Filter -->
                <TagFilter 
                  :activeTag="activeTag" 
                  :modelCounts="modelCounts"
                  @update:activeTag="activeTag = $event"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Models Grid -->
        <section class="py-16 bg-brand-dark/15">
          <div class="container mx-auto px-4">
            <div v-if="filteredModels.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-base text-gray-600 mb-2">No models found</p>
              <p class="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ModelCard 
                v-for="[modelId, model] in filteredModels" 
                :key="modelId"
                :model="model"
                :modelId="modelId"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  `
};

// Model Detail View
const ModelDetailView = {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const model = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // Function to clean up HuggingFace model readmes
    const cleanReadme = (readme) => {
      if (!readme) return readme;
      
      // Remove YAML frontmatter (everything between --- or between first <hr/> tags with metadata)
      let cleaned = readme;
      
      // Pattern 1: Remove content between <hr/> tags that contains license/tags
      cleaned = cleaned.replace(/<hr\/>\s*<p>license:[\s\S]*?<\/p>\s*<hr\/>/i, '');
      
      // Pattern 2: Remove YAML frontmatter between --- markers
      cleaned = cleaned.replace(/^---[\s\S]*?---\s*/m, '');
      
      return cleaned.trim();
    };

    onMounted(async () => {
      // Scroll to top when component mounts
      window.scrollTo(0, 0);
      
      try {
        const response = await fetch('model_data.json');
        if (!response.ok) throw new Error('Failed to fetch model data');
        const data = await response.json();
        const modelId = route.params.id;
        
        if (data[modelId]) {
          model.value = data[modelId];
          // Clean up the readme if it exists
          if (model.value.readme) {
            model.value.readme = cleanReadme(model.value.readme);
          }
        } else {
          throw new Error('Model not found');
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    const goBack = () => {
      router.push('/');
    };

    return {
      model,
      loading,
      error,
      goBack
    };
  },
  template: `
    <div>
      <!-- Back Navigation Bar -->
      <div class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <button 
            @click="goBack"
            class="group inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-brand-primary hover:bg-brand-primary hover:text-white text-gray-700 hover:text-brand-dark font-medium transition-all duration-200 shadow-sm"
          >
            <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Model Zoo
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-24">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent"></div>
        <p class="mt-6 text-gray-600 text-base">Loading model details...</p>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <div class="bg-red-50 rounded-lg p-8 inline-block">
          <p class="text-red-600 text-base">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="model" class="container mx-auto px-4 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Model Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">{{ model.model_name }}</h1>
            <p class="text-base text-gray-700 leading-relaxed">{{ model.description }}</p>
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Sidebar -->
            <div class="lg:col-span-4">
              <div class="lg:sticky lg:top-24 space-y-6">
                <!-- Model Info Card -->
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-base font-semibold text-gray-800 mb-4">Model Information</h3>
                  
                  <div class="space-y-4">
                    <div v-if="model.authors">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Authors</h4>
                      <p class="text-gray-800 mt-1">{{ model.authors }}</p>
                    </div>
                    
                    <div v-if="model.version">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Version</h4>
                      <p class="text-gray-800 mt-1">{{ model.version }}</p>
                    </div>
                    
                    <div v-if="model.download_url || model.huggingface_url">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Type</h4>
                      <p class="text-gray-800 mt-1">
                        {{ ((model.download_url || model.huggingface_url).includes('huggingface.co/MONAI') && !model.model_name.toLowerCase().includes('vila')) ? 'MONAI Bundle' : 'HuggingFace Model' }}
                      </p>
                    </div>
                  </div>

                  <!-- Download Button -->
                  <div v-if="model.download_url || model.huggingface_url" class="mt-6">
                    <a
                      :href="model.download_url || model.huggingface_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-dark transition-all duration-300"
                    >
                      {{ (model.download_url || model.huggingface_url).includes('huggingface.co') ? 'View on Hugging Face' : 'Download Model' }}
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- References -->
                <div v-if="model.papers && model.papers.length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-base font-semibold text-gray-800 mb-4">References</h3>
                  <ul class="space-y-2">
                    <li v-for="(paper, index) in model.papers" :key="index" class="text-sm text-gray-700 leading-relaxed">
                      <span class="text-brand-primary mr-2">•</span>{{ paper }}
                    </li>
                  </ul>
                </div>

                <!-- Version History -->
                <div v-if="model.changelog && Object.keys(model.changelog).length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-base font-semibold text-gray-800 mb-4">Version History</h3>
                  <div class="max-h-64 overflow-y-auto space-y-3">
                    <div v-for="(changes, version) in model.changelog" :key="version" class="border-l-2 border-gray-200 pl-4">
                      <h4 class="font-medium text-gray-800">v{{ version }}</h4>
                      <p class="text-sm text-gray-600">{{ changes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Content - Documentation -->
            <div class="lg:col-span-8">
              <div v-if="model.readme" class="bg-white border border-gray-200 rounded-lg p-8">
                <h2 class="text-lg font-bold text-gray-800 mb-6">Documentation</h2>
                <div class="prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded" v-html="model.readme"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

// Router configuration
const routes = [
  { path: '/', component: ModelListView },
  { path: '/model/:id', component: ModelDetailView }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Main App
const app = createApp({
  template: `
    <div class="min-h-screen">
      <router-view></router-view>
    </div>
  `
});

app.use(router);
app.mount('#app');