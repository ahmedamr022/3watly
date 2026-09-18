import type { RoleDefinition, SkillDefinition } from '../types/skills';

export const SKILLS: Record<string, SkillDefinition> = {
  sql: {
    id: 'sql',
    name: 'SQL',
    aliases: ['SQL', 'T-SQL', 'PL/SQL'],
    tier: 'foundation',
    hours: 8,
    courses: 3,
    growth: 4,
    why: 'Every data role in the Egyptian market screens for SQL first — it is the shared language of every pipeline, dashboard and report.',
    actions: [
    'Practice joins, window functions and CTEs on a real dataset',
    'Rewrite one messy query into a readable, indexed version',
    'Publish a query notebook to your portfolio'],

    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: "SQL Full Database Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "SQL for Data Science", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/sql-for-data-science" },
      { title: "SQL & Window Functions Interactive Reference", provider: "Mode Analytics", kind: "docs", hours: 3, free: true, url: "https://mode.com/sql-tutorial/sql-window-functions" },
      { title: "SQL Data Cleaning & Analysis Portfolio Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Data%20Cleaning%20Portfolio%20Project%20Queries.sql" }
    ]
  },
  python: {
    id: 'python',
    name: 'Python',
    aliases: ['Python', 'Pandas', 'NumPy'],
    tier: 'foundation',
    hours: 10,
    courses: 4,
    growth: 11,
    why: 'Python is how analysts move from one-off reports to repeatable automation, and it is the default language of every data platform team.',
    actions: [
      'Automate one recurring Excel report end to end',
      'Clean a public dataset with pandas and document the steps',
      'Ship the script with tests and a README'
    ],
    prerequisites: [],
    salaryUplift: 4,
    resources: [
      { title: "Python for Beginners — Full 14-Hour Course", provider: "freeCodeCamp", kind: "video", hours: 14, free: true, url: "https://www.youtube.com/watch?v=8DvywoWv6fI" },
      { title: "Python for Everybody Specialization", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/specializations/python" },
      { title: "Python 3 Official Tutorial & Documentation", provider: "Python Docs", kind: "docs", hours: 4, free: true, url: "https://docs.python.org/3/tutorial/" },
      { title: "Data Cleaning & Web Scraping Portfolio Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Amazon%20Web%20Scraper%20Project.ipynb" }
    ]
  },
  git: {
    id: 'git',
    name: 'Git',
    aliases: ['Git', 'GitHub', 'GitLab', 'version control'],
    tier: 'foundation',
    hours: 4,
    courses: 2,
    growth: 3,
    why: 'Teams will not merge your work without it. Git is the entry ticket to collaborating on any production data codebase.',
    actions: [
      'Move one existing project into a clean repository',
      'Practice branching, rebasing and pull requests',
      'Add a README and commit history worth reading'
    ],
    prerequisites: [],
    salaryUplift: 1,
    resources: [
      { title: "Git & GitHub Crash Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 3, free: true, url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      { title: "Version Control with Git", provider: "Coursera", kind: "course", hours: 8, free: false, url: "https://www.coursera.org/learn/version-control-with-git" },
      { title: "Pro Git Official Guide & Reference", provider: "Git-SCM", kind: "docs", hours: 4, free: true, url: "https://git-scm.com/book/en/v2" },
      { title: "Learn Git Branching (Interactive Visual Sandbox)", provider: "LearnGitBranching", kind: "project", hours: 3, free: true, url: "https://learngitbranching.js.org/" }
    ]
  },
  etl: {
    id: 'etl',
    name: 'ETL Pipelines',
    aliases: ['ETL', 'ELT', 'data pipeline', 'data pipelines', 'data ingestion'],
    tier: 'core',
    hours: 14,
    courses: 4,
    growth: 9,
    why: 'Egyptian employers hire data engineers to move and reshape data reliably. Pipeline design is the single most requested competency in the market.',
    actions: [
      'Design an extract → transform → load flow for one real source',
      'Add validation, retries and logging to the flow',
      'Document the pipeline contract and failure handling'
    ],
    prerequisites: ['sql', 'python'],
    salaryUplift: 6,
    resources: [
      { title: "Building an End-to-End Data Pipeline from Scratch", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=qWru-b6m030" },
      { title: "Data Engineering Foundations Specialization", provider: "Coursera", kind: "course", hours: 20, free: false, url: "https://www.coursera.org/specializations/data-engineering-foundations" },
      { title: "Data Engineering Zoomcamp (Full Free Curriculum)", provider: "DataTalks.Club", kind: "docs", hours: 8, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp" },
      { title: "End-to-End Data Engineering Tutorial Series & Code", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/darshilparmar/Data-Engineer-Tutorial-Series" }
    ]
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    aliases: ['Docker', 'containers', 'containerization'],
    tier: 'core',
    hours: 12.5,
    courses: 4,
    growth: 18,
    why: 'Docker is the containerization standard used across data engineering pipelines and cloud deployments — and it appears in half of Cairo tech postings.',
    actions: [
      'Learn images, layers, volumes and networking basics',
      'Containerize one of your existing Python projects',
      'Add the containerized project to your portfolio'
    ],
    prerequisites: ['python'],
    salaryUplift: 5,
    resources: [
      { title: "Docker Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
      { title: "Introduction to Containers with Docker & Kubernetes", provider: "Coursera", kind: "course", hours: 12, free: false, url: "https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift" },
      { title: "Docker Getting Started Guide", provider: "Docker Docs", kind: "docs", hours: 3, free: true, url: "https://docs.docker.com/get-started/" },
      { title: "Docker Compose Containerized Data Pipeline", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform" }
    ]
  },
  airflow: {
    id: 'airflow',
    name: 'Apache Airflow',
    aliases: ['Airflow', 'DAG', 'orchestration'],
    tier: 'core',
    hours: 16.75,
    courses: 5,
    growth: 24,
    why: 'Airflow is the leading workflow orchestration tool for data pipelines and adoption across MENA is growing faster than any other scheduler.',
    actions: [
      'Learn DAGs, operators, sensors and scheduling',
      'Orchestrate a two-step pipeline you already built',
      'Add alerting and a backfill run to the DAG'
    ],
    prerequisites: ['python', 'etl'],
    salaryUplift: 6,
    resources: [
      { title: "Apache Airflow Complete Course for Beginners", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE" },
      { title: "ETL and Data Pipelines with Shell, Airflow & Kafka", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka" },
      { title: "Airflow Core Concepts & TaskFlow API Docs", provider: "Apache Airflow Docs", kind: "docs", hours: 4, free: true, url: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html" },
      { title: "End-to-End Real-Time Data Pipeline with Airflow", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/airscholar/e2e-data-engineering" }
    ]

  },
  'data-modeling': {
    id: 'data-modeling',
    name: 'Data Modeling',
    aliases: ['Data Modeling', 'Data Modelling', 'dimensional modeling', 'star schema'],
    tier: 'core',
    hours: 9,
    courses: 3,
    growth: 7,
    why: 'Modeling is what separates a report writer from an engineer — it is asked about in almost every technical interview loop.',
    actions: [
    'Model one business process as a star schema',
    'Define grain, facts, dimensions and slowly changing rules',
    'Review the model against three real questions it must answer'],

    prerequisites: ['sql'],
    salaryUplift: 4,
    resources: [
      { title: 'Dimensional modeling explained', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=aEGan35iBbE' },
      { title: 'Data Warehouse Design', provider: 'Coursera', kind: 'course', hours: 12, free: true, url: 'https://www.youtube.com/watch?v=GTvRjJlJ_b4' },
      { title: 'Model a retail sales mart', provider: 'Hands-on Project', kind: 'project', hours: 6, free: true, url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/' }
    ]
  },
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    aliases: ['PostgreSQL', 'Postgres'],
    tier: 'core',
    hours: 8.25,
    courses: 3,
    growth: 8,
    why: 'Postgres is the default operational database for Egyptian startups, so hands-on administration shows you can work close to production.',
    actions: [
      'Set up a local instance and load a real dataset',
      'Practice indexing, explain plans and query tuning',
      'Automate a backup and restore cycle'
    ],
    prerequisites: ['sql'],
    salaryUplift: 3,
    resources: [
      { title: "PostgreSQL Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=qw--VYLpxG4" },
      { title: "PostgreSQL for Everybody Specialization", provider: "Coursera", kind: "course", hours: 16, free: false, url: "https://www.coursera.org/specializations/postgresql-for-everybody" },
      { title: "Official PostgreSQL Manual & Reference", provider: "PostgreSQL Docs", kind: "docs", hours: 4, free: true, url: "https://www.postgresql.org/docs/" },
      { title: "Northwind Database SQL Analytics & Schema", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/pthom/northwind_psql" }
    ]
  },
  spark: {
    id: 'spark',
    name: 'Apache Spark',
    aliases: ['Spark', 'PySpark'],
    tier: 'advanced',
    hours: 10.65,
    courses: 4,
    growth: 12,
    why: 'Spark shows up once companies outgrow single-machine processing — valuable, but usually after the core pipeline stack is in place.',
    actions: [
      'Learn RDDs, DataFrames and the execution model',
      'Reprocess a large dataset with PySpark',
      'Benchmark it against your pandas version'
    ],
    prerequisites: ['python', 'etl'],
    salaryUplift: 5,
    resources: [
      { title: "PySpark Tutorial — Full Course Zero to Pro", provider: "YouTube", kind: "video", hours: 6, free: true, url: "https://www.youtube.com/watch?v=y8L6m2e987c" },
      { title: "Big Data Specialization with Apache Spark", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/specializations/big-data" },
      { title: "PySpark SQL Programming Guide", provider: "Apache Spark Docs", kind: "docs", hours: 4, free: true, url: "https://spark.apache.org/docs/latest/sql-programming-guide.html" },
      { title: "Spark Batch Processing on Real-world Taxi Dataset", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/05-batch" }
    ]
  },
  kafka: {
    id: 'kafka',
    name: 'Apache Kafka',
    aliases: ['Kafka', 'event streaming'],
    tier: 'advanced',
    hours: 14.3,
    courses: 6,
    growth: 9,
    why: 'Kafka is powerful for real-time streaming but is mostly required in senior or specialised backend roles, so it pays off later.',
    actions: [
      'Understand topics, partitions, producers and consumers',
      'Stream one live feed into a storage layer',
      'Add consumer-group monitoring to the setup'
    ],
    prerequisites: ['python', 'docker'],
    salaryUplift: 7,
    resources: [
      { title: "Apache Kafka Crash Course (KRaft Mode & Docker)", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=R873BlNVUB4" },
      { title: "Confluent Kafka Developer Learning Path", provider: "Confluent Developer", kind: "course", hours: 12, free: true, url: "https://developer.confluent.io/courses/" },
      { title: "Apache Kafka Official Documentation", provider: "Apache Kafka Docs", kind: "docs", hours: 5, free: true, url: "https://kafka.apache.org/documentation/" },
      { title: "Real-Time Streaming Pipeline with Kafka & Docker", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/airscholar/e2e-data-engineering" }
    ]
  },
  dbt: {
    id: 'dbt',
    name: 'dbt',
    aliases: ['dbt', 'analytics engineering'],
    tier: 'advanced',
    hours: 6,
    courses: 2,
    growth: 31,
    why: 'dbt is the fastest-growing tool in analytics engineering job posts and turns your SQL into tested, versioned transformations.',
    actions: [
      'Convert three ad-hoc queries into dbt models',
      'Add tests, docs and a lineage graph',
      'Run the project on a schedule'
    ],
    prerequisites: ['sql', 'data-modeling'],
    salaryUplift: 4,
    resources: [
      { title: "dbt (Data Build Tool) Complete Tutorial with CI/CD", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=4eGJ4b0L724" },
      { title: "dbt Fundamentals (Official Free Certification)", provider: "dbt Labs", kind: "course", hours: 5, free: true, url: "https://courses.getdbt.com/courses/fundamentals" },
      { title: "dbt Official Developer Documentation", provider: "dbt Docs", kind: "docs", hours: 3, free: true, url: "https://docs.getdbt.com/" },
      { title: "Production dbt Transformations with Jaffle Shop", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/dbt-labs/jaffle_shop" }
    ]
  },
  snowflake: {
    id: 'snowflake',
    name: 'Snowflake',
    aliases: ['Snowflake'],
    tier: 'advanced',
    hours: 7.5,
    courses: 3,
    growth: 21,
    why: 'Cloud warehouses are replacing on-prem stacks in the region, and Snowflake is the one most Egyptian scale-ups migrate to.',
    actions: [
      'Load a dataset and model it in a warehouse schema',
      'Practice warehouse sizing, roles and cost controls',
      'Connect a BI tool to your warehouse'
    ],
    prerequisites: ['sql', 'data-modeling'],
    salaryUplift: 5,
    resources: [
      { title: "Snowflake Cloud Data Warehouse Full Course", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=vY3u3WvLg_k" },
      { title: "Snowflake Hands-on Essentials & Badges", provider: "Snowflake Learn", kind: "course", hours: 10, free: true, url: "https://learn.snowflake.com/" },
      { title: "Snowflake Official Documentation", provider: "Snowflake Docs", kind: "docs", hours: 4, free: true, url: "https://docs.snowflake.com/" },
      { title: "Data Engineering Pipelines with Snowflake Quickstart", provider: "Snowflake Quickstarts", kind: "project", hours: 5, free: true, url: "https://quickstarts.snowflake.com/" }
    ]
  },
  powerbi: {
    id: 'powerbi',
    name: 'Power BI',
    aliases: ['Power BI', 'PowerBI'],
    tier: 'core',
    hours: 9,
    courses: 3,
    growth: 6,
    why: 'Power BI is the reporting layer most Egyptian enterprises standardise on, so it is the fastest route to visible business impact.',
    actions: [
      'Rebuild one manual report as a refreshable dashboard',
      'Model the data behind it properly before visualising',
      'Share it with a stakeholder and iterate once'
    ],
    prerequisites: ['sql'],
    salaryUplift: 3,
    resources: [
      { title: "Power BI Full Course — Beginner to Advanced", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=TmhQCQr_8CA" },
      { title: "Microsoft Power BI Data Analyst Professional Certificate", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst" },
      { title: "Microsoft Power BI Official Learning Path", provider: "Microsoft Learn", kind: "docs", hours: 6, free: true, url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
      { title: "End-to-End Power BI Portfolio Dashboard Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Power%20BI%20Project.pbix" }
    ]
  },
  dax: {
    id: 'dax',
    name: 'DAX',
    aliases: ['DAX'],
    tier: 'core',
    hours: 6.5,
    courses: 2,
    growth: 5,
    why: 'DAX is where Power BI reports either scale or fall apart, and interviewers use it to test real modelling understanding.',
    actions: [
      'Master filter context, CALCULATE and time intelligence',
      'Rewrite three measures to be filter-safe',
      'Document the measure logic for reviewers'
    ],
    prerequisites: ['powerbi'],
    salaryUplift: 2,
    resources: [
      { title: "DAX Filter Context Masterclass (SQLBI)", provider: "YouTube", kind: "video", hours: 3, free: true, url: "https://www.youtube.com/watch?v=482vW4-X72o" },
      { title: "Introducing DAX Video Course", provider: "SQLBI", kind: "course", hours: 6, free: true, url: "https://www.sqlbi.com/p/introducing-dax-video-course/" },
      { title: "DAX Functions Reference Guide", provider: "DAX Guide", kind: "docs", hours: 3, free: true, url: "https://dax.guide/" },
      { title: "DAX Calculation Patterns & Financial Models", provider: "DAX Patterns", kind: "project", hours: 5, free: true, url: "https://www.daxpatterns.com/" }
    ]
  },
  excel: {
    id: 'excel',
    name: 'Advanced Excel',
    aliases: ['Excel', 'Power Query', 'Google Sheets'],
    tier: 'foundation',
    hours: 5,
    courses: 2,
    growth: 2,
    why: 'Excel is still the language business stakeholders speak, and Power Query skills carry directly into modern BI tooling.',
    actions: [
      'Rebuild a manual workbook with Power Query',
      'Replace nested formulas with structured references',
      'Turn the workbook into a reusable template'
    ],
    prerequisites: [],
    salaryUplift: 1,
    resources: [
      { title: "Excel for Data Analysts — Full 5-Hour Course", provider: "freeCodeCamp", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=PSNXoAs2FtQ" },
      { title: "Excel Skills for Business Specialization", provider: "Coursera", kind: "course", hours: 18, free: false, url: "https://www.coursera.org/specializations/excel" },
      { title: "Excel Functions & Formulas Reference", provider: "ExcelJet", kind: "docs", hours: 2, free: true, url: "https://exceljet.net/formulas" },
      { title: "Excel Sales & Customer Dashboard Project Dataset", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Excel%20Project%20Dataset.xlsx" }
    ]
  },
  tableau: {
    id: 'tableau',
    name: 'Tableau',
    aliases: ['Tableau'],
    tier: 'core',
    hours: 7,
    courses: 3,
    growth: 4,
    why: 'Multinationals operating in Egypt often standardise on Tableau, so it widens the set of employers you can apply to.',
    actions: [
      'Recreate one Power BI dashboard in Tableau',
      'Learn LOD expressions and dashboard actions',
      'Publish the workbook to Tableau Public'
    ],
    prerequisites: ['data-viz'],
    salaryUplift: 2,
    resources: [
      { title: "Tableau Desktop Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=f_sm7j3d5pY" },
      { title: "Data Visualization with Tableau Specialization", provider: "Coursera", kind: "course", hours: 16, free: false, url: "https://www.coursera.org/specializations/data-visualization" },
      { title: "Tableau Official Video Training & Guides", provider: "Tableau", kind: "docs", hours: 6, free: true, url: "https://www.tableau.com/learn/training" },
      { title: "Tableau Public Interactive Portfolio Gallery", provider: "Tableau Public", kind: "project", hours: 5, free: true, url: "https://public.tableau.com/app/discover" }
    ]
  },
  statistics: {
    id: 'statistics',
    name: 'Statistical Analysis',
    aliases: ['Statistical Analysis', 'Statistics', 'A/B Testing', 'hypothesis testing'],
    tier: 'core',
    hours: 8,
    courses: 3,
    growth: 6,
    why: 'Statistics is what makes your insights defensible in a stakeholder review instead of just descriptive.',
    actions: [
      'Run a hypothesis test on a real business question',
      'Learn confidence intervals and effect size reporting',
      'Write up one experiment readout'
    ],
    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: "Statistics — Full University Course on Data Science", provider: "freeCodeCamp", kind: "video", hours: 8, free: true, url: "https://www.youtube.com/watch?v=Xn7KWR9EO40" },
      { title: "Basic Statistics (University of Amsterdam)", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/basic-statistics" },
      { title: "Applied Statistics STAT 500 Online Handbook", provider: "Penn State Online", kind: "docs", hours: 8, free: true, url: "https://online.stat.psu.edu/stat500/" },
      { title: "Exploratory Data Analysis & Correlation Project in Python", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Movie%20Industry%20Correlation%20Project.ipynb" }
    ]
  },
  'data-viz': {
    id: 'data-viz',
    name: 'Data Visualization',
    aliases: ['Data Visualization', 'Data Visualisation', 'dashboards', 'dashboard'],
    tier: 'foundation',
    hours: 6,
    courses: 2,
    growth: 5,
    why: 'Clear visual communication is the skill hiring managers judge in every portfolio review, whatever the tool.',
    actions: [
      'Redesign one cluttered chart around a single message',
      'Build a dashboard with a clear visual hierarchy',
      'Get feedback from a non-technical reader'
    ],
    prerequisites: [],
    salaryUplift: 2,
    resources: [
      { title: 'Storytelling with data', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=8EMW7io4rSI' },
      { title: 'Data Visualization Principles', provider: 'Coursera', kind: 'course', hours: 8, free: true, url: 'https://datavizcatalogue.com/' },
      { title: 'Redesign a public dashboard', provider: 'Hands-on Project', kind: 'project', hours: 5, free: true, url: 'https://www.storytellingwithdata.com/' }
    ]
  }
};

export const ROLES: RoleDefinition[] = [
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    nameAr: 'مهندس بيانات',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Build and run the pipelines that every analytics team depends on.',
    blurbAr: 'بناء وتشغيل خطوط معالجة وتدفق البيانات التي تعتمد عليها كافة فرق التحليل والذكاء الاصطناعي.',
    openJobs: 1247,
    salaryEgpK: 28,
    yoyGrowth: 24,
    timeToHireDays: 32,
    coreSkills: [
      { skillId: 'sql', demand: 78 },
      { skillId: 'python', demand: 71 },
      { skillId: 'etl', demand: 63 },
      { skillId: 'docker', demand: 52 },
      { skillId: 'git', demand: 44 },
      { skillId: 'airflow', demand: 41 },
      { skillId: 'data-modeling', demand: 38 },
      { skillId: 'postgresql', demand: 34 },
      { skillId: 'spark', demand: 27 },
      { skillId: 'kafka', demand: 22 }
    ]
  },
  {
    id: 'analytics-engineer',
    name: 'Analytics Engineer',
    nameAr: 'مهندس تحليلات بيانات',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Turn raw warehouse tables into trusted, tested data products.',
    blurbAr: 'تحويل جداول المستودعات الخام إلى منتجات بيانات موثوقة ومختبرة وجاهزة لصناع القرار.',
    openJobs: 486,
    salaryEgpK: 26,
    yoyGrowth: 31,
    timeToHireDays: 28,
    coreSkills: [
      { skillId: 'sql', demand: 82 },
      { skillId: 'python', demand: 55 },
      { skillId: 'data-modeling', demand: 51 },
      { skillId: 'dbt', demand: 47 },
      { skillId: 'git', demand: 46 },
      { skillId: 'powerbi', demand: 38 },
      { skillId: 'statistics', demand: 35 },
      { skillId: 'snowflake', demand: 33 },
      { skillId: 'excel', demand: 30 },
      { skillId: 'airflow', demand: 24 }
    ]
  },
  {
    id: 'bi-developer',
    name: 'BI Developer',
    nameAr: 'مطور ذكاء الأعمال (BI Developer)',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Own the reporting layer the whole business makes decisions on.',
    blurbAr: 'تطوير لوحات التحكم والتقارير التفاعلية التي تتخذ الشركات قراراتها الاستراتيجية بناءً عليها.',
    openJobs: 934,
    salaryEgpK: 22,
    yoyGrowth: 12,
    timeToHireDays: 24,
    coreSkills: [
      { skillId: 'sql', demand: 79 },
      { skillId: 'powerbi', demand: 74 },
      { skillId: 'excel', demand: 58 },
      { skillId: 'dax', demand: 52 },
      { skillId: 'data-modeling', demand: 44 },
      { skillId: 'tableau', demand: 41 },
      { skillId: 'etl', demand: 36 },
      { skillId: 'statistics', demand: 33 },
      { skillId: 'python', demand: 31 },
      { skillId: 'git', demand: 29 }
    ]
  },
  {
    id: 'senior-data-analyst',
    name: 'Senior Data Analyst',
    nameAr: 'محلل بيانات أول (Senior Data Analyst)',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Lead the analysis that shapes product and commercial decisions.',
    blurbAr: 'قيادة التحليلات الإحصائية والتجارية المتقدمة لتوجيه مسار المنتجات والنمو المالي.',
    openJobs: 1610,
    salaryEgpK: 20,
    yoyGrowth: 9,
    timeToHireDays: 21,
    coreSkills: [
      { skillId: 'sql', demand: 81 },
      { skillId: 'excel', demand: 69 },
      { skillId: 'powerbi', demand: 57 },
      { skillId: 'python', demand: 54 },
      { skillId: 'data-viz', demand: 52 },
      { skillId: 'statistics', demand: 48 },
      { skillId: 'tableau', demand: 39 },
      { skillId: 'dax', demand: 34 },
      { skillId: 'etl', demand: 29 },
      { skillId: 'git', demand: 28 }
    ]
  }
];


export const DEFAULT_ROLE_ID = 'data-engineer';

export const WEEKLY_HOUR_OPTIONS = [2, 4, 6, 10, 15];