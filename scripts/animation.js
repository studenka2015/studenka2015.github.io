"use strict";
window.addEventListener("load", function () {
    /**initialization after loading window */
    let map = document.getElementById("map");
    let scaleObject = document.getElementById("svgScale1").contentDocument;
    let scale = scaleObject.getElementById("scale");   
    let scaleObject3 = document.getElementById("svgScale3").contentDocument;
    let scale3 = scaleObject3.getElementById("scale");    

    let startButton = document.getElementById("startButton");
    startButton.style.zIndex = 999;
    startButton.addEventListener("click", animationMain);

    let legendButton = document.getElementById("legendButton");
    legendButton.addEventListener("mouseover", showLegend);
    legendButton.addEventListener("mouseout", hideLegend);
    
    /**set proper size of map and scale according window extent*/
    setProperSizeOfMap(map);
    setProperScaleOfMap(1, 0, 0);
    setProperSizeOfScale(scale);
    setProperSizeOfScale(scale3);   

});

/**
 * @param {int} num
 * @return int with two digits
 * */
function twoDigits(num) {
    return ("0" + num).slice(-2);
}

/**set the size (width, height) of manipulated map SVG to fit into page extent
 * @param {SVGObject} manipulatedMap - SVGFile with map
*/
function setProperSizeOfMap(manipulatedMap) {
    let windowWidth = "100vw";
    let windowHeight = "88vh";

    manipulatedMap.setAttribute("width", windowWidth);
    manipulatedMap.setAttribute("height", windowHeight);
}

/**set the scale of manipulated map SVG to fit into page extent
 * @param {int} newScaleOfMap - new scale of SVG via transform
 * @param {int} translateX - move the SVG in X coordinate
 * @param {int} translateY - move the SVG in Y coordinate
 */
function setProperScaleOfMap(newScaleOfMap, translateX, translateY) {
    let mapClip = document.getElementById("mapClipPath");
    let mapContent = document.getElementById("mapContent");

    mapContent.setAttribute("transform", "scale(" + newScaleOfMap + "), translate(" + -1 * translateX + " " + -1 * translateY + ")");
    mapClip.setAttribute("transform", "scale(" + 1 / newScaleOfMap + "), translate(" + 1 * newScaleOfMap * translateX + " " + 1 * newScaleOfMap * translateY + ")");
}

/**set the scale of manipulated scale of map (SVG) to fit into page extent - height 88vh
 * @param {SVGObject} manipulatedScale - external SVGFile of scale
 * @const {int} 900 - original height of SVG map
 */
function setProperSizeOfScale(manipulatedScale) {
    let windowHeight = window.innerHeight;
    let mapHeight = 0.88 * windowHeight;
    let scaleWidth = manipulatedScale.getAttribute("width");
    let scaleHeight = manipulatedScale.getAttribute("height");
    let ratio = mapHeight/900;

    manipulatedScale.setAttribute("width", ratio * scaleWidth);
    manipulatedScale.setAttribute("height", ratio * scaleHeight);
}

/**animate legend appear */
function showLegend() {
    let legend = document.getElementById("legend");
    legend.style.zIndex = 100;
    anime({
        targets: legend,
        opacity: [0,1],
        duration: 1000,
    });
}

/**animate legend disappear */
function hideLegend() {
    let legend = document.getElementById("legend");
    legend.style.zIndex = 50;
    anime({
        targets: legend,
        opacity: [1,0],
        duration: 1000,
    });
}

/**pause animation
 * @param {Object} realTL - timeline object of anime.js
 * @param {Object} playButton
 */
function pauseAnimationInfo(realTL, playButton) {
    let realTimeMS = Math.floor(realTL.duration * realTL.progress * 0.01);
    realTL.pause();
    if (playButton.classList.value == "playControl") {
        playButtonState(playButton, "pauseControl", "| |");
    }  
    realTL.seek(realTimeMS + 1);
}

/**write info text
 * @param {string} text - upload from stopsdata object
 */
function writeInfo(text) {
    let textInfo = document.getElementById("textInfo");
    textInfo.innerHTML = text;
}

/**play animation after given duration and if animation is not paused by human
 * @param {Object} realTL - timeline object of anime.js
 * @param {Object} stopData - Object of given stop from Object stopsData
 * @param {Object} playButton
 */
