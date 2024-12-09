document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const resourceTableBody = document.getElementById('resourceTableBody');

    // Load existing resources from localStorage
    function loadResources() {
        const resources = JSON.parse(localStorage.getItem('classResources') || '[]');
        resourceTableBody.innerHTML = '';
        resources.forEach((resource, index) => {
            const row = resourceTableBody.insertRow();
            row.innerHTML = `
                <td>${resource.name}</td>
                <td>${resource.type}</td>
                <td>
                    <button class="download-btn" data-index="${index}">Download</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
        });

        // Add event listeners for download and delete buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', downloadResource);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteResource);
        });
    }

    // Upload files
    uploadButton.addEventListener('click', () => {
        const files = fileInput.files;
        const resources = JSON.parse(localStorage.getItem('classResources') || '[]');

        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                resources.push({
                    name: file.name,
                    type: file.type || 'unknown',
                    data: e.target.result
                });
                localStorage.setItem('classResources', JSON.stringify(resources));
                loadResources();
            };
            reader.readAsDataURL(file);
        }

        fileInput.value = ''; // Clear file input
    });

    // Download resource
    function downloadResource(e) {
        const index = e.target.getAttribute('data-index');
        const resources = JSON.parse(localStorage.getItem('classResources') || '[]');
        const resource = resources[index];

        const link = document.createElement('a');
        link.href = resource.data;
        link.download = resource.name;
        link.click();
    }

    // Delete resource
    function deleteResource(e) {
        const index = e.target.getAttribute('data-index');
        const resources = JSON.parse(localStorage.getItem('classResources') || '[]');
        resources.splice(index, 1);
        localStorage.setItem('classResources', JSON.stringify(resources));
        loadResources();
    }

    // Initial load of resources
    loadResources();
});