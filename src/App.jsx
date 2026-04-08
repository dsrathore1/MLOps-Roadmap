import { useState, useEffect, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  dark:  { bg:"#070709", bg2:"#0d0d10", card:"#111114", cardH:"#17171b", border:"#1f1f26", borderH:"#2e2e3a", text:"#e8e8f0", mid:"#aaaabc", dim:"#66667a", faint:"#33333f", accent:"#C8FF57", accentD:"#C8FF5718", shadow:"0 8px 32px rgba(0,0,0,.7)", pill:"#16161a", pillB:"#24242c", ok:"#34d399", warn:"#fbbf24", danger:"#f87171" },
  light: { bg:"#f4f3ee", bg2:"#eceae0", card:"#ffffff", cardH:"#f9f8f2", border:"#ddd9cc", borderH:"#bbb6a8", text:"#18181e", mid:"#3d3d4a", dim:"#77778a", faint:"#bbbbcc", accent:"#1a6b38", accentD:"#1a6b3818", shadow:"0 8px 32px rgba(0,0,0,.08)", pill:"#f0ede4", pillB:"#ddd8cc", ok:"#16a34a", warn:"#d97706", danger:"#dc2626" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MONTHS = [
  { id:"m1", label:"Month 1", title:"ML Engineering Core", color:"#C8FF57",
    goal:"Graduate from ML practitioner → ML Engineer who ships production-grade systems.",
    weeks:[
      { id:"w1", week:1, title:"Advanced Python + ML Pipeline", theme:"Make your Python production-ready. No more notebook code.",
        tasks:[
          {id:"w1t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (Arrays/HashMap). Write time-complexity notes after each."},
          {id:"w1t2", slot:"10–12:30", label:"Python", txt:"Advanced Pandas (groupby/merge/pivot), NumPy vectorization, type hints, dataclasses, context managers."},
          {id:"w1t3", slot:"1:30–3:30", label:"Sklearn", txt:"Pipeline + ColumnTransformer + custom transformers. Write reusable fit/transform classes."},
          {id:"w1t4", slot:"3:30–5", label:"Build", txt:"Build end-to-end ML pipeline class: ingest→preprocess→train→evaluate. Push to GitHub."},
          {id:"w1t5", slot:"5–6", label:"Review", txt:"GitHub push. Write 5-line commit message explaining what and why."},
        ], milestone:"Reusable ML pipeline on GitHub. 10 DSA problems solved.", resources:["Sklearn Pipeline docs","LeetCode Blind 75","madewithml.com"]},
      { id:"w2", week:2, title:"Experiment Tracking + Model Registry", theme:"A model you can't reproduce is a model you can't trust.",
        tasks:[
          {id:"w2t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (Sliding Window/Two Pointers). Pattern-first approach."},
          {id:"w2t2", slot:"10–12:30", label:"MLflow", txt:"autolog, custom metrics, nested runs, model registry with Staging→Production promotion workflow."},
          {id:"w2t3", slot:"1:30–3:30", label:"DVC", txt:"dvc init, dvc add, S3 remote push. Wire into pipeline with dvc repro."},
          {id:"w2t4", slot:"3:30–5", label:"Integrate", txt:"MLflow + DVC in single pipeline. Every run tracked, every dataset versioned."},
          {id:"w2t5", slot:"5–6", label:"Review", txt:"Write README: how to reproduce your experiment end-to-end in 3 commands."},
        ], milestone:"Fully reproducible tracked experiment. DVC + MLflow both wired.", resources:["MLflow docs","DVC.org","chip.huyen.com/blog"]},
      { id:"w3", week:3, title:"FastAPI + Docker Production Serving", theme:"Get your model out of the notebook and onto the internet.",
        tasks:[
          {id:"w3t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (Binary Search/Recursion). Draw call-stack before coding."},
          {id:"w3t2", slot:"10–12:30", label:"FastAPI", txt:"POST /predict with Pydantic, async endpoints, background tasks, middleware, /health + /metrics."},
          {id:"w3t3", slot:"1:30–3:30", label:"Docker", txt:"Multi-stage Dockerfile, non-root user, .dockerignore, healthcheck. Build, run, test."},
          {id:"w3t4", slot:"3:30–5", label:"Testing", txt:"pytest: unit + integration tests for API. Aim for 80%+ coverage."},
          {id:"w3t5", slot:"5–6", label:"Deploy", txt:"Push image to ECR (use your AWS knowledge). Tag with git SHA."},
        ], milestone:"Containerized ML API with tests. Image live in ECR.", resources:["FastAPI docs","Docker best practices","pytest docs"]},
      { id:"w4", week:4, title:"CI/CD + Automated Pipelines", theme:"One git push deploys everything. No manual steps.",
        tasks:[
          {id:"w4t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (Trees/BFS-DFS). Visualize tree before coding."},
          {id:"w4t2", slot:"10–12:30", label:"GH Actions", txt:"CI: lint (black/flake8) → pytest → build Docker → push ECR. CD: deploy to EC2 on merge."},
          {id:"w4t3", slot:"1:30–3:30", label:"Retraining", txt:"S3 event trigger → GitHub Actions workflow → retrain pipeline. Automate the loop."},
          {id:"w4t4", slot:"3:30–5", label:"Makefile", txt:"make train / make serve / make deploy / make test. One-command everything."},
          {id:"w4t5", slot:"5–6", label:"Diagram", txt:"Architecture diagram in Excalidraw. Add to repo wiki."},
        ], milestone:"Full CI/CD: push → lint → test → build → deploy.", resources:["GitHub Actions docs","Excalidraw","AWS ECR docs"]},
    ]},
  { id:"m2", label:"Month 2", title:"Cloud-Native MLOps + Production", color:"#FF6B6B",
    goal:"Deploy, monitor and operate ML systems at scale exactly as a Senior MLOps Engineer would.",
    weeks:[
      { id:"w5", week:5, title:"Kubernetes for ML Workloads", theme:"Docker is the container. K8s is the orchestrator. Think in clusters.",
        tasks:[
          {id:"w5t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (DP — Climbing Stairs, Coin Change, House Robber)."},
          {id:"w5t2", slot:"10–12:30", label:"K8s Core", txt:"Pods, Deployments, Services, ConfigMaps, Secrets. Deploy ML API on Minikube."},
          {id:"w5t3", slot:"1:30–3:30", label:"K8s Adv", txt:"HPA (CPU/custom metrics), resource limits/requests, liveness + readiness probes, rolling updates."},
          {id:"w5t4", slot:"3:30–5", label:"Helm", txt:"Package ML app as Helm chart. Parameterize: image tag, replicas, env, resources."},
          {id:"w5t5", slot:"5–6", label:"Cloud K8s", txt:"Deploy Helm chart to EKS cluster. Validate autoscaling with load test."},
        ], milestone:"ML API on K8s + Helm chart + autoscaling working.", resources:["KodeKloud K8s","Helm docs","AWS EKS workshop"]},
      { id:"w6", week:6, title:"Monitoring, Observability + Drift Detection", theme:"A model that silently fails is worse than no model.",
        tasks:[
          {id:"w6t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (Graphs — BFS, number of islands, shortest path)."},
          {id:"w6t2", slot:"10–12:30", label:"Prometheus", txt:"Instrument FastAPI with prometheus-fastapi-instrumentator. Custom counters, histograms, gauges."},
          {id:"w6t3", slot:"1:30–3:30", label:"Grafana", txt:"Dashboard: request rate, latency p50/p95/p99, error rate, model confidence distribution."},
          {id:"w6t4", slot:"3:30–5", label:"Evidently", txt:"Data drift + prediction drift reports. Compare training vs production distributions daily."},
          {id:"w6t5", slot:"5–6", label:"Alerting", txt:"AlertManager: error rate > 1% → Slack. Model confidence drop → PagerDuty-style alert."},
        ], milestone:"Full observability: metrics + dashboards + drift + alerts.", resources:["Evidently AI docs","Prometheus docs","Grafana getting started"]},
      { id:"w7", week:7, title:"Infrastructure as Code + Cloud Architecture", theme:"Click-ops is for demos. Engineers write infrastructure.",
        tasks:[
          {id:"w7t1", slot:"9–10", label:"DSA", txt:"2 LeetCode (revisit weak areas + 1 medium from any category)."},
          {id:"w7t2", slot:"10–12:30", label:"Terraform", txt:"VPC, EC2, S3, ECR, IAM roles (least-privilege). State in S3 + DynamoDB lock. Terraform modules."},
          {id:"w7t3", slot:"1:30–3:30", label:"AWS Adv", txt:"Lambda serverless inference, SageMaker Pipelines, CloudWatch alarms + SNS, Cost Explorer."},
          {id:"w7t4", slot:"3:30–5", label:"Security", txt:"IAM policies audit, secret rotation with AWS Secrets Manager, checkov scan on Terraform."},
          {id:"w7t5", slot:"5–6", label:"IaC Test", txt:"terraform destroy then apply from scratch in < 6 mins. That's the benchmark."},
        ], milestone:"Full AWS infra provisioned via Terraform. Zero manual clicks.", resources:["HashiCorp Terraform","AWS Well-Architected ML","checkov.io"]},
      { id:"w8", week:8, title:"Capstone 1 + 2 + Job Prep", theme:"Ship. Then sell.",
        tasks:[
          {id:"w8t1", slot:"9–11", label:"Capstone", txt:"Polish Churn Platform + Fraud Detection projects. Clean code, typed Python, full README."},
          {id:"w8t2", slot:"11–1", label:"Portfolio", txt:"GitHub profile: pin 5 repos, compelling descriptions, badges (build ✓, coverage %)."},
          {id:"w8t3", slot:"2–4", label:"Resume", txt:"1-page ATS resume. Lead with projects. Quantify: 'reduced latency by 40% using batching'."},
          {id:"w8t4", slot:"4–5:30", label:"Apply", txt:"5-8 applications daily: MLOps internship, junior SRE, junior cloud engineer, ML Platform."},
          {id:"w8t5", slot:"5:30–7", label:"Interview", txt:"System design: design a recommendation system at scale. K8s deep-dive. CI/CD walkthroughs."},
        ], milestone:"2 capstones live. Resume submitted to 20+ roles.", resources:["System Design Interview (Alex Xu)","MLOps.community Discord","levels.fyi"]},
    ]},
  { id:"m3", label:"Month 3", title:"Advanced MLOps + AI Systems", color:"#A78BFA",
    goal:"Build the systems that power real AI products. Think like a Staff Engineer. Work like a founding ML engineer.",
    weeks:[
      { id:"w9", week:9, title:"LLMOps + GenAI Infrastructure", theme:"The world runs on LLMs now. Learn to operate them.",
        tasks:[
          {id:"w9t1", slot:"9–10", label:"DSA", txt:"2 LeetCode hard (practice under 25-min constraint for interviews)."},
          {id:"w9t2", slot:"10–12:30", label:"LLMOps", txt:"LangChain/LlamaIndex production patterns. Prompt versioning with PromptLayer or LangSmith."},
          {id:"w9t3", slot:"1:30–3:30", label:"RAG", txt:"Build production RAG: chunking strategies, embedding models, vector DB (Qdrant/Weaviate), reranking."},
          {id:"w9t4", slot:"3:30–5", label:"Observability", txt:"LLM tracing: LangSmith / Arize Phoenix. Track token costs, latency, hallucination rate."},
          {id:"w9t5", slot:"5–6", label:"Deploy", txt:"Deploy RAG API to Kubernetes. Add Redis caching for repeat queries. Benchmark costs."},
        ], milestone:"Production RAG system deployed with full LLM observability.", resources:["LangSmith docs","LlamaIndex production guide","Weaviate docs"]},
      { id:"w10", week:10, title:"Feature Stores + Advanced ML Pipelines", theme:"Features are the currency of ML. Own the pipeline.",
        tasks:[
          {id:"w10t1", slot:"9–10", label:"DSA", txt:"2 LeetCode hard (focus on system-design-adjacent problems: LRU Cache, Design Twitter)."},
          {id:"w10t2", slot:"10–12:30", label:"Feast", txt:"Feature store with Feast: offline (S3 Parquet) + online (Redis) stores. Point-in-time joins."},
          {id:"w10t3", slot:"1:30–3:30", label:"Airflow", txt:"Airflow DAGs for ML: data ingestion → feature computation → training → evaluation → deploy."},
          {id:"w10t4", slot:"3:30–5", label:"Streaming", txt:"Kafka + Faust for real-time feature computation. Sliding window aggregations."},
          {id:"w10t5", slot:"5–6", label:"Integration", txt:"Wire feature store into existing model serving. Measure training-serving skew."},
        ], milestone:"Feature store serving online + offline features. Airflow ML DAG running.", resources:["Feast docs","Airflow docs","Kafka quickstart"]},
      { id:"w11", week:11, title:"ML Platform Engineering + Scale", theme:"Build the platform that other engineers use to ship models.",
        tasks:[
          {id:"w11t1", slot:"9–10", label:"DSA", txt:"Mock interview: 45-min session with a peer or using Pramp."},
          {id:"w11t2", slot:"10–12:30", label:"Platform", txt:"Design + build internal ML platform: model submission API, auto-training queue, model registry UI."},
          {id:"w11t3", slot:"1:30–3:30", label:"KServe", txt:"KServe (formerly KFServing): deploy multiple model frameworks. Canary + blue-green deployments."},
          {id:"w11t4", slot:"3:30–5", label:"Cost Opt", txt:"GPU cost optimization: spot instances, mixed precision inference, model quantization (ONNX)."},
          {id:"w11t5", slot:"5–6", label:"Benchmarks", txt:"Benchmark inference: latency p99, throughput, cost-per-1k-requests. Document findings."},
        ], milestone:"Internal ML platform API + KServe canary deployment + cost report.", resources:["KServe docs","ONNX runtime","AWS Spot Instances ML guide"]},
      { id:"w12", week:12, title:"System Design Mastery + Final Capstones", theme:"Ace any ML system design interview. Ship your best work.",
        tasks:[
          {id:"w12t1", slot:"9–11", label:"System Design", txt:"Practice: design YouTube recommendations, Uber surge pricing, Spotify Discover Weekly from scratch."},
          {id:"w12t2", slot:"11–1", label:"Capstone", txt:"Complete Capstone 4 + 5. Full documentation, architecture decisions log, performance benchmarks."},
          {id:"w12t3", slot:"2–4", label:"Open Source", txt:"Contribute to MLflow, DVC, or Evidently AI. Even docs PRs count and show up on GitHub."},
          {id:"w12t4", slot:"4–6", label:"Interviews", txt:"Apply to top-tier: Flipkart, Swiggy, PhonePe, Meesho, Razorpay, Atlassian India, Walmart Labs."},
          {id:"w12t5", slot:"6–7", label:"Blog", txt:"Write 1 technical blog post about something you built. Publish on Medium or dev.to."},
        ], milestone:"All 5 capstones live. MNC applications sent. Technical blog published.", resources:["Grokking ML Interview","Designing ML Systems (Chip Huyen)","open-source GitHub search"]},
    ]},
];

const MINI_PROJECTS = [
  { id:"mp1", title:"Iris Classifier API", week:"Week 1–2", color:"#60A5FA", difficulty:"Beginner",
    tagline:"Your first production ML endpoint.", stack:["Scikit-learn","FastAPI","Docker","MLflow"],
    desc:"Train Iris classifier. Wrap in FastAPI with Pydantic. Track with MLflow. Containerize. Add /health and /predict endpoints with confidence scores.",
    architecture:"Sklearn Model → MLflow Registry → FastAPI → Docker Container → /predict endpoint",
    deliverables:["FastAPI /predict with confidence","Dockerfile + docker-compose","MLflow experiment UI","pytest unit+integration","README with curl examples"],
    resumeLine:"Built containerized REST ML inference API with experiment tracking via MLflow, serving predictions with <20ms latency.",
    github:["machine-learning","fastapi","docker","mlflow","scikit-learn"]},
  { id:"mp2", title:"DVC Versioned Data Pipeline", week:"Week 2", color:"#34D399", difficulty:"Beginner",
    tagline:"Never lose track of your data or experiments.", stack:["DVC","AWS S3","Python","Pandas"],
    desc:"Versioned pipeline with DVC: data ingestion → validation → preprocessing stages. S3 remote. Fully reproducible with dvc repro. params.yaml for hyperparameters.",
    architecture:"Raw Data → dvc add → S3 Remote → dvc repro → Processed Features → Model",
    deliverables:["dvc.yaml pipeline stages","S3 remote configured","Data validation script","params.yaml with all hyperparams","dvc dag visualization"],
    resumeLine:"Designed reproducible ML data pipeline with DVC and AWS S3, enabling one-command experiment reproduction.",
    github:["dvc","data-versioning","aws-s3","reproducibility","mlops"]},
  { id:"mp3", title:"GitHub Actions ML CI/CD", week:"Week 4", color:"#F59E0B", difficulty:"Intermediate",
    tagline:"Push code. Everything else is automatic.", stack:["GitHub Actions","Docker","AWS ECR","pytest"],
    desc:"Full CI/CD for ML: push → black/flake8 → pytest (80% coverage gate) → Docker build → ECR push → EC2 deploy via SSH. Branch protection + PR checks.",
    architecture:"git push → GH Actions CI → pytest gate → Docker build → ECR push → EC2 SSH deploy",
    deliverables:["ci.yml + cd.yml workflows","Makefile with all commands","Coverage badge in README","Branch protection rules","Deployment notification to Slack"],
    resumeLine:"Implemented end-to-end CI/CD for ML models with GitHub Actions, Docker, and AWS ECR including automated test gates.",
    github:["github-actions","ci-cd","mlops","docker","aws-ecr"]},
  { id:"mp4", title:"Kubernetes ML Deployment", week:"Week 5", color:"#A78BFA", difficulty:"Intermediate",
    tagline:"Your model, auto-scaled in a real cluster.", stack:["Kubernetes","Helm","FastAPI","Minikube","k6"],
    desc:"Deploy ML API on K8s. HPA on CPU/custom metrics. Liveness + readiness probes. Helm chart with configurable values. Load test with k6 at 1000 RPS.",
    architecture:"Helm Chart → K8s Deployment → Service → HPA (CPU>60%) → Load Balancer → External Traffic",
    deliverables:["Helm chart with values.yaml","HPA configured + tested","Readiness/liveness probes","k6 load test script + results","Architecture diagram"],
    resumeLine:"Deployed ML inference service on Kubernetes with Helm packaging and HPA, sustaining 1000 RPS under load test.",
    github:["kubernetes","helm","mlops","autoscaling","infrastructure"]},
  { id:"mp5", title:"Model Drift Monitor", week:"Week 6", color:"#FB7185", difficulty:"Intermediate",
    tagline:"Catch silent failures before your users do.", stack:["Evidently AI","Grafana","Prometheus","Python"],
    desc:"Standalone drift monitoring service. Production predictions vs training reference → Evidently reports → Prometheus metrics → Grafana dashboard → Slack alert on drift.",
    architecture:"Production Data → Evidently → drift metrics → Prometheus → Grafana Dashboard + AlertManager → Slack",
    deliverables:["Evidently HTML drift reports","Custom Prometheus exporter","Grafana dashboard JSON (importable)","Slack alert on PSI > 0.2","Automated daily cron report"],
    resumeLine:"Built ML monitoring service detecting data + prediction drift using Evidently AI with automated Grafana dashboards.",
    github:["mlops","monitoring","evidently-ai","grafana","prometheus"]},
];

const CAPSTONES = [
  { id:"c1", title:"End-to-End Churn Prediction Platform", duration:"Week 3–4", color:"#C8FF57", difficulty:"Intermediate",
    tagline:"Raw data to monitored cloud deployment.", stack:["Sklearn","FastAPI","Docker","GH Actions","MLflow","DVC","AWS EC2","Streamlit"],
    desc:"Full customer churn prediction system. CSV → DVC pipeline → feature engineering → MLflow tracking → FastAPI serving → Docker → CI/CD → EC2 deploy → Streamlit UI. This is your Month 1 capstone.",
    architecture:"S3/DVC → Preprocessing → MLflow Training → Model Registry → FastAPI → Docker → EC2 → Streamlit Dashboard",
    deliverables:["DVC pipeline with S3 remote","MLflow model registry + staging workflow","FastAPI /predict with confidence + SHAP explanation","GitHub Actions CI/CD","AWS EC2 live deployment (public URL)","Streamlit prediction dashboard","Full README + architecture diagram","Makefile for all operations"],
    resumeLine:"Built end-to-end churn prediction platform with CI/CD, experiment tracking, and cloud deployment serving real-time REST predictions with SHAP explanations.",
    interview:["How did you handle class imbalance in the churn dataset?","Walk me through your full deployment pipeline.","How do you version your training data and why does it matter?","If the model performance drops in production, how do you detect and respond?"]},
  { id:"c2", title:"Real-Time Fraud Detection System", duration:"Week 5–6", color:"#FF6B6B", difficulty:"Advanced",
    tagline:"Sub-50ms inference at scale with full observability.", stack:["XGBoost","FastAPI","Kubernetes","Helm","Prometheus","Grafana","Redis","k6"],
    desc:"Fraud detection API processing transactions in real time. XGBoost with class weights. FastAPI + Redis caching. K8s + HPA. Full Prometheus/Grafana observability. Load tested at 1000 RPS.",
    architecture:"Client → FastAPI (K8s HPA) → Redis Cache → XGBoost Model → Prometheus → Grafana → AlertManager → Slack",
    deliverables:["XGBoost with feature importance report","FastAPI + Redis caching layer","Helm chart with HPA","Prometheus + Grafana dashboard","AlertManager → Slack","k6 load test: 1000 RPS results","p99 latency benchmark < 50ms","Architecture diagram"],
    resumeLine:"Architected real-time fraud detection system on Kubernetes with sub-50ms p99 inference, Redis caching, and full Grafana observability at 1000 RPS.",
    interview:["How does Redis caching affect your model's freshness-latency tradeoff?","What happens if your K8s pods crash during a traffic spike?","How did you choose your fraud threshold and what's the business impact?","Explain HPA: what metrics trigger it and how fast does it scale?"]},
  { id:"c3", title:"MLOps Platform via Terraform", duration:"Week 7", color:"#7C9EFF", difficulty:"Advanced",
    tagline:"One terraform apply provisions your entire ML stack.", stack:["Terraform","AWS VPC/EKS/S3/ECR/IAM","GH Actions","Helm","checkov","infracost"],
    desc:"Reusable Terraform modules provisioning complete MLOps platform on AWS. VPC, EKS, S3 data lake, ECR, IAM (least-privilege), CloudWatch, auto-deploy on merge to main. Security audited with checkov.",
    architecture:"GitHub Actions → terraform plan/apply → AWS (VPC+EKS+S3+ECR+IAM+CloudWatch) → Running ML Services",
    deliverables:["Terraform modules: vpc, eks, iam, s3, ecr","Remote state S3 + DynamoDB lock","GH Actions: auto plan on PR, apply on merge","CloudWatch alarms + SNS email","checkov security scan (0 high-severity)","infracost cost estimate","Full destroy + reprovision in < 6 min","README with module usage docs"],
    resumeLine:"Designed Infrastructure-as-Code for complete AWS MLOps platform using Terraform, enabling zero-click environment provisioning with security scanning and cost estimation.",
    interview:["Why Terraform over CloudFormation or CDK?","How do you manage Terraform state in a team with concurrent writes?","How do you handle secret management in IaC — what should never be in Git?","What is a Terraform module and how do you structure them for reuse?"]},
  { id:"c4", title:"Automated ML Retraining Pipeline", duration:"Week 9–10", color:"#34D399", difficulty:"Advanced",
    tagline:"Your model retrains and redeploys itself when data drifts.", stack:["Evidently AI","AWS Lambda","GH Actions","MLflow","DVC","Airflow","Python"],
    desc:"Automated retraining: Evidently monitors production daily → drift detected → Lambda trigger → GitHub Actions workflow → DVC pulls new data → retrains → MLflow compares → promotes if better → auto-deploys. No human in the loop.",
    architecture:"Evidently (drift PSI>0.2) → Lambda trigger → GH Actions → DVC + MLflow → Model Comparison → Conditional deploy → Slack notification",
    deliverables:["Evidently drift monitoring (scheduled daily)","AWS Lambda retraining trigger function","GitHub Actions retraining workflow","MLflow champion/challenger comparison logic","Auto-deploy only if new model better by > 1%","Full audit trail of all retraining runs","Slack notifications with model comparison","System design document (4 pages)"],
    resumeLine:"Built autonomous ML retraining pipeline detecting data drift and orchestrating retraining, evaluation, and deployment with zero human intervention.",
    interview:["How do you prevent a bad retrained model from being auto-deployed?","What's your rollback strategy if the new model causes an incident?","How do you define 'better' — what metrics and why?","What's the blast radius if the retraining Lambda crashes?"]},
  { id:"c5", title:"Multi-Model Serving Gateway + A/B Testing", duration:"Week 11–12", color:"#F59E0B", difficulty:"Expert",
    tagline:"One API. Many models. Smart traffic routing. Zero-downtime updates.", stack:["FastAPI","Kubernetes","Nginx","MLflow","Redis","Prometheus","Feature Flags"],
    desc:"Model gateway serving multiple model versions. A/B testing with statistical significance checks. Canary deployments (5%→25%→100%). Shadow mode (test without affecting users). Auto-rollback on error spike. Full K8s deployment.",
    architecture:"Client → Nginx → FastAPI Gateway → Traffic Router (A/B/Canary/Shadow) → [Model A | Model B] → Redis → Prometheus → Grafana A/B Dashboard",
    deliverables:["FastAPI gateway with pluggable routing logic","A/B splitter with statistical significance (p<0.05)","Canary Helm chart with traffic weights","Shadow mode with no user impact","Auto-rollback on error rate > 1%","Grafana A/B performance dashboard","Load test comparing model versions","Full system design document (6 pages)"],
    resumeLine:"Built production ML serving gateway supporting A/B testing, canary deployments, and shadow mode for zero-downtime model updates, serving 10k+ RPM on Kubernetes.",
    interview:["How do you ensure statistical significance in your A/B tests — what sample size do you need?","Explain the difference between canary and blue-green deployment.","How does shadow mode work without affecting the user?","When would you use A/B testing vs canary vs shadow mode?"]},
];

const AI_ML_TOPICS = [
  { id:"ai1", title:"Machine Learning Fundamentals", color:"#60A5FA", icon:"🧠",
    month:"Months 1–2 (parallel)", priority:"High",
    desc:"The theory that makes you dangerous in interviews and system design.",
    topics:[
      { name:"Supervised Learning Deep Dive", subtopics:["Linear/Logistic Regression derivations","Decision Trees & ensemble methods (RF, XGBoost, LightGBM)","SVM: kernel trick, margin maximization","Bias-variance tradeoff: formal analysis","Regularization: L1 (Lasso), L2 (Ridge), Elastic Net"] },
      { name:"Model Evaluation & Selection", subtopics:["Cross-validation strategies (k-fold, stratified, time-series)","Metrics: AUC-ROC, PR curve, F1, MCC, NDCG","Calibration: Platt scaling, isotonic regression","Hyperparameter tuning: Bayesian optimization, Optuna","Class imbalance: SMOTE, class weights, threshold tuning"] },
      { name:"Unsupervised & Semi-supervised", subtopics:["Clustering: K-means, DBSCAN, hierarchical","Dimensionality reduction: PCA, t-SNE, UMAP","Anomaly detection: Isolation Forest, Autoencoders","Self-supervised learning patterns","Label propagation"] },
      { name:"Feature Engineering", subtopics:["Encoding: target encoding, embeddings for categoricals","Feature interactions and polynomial features","Time-series features: lag, rolling stats, Fourier","Missing data strategies beyond imputation","Feature selection: SHAP, permutation importance, RFE"] },
    ]},
  { id:"ai2", title:"Deep Learning & Neural Networks", color:"#A78BFA", icon:"⚡",
    month:"Month 2–3 (parallel)", priority:"High",
    desc:"From PyTorch basics to training large models efficiently.",
    topics:[
      { name:"PyTorch Production Patterns", subtopics:["Custom Dataset + DataLoader + collate_fn","Training loops: gradient accumulation, mixed precision (AMP)","Model checkpointing and resuming training","TorchScript and model export","Distributed training with DDP basics"] },
      { name:"Neural Architecture Patterns", subtopics:["CNNs: conv layers, pooling, batch norm, residual connections","RNNs/LSTMs: sequence modeling, vanishing gradient solutions","Attention mechanism from scratch","Transformer architecture (encoder-decoder)","Transfer learning: fine-tuning strategies"] },
      { name:"Training Optimization", subtopics:["Optimizers: SGD, Adam, AdamW, learning rate schedulers","Regularization: dropout, weight decay, data augmentation","Gradient clipping, gradient checkpointing","Mixed precision training (FP16/BF16)","Debugging: loss divergence, gradient norms"] },
      { name:"Model Compression & Efficiency", subtopics:["Quantization: INT8, FP16, GPTQ","Pruning: structured vs unstructured","Knowledge distillation","ONNX export + runtime optimization","Benchmarking: FLOPs, latency, throughput"] },
    ]},
  { id:"ai3", title:"Large Language Models & GenAI", color:"#FB7185", icon:"🤖",
    month:"Month 3", priority:"High",
    desc:"Operating and building on top of LLMs in production.",
    topics:[
      { name:"LLM Fundamentals", subtopics:["Transformer architecture deep dive: attention, positional encoding","Pre-training vs fine-tuning vs RLHF","Tokenization: BPE, SentencePiece","Context window, KV cache, speculative decoding","Inference optimization: batching, continuous batching"] },
      { name:"Fine-tuning & Adaptation", subtopics:["Full fine-tuning vs parameter-efficient (LoRA, QLoRA)","Instruction tuning with supervised fine-tuning (SFT)","RLHF: reward model + PPO training","DPO (Direct Preference Optimization)","Dataset curation for fine-tuning"] },
      { name:"RAG Systems", subtopics:["Chunking strategies: fixed, semantic, recursive","Embedding models: sentence-transformers, OpenAI embeddings","Vector databases: Qdrant, Weaviate, Pinecone, pgvector","Retrieval: dense, sparse (BM25), hybrid + reranking","Evaluation: RAGAS framework, faithfulness, relevance"] },
      { name:"LLMOps", subtopics:["Prompt versioning and management","LangSmith / Arize Phoenix for tracing","Cost tracking: tokens, latency, $/1k requests","Guardrails: output validation, PII detection","A/B testing prompts in production"] },
    ]},
  { id:"ai4", title:"MLOps & ML Systems Design", color:"#34D399", icon:"⚙️",
    month:"All 3 months", priority:"Critical",
    desc:"The intersection of ML and software engineering — your core differentiator.",
    topics:[
      { name:"ML System Architecture Patterns", subtopics:["Two-tower models for retrieval","Embedding-based recommendation systems","Real-time vs batch prediction tradeoffs","Feature store patterns: online vs offline","Training-serving skew: causes and prevention"] },
      { name:"Data Engineering for ML", subtopics:["Data lakes: S3 + Parquet + Iceberg/Delta Lake","Stream processing: Kafka + Flink/Spark Streaming","Data quality: Great Expectations, Soda","Lineage tracking: OpenLineage, Marquez","ETL vs ELT patterns for ML pipelines"] },
      { name:"Experiment Design", subtopics:["A/B testing: power analysis, significance testing","Multi-armed bandits: epsilon-greedy, Thompson sampling","Interleaving experiments","Holdback groups and novelty effects","Metric selection: guardrail vs north-star"] },
      { name:"Reliability Engineering for ML", subtopics:["SLOs for ML systems: what does 'available' mean for a model?","Chaos engineering for ML pipelines","Incident response runbooks","Post-mortem culture and blameless reviews","On-call rotations and toil reduction"] },
    ]},
  { id:"ai5", title:"Mathematics for ML", color:"#F59E0B", icon:"📐",
    month:"Ongoing (30 min/day)", priority:"Medium",
    desc:"The math that unlocks understanding instead of just usage.",
    topics:[
      { name:"Linear Algebra", subtopics:["Matrix multiplication intuition (transformation view)","Eigenvalues/eigenvectors: PCA derivation","SVD: applications in recommendation systems","Norms: L1, L2, nuclear norm","Dot product as similarity measure"] },
      { name:"Probability & Statistics", subtopics:["MLE vs MAP estimation","Bayesian inference: prior, likelihood, posterior","Hypothesis testing: p-values, confidence intervals","Distributions: Gaussian, Binomial, Poisson, Beta","KL divergence, cross-entropy, mutual information"] },
      { name:"Calculus & Optimization", subtopics:["Gradient descent derivation from first principles","Chain rule and backpropagation by hand","Convexity and why it matters","Lagrange multipliers (for SVM derivation)","Second-order methods: Newton, quasi-Newton"] },
    ]},
];

const INTERVIEW_QA = [
  { id:"iq1", cat:"MLOps & System Design", color:"#C8FF57", icon:"🏗️",
    questions:[
      { q:"Design a real-time fraud detection system at 100k transactions/second.", level:"L5/Senior",
        a:"Start with requirements: latency < 50ms p99, 99.99% availability, explainability for compliance. Architecture: Kafka ingestion → feature computation (Flink, sliding windows) → feature store (Redis online, S3 offline) → XGBoost/LightGBM model served via FastAPI on K8s with HPA → async logging to data lake. Key decisions: (1) Use Redis for sub-1ms feature lookup — don't compute features at inference time. (2) Shadow mode for new model versions before full rollout. (3) Two-stage: fast rule-based filter (99% pass) → expensive ML model for flagged txns. (4) Model explainability via SHAP stored per prediction for compliance. Monitoring: Evidently for drift, custom Grafana dashboards, PagerDuty alerting. Rollback: Helm rollback to previous image tag, zero-downtime via rolling updates.",
        followups:["How do you handle feature freshness vs latency?","What's your strategy for model updates without downtime?","How do you deal with concept drift in fraud patterns?"] },
      { q:"How would you build a recommendation system for 100M users?", level:"L5/Senior",
        a:"Two-stage: (1) Candidate generation — two-tower neural network: user tower (embeddings from history) + item tower (embeddings from content). ANN search via FAISS/ScaNN returns top 1000 candidates in < 10ms. (2) Ranking — LightGBM or neural ranker with dense features: user-item interactions, context (time, device), item quality signals. Feature store: Feast with Redis online store for user features, S3 offline for training. Training: daily batch retraining with Airflow, continuous evaluation on held-out recent data. Serving: candidate generation on K8s (memory-heavy), ranker on smaller instances. Experimentation: A/B testing framework with holdback groups. Key metrics: click-through rate (CTR), watch time, diversity (intra-list distance).",
        followups:["How do you handle the cold start problem?","How do you measure 'good' recommendations beyond CTR?","How do you prevent filter bubbles?"] },
      { q:"How do you handle model drift in production?", level:"L4/Mid",
        a:"Three layers of detection: (1) Data drift — PSI (Population Stability Index) and KS test on input feature distributions daily via Evidently AI. Alert if PSI > 0.2. (2) Prediction drift — distribution shift in model outputs. (3) Concept drift — performance degradation on labeled ground truth (requires feedback loop with label collection). Response strategy: severity-based. Minor drift → increase monitoring frequency. Moderate → trigger shadow mode retraining. Severe → automatic rollback + page on-call. Prevention: robust training data that covers edge cases, frequent retraining schedules, feature stability monitoring. In practice: set up Grafana dashboards for all three drift types, document normal baseline during initial deployment.",
        followups:["What's the difference between covariate and concept drift?","How do you collect ground truth labels in production?","When would you retrain vs rollback?"] },
      { q:"Explain your CI/CD pipeline for ML models. How is it different from software CI/CD?", level:"L4/Mid",
        a:"ML CI/CD has additional stages software doesn't: (1) Data validation — Great Expectations checks on new training data before training starts. (2) Training pipeline — reproducible with DVC, tracked with MLflow. (3) Model validation — compare champion vs challenger: accuracy, latency, fairness metrics, feature importance stability. (4) A/B deployment — don't deploy to 100% immediately. Canary (5%) → watch metrics → promote or rollback. Our pipeline: PR → lint/test → Docker build → push ECR → deploy canary on K8s → automated smoke tests → Grafana dashboard review gate → full rollout. Key difference from software: you can't just unit-test a model. You need integration tests against real data distributions.",
        followups:["How do you implement a model quality gate in CI?","What happens when training fails mid-pipeline?","How do you test for model fairness automatically?"] },
    ]},
  { id:"iq2", cat:"Kubernetes & Infrastructure", color:"#60A5FA", icon:"☸️",
    questions:[
      { q:"Explain how Kubernetes HPA works and how you'd configure it for an ML inference service.", level:"L4/Mid",
        a:"HPA (Horizontal Pod Autoscaler) queries metrics (CPU%, memory, or custom metrics) every 15s via the Metrics Server. It computes: desired_replicas = ceil(current_replicas * current_metric / target_metric). For ML inference: CPU-based HPA is often wrong — a model serving 1 request at 100% CPU behaves differently than 100 requests at 100% CPU. Better: use custom metrics via Prometheus Adapter — e.g., http_requests_per_second or pending_inference_queue_depth. Configuration: set resources.requests accurately (HPA uses this as denominator), set minReplicas=2 for HA, set stabilizationWindowSeconds=300 to prevent flapping. For ML workloads with GPU: KEDA (Kubernetes Event-Driven Autoscaling) based on queue depth is more appropriate than CPU-based HPA.",
        followups:["What's the difference between HPA and VPA?","How do you autoscale GPU-based inference?","How do you prevent thrashing during scale events?"] },
      { q:"What happens when you do kubectl apply vs kubectl replace?", level:"L3/Junior",
        a:"kubectl apply uses server-side merge patch — it only updates fields you specify, preserving fields not in your manifest. It's declarative and idempotent. kubectl replace does a full replacement — deletes the existing resource and recreates it, which can cause downtime. Always use kubectl apply in production. Under the hood, apply compares your manifest against the last-applied-configuration annotation stored on the resource, then computes a three-way merge. For production: use Helm (which handles this properly) or GitOps (ArgoCD/Flux) rather than raw kubectl apply.",
        followups:["When would kubectl replace be appropriate?","What is the three-way strategic merge patch?","How does ArgoCD differ from kubectl apply?"] },
      { q:"How do you debug a pod that's in CrashLoopBackOff?", level:"L3/Junior",
        a:"Systematic approach: (1) kubectl describe pod <name> — check Events section for OOMKilled (memory limit), image pull errors, probe failures. (2) kubectl logs <pod> --previous — logs from the crashed container. (3) If no logs: kubectl run debug --image=<same-image> -it --rm -- /bin/sh — exec into the image interactively. (4) Check resource limits — if OOMKilled, increase memory limit or optimize the app. (5) Check liveness probe config — misconfigured probes kill healthy pods. (6) Check if it's a startup issue: use startupProbe with higher failureThreshold for slow-starting ML models that take 30s+ to load weights. Common ML-specific causes: model weights too large (OOM), missing env vars (model path), long model loading time failing liveness probe.",
        followups:["How do you handle slow-starting ML models in K8s?","What's the difference between liveness, readiness, and startup probes?","How do you set resource limits for a PyTorch model server?"] },
    ]},
  { id:"iq3", cat:"Machine Learning Theory", color:"#A78BFA", icon:"📊",
    questions:[
      { q:"Explain gradient boosting from first principles. How does XGBoost improve on vanilla GBM?", level:"L4/Mid",
        a:"Gradient boosting builds an ensemble of weak learners sequentially. At each step, fit a new tree to the negative gradient of the loss function — this is steepest descent in function space. For MSE loss, the negative gradient is just the residuals. XGBoost improvements: (1) Second-order Taylor expansion of loss function — uses both gradient and Hessian for better step direction. (2) Regularization built-in: L1 (leaf weights) and L2 (tree complexity) in the objective. (3) Approximate split finding via histogram-based binning — O(n) vs O(n log n). (4) Sparsity-aware: handles missing values natively by learning default direction. (5) Column and row subsampling like Random Forest — reduces overfitting. (6) Parallelism: split finding is parallelized across features. LightGBM further improves with GOSS (only use instances with large gradients) and EFB (bundle mutually exclusive features).",
        followups:["When would you choose XGBoost over a neural network?","How do you tune n_estimators vs learning_rate?","Explain the XGBoost regularization objective."] },
      { q:"What is the difference between L1 and L2 regularization? When do you use each?", level:"L3/Junior",
        a:"L2 (Ridge): adds λΣw² to loss. Gradient: 2λw — penalizes large weights, shrinks all weights toward zero but rarely to exactly zero. Geometrically: circular constraint in weight space. L1 (Lasso): adds λΣ|w| to loss. Gradient: λ·sign(w) — constant force toward zero, which can push weights exactly to zero → feature selection. Geometrically: diamond constraint — corners at axes where solution lands produce sparse weights. Use L1: when you suspect many features are irrelevant, want automatic feature selection, model interpretability. Use L2: when you think most features contribute, don't want to zero out features, generally more stable. Elastic Net combines both — good default when you don't know. In deep learning: L2 (weight decay) is standard via AdamW optimizer. L1 rarely used directly — use structured pruning instead.",
        followups:["Why does L1 produce sparse solutions geometrically?","What is weight decay and how does it relate to L2?","How would you implement elastic net in sklearn?"] },
      { q:"Explain the attention mechanism. Why does it work better than RNNs for long sequences?", level:"L5/Senior",
        a:"Attention computes: Attention(Q,K,V) = softmax(QK^T / √d_k) V. Q (queries), K (keys), V (values) are linear projections of input. The dot product QK^T measures similarity between every pair of positions — so attention is O(n²) but every position attends to every other position in one step. RNN problems: (1) Sequential dependency — can't parallelize, slow training. (2) Vanishing gradient — information from early tokens is compressed through many non-linearities before reaching later steps. (3) Fixed-size hidden state bottleneck — compressing a 1000-word document into a 512-d vector loses information. Attention solves all three: fully parallel (matrix multiplications), direct O(1) path between any two positions (no vanishing gradient path), and attends to ALL previous tokens simultaneously. The √d_k scaling prevents dot products from becoming too large in high dimensions, keeping softmax in a useful gradient regime.",
        followups:["What is multi-head attention and why have multiple heads?","How does positional encoding work?","What are the computational challenges with transformers at long context lengths?"] },
    ]},
  { id:"iq4", cat:"Python & System Design", color:"#FB7185", icon:"🐍",
    questions:[
      { q:"How do you optimize Python for high-throughput ML inference?", level:"L4/Mid",
        a:"Layer by layer: (1) Batch inference — never process one sample at a time. Dynamic batching groups requests arriving within a time window. (2) Async FastAPI — use async def endpoints with asyncio to handle I/O concurrently (reading from cache, logging). (3) Model-level: ONNX export removes Python overhead, runs C++ runtime. TorchScript for PyTorch. Mixed precision (FP16) halves memory bandwidth. (4) Caching — Redis for frequently requested predictions (e.g., same user ID within 1 minute). (5) Preprocessing pipeline — vectorize with NumPy, avoid Python loops. Use Polars instead of Pandas for 10x faster data transformations. (6) Concurrency model: for CPU-bound inference, use ProcessPoolExecutor (bypasses GIL). For I/O-bound: asyncio. (7) Profiling first — use py-spy, line_profiler before optimizing. Never guess the bottleneck.",
        followups:["What is the Python GIL and how does it affect ML serving?","When would you use multiprocessing vs threading vs asyncio?","How do you implement dynamic batching in FastAPI?"] },
      { q:"Design a rate limiter for an ML inference API.", level:"L4/Mid",
        a:"Algorithm choice: Token Bucket (recommended for ML APIs). Each user gets a bucket with N tokens refilling at rate R. Each request consumes 1 token. Allows bursts up to N while maintaining average rate R. Implementation: Redis with INCR + EXPIRY for atomic token counting. Sliding window log variant for strict per-second limits. For ML specifically: consider request cost beyond count — large batch = more tokens consumed. Implementation in FastAPI: middleware or Depends() decorator checking Redis. Key-value: user_id:endpoint:minute → count. Return 429 with Retry-After header. At scale: Redis Cluster for distributed rate limiting. Lua scripts for atomic check-and-increment. Consider token bucket per tier: free (10 req/min), paid (1000 req/min). Edge case: Redis failure → fail open (allow) or fail closed (deny) — fail open preferred for revenue-generating APIs.",
        followups:["Difference between token bucket and leaky bucket?","How do you rate limit across multiple API instances?","How would you implement tiered rate limiting?"] },
    ]},
];

// ─── PROGRESS STORE KEY ───────────────────────────────────────────────────────
const STORAGE_KEY = "mlops-progress-v3";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("roadmap");
  const [mIdx, setMIdx] = useState(0);
  const [openWeek, setOpenWeek] = useState(null);
  const [openProj, setOpenProj] = useState(null);
  const [openQ, setOpenQ] = useState(null);
  const [openAI, setOpenAI] = useState(null);
  const [openAISub, setOpenAISub] = useState(null);
  const [iqCat, setIqCat] = useState(0);
  const [progress, setProgress] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [savingIndicator, setSavingIndicator] = useState(false);

  const th = dark ? T.dark : T.light;
  const month = MONTHS[mIdx];

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
    } catch (e) {}
    setStorageReady(true);
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setSavingIndicator(true);
      setTimeout(() => setSavingIndicator(false), 1200);
    } catch (e) {}
  }, []);

  const setTaskStatus = useCallback((id, status) => {
    setProgress(prev => {
      const next = { ...prev, [id]: status === prev[id] ? undefined : status };
      if (next[id] === undefined) delete next[id];
      saveProgress(next);
      return next;
    });
  }, [saveProgress]);

  // Stats
  const allTaskIds = MONTHS.flatMap(m => m.weeks.flatMap(w => w.tasks.map(t => t.id)));
  const doneCount = allTaskIds.filter(id => progress[id] === "done").length;
  const wipCount = allTaskIds.filter(id => progress[id] === "wip").length;
  const totalTasks = allTaskIds.length;
  const pct = Math.round(((doneCount + wipCount * 0.5) / totalTasks) * 100);

  const allMiniIds = MINI_PROJECTS.map(p => p.id);
  const allCapIds = CAPSTONES.map(p => p.id);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${th.bg};}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-thumb{background:${th.border};border-radius:2px;}

    .tab{padding:6px 14px;border:1px solid ${th.border};background:transparent;color:${th.dim};font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.07em;cursor:pointer;border-radius:5px;transition:all .18s;white-space:nowrap;}
    .tab:hover{color:${th.text};border-color:${th.borderH};background:${th.card};}
    .tab.on{background:${th.accent};color:${dark?"#000":"#fff"};border-color:${th.accent};font-weight:700;}

    .card{border:1px solid ${th.border};border-radius:10px;overflow:hidden;transition:border-color .2s,box-shadow .2s;}
    .card:hover{border-color:${th.borderH};}
    .card.open{border-color:var(--ac)!important;}

    .hdr{padding:15px 18px;cursor:pointer;background:${th.card};transition:background .15s;display:flex;justify-content:space-between;align-items:center;gap:12px;}
    .hdr:hover{background:${th.cardH};}

    .row{display:grid;gap:10px;padding:9px 6px;border-bottom:1px solid ${th.border};align-items:start;border-radius:5px;transition:background .13s;}
    .row:hover{background:${th.cardH};}
    .row:last-child{border-bottom:none;}
    .row:hover .rt{color:${th.text}!important;}

    .pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;background:${th.pill};border:1px solid ${th.pillB};color:${th.dim};margin:2px;transition:all .14s;}
    .pill:hover{border-color:var(--ac,${th.accent});color:${th.text};}

    .ck-wrap{display:flex;gap:5px;align-items:center;flex-shrink:0;}
    .ck{width:22px;height:22px;border-radius:5px;border:1.5px solid ${th.border};background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .15s;flex-shrink:0;}
    .ck:hover{border-color:${th.borderH};transform:scale(1.08);}
    .ck.done{background:${th.ok};border-color:${th.ok};color:#fff;}
    .ck.wip{background:${th.warn};border-color:${th.warn};color:#000;}

    .proj-ck{width:26px;height:26px;border-radius:6px;border:1.5px solid ${th.border};background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s;}
    .proj-ck:hover{border-color:${th.borderH};}
    .proj-ck.done{background:${th.ok};border-color:${th.ok};}
    .proj-ck.wip{background:${th.warn};border-color:${th.warn};}

    .pbar-bg{width:100%;height:6px;background:${th.border};border-radius:3px;overflow:hidden;}
    .pbar-fill{height:6px;border-radius:3px;transition:width .5s ease;}

    .toggle{width:42px;height:22px;border-radius:11px;border:1px solid ${th.border};background:${th.pill};cursor:pointer;position:relative;transition:all .2s;display:flex;align-items:center;padding:2px;}
    .knob{width:16px;height:16px;border-radius:50%;background:${th.accent};transition:transform .2s ease;transform:${dark?"translateX(20px)":"translateX(0)"}}

    .del{display:flex;gap:10px;padding:7px 4px;border-bottom:1px solid ${th.border};border-radius:4px;transition:all .13s;}
    .del:hover{background:${th.cardH};padding-left:8px;}
    .del:last-child{border-bottom:none;}
    .del:hover .dt{color:${th.text}!important;}

    .itm{padding:8px 10px;border-bottom:1px solid ${th.border};border-radius:5px;transition:all .15s;}
    .itm:hover{background:${th.cardH};}
    .itm:last-child{border-bottom:none;}

    .sub-item{padding:5px 8px;border-radius:4px;transition:background .13s;cursor:default;}
    .sub-item:hover{background:${th.cardH};}

    .mbtn{flex:1;padding:12px 14px;border:1px solid ${th.border};background:${th.card};color:${th.dim};font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;border-radius:7px;text-align:left;transition:all .18s;}
    .mbtn:hover{color:${th.text};border-color:${th.borderH};}
    .mbtn.on{border-color:var(--mc);color:${th.text};}

    .save-dot{width:6px;height:6px;border-radius:50%;background:${th.ok};display:inline-block;animation:fadeout 1.2s forwards;}
    @keyframes fadeout{0%{opacity:1}80%{opacity:1}100%{opacity:0}}

    .pulse{animation:pulse 2.5s ease-in-out infinite;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    .fadein{animation:fadein .28s ease;}
    @keyframes fadein{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}

    .stat-box{padding:12px 14px;background:${th.card};border:1px solid ${th.border};border-radius:8px;transition:border-color .15s;}
    .stat-box:hover{border-color:${th.borderH};}
  `;

  // Small helpers
  const TaskRow = ({ t, cols = "90px 72px 1fr" }) => {
    const s = progress[t.id];
    return (
      <div className="row" style={{ gridTemplateColumns: `${cols} 50px` }}>
        <span style={{ fontSize: 10, color: th.dim }}>{t.slot}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--ac)", padding: "2px 6px", background: "color-mix(in srgb, var(--ac) 14%, transparent)", border: "1px solid color-mix(in srgb, var(--ac) 30%, transparent)", borderRadius: 4, letterSpacing: ".04em", whiteSpace: "nowrap", alignSelf: "flex-start" }}>{t.label}</span>
        <span className="rt" style={{ fontSize: 12, color: th.mid, lineHeight: 1.65, transition: "color .13s", textDecoration: s === "done" ? "line-through" : "none", opacity: s === "done" ? 0.5 : 1 }}>{t.txt}</span>
        <div className="ck-wrap">
          <button className={`ck ${s === "done" ? "done" : ""}`} title="Mark done" onClick={() => setTaskStatus(t.id, "done")}>{s === "done" ? "✓" : ""}</button>
          <button className={`ck ${s === "wip" ? "wip" : ""}`} title="Mark in-progress" onClick={() => setTaskStatus(t.id, "wip")}>{s === "wip" ? "⏳" : ""}</button>
        </div>
      </div>
    );
  };

  const ProjCheck = ({ id, color }) => {
    const s = progress[id];
    return (
      <div className="ck-wrap" style={{ gap: 4 }}>
        <button className={`proj-ck ${s === "done" ? "done" : ""}`} style={{ "--ac": color }} title="Done" onClick={() => setTaskStatus(id, "done")}>{s === "done" ? "✓" : ""}</button>
        <button className={`proj-ck ${s === "wip" ? "wip" : ""}`} title="In Progress" onClick={() => setTaskStatus(id, "wip")}>{s === "wip" ? "⏳" : ""}</button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "'JetBrains Mono', monospace", transition: "background .3s, color .3s" }}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <div style={{ padding: "32px 20px 0", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: th.accent, display: "inline-block" }} />
            <span style={{ fontSize: 9, color: th.dim, letterSpacing: ".14em" }}>PYTHON + DEVOPS + AWS → MTECH + MLOPS ENGINEER</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {savingIndicator && <><span className="save-dot" /><span style={{ fontSize: 10, color: th.ok }}>saved</span></>}
            <span style={{ fontSize: 10, color: th.dim }}>{dark ? "☾" : "☀"}</span>
            <button className="toggle" onClick={() => setDark(d => !d)}><div className="knob" /></button>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,4.5vw,44px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.025em", marginBottom: 8 }}>
          12-WEEK MLOPS<br /><span style={{ color: th.accent }}>ELITE ROADMAP</span>
        </h1>
        <p style={{ color: th.dim, fontSize: 12, lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>
          Built on your DevOps + AWS + Python base. 3 months. Interactive progress tracking. MNC-level interview prep.
        </p>

        {/* Progress dashboard */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 16 }}>
          {[
            ["Overall Progress", `${pct}%`, th.accent],
            ["Tasks Done", `${doneCount}/${totalTasks}`, th.ok],
            ["In Progress", `${wipCount}`, th.warn],
            ["Mini Projects", `${allMiniIds.filter(id => progress[id] === "done").length}/5`, "#60A5FA"],
            ["Capstones", `${allCapIds.filter(id => progress[id] === "done").length}/5`, "#FB7185"],
            ["Duration", "12 Weeks", th.mid],
          ].map(([k, v, c]) => (
            <div key={k} className="stat-box">
              <div style={{ fontSize: 9, color: th.faint, marginBottom: 3, letterSpacing: ".07em" }}>{k}</div>
              <div style={{ fontSize: 15, color: c, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Global progress bar */}
        <div style={{ marginBottom: 6 }}>
          <div className="pbar-bg">
            <div className="pbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${th.accent}, ${th.ok})` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 9, color: th.faint }}>✓ = done &nbsp;⏳ = in progress</span>
            <span style={{ fontSize: 9, color: th.dim }}>{pct}% complete</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 5, marginBottom: 24, flexWrap: "wrap", marginTop: 18 }}>
          {["roadmap","daily schedule","mini projects","capstones","interview Q&A","ai & ml topics","rules"].map(tb => (
            <button key={tb} className={`tab ${tab === tb ? "on" : ""}`} onClick={() => setTab(tb)}>
              {tb.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 60px", maxWidth: 860, margin: "0 auto" }} className="fadein">

        {/* ══ ROADMAP ══════════════════════════════════════════════════════════ */}
        {tab === "roadmap" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {MONTHS.map((m, i) => {
                const mTasks = m.weeks.flatMap(w => w.tasks.map(t => t.id));
                const mDone = mTasks.filter(id => progress[id] === "done").length;
                const mPct = Math.round((mDone / mTasks.length) * 100);
                return (
                  <button key={m.id} className={`mbtn ${mIdx === i ? "on" : ""}`}
                    style={{ "--mc": m.color }} onClick={() => { setMIdx(i); setOpenWeek(null); }}>
                    <div style={{ fontSize: 9, color: mIdx === i ? m.color : th.faint, marginBottom: 3, letterSpacing: ".1em" }}>{m.label.toUpperCase()}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{m.title}</div>
                    <div style={{ marginTop: 6 }}>
                      <div className="pbar-bg">
                        <div className="pbar-fill" style={{ width: `${mPct}%`, background: m.color }} />
                      </div>
                      <span style={{ fontSize: 9, color: th.dim, marginTop: 3, display: "block" }}>{mDone}/{mTasks.length} done</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ padding: "11px 14px", border: `1px solid ${month.color}30`, background: `${month.color}08`, borderRadius: 7, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: month.color, letterSpacing: ".1em", marginBottom: 3 }}>MONTH {month.month || mIdx+1} GOAL</div>
              <div style={{ fontSize: 12, color: th.mid, lineHeight: 1.7 }}>{month.goal}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {month.weeks.map(week => {
                const key = `${mIdx}-${week.id}`;
                const isOpen = openWeek === key;
                const wDone = week.tasks.filter(t => progress[t.id] === "done").length;
                const wWip = week.tasks.filter(t => progress[t.id] === "wip").length;
                return (
                  <div key={key} className={`card ${isOpen ? "open" : ""}`} style={{ "--ac": month.color }}>
                    <div className="hdr" onClick={() => setOpenWeek(isOpen ? null : key)}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 7, background: `${month.color}18`, border: `1px solid ${month.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: month.color, flexShrink: 0 }}>W{week.week}</div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: th.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{week.title}</div>
                          <div style={{ fontSize: 11, color: th.dim, marginTop: 2 }}>{week.theme}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                            {wDone > 0 && <span style={{ fontSize: 9, color: th.ok, background: `${th.ok}15`, border: `1px solid ${th.ok}30`, padding: "1px 6px", borderRadius: 3 }}>✓ {wDone} done</span>}
                            {wWip > 0 && <span style={{ fontSize: 9, color: th.warn, background: `${th.warn}15`, border: `1px solid ${th.warn}30`, padding: "1px 6px", borderRadius: 3 }}>⏳ {wWip} wip</span>}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: th.faint, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "16px 18px", background: dark ? "#0b0b0e" : "#FAFAF6", borderTop: `1px solid ${th.border}` }}>
                        <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 10 }}>▸ DAILY TASKS (Mon–Sat) — click ✓ to mark done, ⏳ for in-progress</div>
                        {week.tasks.map(t => <TaskRow key={t.id} t={t} />)}
                        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: th.faint, letterSpacing: ".1em", alignSelf: "center" }}>RESOURCES:</span>
                          {week.resources.map(r => <span key={r} style={{ fontSize: 10, color: th.dim, padding: "3px 8px", border: `1px dashed ${th.border}`, borderRadius: 4 }}>{r}</span>)}
                        </div>
                        <div style={{ padding: "10px 12px", background: `${month.color}08`, border: `1px solid ${month.color}25`, borderRadius: 6, display: "flex", gap: 8 }}>
                          <span>🏁</span>
                          <div>
                            <div style={{ fontSize: 9, color: month.color, letterSpacing: ".1em", marginBottom: 3 }}>MILESTONE</div>
                            <div style={{ fontSize: 11, color: th.mid, lineHeight: 1.6 }}>{week.milestone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ DAILY SCHEDULE ══════════════════════════════════════════════════ */}
        {tab === "daily schedule" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 14 }}>▸ STANDARD DAILY TEMPLATE — MON TO SAT</div>
            <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 10, padding: "18px", marginBottom: 14 }}>
              {[
                { t:"9:00–10:00", b:"DSA", c:"#7C9EFF", n:"2 problems. Time yourself. Write time-complexity after each solution." },
                { t:"10:00–12:30", b:"Deep Work", c:th.accent, n:"Core topic of the week. Build while you learn. No passive watching." },
                { t:"12:30–1:30", b:"Break", c:th.dim, n:"Walk. Eat. Let the morning sink in." },
                { t:"1:30–3:30", b:"Build", c:"#FF6B6B", n:"Apply morning learning to your current project. Hands-on only." },
                { t:"3:30–5:00", b:"Integration", c:"#F59E0B", n:"Connect today's work to the bigger system. Think in pipelines." },
                { t:"5:00–6:00", b:"Review + GitHub", c:"#34D399", n:"Push code. Commit message. Log 3 learnings of the day." },
                { t:"6:00–7:00", b:"Community", c:"#C084FC", n:"Read 1 blog post or paper. MLOps.community, chip.huyen.com." },
              ].map((r, i) => (
                <div key={i} className="row" style={{ gridTemplateColumns: "96px 110px 1fr" }}>
                  <span style={{ fontSize: 10, color: th.dim }}>{r.t}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: r.c, padding: "2px 7px", background: `${r.c}12`, border: `1px solid ${r.c}25`, borderRadius: 4, whiteSpace: "nowrap", alignSelf: "flex-start" }}>{r.b}</span>
                  <span className="rt" style={{ fontSize: 12, color: th.mid, lineHeight: 1.65 }}>{r.n}</span>
                </div>
              ))}
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 10, padding: "18px" }}>
              <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 12 }}>▸ SUNDAY — REVIEW + REST</div>
              {[["9–10","DSA revisit: problems you got wrong this week"],["10–11:30","Code cleanup: refactor, docstrings, type hints"],["11:30–1","Weekly reflection: learned / struggled / plan"],["3–5","Read 1 MLOps blog or paper"],["5–6","Plan next week: 3 concrete deliverables"]].map(([t2, d]) => (
                <div key={t2} className="row" style={{ gridTemplateColumns: "70px 1fr" }}>
                  <span style={{ fontSize: 10, color: th.dim }}>{t2}</span>
                  <span className="rt" style={{ fontSize: 12, color: th.mid, lineHeight: 1.65 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MINI PROJECTS ════════════════════════════════════════════════════ */}
        {tab === "mini projects" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 6 }}>▸ 5 MINI PROJECTS — 3–5 DAYS EACH. EACH IS A STANDALONE GITHUB REPO.</div>
            <div style={{ fontSize: 12, color: th.dim, marginBottom: 16, lineHeight: 1.7 }}>Focused skill-locked builds. Click ✓ or ⏳ to track your status.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MINI_PROJECTS.map(p => {
                const isOpen = openProj === p.id;
                const s = progress[p.id];
                return (
                  <div key={p.id} className={`card ${isOpen ? "open" : ""}`} style={{ "--ac": p.color, "--pc": p.color }}>
                    <div className="hdr" onClick={() => setOpenProj(isOpen ? null : p.id)}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 7, background: `${p.color}18`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: p.color, flexShrink: 0 }}>{p.id.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: th.dim, marginTop: 2 }}>{p.tagline}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, color: p.color, padding: "2px 7px", border: `1px solid ${p.color}40`, borderRadius: 3 }}>{p.week}</span>
                        <ProjCheck id={p.id} color={p.color} />
                        <span style={{ fontSize: 10, color: th.faint }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 18px", background: dark ? "#0d0d10" : "#F5F4EE", borderTop: `1px solid ${th.border}` }}>
                      {p.stack.map(s2 => <span key={s2} className="pill" style={{ "--ac": p.color }}>{s2}</span>)}
                    </div>
                    {isOpen && (
                      <div style={{ padding: "16px 18px", background: dark ? "#0a0a0d" : "#FAFAF6", borderTop: `1px solid ${th.border}` }}>
                        <p style={{ fontSize: 12, color: th.mid, lineHeight: 1.8, marginBottom: 14 }}>{p.desc}</p>
                        <div style={{ padding: "9px 12px", background: dark ? "#0d0d10" : "#F0EEE6", border: `1px solid ${th.border}`, borderRadius: 5, marginBottom: 14, fontFamily: "monospace" }}>
                          <div style={{ fontSize: 9, color: th.faint, marginBottom: 5, letterSpacing: ".1em" }}>ARCHITECTURE</div>
                          <div style={{ fontSize: 11, color: p.color, lineHeight: 1.7 }}>{p.architecture}</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".1em", marginBottom: 8 }}>▸ DELIVERABLES</div>
                          {p.deliverables.map(d => (
                            <div key={d} className="del">
                              <span style={{ color: p.color, fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
                              <span className="dt" style={{ fontSize: 12, color: th.dim, lineHeight: 1.6, transition: "color .13s" }}>{d}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: "10px 12px", background: `${p.color}08`, border: `1px solid ${p.color}25`, borderRadius: 5, marginBottom: 10 }}>
                          <div style={{ fontSize: 9, color: p.color, letterSpacing: ".1em", marginBottom: 4 }}>📄 RESUME LINE</div>
                          <div style={{ fontSize: 12, color: th.mid, lineHeight: 1.6, fontStyle: "italic" }}>"{p.resumeLine}"</div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {p.github.map(g => <span key={g} style={{ fontSize: 10, color: th.dim, padding: "2px 7px", border: `1px dashed ${th.border}`, borderRadius: 3 }}>#{g}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ CAPSTONES ════════════════════════════════════════════════════════ */}
        {tab === "capstones" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 6 }}>▸ 5 CAPSTONE PROJECTS — PORTFOLIO-GRADE. THESE GET YOU HIRED.</div>
            <div style={{ fontSize: 12, color: th.dim, marginBottom: 16, lineHeight: 1.7 }}>Full-system builds. Each one is the project that makes a hiring manager stop scrolling.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CAPSTONES.map(p => {
                const isOpen = openProj === p.id;
                return (
                  <div key={p.id} className={`card ${isOpen ? "open" : ""}`} style={{ "--ac": p.color, "--pc": p.color }}>
                    <div className="hdr" onClick={() => setOpenProj(isOpen ? null : p.id)}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0, flexWrap: "wrap" }}>
                        <div style={{ width: 38, height: 38, borderRadius: 7, background: `${p.color}18`, border: `1px solid ${p.color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: p.color, flexShrink: 0 }}>{p.id.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: th.dim, marginTop: 2 }}>{p.tagline}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 9, color: p.color, padding: "2px 6px", border: `1px solid ${p.color}40`, borderRadius: 3 }}>{p.difficulty}</span>
                        <span style={{ fontSize: 9, color: th.dim, padding: "2px 6px", border: `1px solid ${th.border}`, borderRadius: 3 }}>{p.duration}</span>
                        <ProjCheck id={p.id} color={p.color} />
                        <span style={{ fontSize: 10, color: th.faint }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 18px", background: dark ? "#0d0d10" : "#F5F4EE", borderTop: `1px solid ${th.border}` }}>
                      {p.stack.map(s2 => <span key={s2} className="pill" style={{ "--ac": p.color }}>{s2}</span>)}
                    </div>
                    {isOpen && (
                      <div style={{ padding: "18px", background: dark ? "#0a0a0d" : "#FAFAF6", borderTop: `1px solid ${th.border}` }}>
                        <p style={{ fontSize: 12, color: th.mid, lineHeight: 1.8, marginBottom: 14 }}>{p.desc}</p>
                        <div style={{ padding: "9px 12px", background: dark ? "#0d0d10" : "#F0EEE6", border: `1px solid ${th.border}`, borderRadius: 5, marginBottom: 14 }}>
                          <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".1em", marginBottom: 5 }}>▸ ARCHITECTURE</div>
                          <div style={{ fontSize: 11, color: p.color, lineHeight: 1.7, fontFamily: "monospace" }}>{p.architecture}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 4, marginBottom: 14 }}>
                          {p.deliverables.map(d => (
                            <div key={d} className="del">
                              <span style={{ color: p.color, fontSize: 11, flexShrink: 0 }}>✓</span>
                              <span className="dt" style={{ fontSize: 12, color: th.dim, lineHeight: 1.6 }}>{d}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: "10px 12px", background: `${p.color}08`, border: `1px solid ${p.color}25`, borderRadius: 5, marginBottom: 12 }}>
                          <div style={{ fontSize: 9, color: p.color, letterSpacing: ".1em", marginBottom: 4 }}>📄 RESUME BULLET</div>
                          <div style={{ fontSize: 12, color: th.mid, lineHeight: 1.6, fontStyle: "italic" }}>"{p.resumeLine}"</div>
                        </div>
                        <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".1em", marginBottom: 8 }}>▸ INTERVIEW QUESTIONS FOR THIS PROJECT</div>
                        {p.interview.map((q, i) => (
                          <div key={i} className="itm">
                            <span style={{ fontSize: 9, color: th.faint }}>Q{i+1}.</span>
                            <span style={{ fontSize: 12, color: th.mid, lineHeight: 1.6, marginLeft: 8 }}>{q}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ INTERVIEW Q&A ════════════════════════════════════════════════════ */}
        {tab === "interview Q&A" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 14 }}>▸ MNC-LEVEL INTERVIEW QUESTIONS + FULL ANSWERS (Flipkart, Swiggy, Razorpay, Atlassian, Walmart Labs tier)</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {INTERVIEW_QA.map((cat, i) => (
                <button key={cat.id} className={`tab ${iqCat === i ? "on" : ""}`} style={{ "--ac": cat.color }} onClick={() => setIqCat(i)}>
                  {cat.icon} {cat.cat.toUpperCase()}
                </button>
              ))}
            </div>
            {(() => {
              const cat = INTERVIEW_QA[iqCat];
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cat.questions.map((q, i) => {
                    const key = `${cat.id}-${i}`;
                    const isOpen = openQ === key;
                    return (
                      <div key={key} className={`card ${isOpen ? "open" : ""}`} style={{ "--ac": cat.color }}>
                        <div className="hdr" onClick={() => setOpenQ(isOpen ? null : key)}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 9, color: cat.color, padding: "1px 7px", border: `1px solid ${cat.color}40`, borderRadius: 3 }}>{q.level}</span>
                              <span style={{ fontSize: 9, color: th.faint }}>Q{i+1}</span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: th.text, lineHeight: 1.5 }}>{q.q}</div>
                          </div>
                          <span style={{ fontSize: 10, color: th.faint, flexShrink: 0, marginLeft: 12 }}>{isOpen ? "▲" : "▼"}</span>
                        </div>
                        {isOpen && (
                          <div style={{ padding: "16px 18px", background: dark ? "#0b0b0e" : "#FAFAF6", borderTop: `1px solid ${th.border}` }}>
                            <div style={{ fontSize: 9, color: cat.color, letterSpacing: ".1em", marginBottom: 8 }}>▸ MODEL ANSWER</div>
                            <p style={{ fontSize: 12, color: th.mid, lineHeight: 1.85, marginBottom: 14, whiteSpace: "pre-line" }}>{q.a}</p>
                            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".1em", marginBottom: 8 }}>▸ FOLLOW-UP QUESTIONS TO PREPARE</div>
                            {q.followups.map((f, fi) => (
                              <div key={fi} className="itm">
                                <span style={{ fontSize: 9, color: th.faint }}>↳</span>
                                <span style={{ fontSize: 12, color: th.dim, marginLeft: 8 }}>{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ AI & ML TOPICS ═══════════════════════════════════════════════════ */}
        {tab === "ai & ml topics" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 6 }}>▸ WHAT TO LEARN IN AI/ML — MAPPED TO YOUR ROADMAP TIMELINE</div>
            <div style={{ fontSize: 12, color: th.dim, marginBottom: 16, lineHeight: 1.7 }}>Study these in parallel with the main roadmap. 30–60 minutes daily on theory makes you dangerous in interviews.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {AI_ML_TOPICS.map(section => {
                const isOpen = openAI === section.id;
                return (
                  <div key={section.id} className={`card ${isOpen ? "open" : ""}`} style={{ "--ac": section.color }}>
                    <div className="hdr" onClick={() => setOpenAI(isOpen ? null : section.id)}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 7, background: `${section.color}18`, border: `1px solid ${section.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{section.icon}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{section.title}</div>
                          <div style={{ fontSize: 11, color: th.dim, marginTop: 2 }}>{section.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, color: section.color, padding: "2px 6px", border: `1px solid ${section.color}40`, borderRadius: 3 }}>{section.priority}</span>
                        <span style={{ fontSize: 9, color: th.dim, padding: "2px 6px", border: `1px solid ${th.border}`, borderRadius: 3 }}>{section.month}</span>
                        <span style={{ fontSize: 10, color: th.faint }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "16px 18px", background: dark ? "#0b0b0e" : "#FAFAF6", borderTop: `1px solid ${th.border}` }}>
                        {section.topics.map(topic => {
                          const tKey = `${section.id}-${topic.name}`;
                          const tOpen = openAISub === tKey;
                          return (
                            <div key={topic.name} style={{ marginBottom: 8, border: `1px solid ${th.border}`, borderRadius: 7, overflow: "hidden" }}>
                              <div style={{ padding: "10px 14px", cursor: "pointer", background: th.card, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .14s" }}
                                onClick={() => setOpenAISub(tOpen ? null : tKey)}
                                onMouseEnter={e => e.currentTarget.style.background = th.cardH}
                                onMouseLeave={e => e.currentTarget.style.background = th.card}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{topic.name}</span>
                                <span style={{ fontSize: 10, color: th.faint }}>{tOpen ? "▲" : "▼"}</span>
                              </div>
                              {tOpen && (
                                <div style={{ padding: "10px 14px", background: dark ? "#0d0d10" : "#F5F4EE", borderTop: `1px solid ${th.border}` }}>
                                  {topic.subtopics.map(st => (
                                    <div key={st} className="sub-item">
                                      <span style={{ color: section.color, marginRight: 8, fontSize: 11 }}>›</span>
                                      <span style={{ fontSize: 12, color: th.mid }}>{st}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ RULES ════════════════════════════════════════════════════════════ */}
        {tab === "rules" && (
          <div>
            <div style={{ fontSize: 9, color: th.faint, letterSpacing: ".12em", marginBottom: 14 }}>▸ NON-NEGOTIABLE OPERATING PRINCIPLES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, marginBottom: 20 }}>
              {[
                ["⚡","GitHub every day","One commit minimum. The streak is the proof."],
                ["🔨","Build > Watch","For every 1h theory, 2h building. Always."],
                ["📐","Diagram everything","Draw before you code. Architecture thinking = senior pay."],
                ["🧪","Write tests","Every project. 80%+ coverage. No exceptions."],
                ["📝","Document as you go","README + architecture diagram + decision log."],
                ["🎯","DSA is non-negotiable","2 problems/day = 120+ in 3 months. MTech + interviews."],
                ["📊","Read papers","1 paper/week. Arxiv, distill.pub, chip.huyen.com."],
                ["🤝","Community","MLOps.community Discord. Lurk, ask, contribute."],
              ].map(([ic, ti, de]) => (
                <div key={ti} style={{ padding: "14px", border: `1px solid ${th.border}`, borderRadius: 8, background: th.card, cursor: "default", transition: "all .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = th.accent + "40"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = th.shadow; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 18, marginBottom: 8 }}>{ic}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: th.mid, marginBottom: 5 }}>{ti}</div>
                  <div style={{ fontSize: 11, color: th.dim, lineHeight: 1.7 }}>{de}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 18px", border: `1px solid ${th.accent}25`, background: th.accentD, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: th.accent, fontWeight: 700, marginBottom: 6 }}>You already have the base. That's the hardest part.</div>
              <div style={{ fontSize: 12, color: th.dim, lineHeight: 1.8 }}>DevOps intermediate + AWS + Python + DSA practice means you're not starting from zero.<br />You're deepening, not rebuilding. That's a 3-month headstart over most MTech applicants.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
