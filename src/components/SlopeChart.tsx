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
  const { filename, line, group, visible } = props;

  const data = getChartData(filename);

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {},
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "",
      },
      min: 0,
    },
  });

  useEffect(() => {
    data.then((data) => {
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          yAxis: {
            ...prevOptions.yAxis,
            max: data.yMax,
          },
          series: [
            {
              name: "Všichni",
              type: "line",
              data: data.total.lines[line].filter(
                (_point: number, index: number) =>
                  index === 0 || index === data.total.lines[line].length - 1
              ),
            },
            ...data.groups
              .find((groupData: any) => groupData.title === group)
              .data.map((groupData: any) => {
                return {
                  name: groupData.title,
                  type: "line",
                  data: groupData.lines[line].filter(
                    (_point: number, index: number) =>
                      index === 0 || index === groupData.lines[line].length - 1
                  ),
                  visible: visible.includes(groupData.title),
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
