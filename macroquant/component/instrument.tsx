"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { IoIosArrowForward } from "react-icons/io";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import { IoCloseOutline } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Instrument() {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  return (
    <div className="mt-2 o">
      <Sheet>
        <SheetTrigger>Symbol</SheetTrigger>
        <SheetContent side="left" className="z-100 p-5 font-mono">
          <SheetHeader className="text-left  pl-0!">
            <SheetTitle>Name</SheetTitle>
            <span>Title</span>
          </SheetHeader>

          <Separator />
          {/* Daily Snapshot */}
          <div>
            <span className="text-[10px]">Daily Snapshot</span>

            <div className="flex flex-row mb-3!">
              <h1 className="mr-2! text-sm"> Current Price</h1>{" "}
              <span>(+0.8%)</span>
            </div>
            <div className="flex flex-row  font-mono justify-between ">
              <div>
                <h1 className="text-[10px]">24H HIGH</h1>
                <h1 className="text-xs">1000.09</h1>
              </div>
              <div>
                <h1 className="text-[10px]">24H LOW</h1>
                <h1 className="text-xs">1000.09</h1>
              </div>

              <div>
                <h1 className="text-[10px]">VOLUME</h1>
                <h1 className="text-xs">1000.09</h1>
              </div>
            </div>
          </div>
          {/* Macro Correlation Score */}
          <Separator />
          <div>
            <div className="flex flex-row justify-between text-center mb-2 pt-auto">
              <span className=" text-[10px]">MACRO CORRELATION SCORE</span>
              <span>0.8</span>
            </div>
            <Progress value={33} />
            <div className="flex flex-row justify-between text-[10px]">
              <span>LOW</span>
              <span>HIGH</span>
            </div>
          </div>
          <Separator />
          <Drawer>
            <DrawerTrigger className="text-xs text-left flex flex-row justify-between">
              COT ANALYSIS <IoIosArrowForward />
            </DrawerTrigger>
            <DrawerContent className="z-120 font-mono">
              <DrawerHeader className="flex flex-row justify-between">
                <DrawerTitle className="text-sm">COT ANALYSIS</DrawerTitle>
                <DrawerClose>
                  <IoCloseOutline />
                  {/* <Button variant="outline"></Button> */}
                </DrawerClose>
                {/* <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription> */}
              </DrawerHeader>
              <CardContent className="mb-4">
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <defs>
                      <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-desktop)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillMobile"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-mobile)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="url(#fillMobile)"
                      fillOpacity={0.4}
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="url(#fillDesktop)"
                      fillOpacity={0.4}
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>

              <CardContent>
                <Table className="text-xs">
                  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              {/* <DrawerFooter>
                <Button>Submit</Button>
              </DrawerFooter> */}
            </DrawerContent>
          </Drawer>
        </SheetContent>
      </Sheet>
    </div>
  );
}
