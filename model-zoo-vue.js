"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Vue 3 Model Zoo Application
var _Vue = Vue,
  createApp = _Vue.createApp,
  ref = _Vue.ref,
  computed = _Vue.computed,
  onMounted = _Vue.onMounted,
  watch = _Vue.watch;
var _VueRouter = VueRouter,
  createRouter = _VueRouter.createRouter,
  createWebHashHistory = _VueRouter.createWebHashHistory,
  useRouter = _VueRouter.useRouter,
  useRoute = _VueRouter.useRoute;

// TagFilter Component
var TagFilter = {
  props: ['activeTag', 'modelCounts'],
  emits: ['update:activeTag'],
  template: "\n    <div class=\"flex w-full\" role=\"group\">\n      <button\n        type=\"button\"\n        @click=\"$emit('update:activeTag', 'all')\"\n        :class=\"[\n          'flex-1 px-6 py-3 font-medium rounded-l-lg border-2 transition-all duration-300',\n          activeTag === 'all' \n            ? 'bg-brand-primary text-white border-brand-primary' \n            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-light'\n        ]\"\n      >\n        All Models ({{ modelCounts.total }})\n      </button>\n      <button\n        type=\"button\"\n        @click=\"$emit('update:activeTag', 'bundle')\"\n        :class=\"[\n          'flex-1 px-6 py-3 font-medium border-t-2 border-b-2 -mx-px transition-all duration-300',\n          activeTag === 'bundle' \n            ? 'bg-brand-primary text-white border-brand-primary' \n            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-light'\n        ]\"\n      >\n        MONAI Bundles ({{ modelCounts.bundle }})\n      </button>\n      <button\n        type=\"button\"\n        @click=\"$emit('update:activeTag', 'hf')\"\n        :class=\"[\n          'flex-1 px-6 py-3 font-medium rounded-r-lg border-2 transition-all duration-300',\n          activeTag === 'hf' \n            ? 'bg-brand-primary text-white border-brand-primary' \n            : 'bg-white text-brand-primary border-brand-primary hover:bg-brand-light'\n        ]\"\n      >\n        HuggingFace ({{ modelCounts.hf }})\n      </button>\n    </div>\n  "
};

// ModelCard Component
var ModelCard = {
  props: ['model', 'modelId'],
  computed: {
    isMonaiBundle: function isMonaiBundle() {
      if (!this.model.download_url) return false;
      var isFromMonaiHF = this.model.download_url.includes('huggingface.co/MONAI');
      var isVilaM3 = this.model.model_name && this.model.model_name.toLowerCase().includes('vila');
      return isFromMonaiHF && !isVilaM3;
    }
  },
  template: "\n    <div class=\"bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col hover:border-brand-primary hover:shadow-md transition-all duration-200 group\">\n      <div class=\"flex items-start justify-between mb-3 gap-2\">\n        <h3 class=\"text-xl font-semibold text-gray-800 group-hover:text-brand-primary transition-colors truncate flex-1\" :title=\"model.model_name\">{{ model.model_name }}</h3>\n        <span v-if=\"model.version\" class=\"text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0\">v{{ model.version }}</span>\n      </div>\n      \n      <p class=\"text-gray-600 mb-4 flex-grow overflow-hidden\" style=\"display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;\" :title=\"model.description\">{{ model.description }}</p>\n      \n      <div class=\"flex items-center justify-between pt-4 border-t border-gray-100\">\n        <div class=\"flex items-center gap-2\">\n          <span v-if=\"isMonaiBundle\" class=\"text-xs font-medium px-2 py-1 bg-brand-light text-brand-dark rounded\">MONAI Bundle</span>\n          <span v-else class=\"text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded\">HuggingFace</span>\n        </div>\n        \n        <router-link \n          :to=\"'/model/' + modelId\"\n          class=\"text-brand-primary hover:text-brand-dark font-medium transition-colors inline-flex items-center group/link\"\n        >\n          <span>View Details</span>\n          <svg class=\"w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"></path>\n          </svg>\n        </router-link>\n      </div>\n    </div>\n  "
};

