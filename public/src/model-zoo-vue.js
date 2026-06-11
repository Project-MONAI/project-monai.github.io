// Vue 3 Model Zoo Application
const { createApp, ref, computed, onMounted, watch } = Vue;
const { createRouter, createWebHashHistory, useRouter, useRoute } = VueRouter;


// Sanitize semi-trusted README HTML (from model_data.json) before v-html.
// DOM-based: removes active elements, event handlers, and script-bearing URIs.
function sanitizeHtml(html) {
    const doc = new DOMParser().parseFromString(html || '', 'text/html');
    doc.querySelectorAll('script, iframe, object, embed, style, link, meta, form, base').forEach((el) => el.remove());
    doc.querySelectorAll('*').forEach((el) => {
        for (const attr of Array.from(el.attributes)) {
            const name = attr.name.toLowerCase();
            const value = attr.value.trim().toLowerCase().replace(/[\s\u0000-\u001f]+/g, '');
            if (name.startsWith('on')) el.removeAttribute(attr.name);
            else if ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'formaction' || name === 'srcdoc') &&
                     (value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:text/html'))) {
                el.removeAttribute(attr.name);
            }
        }
    });
    return doc.body.innerHTML;
}

// Shared utility: determine if a model is a MONAI Bundle
// (from huggingface.co/MONAI but NOT VILA-M3 models)
function isMonaiBundle(model) {
    if (!model.download_url) return false;
    const isFromMonaiHF = model.download_url.includes('huggingface.co/MONAI');
    const isVilaM3 = model.model_name && model.model_name.toLowerCase().includes('vila');
    return isFromMonaiHF && !isVilaM3;
}

// Featured models data (hardcoded, renders independently of model_data.json)
const featuredModels = [
    {
        id: 'maisi_ct_generative',
        name: 'MAISI',
        tagline: 'Medical AI for Synthetic Imaging',
        description: 'Generate high-resolution 3D CT images with controllable anatomy',
        icon: 'sparkles'
    },
    {
        id: 'vista3d',
        name: 'VISTA-3D',
        tagline: 'Interactive 3D Segmentation',
        description: 'Automatic, point-prompt, and class-based segmentation',
        icon: 'viewfinder'
    },
    {
        id: 'swin_unetr_btcv_segmentation',
        name: 'SwinUNETR',
        tagline: 'Swin Transformer Architecture',
        description: 'State-of-the-art results on multiple benchmarks',
        icon: 'brain'
    }
];

// Task category keywords for filtering models
const taskKeywords = {
    'segmentation': ['segmentation', 'segment', 'seg'],
    'classification': ['classification', 'classify', 'classifier'],
    'detection': ['detection', 'detect', 'detector'],
    'generation': ['generation', 'generative', 'synthesis', 'synthetic', 'generate'],
    'registration': ['registration', 'register', 'alignment'],
};

