document.addEventListener('DOMContentLoaded', function() {
    // Get all copy buttons
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Find the closest code block or pre element
            const container = this.closest('.relative');
            const codeElement = container.querySelector('code, pre, div.bg-gray-50, div.bg-white');
            const textToCopy = codeElement.textContent.trim();
            
            try {
                // Try to use the modern clipboard API first
                await navigator.clipboard.writeText(textToCopy);
            } catch (err) {
                // Fallback to the older execCommand method
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                } finally {
                    document.body.removeChild(textarea);
                }
            }
            
            // Visual feedback - temporarily change the button's icon to a checkmark
            const originalHTML = this.innerHTML;
            this.innerHTML = `
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
            
            // Revert back to the original icon after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 2000);
        });
    });
}); 