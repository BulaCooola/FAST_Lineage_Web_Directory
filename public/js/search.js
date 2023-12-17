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
        //console.log(response);
        // response.preventDefault()
        $('#memberList').show()

        for (const x of response) {
            let li = document.createElement("li")
            let a = document.createElement("a")
            //console.log(x);
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

    $(submit).click(function (event) {
        event.preventDefault()
        resultDiv.hidden = false
        memberList.hidden = true
        //$(memberList).empty()
        showMembers.hidden = false
        $(showMembers).empty()

        if ($(searchValue).val().trim().length == 0) {
            $('#resultDiv').show()
            $('#myErrors').show()
            // $(myErrors).empty()

            let errorDiv = document.createElement("div")
            errorDiv.setAttribute("class", "errorDiv")
            errorDiv.innerHTML = "Please enter valid input"
            myErrors.appendChild(errorDiv)
        } else {
            $('#myErrors').hide()
            //$(myErrors).empty()
            let searchReq = {
                method: "POST",
                url: "/lines/searchUser",
                data: { searchValue: $(searchValue).val() }
            }
            if (searchType.value == "first-name") {
                // default alr set to "/lines/searchUser"
            } else if (searchType.value == "class") {
                searchReq.url = "/lines/searchGradYear";
            } else if (searchType.value == "major") {
                searchReq.url = "/lines/searchMajor";
            }

            $.ajax(searchReq).then(function (responseMessage) {
                console.log(responseMessage)
                let errorDiv = document.createElement("div")
                if (responseMessage.length == 0) {
                    // errorDiv.setAttribute("class", "errorDiv")
                    errorDiv.innerHTML = "No results found"
                    showMembers.appendChild(errorDiv)
                } else {
                    for (const x of responseMessage) {
                        let li = document.createElement("li")
                        let a = document.createElement("a")
                        //console.log(x);
                        a.setAttribute("href", x.firstName)
                        a.setAttribute("href", x.lastName)
                        let memberName = `${x.firstName} ${x.lastName}`
                        let textNode = document.createTextNode(memberName)
                        a.appendChild(textNode)
                        li.appendChild(a)
                        showMembers.appendChild(li)
                    }
                }
            })
        }
    })

})(window.jQuery);