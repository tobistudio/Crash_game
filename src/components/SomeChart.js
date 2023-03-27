
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

import 'chart.js/auto';
import { Chart, Line } from 'react-chartjs-2';
import moment from "moment";
import 'chartjs-adapter-moment'
// import user from "../../../backend/models/user";



//--------------------------------------------------------------------------------------------------------------
export function SomeChart({ chartData, chartOptions }) {


    return (
        <>
            <div >
                <Chart type='line' data={chartData} options={chartOptions} />
            </div>

        </>
    )
}


//----------------------------------------------------- DawnseeChart ------------------------------------------------//

export const CanvasChart = ({ chartData, chartOptions }) => {


    const canvass = useRef(null);
    let canvasRef = canvass.current;
    const canvas_div = useRef(null);
    const [size, setSize] = useState([400, 200]);

    useEffect(() => {
        canvasRef = canvass.current;
        drawChart();
    }, [chartData, chartOptions])

    useLayoutEffect(() => {
        function updateSize() {
            canvasRef = canvass.current;
            setSize([canvas_div.current.clientWidth, canvas_div.current.clientHeight]);
            drawChart();
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    function LineChart(con) {
        // user defined properties  
        this.minX = con.minX;
        this.minY = con.minY;
        this.maxX = con.maxX;
        this.maxY = con.maxY;
        this.unitsPerTickX = con.unitsPerTickX;
        this.unitsPerTickY = con.unitsPerTickY;

        // constants  
        this.padding = 10;
        this.tickSize = 10;
        this.axisColor = "#5de474";
        this.pointRadius = 5;
        this.font = "10pt Calibri";
        this.fillStyle = "#fff";

        this.fontHeight = 10;

        // relationships       
        this.context = canvasRef.getContext("2d");
        this.context.clearRect(0, 0, canvasRef.width, canvasRef.height);
        this.rangeX = this.maxX - this.minX;
        this.rangeY = this.maxY - this.minY;
        this.numXTicks = Math.round(this.rangeX / this.unitsPerTickX);
        this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
        // this.x = this.getLongestValueWidth() + this.padding * 2;
        this.x = this.padding * 2;
        this.y = this.padding * 2;
        this.width = canvasRef.width - this.x - this.padding * 2;
        this.height = canvasRef.height - this.y - this.padding - this.fontHeight;
        this.scaleX = this.width / this.rangeX;
        this.scaleY = this.height / this.rangeY;

        // draw x y axis and tick marks  
        this.drawXAxis();
        this.drawYAxis();
    }

    LineChart.prototype.getLongestValueWidth = function () {
        this.context.font = this.font;
        var longestValueWidth = 0;
        for (var n = 0; n <= this.numYTicks; n++) {
            var value = this.maxY - (n * this.unitsPerTickY);
            longestValueWidth = Math.max(longestValueWidth, this.context.measureText(value).width);
        }
        return longestValueWidth;
    };

    LineChart.prototype.drawXAxis = function () {
        var context = this.context;
        context.save();
        context.beginPath();
        context.moveTo(this.x, this.y + this.height);
        context.lineTo(this.x - 100 + this.width, this.y + this.height);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 4;
        context.stroke();

        // draw tick marks  
        // for (var n = 0; n < this.numXTicks; n++) {
        //     context.beginPath();
        //     context.moveTo((n + 1) * this.width / this.numXTicks + this.x, this.y + this.height);
        //     context.lineTo((n + 1) * this.width / this.numXTicks + this.x, this.y + this.height - this.tickSize);
        //     context.stroke();
        // }

        // draw labels  
        context.font = this.font;
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";

        for (var n = 0; n < this.numXTicks; n++) {
            var label = parseFloat((n + 1) * this.maxX / this.numXTicks);
            context.save();
            context.translate((n + 1) * this.width / this.numXTicks + this.x - 100, this.y + this.height + this.padding);
            context.fillText(label + "s", 0, 0);
            context.restore();
        }
        context.restore();
    };

    LineChart.prototype.drawYAxis = function () {
        var context = this.context;
        context.save();
        context.save();
        context.beginPath();
        // context.moveTo(this.x, this.y);
        // context.lineTo(this.x, this.y + this.height);
        // context.strokeStyle = this.axisColor;
        // context.lineWidth = 1;
        // context.stroke();
        context.restore();

        // draw tick marks  
        for (var n = 0; n < this.numYTicks; n++) {
            context.beginPath();
            context.strokeStyle = "white"
            context.moveTo(this.x + canvasRef.width - 130, n * this.height / this.numYTicks + this.y);
            context.lineTo(this.x + canvasRef.width - 130 + this.tickSize, n * this.height / this.numYTicks + this.y);
            context.stroke();
            for (var i = 1; i < 4; i++) {
                context.strokeStyle = "grey"
                context.moveTo(this.x + canvasRef.width - 130, n * this.height / this.numYTicks + this.y + i * this.height / (this.numYTicks * 4));
                context.lineTo(this.x + canvasRef.width - 130 + this.tickSize - 5, n * this.height / this.numYTicks + this.y + i * this.height / (this.numYTicks * 4));
                context.stroke();
            }
        }

        // draw values  
        context.font = this.font;
        context.fillStyle = "white";
        context.textAlign = "right";
        context.textBaseline = "middle";

        for (var n = 0; n <= this.numYTicks; n++) {
            var value = parseFloat(this.maxY - (n * this.unitsPerTickY)).toFixed(2);

            context.save();
            context.translate(this.x + canvasRef.width - 60 - this.padding, n * this.height / this.numYTicks + this.y);
            context.fillText(value + "X", 0, 0);
            context.restore();
        }
        context.restore();
    };

    LineChart.prototype.drawLine = function (data, color, width) {
        var context = this.context;
        context.save();
        this.transformContext();
        context.lineWidth = width;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.beginPath();
        console.log("x:---",data[0].x * this.scaleX);
        context.moveTo(data[0].x * this.scaleX, data[0].y * this.scaleY);

        for (var n = 1; n < data.length; n++) {
            var point = data[n];

            // draw segment  
            context.quadraticCurveTo(point.x * this.scaleX, point.y * this.scaleY - 3, point.x * this.scaleX, point.y * this.scaleY);
            // context.lineTo(point.x * this.scaleX, point.y * this.scaleY);
            context.stroke();
            context.closePath();
            context.beginPath();
            // context.arc(point.x * this.scaleX, point.y * this.scaleY, this.pointRadius, 0, 2 * Math.PI, false);
            // context.fill();
            // context.closePath();

            // position for next segment  
            context.beginPath();
            context.moveTo(point.x * this.scaleX, point.y * this.scaleY);
        }
        let myGif = new GIF();
        myGif.load('/images/crash_rocket.gif');
        
        context.drawImage(myGif.image, data[data.length - 1].x * this.scaleX - 30, data[data.length - 1].y * this.scaleY - 30, 150, 150);
        context.restore();
    };

    LineChart.prototype.transformContext = function () {
        var context = this.context;

        // move context to center of canvas  
        this.context.translate(this.x, this.y + this.height);

        // invert the y scale so that that increments  
        // as you move upwards  
        context.scale(1, -1);
    };

    const drawChart = () => {
        if (chartData?.datasets[0]?.data.length) {
            console.log(chartData.datasets[0].data);
            var myLineChart = new LineChart({
                minX: 0,
                minY: 1,
                maxX: 10,
                maxY: 2.6,
                unitsPerTickX: 5,
                unitsPerTickY: 0.1
            });
            // var data = [...new Array(100)].map((ele, i) => ({ x: i * 0.1 * (1 - i / 300 ), y: i * 0.005 }));
            var data = [...chartData.labels.map((i, index) => ({ x: i, y: chartData.datasets[0].data[index] - 1 }))];


            // console.log("data",data);
            myLineChart.drawLine(data, "#d99de6", 3);
        }
    };


    return (
        <>
            <div className="canvas" ref={canvas_div}>
                <canvas ref={canvass} width={parseInt(size[0])} height={parseInt(size[1])} ></canvas>
            </div>
        </>
    )
}
