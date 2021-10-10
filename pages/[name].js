import Head from 'next/head'
import containerStyles from '../styles/Container.module.css'
import styles from '../styles/RepoPage.module.css'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import RepoHeader from '../components/RepoHeader'
import { range } from '../libs/range'
import LineGraph from '../components/LineGraph'

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true
    };
}


export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}`)
    const repoData = await res.json()

    
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `token ${process.env.API_TOKEN}`);

    /*
    const collaboratorsRes = await fetch(`https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}/collaborators`,
    {
        headers: myHeaders
    })
    const collaborators = await collaboratorsRes.json()
    */

    const issuesRes = await fetch(`https://api.github.com/repos/${process.env.REPO_USERNAME}/${params.name}/issues`,
    {
        headers: myHeaders
    })
    const issues = await issuesRes.json()
  
    if (!repoData) {
      return {
        notFound: true,
      }
    }
  
    return {
      props: {
        repoData,
        issues
      },
    }
}

export default function RepoStatPage ({ repoData, issues}) {
    const [displayedData, setDisplayedData] = useState(repoData);
    const [graphData, setGraphData] = useState([]);
    const startYear = useMemo(() => {
        if (repoData) {
            return repoData?.created_at.split("-").slice(0,1)
        }
    }, [repoData])

    const todayDate = new Date();
    const thisYear = Number(todayDate.getFullYear());
    //set a base array of objects to keep the data
    let baseData = useMemo(() => {
        const years = range(Number(startYear), thisYear, 1);
        return years.map((year) => ({ year, issues: 0 }))
    }, [startYear]);

    useEffect(() => {
        if (repoData) {
            setDisplayedData(repoData);
        }
    }, [repoData]);
 
    const filteredIssues = useMemo(() => {
        if (issues) {
           const filtered = issues.filter((issue) => {
                return issue.state === 'open'
            })
            return filtered.reverse();
        }
    }, [issues]);

    const issuesData = useMemo(() => {
        if (filteredIssues) {
            //get only the year of each issues
            const issuesPerYear = filteredIssues.map((issue) => ({ year: issue.created_at.split("-").slice(0,1)[0] }));
            //group and count issues by year
            const issuesCounts = issuesPerYear.reduce((p, c) => {
                const year = c.year;
                if (!p.hasOwnProperty(year)) {
                    p[year] = 0;
                }
                p[year]++;
                return p;
              }, {});
            const issuesCountsExtended = Object.keys(issuesCounts).map(year => {
                return {year, count: issuesCounts[year]};
            });
            //merge into baseData
            baseData.forEach((data) => {
                issuesCountsExtended.forEach((issue) => {
                    if (data.year == issue.year) {
                        data.issues = issue.count
                    }
                })
            })
            return baseData
        }
    }, [filteredIssues]);

    useEffect(() => {
        if (issuesData) {
            setGraphData(issuesData)
        }
    }, [issuesData])

    return (
        <div className={containerStyles.container}>
            <Head>
                <title>{displayedData?.full_name}</title>
                <meta name="Github Indicators Explorer" content={`${displayedData?.full_name} indicator`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Link href='/'>
                    <p className={styles.choose_repo}>Choose another repository</p>
                </Link>

                <RepoHeader data={displayedData} />

                <div className={styles.option_container}>
                    <p className={styles.data_option} style={{ backgroundColor: "#C2DEFB" }}>Open issues</p>
                    <p className={styles.data_option} style={{ backgroundColor: "#FFCCB6" }}>Collaborators</p>
                </div>

                <div className={styles.graph_container}>
                    <LineGraph data={graphData} startYear={startYear} thisYear={thisYear} />
                </div>
            </main>

        </div>
    )
}