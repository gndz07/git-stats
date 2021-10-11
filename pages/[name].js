import Head from "next/head";
import containerStyles from "../styles/Container.module.css";
import styles from "../styles/RepoPage.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import RepoHeader from "../components/RepoHeader";
import LineGraph from "../components/LineGraph";
import { OptionButton } from "../components/OptionButton";

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
    const [activeGraph, setActiveGraph] = useState("all");

    useEffect(() => {
        if (repoData) {
            setDisplayedData(repoData);
        }
    }, [repoData]);

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
                <OptionButton 
                    title="Show all"
                    optionName="all"
                    bgColor="#eaeaea"
                    state={activeGraph}
                    setState={setActiveGraph}
                />
                <OptionButton 
                    title="Open issues"
                    optionName="issues"
                    bgColor="#C2DEFB"
                    state={activeGraph}
                    setState={setActiveGraph}
                />
                <OptionButton 
                    title="Forks"
                    optionName="forks"
                    bgColor="#FFCCB6"
                    state={activeGraph}
                    setState={setActiveGraph}
                />
            </div>

            <div className={styles.graph_container}>
                <LineGraph
                    repoData={repoData}
                    issues={issues}
                    forks={forks}
                    activeGraph={activeGraph}
                />
            </div>
        </main>
        </div>
    );
}
