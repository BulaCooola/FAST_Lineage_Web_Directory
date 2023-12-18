document.addEventListener('DOMContentLoaded', function () {
    const imagesForm = document.getElementById('imageUploadForm');
    if (imagesForm) {
        imagesForm.addEventListener('submit', (event) => {
            if (!validateImagesForm()) {
                event.preventDefault();
            }
        });
    }
});

const validateImagesForm = () => {
    //regex from stack overflow
    const string = document.getElementById('imageURLInput').value;
    const imgur_re = /^(https?:\/\/)?(www\.)?(i\.)?imgur\.com\/(gallery\/)?([a-zA-Z0-9]{5,})[^\s]*$/;
    if (imgur_re.test(string)) {
        return string;
    }
    else {
        alert(`Error: ${string} is not a valid imgur link`)
    }
}