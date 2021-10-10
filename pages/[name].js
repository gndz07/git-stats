import Head from 'next/head'
import containerStyles from '../styles/Container.module.css'
import styles from '../styles/RepoPage.module.css'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RepoHeader from '../components/RepoHeader'

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
    const [issuesData, setIssuesData] = useState(issues);

    useEffect(() => {
        setDisplayedData(repoData);
    }, [repoData]);
 
    const filteredIssues = useMemo(() => {
        if (issues) {
           const filtered = issues.filter((issue) => {
                return issue.state === 'open'
            })
            return filtered.reverse();
        }
    }, [issues]);

    useEffect(() => {
        if (filteredIssues) {
            const data = filteredIssues.map((issue, index) => ({ date: issue.created_at.split("T").slice(0,1), issues: index+1 }));
            setIssuesData(data);
        }
    }, [filteredIssues]);

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
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={issuesData}
                            margin={{
                            top: 20,
                            right: 30,
                            left: -10,
                            bottom: 5,
                            }}
                        >
                            <XAxis dataKey="date" tick={false} tickLine={false} />
                            <YAxis tick={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="issues" stroke="#C2DEFB" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </main>

        </div>
    )
}