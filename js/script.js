

const bubbleRoot = d3.select('#bubble-root');
const selectionRoot = d3.select('#selection-root');
const insertionRoot = d3.select('#insertion-root');

const svgWidth = +bubbleRoot.attr('width');
const svgHeight = +bubbleRoot.attr('height');
const bottomSvgSpace = 30; // space of bubbles
const barChartHeight = svgHeight - bottomSvgSpace;

//length of array
const length = 25;


var bubbleDuration = 100;
var selectionDuration = 100;
var insertionDuration = 100;

const barWidth = svgWidth / length;
const padding = barWidth * 0.0; // space between bars

var bubbleRunning = false;
var selectionRunning = false;
var insertionRunning = false;


//Scales
const heightScale = d3.scaleLinear().domain([0, length - 1]).range([0, barChartHeight]);
const lowerScale = d3.scaleLinear().domain([0, length - 1]).range([0, 1]);



//Buttons
const bubblePlayButton = d3.select('#bubble-play-button');
const bubbleGenerateButton = d3.select('#bubble-generate-button');
const bubbleDurationInput = d3.select('#bubble-duration-input');

const selectionPlayButton = d3.select('#selection-play-button');
const selectionGenerateButton = d3.select('#selection-generate-button');
const selectionDurationInput = d3.select('#selection-duration-input');

const insertionPlayButton = d3.select('#insertion-play-button');
const insertionGenerateButton = d3.select('#insertion-generate-button');
const insertionDurationInput = d3.select('#insertion-duration-input');


bubbleDurationInput.on('input', function () { bubbleDuration = +this.value });
bubbleGenerateButton.on('click', function () {
    bubbleRunning = false;
    bubblePlayButton.text('START');
    for (let i = 0; i < length; i++) {
        bubbleArray[i].value = Math.floor(Math.random() * length) + 1;
    }
    render(bubbleRoot, bubbleArray, bubbleDuration);
});
bubblePlayButton.on('click', function () {

    //start 
    if (bubbleRunning == false) {
        bubblePlayButton.text('STOP');
        bubbleRunning = true;
        bubbleSort();

    }
    //stop
    else {
        bubblePlayButton.text('START');
        bubbleRunning = false;

    }
});

selectionDurationInput.on('input', function () { selectionDuration = +this.value });
selectionGenerateButton.on('click', function () {
    selectionRunning = false;
    selectionPlayButton.text('START');
    for (let i = 0; i < length; i++) {
        selectionArray[i].value = Math.floor(Math.random() * length) + 1;
    }
    render(selectionRoot, selectionArray, selectionDuration);
});
selectionPlayButton.on('click', function () {

    //start 
    if (selectionRunning == false) {
        selectionPlayButton.text('STOP');
        selectionRunning = true;
        selectionSort();

    }
    //stop
    else {
        selectionPlayButton.text('START');
        selectionRunning = false;

    }
});

insertionDurationInput.on('input', function () { insertionDuration = +this.value });
insertionGenerateButton.on('click', function () {
    insertionRunning = false;
    insertionPlayButton.text('START');
    for (let i = 0; i < length; i++) {
        insertionArray[i].value = Math.floor(Math.random() * length) + 1;
    }
    render(insertionRoot, insertionArray, insertionDuration);
});
insertionPlayButton.on('click', function () {

    //start 
    if (insertionRunning == false) {
        insertionPlayButton.text('STOP');
        insertionRunning = true;
        insertionSort();

    }
    //stop
    else {
        insertionPlayButton.text('START');
        insertionRunning = false;

    }
});



//Helpful functions
/**
 * Swaps indexes i and j in array a
 * @param {Number} i
 * @param {Number} j
 * @param {Array} a
 */
const swap = (i, j, a) => {
    let temp = a[j];
    a[j] = a[i];
    a[i] = temp;
};