// Task categories for the filter UI
const taskCategories = [
    { key: 'all', label: 'All Tasks' },
    { key: 'segmentation', label: 'Segmentation' },
    { key: 'classification', label: 'Classification' },
    { key: 'detection', label: 'Detection' },
    { key: 'generation', label: 'Generation' },
    { key: 'registration', label: 'Registration' },
    { key: 'other', label: 'Other' }
];

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
          'flex-1 px-6 py-3 font-semibold rounded-l-lg border transition-all duration-300 text-sm',
          activeTag === 'all'
            ? 'bg-brand-primary text-gray-900 shadow-sm border-brand-primary'
            : 'bg-white text-gray-700 border-gray-200 hover:text-brand-teal hover:border-brand-primary/30'
        ]"
      >
        All Models ({{ modelCounts.total }})
      </button>
      <button
        type="button"
        @click="$emit('update:activeTag', 'bundle')"
        :class="[
          'flex-1 px-6 py-3 font-semibold border-t border-b -mx-px transition-all duration-300 text-sm',
          activeTag === 'bundle'
            ? 'bg-brand-primary text-gray-900 shadow-sm border-brand-primary'
            : 'bg-white text-gray-700 border-gray-200 hover:text-brand-teal hover:border-brand-primary/30'
        ]"
      >
        MONAI Bundles ({{ modelCounts.bundle }})
      </button>
      <button
        type="button"
        @click="$emit('update:activeTag', 'hf')"
        :class="[
          'flex-1 px-6 py-3 font-semibold rounded-r-lg border transition-all duration-300 text-sm',
          activeTag === 'hf'
            ? 'bg-brand-primary text-gray-900 shadow-sm border-brand-primary'
            : 'bg-white text-gray-700 border-gray-200 hover:text-brand-teal hover:border-brand-primary/30'
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
      return isMonaiBundle(this.model);
    }
  },
  template: `
    <div class="group bg-white p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 h-full flex flex-col">
      <div class="flex items-start justify-between mb-3 gap-2">
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-brand-teal transition-colors truncate flex-1" :title="model.model_name">{{ model.model_name }}</h3>
        <span v-if="model.version" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex-shrink-0">v{{ model.version }}</span>
      </div>

      <p class="text-gray-500 text-sm leading-relaxed mb-4 flex-grow overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;" :title="model.description">{{ model.description }}</p>

      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <span v-if="isMonaiBundle" class="px-4 py-2 bg-brand-primary/10 text-brand-teal rounded-full text-xs font-semibold border border-brand-primary/20">MONAI Bundle</span>
          <span v-else class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">HuggingFace</span>
        </div>

        <router-link
          :to="'/model/' + modelId"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-dark group/link transition-colors"
        >
          <span>View Details</span>
          <svg class="w-4 h-4 transform group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    const activeTask = ref('all');
    const sortBy = ref('name-asc');
    const searchQuery = ref('');
    const loading = ref(true);
    const error = ref(null);
    const tasks = taskCategories;

    // Helper: determine which task category a model belongs to
    function getModelTask(modelId, model) {
      const name = (model.model_name || '').toLowerCase();
      const desc = (model.description || '').toLowerCase();
      const id = modelId.toLowerCase();
      const text = name + ' ' + desc + ' ' + id;

      for (const [task, keywords] of Object.entries(taskKeywords)) {
        for (const kw of keywords) {
          if (text.includes(kw)) return task;
        }
      }
      return 'other';
    }

    const filteredModels = computed(() => {
      if (!models.value || Object.keys(models.value).length === 0) return [];

      let results = Object.entries(models.value).filter(([modelId, model]) => {
        // First filter by tag
        if (activeTag.value !== 'all') {
          const isBundle = isMonaiBundle(model);
          if (activeTag.value === 'bundle' && !isBundle) return false;
          if (activeTag.value === 'hf' && isBundle) return false;
        }

        // Filter by task category
        if (activeTask.value !== 'all') {
          const modelTask = getModelTask(modelId, model);
          if (activeTask.value !== modelTask) return false;
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

      // Apply sorting
      results.sort(([idA, a], [idB, b]) => {
        const nameA = (a.model_name || idA).toLowerCase();
        const nameB = (b.model_name || idB).toLowerCase();
        if (sortBy.value === 'name-asc') {
          return nameA.localeCompare(nameB);
        } else if (sortBy.value === 'name-desc') {
          return nameB.localeCompare(nameA);
        }
        return 0;
      });

      return results;
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

    // Analytics: debounced search tracking (zoo_search)
    let searchDebounceTimer = null;
    watch(searchQuery, (val) => {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      const query = (val || '').trim();
      if (!query) return;
      searchDebounceTimer = setTimeout(() => {
        if (window.track) {
          window.track('zoo_search', { search_term: query, results_count: filteredModels.value.length });
        }
      }, 600);
    });

    // Analytics: source tag filter (zoo_filter)
    const setTag = (tag) => {
      activeTag.value = tag;
      if (window.track) {
        window.track('zoo_filter', { filter_type: 'source', filter_value: tag === 'hf' ? 'huggingface' : tag });
      }
    };

    // Analytics: task category filter (zoo_filter)
    const setTask = (taskKey) => {
      activeTask.value = taskKey;
      if (window.track) {
        window.track('zoo_filter', { filter_type: 'task', filter_value: taskKey });
      }
    };

    // Analytics: sort option (zoo_filter)
    watch(sortBy, (val) => {
      if (window.track) {
        window.track('zoo_filter', { filter_type: 'sort', filter_value: val });
      }
    });

    const retryFetch = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await fetch('model_data.json');
        if (!response.ok) throw new Error('Failed to fetch model data');
        models.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      models,
      activeTag,
      activeTask,
      sortBy,
      searchQuery,
      loading,
      error,
      filteredModels,
      modelCounts,
      retryFetch,
      tasks,
      featuredModels,
      setTag,
      setTask
    };
  },
  template: `
    <div>
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-white via-brand-light/40 to-white">
        <div class="container relative z-10">
          <div class="py-20 md:py-24 lg:py-28">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,30rem)] gap-12 lg:gap-16 items-center">
              <div class="max-w-3xl">
                <p class="text-sm font-semibold text-brand-teal uppercase tracking-widest mb-4">Model Zoo</p>
                <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.08] mb-8">
                  Pre-trained models for <span class="text-brand-accent">medical AI</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">
                  Every model ships as a
                  <a class="text-brand-teal hover:text-brand-dark transition-colors" href="https://monai.readthedocs.io/en/latest/bundle_intro.html" target="_blank" rel="noopener noreferrer">MONAI Bundle</a>:
                  weights, training config, and inference code in one reproducible unit. Run it as-is, fine-tune it on your data, or read exactly how it was trained.
                </p>
                <div class="flex flex-wrap gap-4">
                  <a href="https://github.com/Project-MONAI/model-zoo" target="_blank" data-track="cta_click" data-track-cta-id="zoo_contribute" data-track-cta-dest="https://github.com/Project-MONAI/model-zoo" class="px-7 py-3 rounded-lg bg-brand-primary text-gray-900 font-semibold hover:bg-brand-accent transition-all duration-200 inline-flex items-center gap-2 group shadow-lg shadow-brand-primary/20">
                    Contribute a Model
                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </a>
                  <a href="https://monai.readthedocs.io/en/latest/bundle_intro.html" target="_blank" data-track="cta_click" data-track-cta-id="zoo_learn_more" data-track-cta-dest="https://monai.readthedocs.io/en/latest/bundle_intro.html" class="px-7 py-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:border-brand-primary/40 hover:text-brand-teal shadow-sm transition-all duration-200 inline-flex items-center gap-2 group">
                    Learn More
                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <aside class="hidden lg:block" aria-label="Quick start: download a model from the Zoo">
                <div class="rounded-2xl bg-surface-dark border border-white/10 shadow-2xl shadow-brand-primary/10 overflow-hidden">
                  <div class="flex items-center gap-3 px-5 py-3 border-b border-white/10">
                    <div class="flex items-center gap-1.5" aria-hidden="true">
                      <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                    </div>
                    <span class="text-xs font-mono text-gray-400">use a model from the zoo</span>
                  </div>
                  <div class="px-5 py-5 font-mono text-sm leading-relaxed overflow-x-auto">
                    <p class="m-0"><span class="text-gray-500 select-none">$ </span><span class="text-white">pip install monai</span></p>
                    <pre class="m-0 mt-4 whitespace-pre"><code><span class="text-brand-primary">from</span> <span class="text-gray-200">monai.bundle</span> <span class="text-brand-primary">import</span> <span class="text-gray-200">download, load</span>

