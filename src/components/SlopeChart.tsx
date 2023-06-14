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
  const { filename, group, visible } = props;

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
  });

  useEffect(() => {
    data.then((data) => {
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          series: [
            {
              name: "Celkem",
              type: "line",
              data: data.total.lines[0].filter(
                (_point: number, index: number) =>
                  index === 0 || index === data.total.lines[0].length - 1
              ),
            },
            ...data.groups
              .find((groupData: any) => groupData.title === group)
              .data.map((groupData: any) => {
                return {
                  name: groupData.title,
                  type: "line",
                  data: groupData.lines[0].filter(
                    (_point: number, index: number) =>
                      index === 0 || index === groupData.lines[0].length - 1
                  ),
                };
              }),
          ],
        };
      });
    });
  }, [data]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
};
