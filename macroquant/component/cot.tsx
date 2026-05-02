import { useCotState } from "@/app/util/state";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiCircleInfo, CiSearch } from "react-icons/ci";
import { RxPeople } from "react-icons/rx";

export default function COT() {
  const [symbolsData, setSymbolsData] = useState<Record<string, any>>({});
  const [percData, setPerData] = useState<Record<string, any>>({
    Large_Spec_Net: {
      "1_month": null,
      "3_month": null,
      "6_month": null,
    },
    Commercial_Net: {
      "1_month": null,
      "3_month": null,
      "6_month": null,
    },
  });
  const [dataSet, setDataSet] = useState<boolean>(false);
  const { fetchCot, data, loading, error } = useCotState();
  const handleAllData = () => {
    // console.log("all Data");
    if (data && Object.keys(data).length > 0) {
      // const mergedData = [...Object.values(data)]
      // console.log(mergedData)
    }
  };

  const handleSymbolData = (value: Record<string, any>) => {
    const sortedData = Object.entries(value as Record<string, any>)
      .slice(0, -2) // 1. Remove the last two items
      .sort(([keyA], [keyB]) => keyB.localeCompare(keyA));

    const pctLChange =
      Object.entries(
        value?.["pct_change"]?.["Large_Spec_Net"]?.["1_month"] || {},
      )
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;
    const pct3LChange =
      Object.entries(value["pct_change"]?.["Large_Spec_Net"]?.["3_month"] || {})
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;
    const pct6LChange =
      Object.entries(value["pct_change"]?.["Large_Spec_Net"]?.["6_month"] || {})
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;

    const pctCChange =
      Object.entries(value["pct_change"]?.["Commercial_Net"]?.["1_month"] || {})
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;
    const pct3CChange =
      Object.entries(value["pct_change"]?.["Commercial_Net"]?.["3_month"] || {})
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;
    const pct6CChange =
      Object.entries(value["pct_change"]?.["Commercial_Net"]?.["6_month"] || {})
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .at(0)?.[1] || null;

    const pctData = {
      Large_Spec_Net: {
        "1_month": pctLChange,
        "3_month": pct3LChange,
        "6_month": pct6LChange,
      },
      Commercial_Net: {
        "1_month": pctCChange,
        "3_month": pct3CChange,
        "6_month": pct6CChange,
      },
    };
    setSymbolsData(sortedData);
    setDataSet(true);
    setPerData(pctData);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchCot(); // ← Get the returned data
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [fetchCot]);

  useEffect(() => {
    console.log(data);
    if (data && Object.keys(data).length > 0) {
      console.log("Data updated in store:", data);
      // Do something with the new data
    }
  }, [data]);

  // if (loading) return <div>Loading COT data...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <div>
        <Link href={""}></Link>
        <div>
          <h1 className="text-xl font-bold">Commitment of Traders (COT)</h1>
          <span className="text-xs/1 text-neutral-600">
            CTFC tracked weekly summary of market participants positions 20
            instuments tracked
          </span>
        </div>
      </div>
      {/* Description of Traders */}
      <div className="mb-5">
        <div>
          {/* <RxPeople /> */}
          <div className="border-neutral-200 border-[0.5px] px-5 py-4 rounded-lg mb-3">
            <div className="flex flex-row justify-between">
              <span className="text-xs text-neutral-600">Commercial</span>
              <CiCircleInfo />
            </div>

            <h1 className="text-bold text-sm">Producers & Hedgers</h1>
          </div>
          <div className="border-neutral-200 border-[0.5px] px-5 py-4 rounded-lg mb-3">
            <div className="flex flex-row justify-between">
              <span className="text-xs text-neutral-600">Non Commercial</span>
              <CiCircleInfo />
            </div>

            <h1 className="text-bold text-sm">Speculators (Hedge Funds)</h1>
          </div>
          <div className="border-neutral-200 border-[0.5px] px-5 py-4 rounded-lg">
            <div className="flex flex-row justify-between">
              <span className="text-xs text-neutral-600">Non Reportable</span>
              <CiCircleInfo />
            </div>

            <h1 className="text-bold text-sm">Small Traders (Retail)</h1>
          </div>
        </div>
      </div>

      {/* Search for instrument */}
      <div className="w-full h-fit mb-5">
        {" "}
        <CiSearch
          style={{ color: "black" }}
          className="absolute left-5  mt-3 ml-2 my-auto"
        />
        <Input
          type="search"
          placeholder="Search instrument.."
          className="text-xs px-7 py-5"
        ></Input>
      </div>

      {/* Filter with Instrument */}

      <div className="overflow-auto mb-2">
        <ToggleGroup
          type="single"
          size="sm"
          defaultValue="top"
          variant="outline"
          spacing={2}
        >
          <ToggleGroupItem
            value="top"
            aria-label="Toggle top"
            onClick={handleAllData}
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="Currency" aria-label="Toggle bottom">
            Currencies
          </ToggleGroupItem>
          <ToggleGroupItem value="Indicies" aria-label="Toggle left">
            Indicies
          </ToggleGroupItem>
          <ToggleGroupItem value="Crypto" aria-label="Toggle right">
            Crypto
          </ToggleGroupItem>
          <ToggleGroupItem value="Financial" aria-label="Toggle right">
            Financial
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Instruments */}

      <div>
        <div className="overflow-auto text-neutral-600">
          {/* Symbols */}
          {loading ? (
            <div>Loading COT data...</div>
          ) : (
            Object.entries(data).map(([key, value]) => (
              <div key={key}>
                {Object.entries(value).map(([k, v]) => (
                  <div
                    key={k}
                    className="border p-4 text-sm rounded-xl w-90 mb-3"
                    onClick={() => handleSymbolData(v as Record<string, any>)}
                  >
                    <div className="flex flex-row justify-between">
                      <div>
                        <h1 className="text-black text-lg font-semibold">
                          {k}
                        </h1>
                      </div>
                      <div>
                        {" "}
                        <h1 className="text-xs">Speculative Net</h1>
                        <span>
                          {Number(
                            Object.entries(v as Record<string, any>)
                              .slice(0, -2) // 1. Remove the last two items
                              .sort(([keyA], [keyB]) =>
                                keyA.localeCompare(keyB),
                              ) // 2. Sort remaining by Key
                              .at(-1)?.[1]["Large_Spec_Net"],
                          ).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div>
                        {" "}
                        <h1 className="text-xs">Commercial Net</h1>
                        <span>
                          {Number(
                            Object.entries(v as Record<string, any>)
                              .slice(0, -2) // 1. Remove the last two items
                              .sort(([keyA], [keyB]) =>
                                keyA.localeCompare(keyB),
                              ) // 2. Sort remaining by Key
                              .at(-1)?.[1]["Commercial_Net"],
                          ).toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs">
                        {" "}
                        Updated:
                        {
                          Object.entries(v as Record<string, any>)
                            .slice(0, -2) // 1. Remove the last two items
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // 2. Sort remaining by Key
                            .at(-1)?.[1]
                            ["Report_Date_as_YYYY_MM_DD"].split("T")[0]
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          {/* {Object.entries(data)} */}
        </div>
        <div>
          {/* Cot */}
          {!dataSet ? (
            <div>
              <h1>No Data ...</h1>
            </div>
          ) : (
            <div>
              <div>
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className=""></TableHead>
                      <TableHead>Speculative Net</TableHead>
                      <TableHead>Commercial Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Monthly</TableCell>
                      <TableCell>
                        {percData["Large_Spec_Net"]["1_month"] ? (
                          percData["Large_Spec_Net"]["1_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["Commercial_Net"]["1_month"] ? (
                          percData["Commercial_Net"]["1_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      {/* Open Interest */}
                      {/* <TableCell className="text-right">$250.00</TableCell> */}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Quartely</TableCell>
                      <TableCell>
                        {percData["Large_Spec_Net"]["3_month"] ? (
                          percData["Large_Spec_Net"]["3_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["Commercial_Net"]["3_month"] ? (
                          percData["Commercial_Net"]["3_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      {/* Open Interest */}
                      {/* <TableCell className="text-right">$250.00</TableCell> */}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bi-Anually</TableCell>
                      <TableCell>
                        {percData["Large_Spec_Net"]["6_month"] ? (
                          percData["Large_Spec_Net"]["6_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["Commercial_Net"]["6_month"] ? (
                          percData["Commercial_Net"]["6_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      {/* Open Interest */}
                      {/* <TableCell className="text-right">$250.00</TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-row justify-between">
                <h1>{""}</h1>
                <span className="text-xs">Crypto</span>
                <span className="text-xs"> View Chart</span>
              </div>

              <div className="mb-3">
                <span className="text-xs">Report Date: April 21</span>
              </div>

              <div className="flex text-xs justify-between">
                <div>
                  <h1> Speculator</h1>
                </div>

                <div>
                  <h1> Commercial</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