//Render
const render = (selection, data, duration) => {
   
    const groups = selection.selectAll('g').data(data, d => d.id);
    const groupsEnter = groups.enter().append('g')

    groupsEnter
        .merge(groups)
        .transition().duration(duration - 10)
        .attr('transform', (d, i) =>
            `translate(${barWidth * i + padding / 2}, ${barChartHeight - heightScale(d.value)})`)

    groupsEnter.exit().remove();
    groupsEnter.append('rect')
        .merge(groups.select('rect'))
        .attr('width', function (d, i) {
            /*            if (d.isSelected == true) {
                            return (barWidth - padding) * 2;
                        }*/
            return barWidth - padding;
        })
        .attr('height', d => heightScale(d.value))
        .attr('fill', function (d) {
            if (d.isSelected == true) {
                return 'yellow';
            }
            else {
                return d3.interpolateSpectral(lowerScale(d.value));
                //return d3.interpolateTurbo(lowerScale(d.value));
                //return d3.interpolateViridis(lowerScale(d.value));
                //return d3.interpolateInferno(1-lowerScale(d.value));
                //return d3.interpolateWarm(1-lowerScale(d.value));
            }
        });
  


    groupsEnter.append('circle')
        .merge(groups.select('circle'))
        .attr('r', function () {
            let radius = barWidth / 2 - 2;
            if (length > 30) {
                return 0;
            }
            if (radius > bottomSvgSpace / 2 - 2) {
                return bottomSvgSpace / 2 - 2;
            }
            else {
                return radius;
            }

        })
        .attr('fill', function (d) {
            if (d.isSelected == true) {
                return 'yellow';
            }
            else {
                return 'rgb(221, 213, 213)';
            }
        })
        .attr('transform', (d) =>
            `translate(${barWidth / 2}, 
            ${(svgHeight - barChartHeight) - bottomSvgSpace / 2 + heightScale(d.value)})`);

    groupsEnter.append('text')
        .merge(groups.select('text'))
        .text(d => d.value)
        .attr('transform', function (d) {
            let width = this.textContent.length;
            return `translate(${barWidth / 2 - width * 9 / 2}, 
            ${(svgHeight - barChartHeight) - bottomSvgSpace / 3 + heightScale(d.value)})`;
        })
        .attr('fill', function (d) {
            if (d.isSelected == true) {
                return 'black';
            }
            else {
                return 'white';
            }
        })
        .attr('font-size', function () {
            if (length > 30) {
                return 0;
            }
        })

}
/**
 * Sets the property of 'isSelected' to bool in array a
 * @param {Array} indexes
 * @param {Boolean} bool
 * @param {Array} a
 */
const setSelected = function (indexes, bool, a) {
    for (let i = 0; i < indexes.length; i++) {
        a[indexes[i]].isSelected = bool;
    }
}


//Sorting Algorithms
function bubbleSort() {
    let i = 0;
    let j = 0;
    (function nextIteration() {

        if (bubbleRunning == false) {
            return;
        }
        if (j >= length - i - 1) {
            j = 0;
            i++;
        }
        if (i < length) {
            if (bubbleArray[j].value > bubbleArray[j + 1].value) {
                swap(j, j + 1, bubbleArray)

            }
            setSelected([j, j + 1], true, bubbleArray);
            render(bubbleRoot, bubbleArray, bubbleDuration);
            setSelected([j, j + 1], false, bubbleArray);
            j++;
            setTimeout(nextIteration, bubbleDuration);
        } else {
            render(bubbleRoot, bubbleArray, bubbleDuration);
            bubblePlayButton.on('click')();
        }

    })();
}

function selectionSort() {
    let i = 0;
    let j = i + 1;
    let minIndex = 0;
    (function nextIteration() {
        if (selectionRunning == false) {
            return;
        }

        if (j < length) {
            setSelected([i, j, minIndex], true, selectionArray);
            render(selectionRoot, selectionArray, selectionDuration);
            setSelected([i, j, minIndex], false, selectionArray);
        }
        if (j >= length) {
            swap(i, minIndex, selectionArray);
            i++;
            j = i + 1;
            minIndex = i;
        }

        if (i < length && j < length) {
            if (selectionArray[minIndex].value > selectionArray[j].value) {
                minIndex = j;
            }

            j++;
            setTimeout(nextIteration, selectionDuration);
        } else {

            render(selectionRoot, selectionArray, selectionDuration);

            selectionPlayButton.on('click')();
        }

    })();
}

function insertionSort() {

    let i = 1;
    let j = i;

    (function nextIteration() {

        if (insertionRunning == false) {
            return;
        }

        if (j <= 0 || insertionArray[j - 1].value <= insertionArray[j].value) {
            i++;
            j = i;
        }

        if (i < length) {
            setSelected([j, j - 1, i], true, insertionArray);
            render(insertionRoot, insertionArray, insertionDuration);
            setSelected([j, j - 1, i], false, insertionArray);
            if (insertionArray[j - 1].value > insertionArray[j].value) {
                swap(j, j - 1, insertionArray);
            }

            j--;
            setTimeout(nextIteration, insertionDuration);
        }
        else {
            render(insertionRoot, insertionArray, insertionDuration);
            insertionPlayButton.on('click')();
        }


    })();
}



//Array
const makeObject = num => {
    return {
        value: Math.floor(Math.random() * length) + 1,
        id: Math.random(),
        isSelected: false,

    };
};
var bubbleArray = d3.range(length).map(makeObject);
var selectionArray = d3.range(length).map(makeObject);
var insertionArray = d3.range(length).map(makeObject); 


render(bubbleRoot, bubbleArray, bubbleDuration);
render(selectionRoot, selectionArray, selectionDuration);
render(insertionRoot, insertionArray, insertionDuration);

console.log('shamsahmedansari@gmail.com')