import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function PieColumnChart() {
  const chartRoot = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/anuncios/total");
        const total = await res.json();
        console.log("TOTAL ANÚNCIOS:", total);

        const data = [
          {
            category: "Total Anúncios",
            value: total,
            sliceSettings: {
              fill: am5.color(0x68ad5c),
            },
            breakdown: [
              { category: "Confirmados", value: total * 0.5 },
              { category: "Pendentes", value: total * 0.3 },
              { category: "Rejeitados", value: total * 0.2 },
            ],
          },
        ];

        const root = am5.Root.new("chartdiv");
        chartRoot.current = root;
        root.setThemes([am5themes_Animated.new(root)]);

        const container = root.container.children.push(
          am5.Container.new(root, {
            width: am5.p100,
            height: am5.p100,
            layout: root.horizontalLayout,
          })
        );

        // ================
        // COLUMN CHART
        // ================
        const columnChart = container.children.push(
          am5xy.XYChart.new(root, {
            width: am5.p50,
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout,
          })
        );

        const yAxis = columnChart.yAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: am5xy.AxisRendererY.new(root, {
              minGridDistance: 20,
            }),
          })
        );

        const xAxis = columnChart.xAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {
              strokeOpacity: 0.1,
            }),
          })
        );

        const columnSeries = columnChart.series.push(
          am5xy.ColumnSeries.new(root, {
            xAxis,
            yAxis,
            valueXField: "value",
            categoryYField: "category",
          })
        );

        columnSeries.columns.template.setAll({
          tooltipText: "{categoryY}: {valueX}",
          fillOpacity: 0.8,
          strokeOpacity: 0,
        });

        columnChart.appear(1000, 100);

        // ================
        // PIE CHART
        // ================
        const pieChart = container.children.push(
          am5percent.PieChart.new(root, {
            width: am5.p50,
            innerRadius: am5.percent(50),
          })
        );

        const pieSeries = pieChart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
          })
        );

        pieSeries.slices.template.setAll({
          templateField: "sliceSettings",
          strokeOpacity: 0,
        });

        // ➜ LABELS CENTRAL
        const label1 = pieChart.seriesContainer.children.push(
          am5.Label.new(root, {
            text: "",
            fontSize: 25,
            fontWeight: "bold",
            fill: am5.color(0xffffff),
            centerX: am5.p50,
            centerY: am5.p50,
          })
        );

        const label2 = pieChart.seriesContainer.children.push(
          am5.Label.new(root, {
            text: "",
            fontSize: 12,
            fill: am5.color(0xffffff),
            centerX: am5.p50,
            centerY: am5.p50,
            dy: 30,
          })
        );

        let currentSlice = null;

        pieSeries.slices.template.on("active", (active, slice) => {
          if (currentSlice && currentSlice !== slice && active) {
            currentSlice.set("active", false);
          }

          label1.setAll({
            fill: am5.color(0xffffff),
            text: root.numberFormatter.format(
              slice.dataItem.get("valuePercentTotal"),
              "#.'%'"
            ),
          });

          label2.setAll({
            fill: am5.color(0xffffff),
            text: slice.dataItem.get("category"),
          });

          columnSeries.columns.template.setAll({
            fill: slice.get("fill"),
            stroke: slice.get("fill"),
          });

          columnSeries.data.setAll(slice.dataItem.dataContext.breakdown);
          yAxis.data.setAll(slice.dataItem.dataContext.breakdown);

          currentSlice = slice;
        });

        pieSeries.labels.template.set("forceHidden", true);
        pieSeries.ticks.template.set("forceHidden", true);

        pieSeries.data.setAll(data);

        pieSeries.events.on("datavalidated", () => {
          pieSeries.slices.getIndex(0).set("active", true);
        });

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    loadData();

    return () => {
      if (chartRoot.current) {
        chartRoot.current.dispose();
      }
    };
  }, []);

  return (
    <div >
      <h4 className="text-xl font-bold mb-4 text-white">
        Gráfico Total de Anúncios
      </h4>
      <div id="chartdiv" style={{ width: "100%", height: "240px" }}  className="bgGeneral py-2"></div>
    </div>
  );
}