function playAnimationInfo(realTL, stopData, playButton) {
    let durationOfStop = stopData["durationOfStop"];
    if (playButton.classList.value != "pauseControlHuman") {
        setTimeout(function () {
            if (playButton.classList.value == "pauseControl") {
                playButtonState(playButton, "playControl", "►");
                realTL.play();
            }
        }, durationOfStop);
    }    
}

/**set proper class and value of play button - play/stop change
 * @param {Object} playButton
 * @param {str} classValue
 * animation play: playControl
 * animation paused by human: pauseControlHuman
 * animation paused by programme: pauseControl
 * @param {str} value
 * PLAY: "►",
 * PAUSE: "| |"
 */
function playButtonState(playButton, classValue, value) {
    playButton.classList.value = classValue;
    playButton.value = value;
}

/**function linking all function necessary for animation */
function animationMain() {
    /**
     * prepare animation constants
     * */

    /**start time of animation 7:40:39 and in miliseconds - MS */
    let startTimeOfAnimation = 7 * 3600 + 40 * 60 + 39;
    let startTimeOfAnimationMS = startTimeOfAnimation * 1000;

    /**get div for writing text info about animation */
    let textInfo = document.getElementById("textInfo");

    /**get play and seek button div */
    let playButton = document.getElementById("playButton");
    let seekButton = document.getElementById("seekButton");
    
    let scaleObject = document.getElementById("svgScale1");
    let scaleObject3 = document.getElementById("svgScale3");

    let stopsData = {
        "stop1": {
            timeStampMS: 27644000, durationOfStop: 0, nickname: "PZZ",
            text: "<p>Jednu minutu a pět vteřin před srážkou, bylo přejezdové zabezpečovací zařízení železničního přejezdu P6501 uvedeno do stavu výstraha.</p>",
            alreadyStopped: false,
        },
        "stop2": {
            timeStampMS: 27684000, durationOfStop: 0, nickname: "SVM vjelo na PZZ",
            text: "<p>25 vteřin před srážkou vjel nedovoleně polský řidič na železniční přejezd.</p>",
            alreadyStopped: false,
        },
        "stop3": {
            timeStampMS: 27688000, durationOfStop: 0, nickname: "padají závory",
            text: "<p>Spouštějí se závory.</p>",
            alreadyStopped: false,
        },
        "stop4": {
            timeStampMS: 27696000, durationOfStop: 0, nickname: "SC minulo hlavní návěstidlo",
            text: "<p>Ex 512 Pendolino rychlostí 160 km/h minulo hlavní vjezdové návěstidlo.</p>. ",
            alreadyStopped: false,
        },
        "stop5": {
            timeStampMS: 27700000, durationOfStop: 0, nickname: "SVM zastavilo",
            text: "<p>Polský řidič zastavil na přejezdu.</p>",
            alreadyStopped: false,
        },
        "stop6": {
            timeStampMS: 27704500, durationOfStop: 0, nickname: "SC začlo brzdit",
            text: "<p>Ex 512 Pendolino začalo 187 m před přejezdem brzdit.</p>",
            alreadyStopped: false,
        },
        "stop7": {
            timeStampMS: 27709000, durationOfStop: 5000, nickname: "STŘET",
            text: "<p>7:41:49 v rychlosti 142 km/h naráží Ex 512 Pendolino do kamionu.</p>",
            alreadyStopped: false,
        },
        "stop8": {
            timeStampMS: 27739000, durationOfStop: 6000, nickname: "SC zabrzdilo",
            text: "<p>Až 557 m za místem srážky Ex 512 Pendolino konečně zastavilo.</p>",
            alreadyStopped: false,
        },

    };

    /**crossing animation is off */
    let crossingOff = true;

    /**enable animation control button and set play button as PLAY*/
    seekButton.disabled = false;
    playButton.disabled = false;
    playButtonState(playButton, "playControl", "►");

    /**create timeline object using anime.js for real-time animation of the crash's animation */
    let realTL = anime.timeline({
        duration: 104000,
        loop: false,
        easing: "linear",
        update: function () {
            /** do on every frame of animation*/

            /** animate seek button every frame*/
            seekButton.value = realTL.progress;

            let realTimeMS = Math.floor(realTL.duration * realTL.progress * 0.01);

            /**if animation is in frame 5000 ms release animation of crossing else stop anim */
            if (realTimeMS >= 5000 && crossingOff) {
                crossingOff = false;
                document.getElementById("P6501").style.opacity = "1";
                anime({
                    targets: document.getElementById("P6501"),
                    opacity: [0, 1],
                    easing: "linear",
                    duration: 100,
                    endDelay: 900,
                    direction: "alternate",
                    loop: true,
                });
            } else if (realTimeMS < 5000) {
                crossingOff = true;
                document.getElementById("P6501").style.opacity = "0";                
            }

            /**go through reconstruction stops and write info about stop */
            for (let i = 8; i > 0; i -= 1) {
                let stopNumber = "stop" + i;

                if (startTimeOfAnimationMS + realTimeMS >= stopsData[stopNumber]["timeStampMS"] && stopsData[stopNumber]["alreadyStopped"] == false) {
                    stopsData[stopNumber]["alreadyStopped"] = true;
                    let currentStopData = stopsData[stopNumber];
                    if (currentStopData["durationOfStop"] != 0) {
                        pauseAnimationInfo(realTL, playButton, 0);
                    }

                    writeInfo(currentStopData["text"]);

                    if (i == 6) {
                        setProperScaleOfMap(3, 550, 250);
                        scaleObject.classList.value = "scaleHidden";
                        scaleObject3.classList.value = "scaleVisible";

                    }

                    if (currentStopData["durationOfStop"] != 0) {
                        playAnimationInfo(realTL, currentStopData, playButton);
                    }
                }

            }

            /**set scale of map after collision (27715000) back to original */
            if  (startTimeOfAnimationMS + realTimeMS >= 27715000) {
                setProperScaleOfMap(1,0,0);
                scaleObject.classList.value = "scaleVisible";
                scaleObject3.classList.value = "scaleHidden";                                          
            }
        },
        complete: function() {
            /**when animation is completed */

            /**block animation control buttons */
            seekButton.disabled = true;
            playButton.disabled = true;
            playButtonState(playButton, "playControlDis", "►");
            
            /**create div of restart window */
            let floatRestart = document.createElement("DIV");
            floatRestart.setAttribute("id", "floatRestart");
            document.getElementById("floatRestartDiv").appendChild(floatRestart);
            document.getElementById("floatRestart").innerHTML = "<div id=\"floatRestartButton\"><input id=\"restartButton\" type=\"button\"value=\"Přehrát znovu\"></input></div>";

            /**get restart button from created floatRestart and move animation to start */
            let restartButton = document.getElementById("restartButton");
            restartButton.addEventListener("click", function () {
                realTL.restart();
                textInfo.innerText = "";
                seekButton.disabled = false;
                playButton.disabled = false;
                playButtonState(playButton, "playControl", "►");
                setProperScaleOfMap(1, 0, 0);
                seekButton.value = 0;
                
                /** remove restart window */
                document.getElementById("floatRestartDiv").innerHTML = "";

                /** reset all commentary stops as not visited so far*/
                for (let key of Object.keys(stopsData)) {
                        stopsData[key]["alreadyStopped"] = false;
                }
            });
        }
    });

    /**control animation button waiting for use*/
    playButton.addEventListener("click", function () {
        if (playButton.classList.value == "playControl") {
            realTL.pause();
            playButtonState(playButton, "pauseControlHuman", "| |");

        } else if (playButton.classList.value == "pauseControl" ||
                    playButton.classList.value == "pauseControlHuman") {          
            realTL.play();
            playButtonState(playButton, "playControl", "►");
        }
    });

    seekButton.addEventListener("input", function () {
        let realTLTime = realTL.duration * (seekButton.value / 100);
        textInfo.innerText = "";
        realTL.pause();
        realTL.seek(realTLTime); 
        playButtonState(playButton, "pauseControlHuman", "| |");

        /**reset commentary stop if it is later than seeked time */
        for (let key of Object.keys(stopsData)) {
            if (startTimeOfAnimationMS + realTLTime < stopsData[key]["timeStampMS"]) {
                stopsData[key]["alreadyStopped"] = false;
            }
        }

        /**write commentary of the nearest stop before seeked time */
        let key;
        let stopNum;
        let stopsDataLength = Object.keys(stopsData).length;
        for (let i = stopsDataLength; i >= 1; i = i - 1) {
            stopNum = i;
            key = "stop" + stopNum;
            if (startTimeOfAnimationMS + realTLTime > stopsData[key]["timeStampMS"]) {
                writeInfo(stopsData[key]["text"]);
                break;
            }
        }        

        /**set proper scale of map when seeked */
        if (startTimeOfAnimationMS + realTLTime > 27704500 && startTimeOfAnimationMS + realTLTime < 27714000) {
            setProperScaleOfMap(3, 550, 250);
            scaleObject.classList.value = "scaleHidden";
            scaleObject3.classList.value = "scaleVisible";
        } else {
            setProperScaleOfMap(1, 0, 0);
            scaleObject.classList.value = "scaleVisible";
            scaleObject3.classList.value = "scaleHidden";
        }        
    });    

    /**prepare paths for moving objects */
    /**pendolino paths when going 160 km/h */
    let pendolinoPath160_7 = anime.path("#pendolinoPath160-7");
    let pendolinoPath160_6 = anime.path("#pendolinoPath160-6");
    let pendolinoPath160_5 = anime.path("#pendolinoPath160-5");
    let pendolinoPath160_4 = anime.path("#pendolinoPath160-4");
    let pendolinoPath160_3 = anime.path("#pendolinoPath160-3");
    let pendolinoPath160_2 = anime.path("#pendolinoPath160-2");
    let pendolinoPath160_1 = anime.path("#pendolinoPath160-1");

    /**pendolino paths when breaking */
    let pendolinoPath160_0_7 = anime.path("#pendolinoPath160_0-7");
    let pendolinoPath160_0_6 = anime.path("#pendolinoPath160_0-6");
    let pendolinoPath160_0_5 = anime.path("#pendolinoPath160_0-5");
    let pendolinoPath160_0_4 = anime.path("#pendolinoPath160_0-4");
    let pendolinoPath160_0_3 = anime.path("#pendolinoPath160_0-3");
    let pendolinoPath160_0_2 = anime.path("#pendolinoPath160_0-2");
    let pendolinoPath160_0_1 = anime.path("#pendolinoPath160_0-1");

    let SVMPathTahac1 = anime.path("#SVMPathTahac1");
    let SVMPathTahac2 = anime.path("#SVMPathTahac2");
    let SVMPathNaves1 = anime.path("#SVMPathNaves1");    
    let SVMPathNaves2 = anime.path("#SVMPathNaves2");
    let SVMPathNaves3 = anime.path("#SVMPathNaves3");

    /**animation release----------------------------------------------------*/
    /**hide floatIntro box */
    anime({
        targets: "#floatIntro",
        opacity: [1,0],
        duration: 3000,
        easing: "cubicBezier(0.015, 1, 0.335, 0.955)",
        complete: function() {
            /**remove floatIntro box from html page */
            let floatIntro = document.getElementById("floatIntro");
            floatIntro.parentNode.removeChild(floatIntro);
        }
    }, 0);

    /** start clock animation */
    realTL.add({
        targets: "#clock",
        update: function () {
            let addTime = Math.floor(startTimeOfAnimation + Math.floor((realTL.duration * (realTL.progress / 100)) / 1000));
            let hour = Math.floor(addTime / 3600);
            let min = twoDigits(Math.floor((addTime % 3600) / 60));
            let sec = twoDigits((addTime % 3600) % 60);
            let string_time = hour + ":" + min + ":" + sec;
            document.getElementById("clock").innerText = string_time;
        },
        duration: 104000
    }, 0);

    /**pendolino's carriages animation*/
    realTL.add({
        targets: document.getElementById("carriage7"),
        keyframes: [
            {
                translateX: pendolinoPath160_7("x"),
                translateY: pendolinoPath160_7("y"),
                rotate: pendolinoPath160_7("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_7("x"),
                translateY: pendolinoPath160_0_7("y"),
                rotate: pendolinoPath160_0_7("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],

    }, 55425).add({
        targets: document.getElementById("carriage6"),
        keyframes: [
            {
                translateX: pendolinoPath160_6("x"),
                translateY: pendolinoPath160_6("y"),
                rotate: pendolinoPath160_6("angle"),
                duration: 10000,
                easing: 'linear',
            }, {
                translateX: pendolinoPath160_0_6("x"),
                translateY: pendolinoPath160_0_6("y"),
                rotate: pendolinoPath160_0_6("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }
        ],
    }, 55425).add({
        targets: document.getElementById("carriage5"),
        keyframes: [
            {
                translateX: pendolinoPath160_5("x"),
                translateY: pendolinoPath160_5("y"),
                rotate: pendolinoPath160_5("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_5("x"),
                translateY: pendolinoPath160_0_5("y"),
                rotate: pendolinoPath160_0_5("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],

    }, 55425).add({
        targets: document.getElementById("carriage4"),
        keyframes: [
            {
                translateX: pendolinoPath160_4("x"),
                translateY: pendolinoPath160_4("y"),
                rotate: pendolinoPath160_4("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_4("x"),
                translateY: pendolinoPath160_0_4("y"),
                rotate: pendolinoPath160_0_4("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],

    }, 55425).add({
        targets: document.getElementById("carriage3"),
        keyframes: [
            {
                translateX: pendolinoPath160_3("x"),
                translateY: pendolinoPath160_3("y"),
                rotate: pendolinoPath160_3("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_3("x"),
                translateY: pendolinoPath160_0_3("y"),
                rotate: pendolinoPath160_0_3("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],

    }, 55425).add({
        targets: document.getElementById("carriage2"),
        keyframes: [
            {
                translateX: pendolinoPath160_2("x"),
                translateY: pendolinoPath160_2("y"),
                rotate: pendolinoPath160_2("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_2("x"),
                translateY: pendolinoPath160_0_2("y"),
                rotate: pendolinoPath160_0_2("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],

    }, 55425).add({
        targets: document.getElementById("carriage1"),
        keyframes: [
            {
                translateX: pendolinoPath160_1("x"),
                translateY: pendolinoPath160_1("y"),
                rotate: pendolinoPath160_1("angle"),
                duration: 10000,
                easing: 'linear',
            },
            {
                translateX: pendolinoPath160_0_1("x"),
                translateY: pendolinoPath160_0_1("y"),
                rotate: pendolinoPath160_0_1("angle"),
                duration: 34000,
                easing: 'cubicBezier(0.390, 0.685, 0.565, 1.000)',
            }],
    }, 55425).add({
        targets: document.getElementById("PendolinoFocusText"),
        keyframes: [
            {
                opacity: [0,1],
                duration: 1000,
            },
            {
                translateX: pendolinoPath160_7("x"),
                translateY: pendolinoPath160_7("y"),
                duration: 10000,
                easing: 'linear',
            },
            {
                opacity: [1,0],
                duration: 0,
            },
        ],
            
    }, 55425);

    /**SVM animation */
    realTL.add({
        targets: document.getElementById("SVMTahac"),
        keyframes: [
            {
                translateX: SVMPathTahac1("x"),
                translateY: SVMPathTahac1("y"),
                rotate: SVMPathTahac1("angle"),
                duration: 59000,
                easing: 'cubicBezier(0.230, 0.490, 0.575, 1.000)',
            },
            {
                translateX: SVMPathTahac2("x"),
                translateY: SVMPathTahac2("y"),
                rotate: SVMPathTahac2("angle"),
                delay: 3000,
                duration: 5000,
                easing: 'cubicBezier(0.225, 0.330, 0.565, 1.000)',

            },
            {
                translateX: [832.208, 832.208 + -1],
                translateY: [411.072, 418],
                width: [8.3622999, 6],
                rotate: [-98.1618, -98.1618 + 165],
                easing: "cubicBezier(0.240, 0.475, 0.135, 0.945)",
                duration: 1500,
                delay: 1250,
            }
        ],
    }, 2000).add({
        targets: document.getElementById("SVMNaves"),
        keyframes: [
            {
                translateX: SVMPathNaves1("x"),
                translateY: SVMPathNaves1("y"),
                rotate: SVMPathNaves1("angle"),
                duration: 59000,
                easing: 'cubicBezier(0.230, 0.490, 0.575, 1.000)',
            }, {
                translateX: SVMPathNaves2("x"),
                translateY: SVMPathNaves2("y"),
                rotate: SVMPathNaves2("angle"),
                delay: 3000,
                endDelay: 1500,
                duration: 5000,
                easing: 'cubicBezier(0.225, 0.330, 0.565, 1.000)',
            }, {
                translateX: SVMPathNaves3("x"),
                translateY: SVMPathNaves3("y"),
                rotate: SVMPathNaves3("angle"),
                /*{value: [-98.1583, -98.1583 - 100], duration: 1500}*/
                easing: "cubicBezier(0.340, 0.485, 0.590, 0.990)",
                duration: 25000,
                delay: 0,
            }
        ],

    }, 2000).add({
        targets: document.getElementById("SVMFocusText"),
        translateX: SVMPathNaves1("x"),
        translateY: SVMPathNaves1("y"),
        duration: 59000,
        opacity: {value: 0, duration: 1000, easing: "linear", delay: 40000},
        easing: 'cubicBezier(0.230, 0.490, 0.575, 1.000)',

    }, 2000);
}
