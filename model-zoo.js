"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect;
function formatDownloadUrl(model) {
  // If the model has an explicit download_url, use it
  if (model.download_url) {
    return model.download_url;
  }

  // If the model has a huggingface_url, use that
  if (model.huggingface_url) {
    return model.huggingface_url;
  }

  // For traditional MONAI models, use the proxy URL format
  var modelName = model.model_name.toLowerCase().replace(/\s+/g, '_');
  var version = model.version;
  return "https://proxy.monai.io/proxy/download/".concat(modelName, "/versions/").concat(version, "/files/").concat(modelName, "_v").concat(version, ".zip");
}
function TagFilter(_ref) {
  var tags = _ref.tags,
    activeTag = _ref.activeTag,
    onTagChange = _ref.onTagChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-3 mb-6"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onTagChange(null);
    },
    className: "px-3 py-1.5 rounded-full text-sm font-medium transition-colors ".concat(activeTag === null ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
  }, "All Models"), tags.map(function (tag) {
    return /*#__PURE__*/React.createElement("button", {
      key: tag,
      onClick: function onClick() {
        return onTagChange(tag);
      },
      className: "px-3 py-1.5 rounded-full text-sm font-medium transition-colors ".concat(activeTag === tag ? tag === 'Bundle' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white' : tag === 'Bundle' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200')
    }, tag, " Models");
  }));
}
function ModelCard(_ref2) {
  var model = _ref2.model,
    onViewDetails = _ref2.onViewDetails;
  var isHuggingFaceModel = model.huggingface_url || model.model_id && model.model_id.startsWith('hf_');
  var modelTag = isHuggingFaceModel ? "HF" : "Bundle";
  var tagColorClass = isHuggingFaceModel ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-6 shadow-lg rounded-lg border-2 border-neutral-lightgray relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-gray-800 mb-2 break-words"
  }, model.model_name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-1 ".concat(tagColorClass, " text-xs font-semibold rounded")
  }, modelTag, " Model")), /*#__PURE__*/React.createElement("h5", {
    className: "text-brand-primary text-sm mb-2 break-words"
  }, model.authors), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mb-4 line-clamp-3 break-words"
  }, model.description), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center text-sm text-gray-500 mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center mr-4"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 mr-1.5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  })), /*#__PURE__*/React.createElement("span", null, "v", model.version))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onViewDetails(model);
    },
    className: "flex items-center justify-center sm:justify-start text-brand-primary hover:text-brand-dark transition-colors py-2 sm:py-0 hover:underline"
  }, /*#__PURE__*/React.createElement("span", null, "View Details"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 ml-1.5 flex-shrink-0 transition-transform group-hover:translate-x-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 5l7 7-7 7"
  }))), /*#__PURE__*/React.createElement("a", {
    href: formatDownloadUrl(model),
    className: "brand-btn flex items-center justify-center py-2 px-6 text-sm sm:ml-auto",
    target: isHuggingFaceModel ? "_blank" : "_self",
    rel: isHuggingFaceModel ? "noopener noreferrer" : ""
  }, /*#__PURE__*/React.createElement("span", null, isHuggingFaceModel ? "View on HF" : "Download"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 ml-1.5 flex-shrink-0 transition-transform group-hover:translate-y-0.5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: isHuggingFaceModel ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  })))))));
}
function ModelDetailsModal(_ref3) {
  var model = _ref3.model,
    onClose = _ref3.onClose;
  if (!model) return null;
  var isHuggingFaceModel = model.huggingface_url || model.model_id && model.model_id.startsWith('hf_');
  var modelTag = isHuggingFaceModel ? "HF" : "Bundle";
  var tagColorClass = isHuggingFaceModel ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  var handleBackdropClick = function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add escape key handler
  useEffect(function () {
    var handleEscapeKey = function handleEscapeKey(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return function () {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8",
    onClick: handleBackdropClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black bg-opacity-50",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-lg shadow-xl overflow-hidden my-0 sm:my-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 bg-white px-4 sm:px-6 py-4 border-b border-gray-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-bold text-brand-primary break-words mb-2"
  }, model.model_name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-1 ".concat(tagColorClass, " text-xs font-semibold rounded")
  }, modelTag, " Model")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mt-1"
  }, "Version ", model.version)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 -mr-2 sm:mr-0"
  }, /*#__PURE__*/React.createElement("a", {
    href: formatDownloadUrl(model),
    className: "brand-btn flex-1 sm:flex-initial flex items-center justify-center px-4 py-2 text-sm",
    target: isHuggingFaceModel ? "_blank" : "_self",
    rel: isHuggingFaceModel ? "noopener noreferrer" : ""
  }, /*#__PURE__*/React.createElement("span", null, isHuggingFaceModel ? "View on HF" : "Download"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 ml-1.5 flex-shrink-0",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: isHuggingFaceModel ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-gray-500",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M6 18L18 6M6 6l12 12"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-y-auto",
    style: {
      maxHeight: 'calc(100vh - 200px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-4 sm:px-6 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 mb-3"
  }, "Overview"), isHuggingFaceModel && /*#__PURE__*/React.createElement("div", {
    className: "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-5 w-5 text-yellow-400",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
    clipRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ml-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-700"
  }, /*#__PURE__*/React.createElement("strong", null, "Warning:"), " This is a Hugging Face model that doesn't follow the standard MONAI Bundle format. It cannot be run using standard MONAI Bundle APIs. Please refer to the documentation below or visit the ", /*#__PURE__*/React.createElement("a", {
    href: formatDownloadUrl(model),
    target: "_blank",
    rel: "noopener noreferrer",
    className: "font-medium underline text-yellow-700 hover:text-yellow-600"
  }, "Hugging Face repository"), " for complete usage instructions.")))), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 break-words"
  }, model.description)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-4 sm:p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 mb-4"
  }, "Model Information"), /*#__PURE__*/React.createElement("dl", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "text-sm font-medium text-gray-500"
  }, "Authors"), /*#__PURE__*/React.createElement("dd", {
    className: "mt-1 text-sm text-gray-900 break-words"
  }, model.authors)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "text-sm font-medium text-gray-500"
  }, "Version"), /*#__PURE__*/React.createElement("dd", {
    className: "mt-1 text-sm text-gray-900"
  }, model.version)), model.papers && model.papers.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "text-sm font-medium text-gray-500 mb-2"
  }, "References"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("ul", {
    className: "space-y-3"
  }, model.papers.map(function (paper, index) {
    return /*#__PURE__*/React.createElement("li", {
      key: index,
      className: "text-sm text-gray-600 pl-4 border-l-2 border-gray-300"
    }, paper);
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-4 sm:p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900"
  }, "Change History"), model.changelog && Object.keys(model.changelog).length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-500"
  }, "Showing last ", Math.min(8, Object.keys(model.changelog).length), " changes")), model.changelog ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, Object.entries(model.changelog).slice(0, 8).map(function (_ref4, index) {
    var _ref5 = _slicedToArray(_ref4, 2),
      version = _ref5[0],
      changes = _ref5[1];
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "flex gap-4 text-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-none"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-brand-primary font-medium"
    }, "v", version)), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 break-words"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-600"
    }, changes)));
  })) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, "No changelog available"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-4 sm:p-6 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prose max-w-none prose-sm sm:prose"
  }, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-pre:whitespace-pre-wrap prose-pre:break-words prose-table:w-full prose-table:block prose-table:overflow-x-auto",
    dangerouslySetInnerHTML: {
      __html: model.readme
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "sticky bottom-0 z-10 bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col-reverse sm:flex-row justify-between items-center gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full sm:w-auto text-center sm:text-left text-gray-600 hover:text-brand-primary hover:underline transition-colors font-medium inline-flex items-center gap-2 group"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 transition-transform group-hover:-translate-x-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10 19l-7-7m0 0l7-7m-7 7h18"
  })), "Close"), /*#__PURE__*/React.createElement("a", {
    href: formatDownloadUrl(model),
    className: "w-full sm:w-auto brand-btn flex items-center justify-center",
    target: isHuggingFaceModel ? "_blank" : "_self",
    rel: isHuggingFaceModel ? "noopener noreferrer" : ""
  }, isHuggingFaceModel ? "View on Hugging Face" : "Download Model", /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 ml-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: isHuggingFaceModel ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  })))))));
}
function ModelZoo() {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    models = _useState2[0],
    setModels = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedModel = _useState4[0],
    setSelectedModel = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    activeTag = _useState6[0],
    setActiveTag = _useState6[1];
  var _useState7 = useState({
      total: 0,
      bundle: 0,
      hf: 0
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    modelCount = _useState8[0],
    setModelCount = _useState8[1];
  useEffect(function () {
    var url = './model_data.json';
    console.log('Fetching data from:', url);
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (data) {
      var modelList = Object.values(data);
      setModels(modelList);

      // Count models by type
      var bundleCount = modelList.filter(function (model) {
        return !(model.huggingface_url || model.model_id && model.model_id.startsWith('hf_'));
      }).length;
      var hfCount = modelList.filter(function (model) {
        return model.huggingface_url || model.model_id && model.model_id.startsWith('hf_');
      }).length;
      setModelCount({
        total: modelList.length,
        bundle: bundleCount,
        hf: hfCount
      });
    })["catch"](function (error) {
      return console.error('Error fetching data:', error);
    });
  }, []);

  // Filter models based on selected tag
  var filteredModels = activeTag === null ? models : models.filter(function (model) {
    var isHF = model.huggingface_url || model.model_id && model.model_id.startsWith('hf_');
    return activeTag === 'HF' ? isHF : !isHF;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement("section", {
    className: "py-24 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pr-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl font-bold text-gray-800 mb-8 relative inline-block pb-2"
  }, "MONAI Model Zoo", /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"
  })), /*#__PURE__*/React.createElement("div", {
    className: "prose max-w-none"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg leading-relaxed text-gray-700"
  }, "Discover and download state-of-the-art medical imaging models in the MONAI Bundle format."), /*#__PURE__*/React.createElement("p", {
    className: "text-lg leading-relaxed text-gray-700"
  }, "The MONAI Model Zoo is a collection of pre-trained medical imaging models, ready for research and clinical deployment. Each model is packaged in the", /*#__PURE__*/React.createElement("a", {
    className: "text-brand-primary hover:text-brand-dark transition-colors mx-1",
    href: "https://docs.monai.io/en/latest/bundle_intro.html",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "MONAI Bundle"), "format, ensuring reproducibility and ease of use."), /*#__PURE__*/React.createElement("p", {
    className: "text-lg leading-relaxed text-gray-700"
  }, "Our models cover a wide range of medical imaging tasks, from segmentation to classification, and are validated through rigorous testing and real-world applications. Whether you're a researcher, clinician, or developer, you'll find models that can accelerate your medical AI journey.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex flex-wrap gap-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/Project-MONAI/model-zoo",
    target: "_blank",
    className: "px-6 py-2.5 rounded-lg bg-brand-primary text-white hover:bg-brand-dark transition-colors inline-flex items-center gap-2 group"
  }, /*#__PURE__*/React.createElement("span", null, "Contribute a Model"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 transition-transform group-hover:translate-x-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 7l5 5m0 0l-5 5m5-5H6"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://docs.monai.io/en/latest/bundle_intro.html",
    target: "_blank",
    className: "px-6 py-2.5 rounded-lg bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-light transition-colors inline-flex items-center gap-2 group"
  }, /*#__PURE__*/React.createElement("span", null, "Learn More"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 transition-transform group-hover:translate-x-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 7l5 5m0 0l-5 5m5-5H6"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block pl-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-lg"
  }, /*#__PURE__*/React.createElement("img", {
    className: "w-full h-auto rounded-lg",
    src: "assets/img/community_header.png",
    alt: "MONAI Model Zoo Illustration"
  })))))), /*#__PURE__*/React.createElement("section", {
    className: "py-16 bg-brand-dark/15"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row md:items-center justify-between mb-8"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-bold text-gray-800 mb-4 md:mb-0"
  }, "Available Models"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, modelCount.total), " models available (", /*#__PURE__*/React.createElement("span", {
    className: "text-green-600 font-medium"
  }, modelCount.bundle), " Bundle,", /*#__PURE__*/React.createElement("span", {
    className: "text-blue-600 font-medium"
  }, " ", modelCount.hf), " HF)"))), /*#__PURE__*/React.createElement(TagFilter, {
    tags: ['Bundle', 'HF'],
    activeTag: activeTag,
    onTagChange: setActiveTag
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  }, filteredModels.map(function (model, index) {
    return /*#__PURE__*/React.createElement(ModelCard, {
      key: index,
      model: model,
      onViewDetails: setSelectedModel
    });
  }), filteredModels.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "col-span-3 py-16 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-gray-600"
  }, "No models found matching the selected filter."))))), selectedModel && /*#__PURE__*/React.createElement(ModelDetailsModal, {
    model: selectedModel,
    onClose: function onClose() {
      return setSelectedModel(null);
    }
  }));
}
ReactDOM.render(/*#__PURE__*/React.createElement(ModelZoo, null), document.getElementById('app'));