// Model List View
var ModelListView = {
  components: {
    TagFilter: TagFilter,
    ModelCard: ModelCard
  },
  setup: function setup() {
    var models = ref({});
    var activeTag = ref('all');
    var searchQuery = ref('');
    var loading = ref(true);
    var error = ref(null);
    var isMonaiBundle = function isMonaiBundle(model) {
      if (!model.download_url) return false;
      // MONAI Bundle: from https://huggingface.co/MONAI but NOT VILA-M3 models
      var isFromMonaiHF = model.download_url.includes('huggingface.co/MONAI');
      var isVilaM3 = model.model_name && model.model_name.toLowerCase().includes('vila');
      return isFromMonaiHF && !isVilaM3;
    };
    var filteredModels = computed(function () {
      if (!models.value || Object.keys(models.value).length === 0) return [];
      return Object.entries(models.value).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          modelId = _ref2[0],
          model = _ref2[1];
        // First filter by tag
        if (activeTag.value !== 'all') {
          var isBundle = isMonaiBundle(model);
          if (activeTag.value === 'bundle' && !isBundle) return false;
          if (activeTag.value === 'hf' && isBundle) return false;
        }

        // Then filter by search query
        if (searchQuery.value.trim()) {
          var query = searchQuery.value.toLowerCase();
          var nameMatch = model.model_name && model.model_name.toLowerCase().includes(query);
          var descMatch = model.description && model.description.toLowerCase().includes(query);
          var idMatch = modelId.toLowerCase().includes(query);
          return nameMatch || descMatch || idMatch;
        }
        return true;
      });
    });
    var modelCounts = computed(function () {
      if (!models.value) return {
        total: 0,
        bundle: 0,
        hf: 0
      };

      // Filter models by search query first
      var searchFiltered = Object.entries(models.value).filter(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          modelId = _ref4[0],
          model = _ref4[1];
        if (!searchQuery.value.trim()) return true;
        var query = searchQuery.value.toLowerCase();
        var nameMatch = model.model_name && model.model_name.toLowerCase().includes(query);
        var descMatch = model.description && model.description.toLowerCase().includes(query);
        var idMatch = modelId.toLowerCase().includes(query);
        return nameMatch || descMatch || idMatch;
      });

      // Then count by type
      var searchFilteredModels = searchFiltered.map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          _ = _ref6[0],
          model = _ref6[1];
        return model;
      });
      var bundleModels = searchFilteredModels.filter(function (m) {
        return isMonaiBundle(m);
      });
      var hfModels = searchFilteredModels.filter(function (m) {
        return !isMonaiBundle(m);
      });
      return {
        total: searchFilteredModels.length,
        bundle: bundleModels.length,
        hf: hfModels.length
      };
    });
    onMounted(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch('model_data.json');
          case 3:
            response = _context.sent;
            if (response.ok) {
              _context.next = 6;
              break;
            }
            throw new Error('Failed to fetch model data');
          case 6:
            _context.next = 8;
            return response.json();
          case 8:
            models.value = _context.sent;
            _context.next = 14;
            break;
          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            error.value = _context.t0.message;
          case 14:
            _context.prev = 14;
            loading.value = false;
            return _context.finish(14);
          case 17:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 11, 14, 17]]);
    })));
    return {
      models: models,
      activeTag: activeTag,
      searchQuery: searchQuery,
      loading: loading,
      error: error,
      filteredModels: filteredModels,
      modelCounts: modelCounts
    };
  },
  template: "\n    <div>\n      <!-- Hero Section -->\n      <section class=\"py-24 bg-white\">\n        <div class=\"container mx-auto px-4\">\n          <div class=\"grid grid-cols-1 lg:grid-cols-2 gap-20 items-center\">\n            <div class=\"pr-8\">\n              <h1 class=\"text-4xl font-bold text-gray-800 mb-8 relative inline-block pb-2\">\n                MONAI Model Zoo\n                <span class=\"absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary\"></span>\n              </h1>\n              <div class=\"prose max-w-none\">\n                <p class=\"text-lg leading-relaxed text-gray-700\">\n                  Discover and download state-of-the-art medical imaging models in the MONAI Bundle format.\n                </p>\n                <p class=\"text-lg leading-relaxed text-gray-700\">\n                  The MONAI Model Zoo is a collection of pre-trained medical imaging models, ready for research and clinical deployment. Each model is packaged in the\n                  <a class=\"text-brand-primary hover:text-brand-dark transition-colors mx-1\" href=\"https://docs.monai.io/en/latest/bundle_intro.html\" target=\"_blank\" rel=\"noopener noreferrer\">MONAI Bundle</a>\n                  format, ensuring reproducibility and ease of use.\n                </p>\n                <p class=\"text-lg leading-relaxed text-gray-700\">\n                  Our models cover a wide range of medical imaging tasks, from segmentation to classification, and are validated through rigorous testing and real-world applications. Whether you're a researcher, clinician, or developer, you'll find models that can accelerate your medical AI journey.\n                </p>\n              </div>\n              <div class=\"mt-8 flex flex-wrap gap-4\">\n                <a href=\"https://github.com/Project-MONAI/model-zoo\" target=\"_blank\" class=\"px-6 py-2.5 rounded-lg bg-brand-primary text-white hover:bg-brand-dark transition-colors inline-flex items-center gap-2 group\">\n                  <span>Contribute a Model</span>\n                  <svg class=\"w-4 h-4 transition-transform group-hover:translate-x-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 7l5 5m0 0l-5 5m5-5H6\"></path>\n                  </svg>\n                </a>\n                <a href=\"https://docs.monai.io/en/latest/bundle_intro.html\" target=\"_blank\" class=\"px-6 py-2.5 rounded-lg bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-light transition-colors inline-flex items-center gap-2 group\">\n                  <span>Learn More</span>\n                  <svg class=\"w-4 h-4 transition-transform group-hover:translate-x-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 7l5 5m0 0l-5 5m5-5H6\"></path>\n                  </svg>\n                </a>\n              </div>\n            </div>\n            <div class=\"hidden lg:block pl-8\">\n              <div class=\"relative w-full max-w-lg\">\n                <img class=\"w-full h-auto rounded-lg\" src=\"assets/img/community_header.png\" alt=\"MONAI Model Zoo Illustration\">\n              </div>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <div v-if=\"loading\" class=\"text-center py-24\">\n        <div class=\"inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent\"></div>\n        <p class=\"mt-6 text-gray-600 text-lg\">Loading models...</p>\n      </div>\n\n      <div v-else-if=\"error\" class=\"text-center py-24\">\n        <div class=\"bg-red-50 rounded-lg p-8 inline-block\">\n          <p class=\"text-red-600 text-lg\">Error loading models: {{ error }}</p>\n        </div>\n      </div>\n\n      <div v-else>\n        <!-- Filter Section -->\n        <section class=\"py-12 bg-gray-50\">\n          <div class=\"container mx-auto px-4\">\n            <div class=\"text-center\">\n              <h2 class=\"text-2xl font-bold text-gray-800 mb-2\">Browse Models</h2>\n              <p class=\"text-gray-600 mb-8\">Search and filter to find the models you need</p>\n              \n              <!-- Search and Filter Container -->\n              <div class=\"max-w-2xl mx-auto space-y-4\">\n                <!-- Search Bar -->\n                <div class=\"relative\">\n                  <input\n                    type=\"text\"\n                    v-model=\"searchQuery\"\n                    placeholder=\"Search by name, description, or ID...\"\n                    class=\"w-full px-6 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors\"\n                  >\n                  <svg class=\"absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\"></path>\n                  </svg>\n                  <button\n                    v-if=\"searchQuery\"\n                    @click=\"searchQuery = ''\"\n                    class=\"absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600\"\n                  >\n                    <svg class=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                      <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\"></path>\n                    </svg>\n                  </button>\n                </div>\n                \n                <!-- Tag Filter -->\n                <TagFilter \n                  :activeTag=\"activeTag\" \n                  :modelCounts=\"modelCounts\"\n                  @update:activeTag=\"activeTag = $event\"\n                />\n              </div>\n            </div>\n          </div>\n        </section>\n\n        <!-- Models Grid -->\n        <section class=\"py-16 bg-white\">\n          <div class=\"container mx-auto px-4\">\n            <div v-if=\"filteredModels.length === 0\" class=\"text-center py-12\">\n              <svg class=\"w-16 h-16 mx-auto text-gray-400 mb-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\"></path>\n              </svg>\n              <p class=\"text-xl text-gray-600 mb-2\">No models found</p>\n              <p class=\"text-gray-500\">Try adjusting your search or filter criteria</p>\n            </div>\n            <div v-else class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">\n              <ModelCard \n                v-for=\"[modelId, model] in filteredModels\" \n                :key=\"modelId\"\n                :model=\"model\"\n                :modelId=\"modelId\"\n              />\n            </div>\n          </div>\n        </section>\n      </div>\n    </div>\n  "
};

