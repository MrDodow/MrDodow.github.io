var text = document.getElementById('command');
var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var ctrack = new clm.tracker({useWebGL : true});
var trackingStarted = false;
var userEmotion;
var round1 = true;
// var round1 = false; 
// var round2 = true;
var round2 = false;
// Be sure the execution sequence by boolean
var happy    = 	true;
var surprise = 	false;
var sad      = 	false;
var angry    = 	false;
// The round 2, the execution sequence is sured by boolean
var round2_1 = true;
var round2_2 = false;
var round2_3 = false;
var round2_4 = false;
var round2_5 = false;
var round2_6 = false;
var round2_7 = false;
var round2_8 = false;
var round2_9 = false;
var round2_10 = false;
// The boolean means when the game enters into the showing final total score phase
var enterScore = false;
var score = 0;
var totalScore = 0;
// identify the date
var date;
var ec = new emotionClassifier();
var emotionData = ec.getBlank();
var margin = {top : 20, right : 20, bottom : 10, left : 40},
width = 400 - margin.left - margin.right,
height = 100 - margin.top - margin.bottom;
var barWidth = 30;
var formatPercent = d3.format(".0%");
var x = d3.scale.linear()
    .domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);
var y = d3.scale.linear()
    .domain([0,1]).range([0, height]);
var svg = d3.select("#emotion_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

// set command value
function setCommandValue(commandValue){
    document.getElementById("command").value = commandValue;
}

// System is loading... --> Round 1, ready? --> Now, follow my order --> 
			// Show your happy to endless work --> Good, what a positive attitude
			// Show your surprise for work overtime today --> Relax, that is normal
			// Show your sad for your boss new Ferrari --> Work hard! --> Then your boss can buy another new one
			// Show your angry to the coming deadline --> Just do it after this game :)
function startVideo() {

    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    trackingStarted = true;
    // start loop to draw face
    drawLoop();	
//     var t2 = setTimeout("drawLoop()",10000);	
    setCommandValue("System is loading ...");
    var t2 = setTimeout("setCommandValue('Round 1, ready? 😎')",4000);
    var t2 = setTimeout("setCommandValue('Now, follow my order 😜')",7000);
    var t2 = setTimeout("setCommandValue('Show your happy to endless work 😅')",10000);

}

function enablestart() {
    var startbutton = document.getElementById('startbutton');
    // revalue the button 
    startbutton.value = "relaxx now";
    startbutton.disabled = null;
}

function adjustVideoProportions() {
    var proportion = vid.videoWidth/vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    overlay.width = vid_width;
}

function gumSuccess( stream ) {
    
    if ("srcObject" in vid) {
        vid.srcObject = stream;
    } 
    else {
        vid.src = (window.URL && window.URL.createObjectURL(stream));
    }

    vid.onloadedmetadata = function() {
        adjustVideoProportions();
        vid.play();
    }
    vid.onresize = function() {
        adjustVideoProportions();
        if (trackingStarted) {
            ctrack.stop();
            ctrack.reset();
            ctrack.start(vid);
        }
    }
}

// Fail to get video from webcam
function gumFail() {
    // setCommandValue("Fail to fetch video from webcam, plz try again");
    alert("Fail to fetch video from camera, please try again");
}

// draw the face and detect emotion 
function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, vid_width, vid_height);
    if (ctrack.getCurrentPosition()) {
        ctrack.draw(overlay);
    }
    var cp = ctrack.getCurrentParameters();
    var er = ec.meanPredict(cp);
    detectEmtion(er);
}

// detect the emotion
// Happy --> surprised --> sad --> angry --> happy --> sad --> happy --> sad --> surprised --> happy
// this is a scoring system
// if every duration < 1s --> +10, 1s < t < 2s --> +5, t > 2s --> 0
// there are 10 orders 

function updateData(data) {
    // update
    var rects = svg.selectAll("rect")
        .data(data)
        .attr("y", function(datum) { return height - y(datum.value); })
        .attr("height", function(datum) { return y(datum.value); });
    var texts = svg.selectAll("text.labels")
        .data(data)
        .attr("y", function(datum) { return height - y(datum.value); })
        .text(function(datum) { return datum.value.toFixed(1);});

    // enter
    rects.enter().append("svg:rect");
    texts.enter().append("svg:text");

    // exit
    rects.exit().remove();
    texts.exit().remove();
}

function detectEmtion(er){
    if (er) {
        updateData(er);
        for (var i = 0;i < er.length;i++) {
            // detect the emotion
            if (er[i].value >= 0.5) {
                document.getElementById('icon'+(i+1)).style.visibility = 'visible';

                if(round1){
                    if(i ==3)
                        afterHappy();
                    else if(i == 2)
                        afterSurprise();
                    else if (i == 1)
                        afterSad();
                    else if (i == 0)
                        afterAngry();
                    }
                    
                // Happy --> surprised --> sad --> angry --> angry --> sad --> happy --> sad --> surprised --> happy
                if(round2){
                    if(i ==3)
                        {
                            round2_1step();
                            round2_5step();
                            round2_7step();
                        }
                    else if(i == 2)
                        {
                            round2_2step();
                            round2_9step();
                        }
                    else if (i == 1)
                        {
                            round2_3step();
                            round2_6step();
                            round2_8step();
                        }
                    else if (i == 0)
                        {
                            round2_4step();
                        }
                    }

                if(enterScore){
                    showTotalScore();
                }

                }
            else {
                document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
                }
            }
        }
}


