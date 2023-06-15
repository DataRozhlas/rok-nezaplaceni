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

const charts = [
  {
    title: "Kolik procent příjmů dávají za bydlení",
    filename: "vydaje-procenta",
    line: 0,
    groups: [
      {
        name: "Region",
        visible: ["Severozápad (Karlovarský a Ústecký kraj)", "Praha"],
      },
      {
        name: "Typ domácnosti – děti a příjem",
        visible: ["S dětmi – příjem pod medián"],
      },
    ],
  },
];

export const App = () => {
  return (
    <Container maxW={620}>
      {charts.map((chart) => {
        return (
          <>
            <Heading fontSize={"3xl"} pb={3}>
              {chart.title}
            </Heading>
            <Tabs key={chart.filename} variant="soft-rounded">
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
                        visible={group.visible}
                      ></SlopeChart>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          </>
        );
      })}
      ;
    </Container>
  );
};
