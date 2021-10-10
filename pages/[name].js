import Head from "next/head";
import containerStyles from "../styles/Container.module.css";
import styles from "../styles/RepoPage.module.css";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import RepoHeader from "../components/RepoHeader";
import { range, mergeData, formatDataByYear } from "../libs";
import LineGraph from "../components/LineGraph";

export async function getStaticPaths() {
    return {
    paths: [],
    fallback: true,
    };
}

export async function getStaticProps({ params }) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `token ${process.env.API_TOKEN}`);

    const res = await fetch(
        `https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}`,
        { headers: myHeaders }
    );
    const repoData = await res.json();

    /*
        const collaboratorsRes = await fetch(`https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}/collaborators`,
        {
            headers: myHeaders
        })
        const collaborators = await collaboratorsRes.json()
        */

    const issuesRes = await fetch(
        `https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}/issues?per_page=100`,
        { headers: myHeaders }
    );
    const issues = await issuesRes.json();

    const forksRes = await fetch(
        `https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}/forks?per_page=100`,
        { headers: myHeaders }
    );
    const forks = await forksRes.json();

    if (!repoData) {
        return {
        notFound: true,
        };
    }

    return {
        props: {
            repoData,
            issues,
            forks,
        },
    };
    }

    export default function RepoStatPage({ repoData, issues, forks }) {
    const [displayedData, setDisplayedData] = useState(repoData);
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

    useEffect(() => {
        if (repoData) {
            setDisplayedData(repoData);
        }
    }, [repoData]);

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
        <div className={containerStyles.container}>
        <Head>
            <title>{displayedData?.full_name}</title>
            <meta
            name="Github Indicators Explorer"
            content={`${displayedData?.full_name} indicator`}
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <Link href="/">
            <p className={styles.choose_repo}>Choose another repository</p>
            </Link>

            <RepoHeader data={displayedData} />

            <div className={styles.option_container}>
            <p
                className={styles.data_option}
                style={{ backgroundColor: "#C2DEFB" }}
            >
                Open issues
            </p>
            <p
                className={styles.data_option}
                style={{ backgroundColor: "#FFCCB6" }}
            >
                Forks
            </p>
            </div>

            <div className={styles.graph_container}>
            <LineGraph
                data={baseData}
                startYear={startYear}
                thisYear={thisYear}
            />
            </div>
        </main>
        </div>
    );
}
