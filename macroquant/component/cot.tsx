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
import {
  cotWeeklyEntries,
  latestCotReport,
  type CotInstrument,
  type CotWeeklyReport,
} from "@/app/util/cot";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiCircleInfo, CiSearch } from "react-icons/ci";
import { RxPeople } from "react-icons/rx";

/** Latest value in a `pct_change` horizon series (keyed by report date). */
function latestPct(series: Record<string, number> | undefined): number | null {
  if (!series) return null;
  const entry = Object.entries(series)
    .sort(([a], [b]) => a.localeCompare(b))
    .at(-1);
  return entry ? entry[1] : null;
}

type PctMetric = "large_spec_net" | "commercial_net";
type PctSummary = Record<
  PctMetric,
  Record<"1_month" | "3_month" | "6_month", number | null>
>;

const emptyPctSummary: PctSummary = {
  large_spec_net: { "1_month": null, "3_month": null, "6_month": null },
  commercial_net: { "1_month": null, "3_month": null, "6_month": null },
};

export default function COT() {
  const [symbolsData, setSymbolsData] = useState<
    Array<[string, CotWeeklyReport]>
  >([]);
  const [percData, setPerData] = useState<PctSummary>(emptyPctSummary);
  const [dataSet, setDataSet] = useState<boolean>(false);
  const { fetchCot, data, loading, error } = useCotState();
  const handleAllData = () => {
    // console.log("all Data");
    if (data && Object.keys(data).length > 0) {
      // const mergedData = [...Object.values(data)]
      // console.log(mergedData)
    }
  };

  const handleSymbolData = (instrument: CotInstrument) => {
    const weekly = cotWeeklyEntries(instrument).sort(([a], [b]) =>
      b.localeCompare(a),
    );

    const pct = instrument.pct_change;
    const pctData: PctSummary = {
      large_spec_net: {
        "1_month": latestPct(pct?.large_spec_net?.["1_month"]),
        "3_month": latestPct(pct?.large_spec_net?.["3_month"]),
        "6_month": latestPct(pct?.large_spec_net?.["6_month"]),
      },
      commercial_net: {
        "1_month": latestPct(pct?.commercial_net?.["1_month"]),
        "3_month": latestPct(pct?.commercial_net?.["3_month"]),
        "6_month": latestPct(pct?.commercial_net?.["6_month"]),
      },
    };

    setSymbolsData(weekly);
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
            Object.entries(data).map(([group, instruments]) => (
              <div key={group}>
                {instruments &&
                  Object.entries(instruments).map(([name, instrument]) => {
                    const latest = latestCotReport(instrument);
                    return (
                      <div
                        key={name}
                        className="border p-4 text-sm rounded-xl w-90 mb-3"
                        onClick={() => handleSymbolData(instrument)}
                      >
                        <div className="flex flex-row justify-between">
                          <div>
                            <h1 className="text-black text-lg font-semibold">
                              {name}
                            </h1>
                          </div>
                          <div>
                            {" "}
                            <h1 className="text-xs">Speculative Net</h1>
                            <span>
                              {latest
                                ? Number(latest.large_spec_net).toLocaleString(
                                    "en-US",
                                  )
                                : "—"}
                            </span>
                          </div>
                          <div>
                            {" "}
                            <h1 className="text-xs">Commercial Net</h1>
                            <span>
                              {latest
                                ? Number(latest.commercial_net).toLocaleString(
                                    "en-US",
                                  )
                                : "—"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs">
                            {" "}
                            Updated:
                            {latest?.report_date_as_yyyy_mm_dd?.split("T")[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
                        {percData["large_spec_net"]["1_month"] ? (
                          percData["large_spec_net"]["1_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["commercial_net"]["1_month"] ? (
                          percData["commercial_net"]["1_month"]
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
                        {percData["large_spec_net"]["3_month"] ? (
                          percData["large_spec_net"]["3_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["commercial_net"]["3_month"] ? (
                          percData["commercial_net"]["3_month"]
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
                        {percData["large_spec_net"]["6_month"] ? (
                          percData["large_spec_net"]["6_month"]
                        ) : (
                          <>
                            <h1>Nan</h1>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {percData["commercial_net"]["6_month"] ? (
                          percData["commercial_net"]["6_month"]
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
