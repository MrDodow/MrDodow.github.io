
				// get the text of command
				var text = document.getElementById('command');
				text.value = "Are you ready? ";

				// videoel 即调用前置摄像头
				var vid = document.getElementById('videoel');
				var vid_width = vid.width;
				var vid_height = vid.height;

				// overlay 是覆盖 videoel
				var overlay = document.getElementById('overlay');
				var overlayCC = overlay.getContext('2d');

				// check and set up video/webcam
				function enablestart() {
					var startbutton = document.getElementById('startbutton');
					// 重新赋值 button 
					startbutton.value = "relaxx now";
					startbutton.disabled = null;
				}

				// resize overlay and video if proportions are different
				// keep same height, just change width
				function adjustVideoProportions() {
					var proportion = vid.videoWidth/vid.videoHeight;
					vid_width = Math.round(vid_height * proportion);
					vid.width = vid_width;
					overlay.width = vid_width;
				}

				// add camera stream if getUserMedia succeeded
				function gumSuccess( stream ) {
				
					if ("srcObject" in vid) {
						vid.srcObject = stream;
					} else {
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
				function gumFail() {
					alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
				}


				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

				// check for camerasupport
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia({video : true}, gumSuccess, gumFail);
				} else {
					alert("This applicaiton depends on getUserMedia, which your browser does not seem to support. :(");
				}
  
				// vid is videoel, the middle part
				vid.addEventListener('canplay', enablestart, false);

				//  setup of emotion detection
				// 设置特征向量 9,11 不正规化，更好地检测眉毛。
				pModel.shapeModel.nonRegularizedVectors.push(9);
				pModel.shapeModel.nonRegularizedVectors.push(11);

				var ctrack = new clm.tracker({useWebGL : true});
				ctrack.init(pModel);
				var trackingStarted = false;

				
				// 添加一个计时器，用于更新 command 里面的文字

				// set command value
				function setCommandValue(commandValue){
				document.getElementById("command").value = commandValue;
				}
				
				// Are you ready? --> Now, follow my order --> Show your happy to endless work --> Good, what a positive attitude
				// Show your surprise for overtime today --> Relax, it's normal 
				// See your boss's Ferrari and your bike, show your sadness --> Work hard! --> Then your boss can buy another new one! 
				function startVideo() {
					// start video
					vid.play();
					// start tracking
					ctrack.start(vid);
					trackingStarted = true;
					// start loop to draw face
					drawLoop();
					setCommandValue("System is loading ...");
					var t2 = setTimeout("setCommandValue('Now, follow my order')",4000);
					var t2 = setTimeout("setCommandValue('Show your happy to endless work')",7000);
				}
				
				var userEmotion;
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


				// 设置4个boolean，就是想顺序实现.
				// true 表示 函数可实现，false 表示 函数不可实现.
				// 这个游戏由 happy 开头
				var happy    = 	true;
				var surprise = 	false;
				var sad      = 	false;
				var angry    = 	false;

				// draw the face and detect emotion 
				function drawLoop() {
					// 动画效果
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
				function detectEmtion(er){
					if (er) {
						updateData(er);
						for (var i = 0;i < er.length;i++) {
							// 检测 emotion
							if (er[i].value > 0.4) {
								document.getElementById('icon'+(i+1)).style.visibility = 'visible';
								if(i ==3)
								afterHappy();
								else if(i == 2)
								afterSurprise();
								else if (i == 1)
								afterSad();
							}
							else {
								document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
							}


						}
					}
				}
				// function sleep(milliSeconds){
				// 	var startTime = new Date().getTime(); // get the current time
				// 	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
				// }

				// 没办法啊，强制顺序执行，setTimeout就是个坑，和sleep不太一样
				function orderFunction(a, b){
					a = false;
					b = true;
				}
				var t;
				// after user shows a happy emotion
				function afterHappy(){
					if(happy){
							var t3 = setTimeout("setCommandValue('Good, what a positive attitude')",1500);
							var t4 = setTimeout("setCommandValue('Show your surprise for overtime today')",4000);
							var t5 = setTimeout("happy = false",1000);
							var t6 = setTimeout("surprise = true",4000);
					}
					else {
						return;
					}
				}
				
				function afterSurprise(){
					if(surprise){
						var t7 = setTimeout("setCommandValue('Relax, it is normal')",1500);
						var t8 = setTimeout("setCommandValue('See your boss new Ferrari, show your sadness')",4000);	
						var t9 = setTimeout("surprise = false",1000);
						var t10 = setTimeout("sad = true",4000);		
					}
					else{
						return;
					}
				}

				function afterSad(){
					if(sad){
						var t11 = setTimeout("setCommandValue('Work harder and harder !! ')",1500);
						var t12 = setTimeout("setCommandValue('Then your boss can buy another new one! ')",4000);
						var t13 = setTimeout("sad = false",1000);
						var t14 = setTimeout("angry = true",4000);
					}
					else{
						return;
					}
				}
				




				delete emotionModel['disgusted'];
				delete emotionModel['fear'];
				var ec = new emotionClassifier();
				ec.init(emotionModel);
				var emotionData = ec.getBlank();

				// draw barchart
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

				svg.selectAll("rect").
					data(emotionData).
					enter().
					append("svg:rect").
					attr("x", function(datum, index) { return x(index); }).
					attr("y", function(datum) { return height - y(datum.value); }).
					attr("height", function(datum) { return y(datum.value); }).
					attr("width", barWidth).
					attr("fill", "#2d578b");

				svg.selectAll("text.labels").
					data(emotionData).
					enter().
					append("svg:text").
					attr("x", function(datum, index) { return x(index) + barWidth; }).
					attr("y", function(datum) { return height - y(datum.value); }).
					attr("dx", -barWidth/2).
					attr("dy", "1.2em").
					attr("text-anchor", "middle").
					text(function(datum) { return datum.value;}).
					attr("fill", "white").
					attr("class", "labels");

				svg.selectAll("text.yAxis").
					data(emotionData).
					enter().append("svg:text").
					attr("x", function(datum, index) { return x(index) + barWidth; }).
					attr("y", height).
					attr("dx", -barWidth/2).
					attr("text-anchor", "middle").
					attr("style", "font-size: 12").
					text(function(datum) { return datum.emotion;}).
					attr("transform", "translate(0, 18)").
					attr("class", "yAxis");
				
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

				// stats 统计
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				document.getElementById('container').appendChild( stats.domElement );

				// update stats on every iteration
				document.addEventListener('clmtrackrIteration', function(event) {
					stats.update();
				}, false);