// Model Detail View
var ModelDetailView = {
  setup: function setup() {
    var route = useRoute();
    var router = useRouter();
    var model = ref(null);
    var loading = ref(true);
    var error = ref(null);

    // Function to clean up HuggingFace model readmes
    var cleanReadme = function cleanReadme(readme) {
      if (!readme) return readme;

      // Remove YAML frontmatter (everything between --- or between first <hr/> tags with metadata)
      var cleaned = readme;

      // Pattern 1: Remove content between <hr/> tags that contains license/tags
      cleaned = cleaned.replace(/<hr\/>\s*<p>license:[\s\S]*?<\/p>\s*<hr\/>/i, '');

      // Pattern 2: Remove YAML frontmatter between --- markers
      cleaned = cleaned.replace(/^---[\s\S]*?---\s*/m, '');
      return cleaned.trim();
    };
    onMounted(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var response, data, modelId;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            // Scroll to top when component mounts
            window.scrollTo(0, 0);
            _context2.prev = 1;
            _context2.next = 4;
            return fetch('model_data.json');
          case 4:
            response = _context2.sent;
            if (response.ok) {
              _context2.next = 7;
              break;
            }
            throw new Error('Failed to fetch model data');
          case 7:
            _context2.next = 9;
            return response.json();
          case 9:
            data = _context2.sent;
            modelId = route.params.id;
            if (!data[modelId]) {
              _context2.next = 16;
              break;
            }
            model.value = data[modelId];
            // Clean up the readme if it exists
            if (model.value.readme) {
              model.value.readme = cleanReadme(model.value.readme);
            }
            _context2.next = 17;
            break;
          case 16:
            throw new Error('Model not found');
          case 17:
            _context2.next = 22;
            break;
          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](1);
            error.value = _context2.t0.message;
          case 22:
            _context2.prev = 22;
            loading.value = false;
            return _context2.finish(22);
          case 25:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 19, 22, 25]]);
    })));
    var goBack = function goBack() {
      router.push('/');
    };
    return {
      model: model,
      loading: loading,
      error: error,
      goBack: goBack
    };
  },
  template: "\n    <div>\n      <!-- Back Navigation Bar -->\n      <div class=\"bg-gray-50 border-b border-gray-200 sticky top-0 z-10\">\n        <div class=\"container mx-auto px-4 py-4\">\n          <button \n            @click=\"goBack\"\n            class=\"group inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-brand-primary hover:bg-brand-light text-gray-700 hover:text-brand-dark font-medium transition-all duration-200 shadow-sm\"\n          >\n            <svg class=\"w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 19l-7-7 7-7\"></path>\n            </svg>\n            Back to Model Zoo\n          </button>\n        </div>\n      </div>\n\n      <div v-if=\"loading\" class=\"text-center py-24\">\n        <div class=\"inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent\"></div>\n        <p class=\"mt-6 text-gray-600 text-lg\">Loading model details...</p>\n      </div>\n\n      <div v-else-if=\"error\" class=\"text-center py-24\">\n        <div class=\"bg-red-50 rounded-lg p-8 inline-block\">\n          <p class=\"text-red-600 text-lg\">{{ error }}</p>\n        </div>\n      </div>\n\n      <div v-else-if=\"model\" class=\"container mx-auto px-4 py-8\">\n        <div class=\"max-w-7xl mx-auto\">\n          <!-- Model Header -->\n          <div class=\"mb-8\">\n            <h1 class=\"text-4xl font-bold text-gray-800 mb-4\">{{ model.model_name }}</h1>\n            <p class=\"text-xl text-gray-700 leading-relaxed\">{{ model.description }}</p>\n          </div>\n\n          <!-- Two Column Layout -->\n          <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-8\">\n            <!-- Left Sidebar -->\n            <div class=\"lg:col-span-4\">\n              <div class=\"lg:sticky lg:top-24 space-y-6\">\n                <!-- Model Info Card -->\n                <div class=\"bg-white border border-gray-200 rounded-lg p-6\">\n                  <h3 class=\"text-lg font-semibold text-gray-800 mb-4\">Model Information</h3>\n                  \n                  <div class=\"space-y-4\">\n                    <div v-if=\"model.authors\">\n                      <h4 class=\"text-sm font-medium text-gray-500 uppercase tracking-wide\">Authors</h4>\n                      <p class=\"text-gray-800 mt-1\">{{ model.authors }}</p>\n                    </div>\n                    \n                    <div v-if=\"model.version\">\n                      <h4 class=\"text-sm font-medium text-gray-500 uppercase tracking-wide\">Version</h4>\n                      <p class=\"text-gray-800 mt-1\">{{ model.version }}</p>\n                    </div>\n                    \n                    <div v-if=\"model.download_url || model.huggingface_url\">\n                      <h4 class=\"text-sm font-medium text-gray-500 uppercase tracking-wide\">Type</h4>\n                      <p class=\"text-gray-800 mt-1\">\n                        {{ ((model.download_url || model.huggingface_url).includes('huggingface.co/MONAI') && !model.model_name.toLowerCase().includes('vila')) ? 'MONAI Bundle' : 'HuggingFace Model' }}\n                      </p>\n                    </div>\n                  </div>\n\n                  <!-- Download Button -->\n                  <div v-if=\"model.download_url || model.huggingface_url\" class=\"mt-6\">\n                    <a\n                      :href=\"model.download_url || model.huggingface_url\"\n                      target=\"_blank\"\n                      rel=\"noopener noreferrer\"\n                      class=\"w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-dark transition-all duration-300\"\n                    >\n                      {{ (model.download_url || model.huggingface_url).includes('huggingface.co') ? 'View on Hugging Face' : 'Download Model' }}\n                      <svg class=\"w-5 h-5 ml-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14\"></path>\n                      </svg>\n                    </a>\n                  </div>\n                </div>\n\n                <!-- References -->\n                <div v-if=\"model.papers && model.papers.length > 0\" class=\"bg-white border border-gray-200 rounded-lg p-6\">\n                  <h3 class=\"text-lg font-semibold text-gray-800 mb-4\">References</h3>\n                  <ul class=\"space-y-2\">\n                    <li v-for=\"(paper, index) in model.papers\" :key=\"index\" class=\"text-sm text-gray-700 leading-relaxed\">\n                      <span class=\"text-brand-primary mr-2\">\u2022</span>{{ paper }}\n                    </li>\n                  </ul>\n                </div>\n\n                <!-- Version History -->\n                <div v-if=\"model.changelog && Object.keys(model.changelog).length > 0\" class=\"bg-white border border-gray-200 rounded-lg p-6\">\n                  <h3 class=\"text-lg font-semibold text-gray-800 mb-4\">Version History</h3>\n                  <div class=\"max-h-64 overflow-y-auto space-y-3\">\n                    <div v-for=\"(changes, version) in model.changelog\" :key=\"version\" class=\"border-l-2 border-gray-200 pl-4\">\n                      <h4 class=\"font-medium text-gray-800\">v{{ version }}</h4>\n                      <p class=\"text-sm text-gray-600\">{{ changes }}</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <!-- Right Content - Documentation -->\n            <div class=\"lg:col-span-8\">\n              <div v-if=\"model.readme\" class=\"bg-white border border-gray-200 rounded-lg p-8\">\n                <h2 class=\"text-2xl font-bold text-gray-800 mb-6\">Documentation</h2>\n                <div class=\"prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded\" v-html=\"model.readme\"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  "
};

// Router configuration
var routes = [{
  path: '/',
  component: ModelListView
}, {
  path: '/model/:id',
  component: ModelDetailView
}];
var router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});

// Main App
var app = createApp({
  template: "\n    <div class=\"min-h-screen\">\n      <router-view></router-view>\n    </div>\n  "
});
app.use(router);
app.mount('#app');