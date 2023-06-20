import { useRef, useEffect, useState } from "preact/hooks";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.

const getChartData = async (filename: string) => {
  const response = await fetch(
    `https://data.irozhlas.cz/paq-data/${filename}.json`
  );
  const data = await response.json();
  return data;
};

export const SlopeChart = (props: HighchartsReact.Props) => {
  const { filename, line, group, visible, unit } = props;

  const data = getChartData(filename);

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [options, setOptions] = useState<Highcharts.Options>({
    title: {
      text: "",
    },
    chart: {},
    credits: {
      enabled: false,
    },
    legend: {
      itemWidth: 400,
    },
    plotOptions: {
      line: {
        animation: false,
        lineWidth: 2,
        shadow: false,
        marker: {
          radius: 2,
        },
        dataLabels: {
          enabled: true,
          allowOverlap: true,
          align: "center",
          verticalAlign: "bottom",
          backgroundColor: "auto",
          style: {
            color: "white",
            textOutline: "none",
            textOverflow: "ellipsis",
          },
          x: 0,
          y: 10,
          formatter: function () {
            return this.series.name + " " + this.y + unit;
          },
        },
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: unit,
    },
    xAxis: {
      categories: ["listopad<br>2021", "květen<br>2023"],
      lineColor: "#999",
      title: {
        text: "",
      },
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
    },
  });

  useEffect(() => {
    data.then((data) => {
      const groupsData = data.groups.find(
        (groupData: any) => groupData.title === group
      );

      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          chart: {
            ...prevOptions.chart,
            height: groupsData.data.length * 13.5 + 450,
          },
          yAxis: {
            ...prevOptions.yAxis,
            max: data.yMax,
          },
          series: [
            {
              name: "Všichni",
              type: "line",
              data: line.reduce(
                (acc: number[], curr: number) => {
                  const values = data.total.lines[curr].filter(
                    (_point: number, index: number) =>
                      index === 0 || index === data.total.lines[curr].length - 1
                  );
                  return [acc[0] + values[0], acc[1] + values[1]];
                },
                [0, 0]
              ),
              marker: {
                symbol: "circle",
              },
            },
            ...groupsData.data.map((groupData: any) => {
              return {
                name: groupData.title,
                type: "line",
                data: line.reduce(
                  (acc: number[], curr: number) => {
                    const values = groupData.lines[curr].filter(
                      (_point: number, index: number) =>
                        index === 0 ||
                        index === groupData.lines[curr].length - 1
                    );
                    return [acc[0] + values[0], acc[1] + values[1]];
                  },
                  [0, 0]
                ),
                visible: visible.includes(groupData.title),
                marker: {
                  symbol: "square",
                },
              };
            }),
          ],
        };
      });
    });
  }, []);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
};