<span class="text-gray-200">download(name=</span><span class="text-teal-300">"spleen_ct_segmentation"</span><span class="text-gray-200">,</span>
<span class="text-gray-200">         bundle_dir=</span><span class="text-teal-300">"./models"</span><span class="text-gray-200">)</span>
<span class="text-gray-200">model = load(name=</span><span class="text-teal-300">"spleen_ct_segmentation"</span><span class="text-gray-200">,</span>
<span class="text-gray-200">             bundle_dir=</span><span class="text-teal-300">"./models"</span><span class="text-gray-200">)</span></code></pre>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Models Section (always visible, independent of data loading) -->
      <section class="relative bg-gray-50 py-16">
        <div class="container relative z-10 mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-10">
            <p class="text-sm font-semibold text-brand-teal uppercase tracking-widest mb-2">Featured Models</p>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Spotlight</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="fm in featuredModels" :key="fm.id" class="min-w-[280px] flex-shrink-0 group p-6 bg-white rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
              <!-- Icon -->
              <div class="w-10 h-10 rounded-lg bg-brand-primary/15 flex items-center justify-center mb-4">
                <!-- sparkles icon -->
                <svg v-if="fm.icon === 'sparkles'" class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <!-- viewfinder icon -->
                <svg v-else-if="fm.icon === 'viewfinder'" class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 8V4a2 2 0 012-2h4M16 2h4a2 2 0 012 2v4M22 16v4a2 2 0 01-2 2h-4M8 22H4a2 2 0 01-2-2v-4M12 8v8M8 12h8"></path>
                </svg>
                <!-- cog icon -->
                <svg v-else-if="fm.icon === 'cog'" class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <!-- brain icon -->
                <svg v-else-if="fm.icon === 'brain'" class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-brand-teal transition-colors mb-1">{{ fm.name }}</h3>
              <p class="text-sm text-brand-teal font-medium mb-2">{{ fm.tagline }}</p>
              <p class="text-gray-600 text-xs leading-relaxed mb-4">{{ fm.description }}</p>
              <router-link :to="'/model/' + fm.id" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-dark transition-colors">
                View Details
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="text-center py-24">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent"></div>
        <p class="mt-6 text-gray-500 text-lg">Loading models...</p>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <div class="bg-amber-50 rounded-xl p-8 inline-block max-w-lg">
          <svg class="w-12 h-12 mx-auto text-amber-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-lg font-semibold text-gray-900 mb-2">Model data not available</p>
          <p class="text-gray-500 mb-4">The model catalog hasn't been loaded yet.</p>
          <p class="text-sm text-gray-400 mb-6">For local development, run: <code class="bg-gray-100 px-2 py-1 rounded text-brand-teal font-mono">npm run fetch-models</code></p>
          <button @click="retryFetch" class="px-6 py-2.5 rounded-lg bg-brand-primary text-gray-900 font-semibold hover:bg-brand-accent transition-all duration-200 shadow-lg shadow-brand-primary/20">
            Retry
          </button>
        </div>
      </div>

      <div v-else>
        <!-- Filter Section -->
        <section class="py-12 bg-white relative">
          <!-- Subtle top border accent -->
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>

          <div class="container mx-auto px-4">
            <div class="text-center max-w-3xl mx-auto">
              <p class="text-sm font-semibold text-brand-teal uppercase tracking-widest mb-4">Browse</p>
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Browse Models</h2>
              <p class="text-lg text-gray-500 leading-relaxed mb-8">Search and filter to find the models you need</p>

              <!-- Search and Filter Container -->
              <div class="max-w-2xl mx-auto space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search by name, description, or ID..."
                    class="w-full px-6 py-3 pl-12 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors"
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
                  @update:activeTag="setTag"
                />

                <!-- Task Category Filter -->
                <div class="flex flex-wrap gap-2 justify-center mt-4">
                  <button v-for="task in tasks" :key="task.key" @click="setTask(task.key)"
                    :class="[
                      'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                      activeTask === task.key
                        ? 'bg-brand-primary text-gray-900 shadow-sm border border-brand-primary'
                        : 'bg-white text-gray-700 border border-gray-200 hover:text-brand-teal hover:border-brand-primary/30'
                    ]">
                    {{ task.label }}
                  </button>
                </div>

                <!-- Sort Dropdown -->
                <div class="flex justify-end mt-4">
                  <select v-model="sortBy" class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Models Grid -->
        <section class="py-24 bg-gray-50">
          <div class="container mx-auto px-4">
            <div v-if="filteredModels.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-xl text-gray-900 font-bold mb-2">No models found</p>
              <p class="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      if (!readme) return sanitizeHtml(readme);

      // Remove YAML frontmatter (everything between --- or between first <hr/> tags with metadata)
      let cleaned = readme;

      // Pattern 1: Remove content between <hr/> tags that contains license/tags
      cleaned = cleaned.replace(/<hr\/>\s*<p>license:[\s\S]*?<\/p>\s*<hr\/>/i, '');

      // Pattern 2: Remove YAML frontmatter between --- markers
      cleaned = cleaned.replace(/^---[\s\S]*?---\s*/m, '');

      return sanitizeHtml(cleaned.trim());
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
          // Analytics: model detail view
          if (window.track) {
            window.track('zoo_model_view', { model_id: modelId });
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

    const modelIsMonaiBundle = computed(() => {
      return model.value ? isMonaiBundle(model.value) : false;
    });

    const modelId = computed(() => route.params.id);

    return {
      model,
      loading,
      error,
      goBack,
      modelIsMonaiBundle,
      modelId
    };
  },
  template: `
    <div>
      <!-- Back Navigation Bar -->
      <div class="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <button
            @click="goBack"
            class="group inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-brand-primary/30 text-gray-700 hover:text-brand-teal font-medium transition-all duration-200 shadow-sm"
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
        <p class="mt-6 text-gray-500 text-lg">Loading model details...</p>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <div class="bg-amber-50 rounded-xl p-8 inline-block max-w-lg">
          <svg class="w-12 h-12 mx-auto text-amber-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-lg font-semibold text-gray-900 mb-2">Model not available</p>
          <p class="text-gray-500 mb-6">{{ error }}</p>
          <button @click="goBack" class="px-6 py-2.5 rounded-lg bg-brand-primary text-gray-900 font-semibold hover:bg-brand-accent transition-all duration-200 shadow-lg shadow-brand-primary/20 inline-flex items-center gap-2 group">
            <svg class="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Model Zoo
          </button>
        </div>
      </div>

      <div v-else-if="model" class="container mx-auto px-4 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Model Header -->
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{{ model.model_name }}</h1>
            <p class="text-lg text-gray-500 leading-relaxed">{{ model.description }}</p>
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Sidebar -->
            <div class="lg:col-span-4">
              <div class="lg:sticky lg:top-24 space-y-6">
                <!-- Model Info Card -->
                <div class="bg-white p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">Model Information</h3>

                  <div class="space-y-4">
                    <div v-if="model.authors">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Authors</h4>
                      <p class="text-gray-900 mt-1">{{ model.authors }}</p>
                    </div>

                    <div v-if="model.version">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Version</h4>
                      <p class="text-gray-900 mt-1">{{ model.version }}</p>
                    </div>

                    <div v-if="model.download_url || model.huggingface_url">
                      <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Type</h4>
                      <p class="text-gray-900 mt-1">
                        {{ modelIsMonaiBundle ? 'MONAI Bundle' : 'HuggingFace Model' }}
                      </p>
                    </div>
                  </div>

                  <!-- Download Button -->
                  <div v-if="model.download_url || model.huggingface_url" class="mt-6">
                    <a
                      :href="model.download_url || model.huggingface_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="zoo_outbound"
                      :data-track-model-id="modelId"
                      :data-track-dest="model.download_url || model.huggingface_url"
                      class="w-full px-7 py-3 rounded-lg bg-brand-primary text-gray-900 font-semibold hover:bg-brand-accent transition-all duration-200 inline-flex items-center justify-center gap-2 group shadow-lg shadow-brand-primary/20"
                    >
                      {{ (model.download_url || model.huggingface_url).includes('huggingface.co') ? 'View on Hugging Face' : 'Download Model' }}
                      <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- References -->
                <div v-if="model.papers && model.papers.length > 0" class="bg-white p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">References</h3>
                  <ul class="space-y-3">
                    <li v-for="(paper, index) in model.papers" :key="index" class="flex items-start gap-3 text-sm text-gray-500 leading-relaxed">
                      <span class="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 mt-2"></span>
                      <span>{{ paper }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Version History -->
                <div v-if="model.changelog && Object.keys(model.changelog).length > 0" class="bg-white p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">Version History</h3>
                  <div class="max-h-64 overflow-y-auto space-y-3">
                    <div v-for="(changes, version) in model.changelog" :key="version" class="border-l-2 border-brand-primary/20 pl-4">
                      <h4 class="font-semibold text-gray-900">v{{ version }}</h4>
                      <p class="text-sm text-gray-500">{{ changes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Content - Documentation -->
            <div class="lg:col-span-8">
              <div v-if="model.readme" class="bg-white p-8 rounded-xl border border-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight mb-6">Documentation</h2>
                <div class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-brand-teal prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded" v-html="model.readme"></div>
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
