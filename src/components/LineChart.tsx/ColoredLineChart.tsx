import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calcMean, calcStd, getAnomalyIntervals } from "../../utils/utils";
import { useMemo } from "react";

const srcData: DataItemType[] = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

type DataItemType = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
};

interface Props {
  data: DataItemType[];
  threshold?: number; // опционально, чтобы менять порог z-score
}

const ColoredLineChart: React.FC<Props> = ({ data, threshold = 1 }) => {

  const [zUvScores, zPvScores] = useMemo(() => {
    const uvs = data.map((d) => d.uv);
    const pvs = data.map((d) => d.pv);

    const meanUv = calcMean(uvs);
    const stdUv = calcStd(uvs, meanUv);
    const meanPv = calcMean(pvs);
    const stdPv = calcStd(pvs, meanPv);

    const zUv = data.map((d) => (stdUv === 0 ? 0 : (d.uv - meanUv) / stdUv));
    const zPv = data.map((d) => (stdPv === 0 ? 0 : (d.pv - meanPv) / stdPv));

    return [zUv, zPv] as const;
  }, [data]);


  const uvIntervals = useMemo(
    () => getAnomalyIntervals(zUvScores, threshold),
    [zUvScores, threshold]
  );
  const pvIntervals = useMemo(
    () => getAnomalyIntervals(zPvScores, threshold),
    [zPvScores, threshold]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={srcData}
        margin={{
          top: 5,
          right: 100,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />

        {/* Закрашиваем фон для каждого «аномального» интервала */}
        {pvIntervals.map(([s, e], idx) => (
          <ReferenceArea
            key={`anompv-${idx}`}
            x1={srcData[s].name}
            x2={srcData[e].name}
            stroke="red"
            fill="red"
            fillOpacity={0.1}
            label={{
              position: "insideTop",
              value: "PV Anomaly",
              fill: "blue",
            }}
          />
        ))}

        {/* Закрашиваем фон для каждого «аномального» интервала */}
        {uvIntervals.map(([s, e], idx) => (
          <ReferenceArea
            key={`anomuv-${idx}`}
            x1={srcData[s].name}
            x2={srcData[e].name}
            stroke="red"
            fill="red"
            fillOpacity={0.1}
            label={{
              position: "insideTop",
              value: "UV Anomaly",
              fill: "blue",
            }}
          />
        ))}

        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ColoredLineChart;
