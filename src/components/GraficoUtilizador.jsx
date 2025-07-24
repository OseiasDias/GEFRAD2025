import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function GraficoUtilizador() {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        let root = am5.Root.new(chartRef.current);

        root.setThemes([am5themes_Animated.new(root)]);

        // Tema dark
        root.interfaceColors.set("text", am5.color(0xffffff));
        root.interfaceColors.set("grid", am5.color(0x444444));

        root.container.set("background", am5.Rectangle.new(root, {
            fill: am5.color(0x000000), // cor é irrelevante se for transparente
            fillOpacity: 0             // opacidade 0 = transparente
        }));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
            })
        );

        let xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: {
                    timeUnit: "day",
                    count: 1,
                },
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 80,
                }),
            })
        );

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        let series = chart.series.push(
            am5xy.SmoothedXLineSeries.new(root, {
                name: "Total de Utilizadores",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{valueY}",
                }),
            })
        );

        series.strokes.template.setAll({
            stroke: am5.color(0x00d1b2),
            strokeWidth: 3,
        });

        series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.3,
            fill: am5.color(0x00d1b2),
        });

        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 4,
                    stroke: am5.color(0xffffff),
                    strokeWidth: 2,
                    fill: am5.color(0x00d1b2),
                }),
            });
        });

        // Busca o total real da API
        fetch("http://localhost:8080/api/utilizadores/total")
            .then((response) => response.json())
            .then((total) => {
                console.log("TOTAL:", total);
                // Simulação: cria alguns pontos com valor igual (só pra desenhar linha)
                let data = [];
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                for (let i = 0; i < 10; i++) {
                    data.push({
                        date: date.getTime(),
                        value: total + i * 5, // exemplo: crescendo só pra ter curva
                    });
                    date.setDate(date.getDate() + 1);
                }
                series.data.setAll(data);
            });

        series.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ width: "100%", height: "250px" }}
            className="bgGeneral"
        ></div>
    );
}
