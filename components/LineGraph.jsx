import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineGraph({ data, startYear, thisYear }) {
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <LineChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: -10,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="year" tick={false} tickLine={false} domain={[startYear, thisYear]} />
                <YAxis tick={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="issues" stroke="#C2DEFB" dot={false} />
                <Line type="monotone" dataKey="forks" stroke="#FFCCB6" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}