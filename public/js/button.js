function disableButton() {
    document.getElementById('submitButton').style.display = 'none';

    // Show the loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';

    // Simulate some asynchronous operation (replace this with your actual processing logic)
    setTimeout(() => {
        // After completing the operation, you can optionally hide the loading indicator
        document.getElementById('loadingIndicator').style.display = 'none';

        // Show the button again
        document.getElementById('submitButton').style.display = 'block';
    }, 8000);
}

function toggleList(id) {
    let hiddenList = document.getElementById(id);
    if (hiddenList.style.display === "none") {
        hiddenList.style.display = "block";
    } else {
        hiddenList.style.display = "none";
    }
}