import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { CanvasChartProps, LinChartContextProps } from "../types/someChart";

let count: number = 0;
let data_x_y: Array<number> = [0, 0];
let degree: number = 0;

//--------------------------------------------------------------------------------------------------------------
// export function SomeChart({ chartData, chartOptions }) {

//     return (
//         <>
//             <div >
//                 <Chart type='line' data={chartData} options={chartOptions} />
//             </div>

//         </>
//     )
// }

//----------------------------------------------------- DawnseeChart ------------------------------------------------//

export const CanvasChart: React.FC<CanvasChartProps> = ({
  chartData,
  chartOptions,
  bBettingPhase,
}) => {

  const canvass = useRef<HTMLCanvasElement>(null);
  const rocket = useRef<HTMLImageElement>(null);
  const explosion = useRef<HTMLImageElement>(null);
  let canvasRef: any = canvass.current;
  const canvas_div = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Array<number>>([400, 200]);

  useEffect(() => {
    canvasRef = canvass.current;
    drawChart();
  }, [chartData, chartOptions]);

  useLayoutEffect(() => {
    function updateSize() {
      canvasRef = canvass.current;
      setSize([
        canvas_div.current!.clientWidth,
        canvas_div.current!.clientHeight,
      ]);
      drawChart();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function LineChart(this: any, con: LinChartContextProps) {

    this.minX = con.minX;
    this.minY = con.minY;
    this.maxX = con.maxX;
    this.maxY = con.maxY;
    this.unitsPerTickX = con.unitsPerTickX;
    this.unitsPerTickY = con.unitsPerTickY;

    this.padding = 10;
    this.tickSize = 10;
    this.axisColor = "grey";
    this.pointRadius = 5;
    this.font = "10pt Calibri";
    this.fillStyle = "#fff";
    this.fontHeight = 10;

    this.context = canvasRef.getContext("2d");
    this.context.clearRect(0, 0, canvasRef.width, canvasRef.height);
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.numXTicks = Math.floor(this.rangeX / this.unitsPerTickX);
    this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
    this.x = this.padding * 2;
    this.y = this.padding * 2;
    this.rocket_width = canvasRef.width - this.x - this.padding * 2 - rocket.current!.width * 0.75;
    this.rocket_height = canvasRef.height - this.y - this.padding - this.fontHeight - rocket.current!.height / 7;
    this.width = canvasRef.width - this.x - this.padding * 2;
    this.height = canvasRef.height - this.y - this.padding - this.fontHeight;
    this.scaleX = this.width / this.rangeX;
    this.scaleY = this.height / this.rangeY;
    this.rocket_scaleX = this.rocket_width / this.rangeX;
    this.rocket_scaleY = this.rocket_height / this.rangeY;

    this.drawXAxis();
    this.drawYAxis();
  }

  LineChart.prototype.getLongestValueWidth = function () {

    this.context.font = this.font;
    var longestValueWidth = 0;
    for (let n = 0; n <= this.numYTicks; n++) {
      var value = this.maxY - n * this.unitsPerTickY;
      longestValueWidth = Math.max(
        longestValueWidth,
        this.context.measureText(value).width
      );
    }
    return longestValueWidth;
  };

  LineChart.prototype.drawXAxis = function () {

    const context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y + this.height);
    context.lineTo(
      this.x - this.padding * 10 + this.width,
      this.y + this.height
    );
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    context.font = this.font;
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let n = 0; n < this.numXTicks; n++) {

      let label = (n + 1) *
      (parseInt(this.maxX) > 9
        ? Math.floor(this.maxX / this.numXTicks / 10) * 10
        : Math.floor(this.maxX / this.numXTicks));

      context.save();

      context.translate(
        ((n + 1) * (this.width - (this.width / this.maxX) * (this.maxX -
        (parseInt(this.maxX) > 9
          ? Math.floor(this.maxX / 10) * 10
          : parseInt(this.maxX))))) / this.numXTicks + this.x - 100,
        this.y + this.height + this.padding
      );

      context.fillText(label + "s", 0, 0);
      context.restore();
    }
    context.restore();
  };

  LineChart.prototype.drawYAxis = function () {

    const context = this.context;
    context.save();
    context.save();
    context.beginPath();
    context.restore();

    for (let n = 0; n < this.numYTicks; n++) {

      context.beginPath();
      context.strokeStyle = "white";
      context.moveTo(
        this.x + canvasRef.width - rocket.current!.width / 2,
        (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) /
        this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );
      console.log(rocket);
      
      context.lineTo(
        this.x + canvasRef.width - rocket.current!.width / 2 + this.tickSize,
        (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) / 
        this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );

      context.stroke();

      for (let i = 1; i < 4; i++) {

        context.strokeStyle = "grey";
        context.moveTo(
          this.x + canvasRef.width - rocket.current!.width / 2,
          (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) / this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)) + (i * this.height) / (this.numYTicks * 4)
        );
        context.lineTo(
          this.x + canvasRef.width - rocket.current!.width / 2 + this.tickSize - 5,
          (n * (this.height - (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) / this.numYTicks + this.y + (this.height / this.rangeY) * (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)) + (i * this.height) / (this.numYTicks * 4)
        );
        context.stroke();
      }
    }

    context.font = this.font;
    context.fillStyle = "white";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let n = 0; n <= this.numYTicks; n++) {

      var value = Number((this.numYTicks - n) * this.unitsPerTickY + 1).toFixed(2);
      context.save();
      context.translate(
        this.x + canvasRef.width - rocket.current!.width / 4 - this.padding,
        (n *
          (this.height -
            (this.height / this.rangeY) *
            (this.maxY - (this.numYTicks * this.unitsPerTickY + 1)))) /
        this.numYTicks +
        this.y +
        (this.height / this.rangeY) *
        (this.maxY - (this.numYTicks * this.unitsPerTickY + 1))
      );
      context.fillText(value + "X", 0, 0);
      context.restore();
    }
    context.restore();
  };

  LineChart.prototype.drawLine = function (data: any, color: any, width: any) {

    const context = this.context;
    context.save();
    this.transformContext();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(
      data[0].x * this.rocket_scaleX,
      data[0].y * this.rocket_scaleY
    );

    for (let n = 1; n < data.length; n++) {
      let point = data[n];

      context.quadraticCurveTo(
        point.x * this.rocket_scaleX,
        point.y * this.rocket_scaleY - 3,
        point.x * this.rocket_scaleX,
        point.y * this.rocket_scaleY
      );
      context.stroke();
      context.closePath();
      context.beginPath();

      context.beginPath();
      context.moveTo(
        point.x * this.rocket_scaleX,
        point.y * this.rocket_scaleY
      );
    }

    if (bBettingPhase && count === 0) {

      count++;
      degree = 0;
      let width = rocket.current!.width;
      rocket.current!.style.display = "none";
      rocket.current!.width = width;
      explosion.current!.style.display = "block";
      explosion.current!.style.left = Number(data[data.length - 1].x * this.rocket_scaleX - 10) + "px";
      explosion.current!.style.bottom = Number(data[data.length - 1].y * this.rocket_scaleY - 85) + "px";

    } else if (bBettingPhase && count === 1) {

      rocket.current!.style.display = "none";
      setTimeout(() => {
        explosion.current!.style.display = "none";
      }, 1000);
      count++;

    } else if (!bBettingPhase) {

      rocket.current!.style.display = "block";

      rocket.current!.style.left =
        Number(
          data[data.length - 1].x * this.rocket_scaleX -
          rocket.current!.width / 2
        ) + "px";

      rocket.current!.style.bottom =
        Number(
          data[data.length - 1].y * this.rocket_scaleY -
          rocket.current!.height / 2.1
        ) + "px";

      if ( data_x_y[0] != data[data.length - 1].x && data_x_y[1] != data[data.length - 1].y ) {

        let meet_side = Number(
          Math.sqrt(
            (data[data.length - 1].x - data_x_y[0]) *
            (data[data.length - 1].x - data_x_y[0]) +
            (data[data.length - 1].y - data_x_y[1]) *
            (data[data.length - 1].y - data_x_y[1])
          )
        );
        let radian = Math.acos(
          (data[data.length - 1].x - data_x_y[0]) / meet_side
        );

        if ((radian * 180) / 3.14 > degree || degree === 0) {
          degree = (radian * 180) / 3.14;
        }

        data[data.length - 1].y > 0.5
          ? (rocket.current!.style.transform =
            "rotate(" + (41 - degree) + "deg)")
          : (rocket.current!.style.transform =
            "rotate(" + (52 - degree) + "deg)");

        data_x_y[0] = data[data.length - 1].x;
        data_x_y[1] = data[data.length - 1].y;

      } else {

        data[data.length - 1].y > 0.5
          ? (rocket.current!.style.transform =
            "rotate(" + (41 - degree) + "deg)")
          : (rocket.current!.style.transform =
            "rotate(" + (52 - degree) + "deg)");
      }
      count = 0;
    }
    context.restore();

  };

  LineChart.prototype.transformContext = function () {

    this.context.translate(this.x, this.y + this.height);
    this.context.scale(1, -1);

  };

  const drawChart = () => {

    if (chartData?.datasets[0]?.data.length) {
      var myLineChart = new (LineChart as any)({
        minX: 0,
        minY: chartOptions?.scales?.yAxes?.min,
        maxX: chartOptions?.scales?.xAxes?.max,
        maxY: chartOptions?.scales?.yAxes?.max,
        unitsPerTickX:
          Math.pow(
            10,
            parseInt(chartOptions?.scales?.xAxes?.max).toString().length
          ) / 10,
        unitsPerTickY:
          Math.pow(
            10,
            Number(chartOptions?.scales?.yAxes?.max / 0.25).toFixed(0).toString().length
          ) / 100,
      });
      var data = [
        ...chartData.labels.map((i: any, index: number) => ({
          x: i,
          y: chartData.datasets[0].data[index] - 1,
        })),
      ];

      myLineChart.drawLine(data, "#d99de6", 3);
    }
  };

  return (
    <>
      <div className="canvas" ref={canvas_div}>
        <canvas ref={canvass} width={size[0]} height={size[1]}></canvas>
        <img
          src="/images/crash_rocket.gif"
          className="rocket"
          ref={rocket}
          alt="rocket"
        />
        <img
          src="/images/explosion.gif"
          className="explosion"
          ref={explosion}
          alt="explosion"
        />
      </div>
    </>
  );
};
