document.addEventListener('DOMContentLoaded', function () {
    const bigLittleForm = document.getElementById('biglittle-form');
    bigLittleForm.addEventListener('submit', (event) => {
        const member = document.getElementById('memberInput').value;
        if (member==='') {
            alert("Select a member!");
            event.preventDefault();
        }
    });
});