const { useState, useEffect } = React;

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
  const modelName = model.model_name.toLowerCase().replace(/\s+/g, '_');
  const version = model.version;
  
  return `https://proxy.monai.io/proxy/download/${modelName}/versions/${version}/files/${modelName}_v${version}.zip`;
}

function TagFilter({ tags, activeTag, onTagChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => onTagChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          activeTag === null
            ? 'bg-brand-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Models
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTag === tag
              ? (tag === 'Bundle' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white')
              : (tag === 'Bundle' 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200')
          }`}
        >
          {tag} Models
        </button>
      ))}
    </div>
  );
}

function ModelCard({ model, onViewDetails }) {
  const isHuggingFaceModel = model.huggingface_url || (model.model_id && model.model_id.startsWith('hf_'));
  const modelTag = isHuggingFaceModel ? "HF" : "Bundle";
  const tagColorClass = isHuggingFaceModel 
    ? "bg-blue-100 text-blue-800" 
    : "bg-green-100 text-green-800";
  
  return (
    <div className="p-4 sm:p-6 shadow-lg rounded-lg border-2 border-neutral-lightgray relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-2 break-words">{model.model_name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 ${tagColorClass} text-xs font-semibold rounded`}>{modelTag} Model</span>
        </div>
        <h5 className="text-brand-primary text-sm mb-2 break-words">{model.authors}</h5>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 break-words">{model.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
            <span className="inline-flex items-center mr-4">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>v{model.version}</span>
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <button
              onClick={() => onViewDetails(model)}
              className="flex items-center justify-center sm:justify-start text-brand-primary hover:text-brand-dark transition-colors py-2 sm:py-0 hover:underline"
            >
              <span>View Details</span>
              <svg className="w-4 h-4 ml-1.5 flex-shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <a
              href={formatDownloadUrl(model)}
              className="brand-btn flex items-center justify-center py-2 px-6 text-sm sm:ml-auto"
              target={isHuggingFaceModel ? "_blank" : "_self"}
              rel={isHuggingFaceModel ? "noopener noreferrer" : ""}
            >
              <span>{isHuggingFaceModel ? "View on HF" : "Download"}</span>
              <svg className="w-4 h-4 ml-1.5 flex-shrink-0 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isHuggingFaceModel ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"} />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelDetailsModal({ model, onClose }) {
  if (!model) return null;

  const isHuggingFaceModel = model.huggingface_url || (model.model_id && model.model_id.startsWith('hf_'));
  const modelTag = isHuggingFaceModel ? "HF" : "Bundle";
  const tagColorClass = isHuggingFaceModel 
    ? "bg-blue-100 text-blue-800" 
    : "bg-green-100 text-green-800";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      
      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-lg shadow-xl overflow-hidden my-0 sm:my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-primary break-words mb-2">{model.model_name}</h2>
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-1 ${tagColorClass} text-xs font-semibold rounded`}>{modelTag} Model</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Version {model.version}</p>
            </div>
            <div className="flex items-center gap-3 -mr-2 sm:mr-0">
              <a
                href={formatDownloadUrl(model)}
                className="brand-btn flex-1 sm:flex-initial flex items-center justify-center px-4 py-2 text-sm"
                target={isHuggingFaceModel ? "_blank" : "_self"}
                rel={isHuggingFaceModel ? "noopener noreferrer" : ""}
              >
                <span>{isHuggingFaceModel ? "View on HF" : "Download"}</span>
                <svg className="w-4 h-4 ml-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={isHuggingFaceModel ? 
                      "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : 
                      "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"}
                  />
                </svg>
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="px-4 sm:px-6 py-8">
            {/* Overview Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              {isHuggingFaceModel && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> This is a Hugging Face model that doesn't follow the standard MONAI Bundle format. 
                        It cannot be run using standard MONAI Bundle APIs. Please refer to the documentation below or 
                        visit the <a href={formatDownloadUrl(model)} target="_blank" rel="noopener noreferrer" className="font-medium underline text-yellow-700 hover:text-yellow-600">Hugging Face repository</a> for complete usage instructions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-gray-600 break-words">{model.description}</p>
            </div>

            {/* Model Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Authors</dt>
                    <dd className="mt-1 text-sm text-gray-900 break-words">{model.authors}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Version</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.version}</dd>
                  </div>
                  {model.papers && model.papers.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">References</dt>
                      <dd>
                        <ul className="space-y-3">
                          {model.papers.map((paper, index) => (
                            <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                              {paper}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Changelog */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Change History</h3>
                  {model.changelog && Object.keys(model.changelog).length > 0 && (
                    <span className="text-sm text-gray-500">
                      Showing last {Math.min(8, Object.keys(model.changelog).length)} changes
                    </span>
                  )}
                </div>
                {model.changelog ? (
                  <div className="space-y-3">
                    {Object.entries(model.changelog)
                      .slice(0, 8)
                      .map(([version, changes], index) => (
                        <div key={index} className="flex gap-4 text-sm">
                          <div className="flex-none">
                            <span className="text-brand-primary font-medium">v{version}</span>
                          </div>
                          <div className="flex-1 break-words">
                            <span className="text-gray-600">{changes}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No changelog available</p>
                )}
              </div>
            </div>

            {/* Full Documentation */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
              <div className="prose max-w-none prose-sm sm:prose">
                <div 
                  className="overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-pre:whitespace-pre-wrap prose-pre:break-words prose-table:w-full prose-table:block prose-table:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: model.readme }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-center sm:text-left text-gray-600 hover:text-brand-primary hover:underline transition-colors font-medium inline-flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Close
            </button>
            <a
              href={formatDownloadUrl(model)}
              className="w-full sm:w-auto brand-btn flex items-center justify-center"
              target={isHuggingFaceModel ? "_blank" : "_self"}
              rel={isHuggingFaceModel ? "noopener noreferrer" : ""}
            >
              {isHuggingFaceModel ? "View on Hugging Face" : "Download Model"}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={isHuggingFaceModel ? 
                    "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : 
                    "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  }
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelZoo() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [modelCount, setModelCount] = useState({ total: 0, bundle: 0, hf: 0 });

  useEffect(() => {
    const url = './model_data.json';
    console.log('Fetching data from:', url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const modelList = Object.values(data);
        setModels(modelList);
        
        // Count models by type
        const bundleCount = modelList.filter(model => 
          !(model.huggingface_url || (model.model_id && model.model_id.startsWith('hf_')))
        ).length;
        
        const hfCount = modelList.filter(model => 
          model.huggingface_url || (model.model_id && model.model_id.startsWith('hf_'))
        ).length;
        
        setModelCount({
          total: modelList.length,
          bundle: bundleCount,
          hf: hfCount
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter models based on selected tag
  const filteredModels = activeTag === null 
    ? models 
    : models.filter(model => {
        const isHF = model.huggingface_url || (model.model_id && model.model_id.startsWith('hf_'));
        return activeTag === 'HF' ? isHF : !isHF;
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="pr-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8 relative inline-block pb-2">
                MONAI Model Zoo
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"></span>
              </h1>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  Discover and download state-of-the-art medical imaging models in the MONAI Bundle format.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  The MONAI Model Zoo is a collection of pre-trained medical imaging models, 
                  ready for research and clinical deployment. Each model is packaged in the 
                  <a className="text-brand-primary hover:text-brand-dark transition-colors mx-1" 
                     href="https://docs.monai.io/en/latest/bundle_intro.html" 
                     target="_blank" 
                     rel="noopener noreferrer">MONAI Bundle</a>
                  format, ensuring reproducibility and ease of use.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Our models cover a wide range of medical imaging tasks, from segmentation 
                  to classification, and are validated through rigorous testing and real-world 
                  applications. Whether you're a researcher, clinician, or developer, you'll 
                  find models that can accelerate your medical AI journey.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://github.com/Project-MONAI/model-zoo" 
                   target="_blank" 
                   className="px-6 py-2.5 rounded-lg bg-brand-primary text-white hover:bg-brand-dark transition-colors inline-flex items-center gap-2 group">
                  <span>Contribute a Model</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </a>
                <a href="https://docs.monai.io/en/latest/bundle_intro.html" 
                   target="_blank" 
                   className="px-6 py-2.5 rounded-lg bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-light transition-colors inline-flex items-center gap-2 group">
                  <span>Learn More</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="hidden lg:block pl-8">
              <div className="relative w-full max-w-lg">
                <img
                  className="w-full h-auto rounded-lg"
                  src="assets/img/community_header.png"
                  alt="MONAI Model Zoo Illustration"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-dark/15">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Available Models
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{modelCount.total}</span> models available
                (<span className="text-green-600 font-medium">{modelCount.bundle}</span> Bundle, 
                <span className="text-blue-600 font-medium"> {modelCount.hf}</span> HF)
              </div>
            </div>
          </div>
          
          <TagFilter 
            tags={['Bundle', 'HF']} 
            activeTag={activeTag} 
            onTagChange={setActiveTag} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, index) => (
              <ModelCard
                key={index}
                model={model}
                onViewDetails={setSelectedModel}
              />
            ))}
            
            {filteredModels.length === 0 && (
              <div className="col-span-3 py-16 text-center">
                <p className="text-lg text-gray-600">No models found matching the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedModel && (
        <ModelDetailsModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}

ReactDOM.render(<ModelZoo />, document.getElementById('app'));
