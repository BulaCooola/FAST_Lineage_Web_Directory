$(document).ready(function() {
    // Listen for input changes in the parameterInput field
    $('#parameterInput').on('input', function() {
        // Get the parameter value
        var parameter = $(this).val().trim();

        // Check if the parameter is not empty
        if (parameter !== '') {
            // Make an AJAX request to the server using jQuery
            $.ajax({
                url: `/api/getUserData?parameter=${encodeURIComponent(parameter)}`,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    // Update the content of the userDataContainer with the received data
                    $('#userDataContainer').html(data.user.parameter);
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Clear the content if the parameter is empty
            $('#userDataContainer').html('');
        }
    });
});