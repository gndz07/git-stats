import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { range, mergeData, formatDataByYear } from "../libs";
import { useEffect, useMemo } from "react";

export default function LineGraph({ repoData, issues, forks, activeGraph }) {
    const startYear = useMemo(() => {
        if (repoData) {
        return repoData?.created_at.split("-").slice(0, 1);
        }
    }, [repoData]);

    const todayDate = new Date();
    const thisYear = Number(todayDate.getFullYear());
    //set a base array of objects to keep the data
    let baseData = useMemo(() => {
        const years = range(Number(startYear), thisYear, 1);
        return years.map((year) => ({ year, issues: 0, forks: 0 }));
    }, [startYear]);

    const issuesData = useMemo(() => {
        if (issues) {
        const filteredIssues = issues
            .filter((issue) => {
            return issue.state === "open";
            })
            .reverse();

        return formatDataByYear(filteredIssues);
        }
    }, [issues]);

    const forksData = useMemo(() => {
        if (forks) {
        return formatDataByYear(forks.reverse());
        }
    }, [forks]);

    useEffect(() => {
        if (repoData) {
        mergeData(baseData, "issues", issuesData);
        }
    }, [issuesData]);

    useEffect(() => {
        if (repoData) {
        mergeData(baseData, "forks", forksData);
        }
    }, [forksData]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={baseData}
                margin={{
                top: 20,
                right: 30,
                left: -10,
                bottom: 5,
                }}
            >
                <XAxis
                    dataKey="year"
                    tick={false}
                    tickLine={false}
                    domain={[startYear, thisYear]}
                />
                <YAxis tick={false} tickLine={false} />
                <Tooltip />
                {activeGraph == "issues" ? (
                    <Line type="monotone" dataKey="issues" stroke="#C2DEFB" strokeWidth={2.5} dot={false} />
                ) : activeGraph == "forks" ? (
                    <Line type="monotone" dataKey="forks" stroke="#FFCCB6" strokeWidth={2.5} dot={false} />
                ) : (
                    <>
                        <Line type="monotone" dataKey="issues" stroke="#C2DEFB" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="forks" stroke="#FFCCB6" strokeWidth={2.5} dot={false} />
                    </>
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}
