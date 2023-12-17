(function ($) {
    let memberList = document.getElementById("memberList"),
        showMembers = document.getElementById('showMembers'),
        resultDiv = document.getElementById('results-wrapper'),
        myErrors = document.getElementById('myErrors'),
        submit = document.getElementById("search"),
        searchType = document.getElementById("searchType"),
        searchValue = document.getElementById("searchValue");

    let requestConfig = {
        method: "GET",
        url: "/lines/allUsers"
    }
    $.ajax(requestConfig).then(function (response) {
        console.log(response);
        // response.preventDefault()
        $('#memberList').show()

        for (const x of response) {
            let li = document.createElement("li")
            let a = document.createElement("a")
            console.log(x);
            a.setAttribute("href", x.firstName)
            a.setAttribute("href", x.lastName)
            //console.log(x._links.self.href)
            let memberName = `${x.firstName} ${x.lastName}`
            let textNode = document.createTextNode(memberName)
            a.appendChild(textNode)
            li.appendChild(a)
            memberList.appendChild(li)
        }
    })

    // $(document).on("click", '#memberList > li > a', function (event) {
    //     event.preventDefault()
    //     const link = this.attributes.href.nodeValue;
    //     resultDiv.hidden = true;
    //     memberList.hidden = true;
    //     $(memberList).empty();

    //     $.ajax(link).then(function (response) {
    //         console.log(response)
    //     })
    // })

})(window.jQuery);