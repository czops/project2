
$(document).ready(function () {

    // alert("I ran first!");

    //targeting the Bulma boxes containing the champions and slackers by the box ID
    var championsList = $("#championUsersBoxes"); // changed from #goalsList
    var slackersList = $("#slackerUsersBoxes");
    var messagesList = $("messagesBoxes");
    var champions;
    var slackers;
    
    var championUserID;
    var slackerUserId;

    // $(document).on("click", "button.delete", handleGoalDelete);
    // $(document).on("click", "button.edit", handleGoalEdit);

    var userLoginData = {
        // username: localStorage.getItem("username"),
        userID: localStorage.getItem("userID"),
        // userImage: localStorage.getItem("userImage")
    }

    //var userID = parseInt(localStorage.getItem("userID"))
    console.log(userLoginData);
    
    // Calling function that gets the users goals and displays them
    getUserGoals(userLoginData.userID);


    //removed redundancy by making this function work for either the champions list of the slackers list
    function displayEmpty(list) {
        list.empty();
        var messageH2 = $("<h2>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No one even made goals to begin with!");
        list.append(messageH2);
    }

//two arguments, one for the list (by jQuery) being populated and one for the users (an array) that are getting loaded in
    function populateListWithUsers(list, users) {
        list.empty();
        var usersToAdd = [];
        for (var i = 0; i < users.length; i++) {
            usersToAdd.push(createNewRow(users[i]));
        }
        list.append(usersToAdd);
    }

    //This is creating new HTML elements.
    //The "goal" being passed in at this stage are the JSON objects of the goals array
    function createNewRow(user) {
        console.log(user);  
        //use the correct Bulma elements
            // |
            // |
            // v
        var newUserBox = $("<div>");
        newUserBox.addClass("box");

        var newUserArticle = $("<article>");
        newUserArticle.addClass("media");

        var newUserFigure =$("<figure>");
        newUserFigure.addClass("media-left");

        var newUserP = $("<p>");
        newUserP.addClass("image is-64x64");

        //not 100% sure about this
        //Sindy you also have an ID on this called poster profile?? What do
        var newUserImage = $("<image>");
        newUserImage.addAttr("src", user.imageURL);

        var newUsernameDiv = $("<div>");
        newUsernameDiv.addClass("media-content");

        var newUsernameContentDiv = $("<div>");
        newUsernameContentDiv.addClass("content");

        var newUsernameP = $("<p>");
        var newUsernameStrong = $("<strong>");
        



//Next append all the created elements in order that they are nested.
            newUserBox.append(newUserArticle);

            newUserArticle.append(newUserFigure);
            newUserFigure.append(newUserP);
            newUserP.append(newUserImage);

            newUserArticle.append(newUsernameDiv);
            newUsernameDiv.append(newUsernameContentDiv);
            newUsernameContentDiv.append(newUsernameP);
            newUsernameP.append(newUsernameStrong);
            
    return newUserBox;
    
};

// Logout button
$("#logoutGo").on("click", function () {
    localStorage.clear();
}); 

// Add goal
$("#addGoal").on("click", function(event) {
    event.preventDefault();

    var goalTitle = $("#goalTitle").val().trim();
    var goalDescription = $("#goalDescriptionBox").val().trim();

    userID = localStorage.getItem("userID");

    console.log("Title: " + goalTitle);
    console.log("Description: " + goalDescription);
    console.log("userID: " + userID);

    if (goalTitle === "" || goalTitle === undefined || goalTitle === null) {
        return alert("Goal title field is empty!");
    } 
    else if (goalDescription === "" || goalDescription === undefined || goalDescription === null) {
        return alert("Goal description field is empty!");
    }
    else {
        var newGoal = {
            goalTitle: goalTitle,
            goalDescription: goalDescription,
            userID: userID
        }
        console.log(newGoal);


        //THIS IS THE PARTS THAT'S LOADING WEIRD
        $.ajax("/api/newGoal", {
            type: "POST",
            data: newGoal
        }).then(function(goalData) {
            console.log(goalData);
            getUserGoals(userID);
        });
    }
});

// Function for getting and displaying all goals belonging to the user that is logged in
// Passing an arguement that will be the userID for the database to reference
function getUserGoals(userID) {
    $.ajax("/api/goals/" + userID , {
        type: "GET"
    }).then(function (goalData) {
        console.log(goalData);
        goals = goalData;
        if (!goals || goals.length <= 0) {
            displayEmpty();
        }
        else {
            populateUserGoalsTable(goals);
        }
    
    });
}


$.ajax("/api/fame",{
    type: "GET",
}).then(function(data){
    console.log(data);
    var users = data;
    if (users) {
        displayEmpty();
    }
    else {
        populateListWithUsers(championsList, users);
    }
})

$.ajax("/api/shame",{
    type: "GET",
}).then(function(data){
    console.log(data);
    var users = data;
    if (users) {
        displayEmpty();
    }
    else {
        populateListWithUsers(slackersList, users);
    }
})

$.ajax("/api/messages",{
    type: "GET",
}).then(function(data){
    console.log(data);
})



}); // End of document.ready()