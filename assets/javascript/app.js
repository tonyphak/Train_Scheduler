var config = {
    apiKey: "AIzaSyBbsJ-H15DZMKcTWweIUc2vrn-hsImggzo",
    authDomain: "scheduler-5f9c9.firebaseapp.com",
    databaseURL: "https://scheduler-5f9c9.firebaseio.com",
    projectId: "scheduler-5f9c9",
    storageBucket: "scheduler-5f9c9.appspot.com",
    messagingSenderId: "842812189032"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function (event) {
    event.preventDefault();
    var train = $("#train-input").val().trim();
    var dest = $("#dest-input").val().trim();
    var time = $("#time-input").val().trim(); //convert to military time using moment.js
    var freq = $("#freq-input").val().trim();

    //pushing values that was inputed to database
    database.ref().push({
        train: train,
        dest: dest,
        time: time,
        freq: freq,
    });
    console.log(train.train);
    console.log(dest.dest);
    console.log(time.time);
    console.log(freq.freq);

    $("#train-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");

})

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();
    console.log(sv.train);
    console.log(sv.dest);
    console.log(sv.time);
    console.log(sv.freq);

    //first train time
    var normTime = moment(sv.time, "HH:mm").format("hh:mm a");
    console.log(normTime);

    // vars to store snapshot values from database
    var nexTrain = sv.train;
    var nexDest = sv.dest;
    var nexFreq = sv.freq;
    var nexArrival //need to calculate next arrival time
    var nexMin //need to caculate how many minutes is next train from start time

    //pushing the inputed non-military time (normTime) back 1 year making sure it comes before current time
    var firstTimeConverted = moment(normTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    //current time
    var currentTime = moment();

    console.log("current time: " + moment(currentTime).format("hh:mm a"));

    //difference between the inputed time and current time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    //time apart or remainder
    var tRemainder = diffTime % nexFreq;
    console.log(tRemainder);

    //how many minutes until next train arrival
    nexMin = nexFreq - tRemainder;
    console.log("Minutes until train: " + nexMin);

    //time of next train arrival
    var nexArrive = moment().add(nexMin, "minutes");
    console.log("Next Train Arrival time: " + moment(nexArrival).format("hh:mm"));

    //converting time to normal hours and minutes with am/pm
    nexArrival = moment(nexArrive).format("hh:mm a");

    var trainRow = $("<tr>").append(
        $("<td>").text(nexTrain),
        $("<td>").text(nexDest),
        $("<td>").text(nexFreq),
        $("<td>").text(nexArrival),
        $("<td>").text(nexMin),
    )

    $("#trainrow").append(trainRow);
})