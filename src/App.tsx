import "./App.css"
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  Tooltip,
} from 'recharts';

type HistoryPrice = {
  unixTime: number
  value: number
}

function scaleData(prices: HistoryPrice[], toMin: number = 5, toMax: number = 19): HistoryPrice[] {
  const values = prices.map((price) => price.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const delimeter = max - min
  
  return prices.map(({ value, unixTime }) => {
    const newValue = toMin + (value - min) * (toMax - toMin) / delimeter
    return {
      value: newValue,
      unixTime: unixTime,
    }
  })
}

function useData() {
  const [data, setData] = useState<Array<HistoryPrice>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://birdeye-proxy.jup.ag/defi/history_price?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&type=5m&time_to=1730740102")
      .then((response) => response.json())
      .then((json: {data: {items: HistoryPrice[]}}) => {
        const data = json.data.items
        setData(scaleData(data))
        setLoading(false)
      })
  }, [])

  return {
    data,
    loading,
  }
}

const formatUnixTime = (unixTime: number) => {
  const date = new Date(unixTime * 1000);
  return `${date.getHours()}:${date.getMinutes()}`;
};

function App() {
  const { data, loading } = useData();
  if (loading) {
    return <div>loading</div>
  }
  return (
      <LineChart 
        data={data}
        height={24}
        layout='horizontal' reverseStackOrder={false}
        width={236}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stopColor="#7EBFFA" />
            <stop offset="100%" stopColor="#FA2155" />
          </linearGradient>
        </defs>
        <Tooltip labelFormatter={formatUnixTime} />
        <Line 
          stroke="url(#lineGradient)"
          yAxisId="2" type='linear' animationDuration={300}
          dataKey="value"
          from={0.99}
          to={1}
          className="gradient"
          
          strokeWidth={1}
          legendType="line"
          connectNulls={false}
          height={14}
          dot={false}

        />
      </LineChart>
  );
};

export default App;