// after user shows a happy emotion
function afterHappy(){
    if(happy){
        var t3 = setTimeout("setCommandValue('Good, what a positive attitude 👍')",1500);
        var t4 = setTimeout("setCommandValue('Show your surprise for overtime today 💀')",4000);
        var t5 = setTimeout("happy = false",1000);
        var t6 = setTimeout("surprise = true",4000);
        }
    else {
        return;
        }
    }
							
function afterSurprise(){
    if(surprise){
        var t7 = setTimeout("setCommandValue('Relax, it is normal 🤐')",1500);
        var t8 = setTimeout("setCommandValue('See your boss Ferrari, show sad')",4000);	
        var t9 = setTimeout("surprise = false",1000);
        var t10 = setTimeout("sad = true",4000);		
        }
    else{
        return;
        }
    }

function afterSad(){
    if(sad){
        var t11 = setTimeout("setCommandValue('Work harder and harder !! 👊')",1500);
        var t12 = setTimeout("setCommandValue('Then your boss can buy another one! 😱')",4000);
        var t12 = setTimeout("setCommandValue('Show your angry for coming deadline ☹️')",7000);
        var t13 = setTimeout("sad = false",1000);
        var t14 = setTimeout("angry = true",4000);
        }
    else{
        return;
    }
}
			
function afterAngry(){
    if(angry){
        var t11 = setTimeout("setCommandValue(' Just do it after this game 💪 ')",1500);
        var t13 = setTimeout("angry = false",1000);
        var t13 = setTimeout("round2 = true",1500);
        var t13 = setTimeout("round1 = false",1500);

        // Good! You have passed Round 1 --> Round 2, follow my order faster
        var t11 = setTimeout("setCommandValue(' Good! You have passed round 1 👏')",4000);
        var t11 = setTimeout("setCommandValue(' Round 2, follow my orders faster! 🤝')",6500);
        var t11 = setTimeout("setCommandValue(' Happy ')",9000);
        // begin to timing 
        var date1 = new Date();
        date = date1;
        }
    else{
        return;
    }
}

function valueScore(duration){
    if(duration <= 1000)
        {
            return 10;}
    else if(duration <= 2000)
        {
            return 5;}
    else 
        {
            return 0;}
}


function round2_1step(){
    if(round2_1){

        round2_1 = false;
        var t = setTimeout("setCommandValue(' Surprised ')",500);
        var t = setTimeout("round2_2 = true", 500);

        var date1 = new Date();
        // because time has delayed 9000 ms
        score = valueScore(date1 - date - 9000);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}

function round2_2step(){
    if(round2_2){
        round2_2 = false;
        var t = setTimeout("setCommandValue(' Sad ')",500);
        var t = setTimeout("round2_3 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_3step(){
    if(round2_3){
        round2_3 = false;
        var t = setTimeout("setCommandValue(' Angry ')",500);
        var t = setTimeout("round2_4 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;					
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_4step(){
    if(round2_4){
        round2_4 = false;
        var t = setTimeout("setCommandValue(' Happy ')",500);
        var t = setTimeout("round2_5 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_5step(){
    if(round2_5){
        round2_5 = false;
        var t = setTimeout("setCommandValue(' Sad ')",500);
        var t = setTimeout("round2_6 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_6step(){
    if(round2_6){
        round2_6 = false;
        var t = setTimeout("setCommandValue(' Happy ')",500);
        var t = setTimeout("round2_7 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_7step(){
    if(round2_7){
        round2_7 = false;
        var t = setTimeout("setCommandValue(' Sad ')",500);
        var t = setTimeout("round2_8 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_8step(){
    if(round2_8){
        round2_8 = false;
        var t = setTimeout("setCommandValue(' Surprised ')",500);
        var t = setTimeout("round2_9 = true", 500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;
    }
    else{
        return;
    }
}
function round2_9step(){
    if(round2_9){
        round2_9 = false;
        var t = setTimeout("setCommandValue(' Happy ')",500);

        // enter to the final scoring part
        var t = setTimeout("enterScore = true",500);

        var date1 = new Date()
        score = valueScore(date1 - date - 500);
        totalScore += score;
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your score is : " + "+" + score;
        date = date1;

    }
    else{
        return;
    }
}

// if the result >= 80 --> Your mark is ** , what a emotion madman
// 50 <= result < 80   --> Your mark is ** , what a flexible face
// 20 <= result < 50   --> Your mark is ** , what a poker face
// result < 20         --> Your mark is ** , what a stiff upper lip
function showTotalScore(){
    if(totalScore < 20){
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your total score is " + totalScore;
        var t = setTimeout("setScoreValue(' Stiff upper lip  🤖')",2000);
    }
    else if (totalScore <50){
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your total score is " + totalScore;
        var t = setTimeout("setScoreValue(' what a poker face 👽')",2000);
    }
    else if (totalScore <80){
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your total score is " + totalScore;
        var t = setTimeout("setScoreValue(' what a flexible face 😝')",2000);
    }
    else{
        document.getElementById('score').style.visibility = 'visible';
        document.getElementById('score').value = "Your total score is " + totalScore;
        var t = setTimeout("setScoreValue(' what an emotion madman 🤡')",2000);
    }
}


function setScoreValue(scoreValue){
    document.getElementById("score").value = scoreValue;
}
                
function getUserEmotion(x){
    if (x == 0) {
        userEmotion = "angry";
        } else if (x == 1){
        userEmotion = "sad";
        } else if (x == 2){
        userEmotion = "surprised";
        } else if (x == 3){
        userEmotion = "happy";		
        }
        return userEmotion;							
}


