import { ChakraProvider } from "@chakra-ui/react";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

import {
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { SlopeChart } from "./components/SlopeChart";
import { usePostMessageWithHeight } from "./hooks/usePostHeightMessage";

const charts = [
  //   {
  //     title: "Kolik procent příjmů dávají za bydlení",
  //     filename: "vydaje-procenta",
  //     line: [0],
  //     unit: " %",
  //     groups: [
  //       {
  //         name: "Typ domácnosti – děti a příjem",
  //         visible: ["S dětmi – příjem pod medián"],
  //       },
  //       {
  //         name: "Příjem domácnosti",
  //         visible: ["Pod hranicí chudoby (< 60 % mediánu)"],
  //       },
  //       {
  //         name: "Region",
  //         visible: ["Severozápad (Karlovarský a Ústecký kraj)"],
  //       },
  //     ],
  //   },
  //   {
  //     title: "Kolika domácnostem po zaplacení všech výdajů nic nezbývá",
  //     filename: "uspory-procenta",
  //     line: [2, 3],
  //     unit: " %",
  //     groups: [
  //       {
  //         name: "Region",
  //         visible: ["Severozápad (Karlovarský a Ústecký kraj)"],
  //       },

  //       {
  //         name: "Typ domácnosti – děti a příjem",
  //         visible: ["S dětmi – příjem pod medián"],
  //       },
  //       {
  //         name: "Příjem domácnosti",
  //         visible: ["Pod hranicí chudoby (< 60 % mediánu)"],
  //       },
  //     ],
  //   },
  {
    title: "Kolik domácnostem zbývá po zaplacení všech výdajů",
    filename: "uspory-castky",
    line: [0],
    unit: " Kč",
    groups: [
      {
        name: "Dospělí v domácnosti",
        visible: ["Jen muž"],
      },
      {
        name: "Typ domácnosti – děti a příjem",
        visible: ["S dětmi – příjem pod medián"],
      },
      {
        name: "Region",
        visible: ["Střední Morava (Olomoucký a Zlínský kraj)", "Praha"],
      },
      {
        name: "Majitelé a nájemníci",
        visible: ["Vlastníci a družstevníci", "Nájemníci a podnájemníci"],
      },
    ],
  },
];

const App = () => {
  const { containerRef, postHeightMessage } =
    usePostMessageWithHeight("rok-nezap-graf3");
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    postHeightMessage();
  }, [activeTab]);

  return (
    <Container maxW={620} ref={containerRef}>
      {charts.map((chart) => {
        return (
          <Container pb={10}>
            <Heading fontSize={"3xl"} pb={3}>
              {chart.title}
            </Heading>
            <Tabs
              key={chart.filename}
              variant="enclosed"
              onChange={(index) => setActiveTab(index)}
            >
              <TabList>
                {chart.groups.map((group) => {
                  return <Tab key={group.name}>{group.name}</Tab>;
                })}
              </TabList>
              <TabPanels>
                {chart.groups.map((group) => {
                  return (
                    <TabPanel key={group.name}>
                      <SlopeChart
                        filename={chart.filename}
                        line={chart.line}
                        group={group.name}
                        unit={chart.unit}
                        visible={group.visible}
                      ></SlopeChart>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          </Container>
        );
      })}
    </Container>
  );
};

render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("app") as HTMLElement
);
