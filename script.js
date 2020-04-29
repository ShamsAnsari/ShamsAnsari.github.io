


const root = d3.select('#root');
const svgWidth = +root.attr('width');
const svgHeight = +root.attr('height');

const bcHeight = svgHeight;
const length = 25;
const duration = 100;
const barWidth = svgWidth / length;
const padding = barWidth * 0.00;



const heightScale = d3.scaleLinear().domain([0, length]).range([0, bcHeight]);
const lowerScale = d3.scaleLinear().domain([0, length]).range([0, 1]);
const colorScale = d3.scaleLinear().domain([0, length]).range(['green', 'yellow']);

const makeObject = num => {
    return { value: Math.floor(Math.random() * length) + 1, id: Math.random() };
};
let arr = d3.range(length).map(makeObject);

const swap = (i, j, a) => {
    let temp = a[j];
    a[j] = a[i];
    a[i] = temp;
};

const render = (selection, data) => {

    const rects = selection.selectAll('rect')
        .data(data, d => d.id);
    rects
        .enter()
        .append('rect')
        .attr('width', barWidth - padding)
        .attr('y', (d) => bcHeight - heightScale(d.value))
        .attr('fill', (d) => d3.interpolateSpectral(lowerScale(d.value)))
        .attr('x', (d, i) => barWidth * i + padding / 2)
        .merge(rects)
        .attr('y', (d) => bcHeight - heightScale(d.value))
        .attr('fill', (d) => d3.interpolateSpectral(lowerScale(d.value)))
       
        .transition()
        .attr('height', d => heightScale(d.value))
        .duration(duration)
        .attr('x', (d, i) => barWidth * i + padding / 2);
}

render(root, arr);
var running = false;

const playButton = d3.select('#play-button');
const generateButton = d3.select('#generate-button');

const clearBubbleSort = function () {
    i = 0;
    j = 0;
}

console.log(playButton);
generateButton.on('click', function () {
    running = false;
    clearBubbleSort();
    playButton.text('start');
    for (let i = 0; i < length; i++) {
        arr[i].value = Math.floor(Math.random() * length) + 1;
    }
    render(root, arr);
});
playButton.on('click', function () {

    //start 
    if (running == false) {
        playButton.text('stop');
        running = true;
        bubbleSort();
    }
    //stop
    else {
        playButton.text('start');
        running = false;

    }
});

function bubbleSort() {
    var i = 0;
    var j = 0;

    (function nextIteration() {
      
        if (running == false) {
            return;
        }
        if (j >= length - i - 1) {
            j = 0;
            i++;
        }
        if (i < length) {
            if (arr[j].value > arr[j + 1].value) {
                swap(j, j + 1, arr)
                render(root, arr);
            }
            j++;
            setTimeout(nextIteration, duration);
        } else {
            clearBubbleSort();
            playButton.text('start');
        }

    })();
}



