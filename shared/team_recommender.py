#!/usr/bin/env python3
"""
Amenthyx AI Teams -- Team Recommendation Engine

Analyzes a strategy.md file and recommends the best-fit teams based on
detected technologies, frameworks, domains, and industry keywords.

Usage:
    python team_recommender.py path/to/strategy.md
    python team_recommender.py path/to/strategy.md --top 5
    python team_recommender.py path/to/strategy.md --json

Python 3.8+, no external dependencies.
"""

import argparse
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional, Set, Tuple

# ---------------------------------------------------------------------------
# ANSI colour support (mirrors amenthyx_cli.py pattern)
# ---------------------------------------------------------------------------

_COLOR_SUPPORTED = True

if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        _COLOR_SUPPORTED = False

if not sys.stdout.isatty():
    _COLOR_SUPPORTED = False


class C:
    """ANSI colour codes."""
    GREEN  = "\033[92m" if _COLOR_SUPPORTED else ""
    YELLOW = "\033[93m" if _COLOR_SUPPORTED else ""
    RED    = "\033[91m" if _COLOR_SUPPORTED else ""
    BLUE   = "\033[94m" if _COLOR_SUPPORTED else ""
    CYAN   = "\033[96m" if _COLOR_SUPPORTED else ""
    MAGENTA = "\033[95m" if _COLOR_SUPPORTED else ""
    BOLD   = "\033[1m"  if _COLOR_SUPPORTED else ""
    DIM    = "\033[2m"  if _COLOR_SUPPORTED else ""
    RESET  = "\033[0m"  if _COLOR_SUPPORTED else ""
    WHITE  = "\033[97m" if _COLOR_SUPPORTED else ""
    BG_BLUE = "\033[44m" if _COLOR_SUPPORTED else ""


# ---------------------------------------------------------------------------
# Team registry -- all 65 teams with folder name and activation alias
# ---------------------------------------------------------------------------

TEAMS: Dict[int, Tuple[str, str]] = {
    1:  ("01-full-stack",             "fullStack"),
    2:  ("02-flutter-mobile",         "flutterMobile"),
    3:  ("03-dotnet-enterprise",      "dotnetEnterprise"),
    4:  ("04-cpp-systems",            "cppSystems"),
    5:  ("05-python-data",            "pythonData"),
    6:  ("06-java-spring",            "javaSpring"),
    7:  ("07-react-frontend",         "react"),
    8:  ("08-nodejs-backend",         "nodejs"),
    9:  ("09-rust-systems",           "rustSystems"),
    10: ("10-go-cloud-native",        "goCloud"),
    11: ("11-swift-ios",              "swiftIos"),
    12: ("12-kotlin-android",         "kotlinAndroid"),
    13: ("13-devops-automation",      "devops"),
    14: ("14-infrastructure-cloud",   "infraCloud"),
    15: ("15-data-engineering",       "dataEngineering"),
    16: ("16-ai-ml",                  "aiMl"),
    17: ("17-cybersecurity",          "cybersecurity"),
    18: ("18-embedded-iot",           "embeddedIot"),
    19: ("19-game-dev",              "gameDev"),
    20: ("20-blockchain-web3",        "blockchainWeb3"),
    21: ("21-agentic-ai",             "agenticAi"),
    22: ("22-elixir-phoenix",         "elixirPhoenix"),
    23: ("23-scala-spark",            "scalaSpark"),
    24: ("24-ruby-rails",             "rubyRails"),
    25: ("25-php-laravel",            "phpLaravel"),
    26: ("26-vue-frontend",           "vue"),
    27: ("27-angular-enterprise",     "angular"),
    28: ("28-sre",                    "sre"),
    29: ("29-platform-engineering",   "platformEngineering"),
    30: ("30-react-native",           "reactNative"),
    31: ("31-database-engineering",   "databaseEngineering"),
    32: ("32-api-design",             "apiDesign"),
    33: ("33-lowcode-automation",     "lowcodeAutomation"),
    34: ("34-qa-automation",          "qaAutomation"),
    35: ("35-technical-writing",      "technicalWriting"),
    36: ("36-ux-design",              "uxDesign"),
    37: ("37-performance-engineering","performanceEngineering"),
    38: ("38-data-science",           "dataScience"),
    39: ("39-computer-vision",        "computerVision"),
    40: ("40-nlp-llm",               "nlpLlm"),
    41: ("41-robotics-ros",           "roboticsRos"),
    42: ("42-xr-spatial",             "xrSpatial"),
    43: ("43-edge-computing",         "edgeComputing"),
    44: ("44-quantum-computing",      "quantumComputing"),
    45: ("45-fintech",                "fintech"),
    46: ("46-healthtech",             "healthtech"),
    47: ("47-edtech",                 "edtech"),
    48: ("48-ecommerce",              "ecommerce"),
    49: ("49-realtime-systems",       "realtimeSystems"),
    50: ("50-accessibility",          "accessibility"),
    51: ("51-open-source",            "openSource"),
    52: ("52-after-effects-motion",   "afterEffectsMotion"),
    53: ("53-video-production",       "videoProduction"),
    54: ("54-3d-vfx",                "3dVfx"),
    55: ("55-audio-engineering",      "audioEngineering"),
    56: ("56-2d-animation",           "2dAnimation"),
    57: ("57-creative-ai-media",      "creativeAI"),
    58: ("58-streaming-broadcast",    "streamingBroadcast"),
    59: ("59-media-pipeline",         "mediaPipeline"),
    60: ("60-social-media",           "socialMedia"),
    61: ("61-mlops-model-deployment", "mlops"),
    62: ("62-developer-relations",    "developerRelations"),
    63: ("63-compliance-governance",  "complianceGovernance"),
    64: ("64-migration-modernization","migrationModernization"),
    65: ("65-prompt-engineering",     "promptEngineering"),
}

# ---------------------------------------------------------------------------
# Keyword weight constants
# ---------------------------------------------------------------------------

W_PRIMARY    = 10   # Primary technology match
W_FRAMEWORK  = 7    # Framework match
W_DOMAIN     = 5    # Domain / capability match
W_INDUSTRY   = 8    # Industry vertical match
W_SECONDARY  = 3    # Secondary / related match

# ---------------------------------------------------------------------------
# Keyword -> (team_number, weight, display_label) mappings
#
# Each keyword maps to a list of (team_num, weight) tuples so one keyword
# can boost multiple teams.  The keyword itself is used as the display label.
# ---------------------------------------------------------------------------

# Helper to build the flat lookup from a more readable structure.
# Format: { team_num: { weight: [keyword, ...] } }
_TEAM_KEYWORDS_RAW: Dict[int, Dict[int, List[str]]] = {
    # 01 - Full Stack
    1: {
        W_PRIMARY:   ["full-stack", "fullstack", "full stack", "mern", "mean", "lamp"],
        W_FRAMEWORK: ["next.js", "nextjs", "nuxt", "remix", "t3", "trpc"],
        W_DOMAIN:    ["web app", "webapp", "web application", "saas", "dashboard", "crud",
                      "rest api", "restful", "graphql", "monolith"],
        W_SECONDARY: ["typescript", "javascript", "html", "css", "sql", "postgresql",
                      "mysql", "mongodb", "redis", "tailwind", "prisma", "orm"],
    },
    # 02 - Flutter Mobile
    2: {
        W_PRIMARY:   ["flutter", "dart"],
        W_FRAMEWORK: ["bloc", "riverpod", "provider", "getx", "flame"],
        W_DOMAIN:    ["mobile app", "cross-platform", "cross platform", "ios", "android",
                      "widget", "material design"],
        W_SECONDARY: ["firebase", "hive", "sqflite", "pub.dev"],
    },
    # 03 - .NET Enterprise
    3: {
        W_PRIMARY:   [".net", "dotnet", "c#", "csharp"],
        W_FRAMEWORK: ["asp.net", "blazor", "maui", "entity framework", "ef core",
                      "wpf", "winforms", "xamarin"],
        W_DOMAIN:    ["enterprise", "windows", "azure functions"],
        W_SECONDARY: ["nuget", "visual studio", "mssql", "sql server", "iis"],
    },
    # 04 - C++ Systems
    4: {
        W_PRIMARY:   ["c++", "cpp"],
        W_FRAMEWORK: ["qt", "boost", "cmake", "conan", "vcpkg"],
        W_DOMAIN:    ["systems programming", "low-level", "memory management",
                      "compiler", "os kernel", "driver"],
        W_SECONDARY: ["makefile", "gcc", "clang", "llvm", "opengl", "vulkan"],
    },
    # 05 - Python Data
    5: {
        W_PRIMARY:   ["python"],
        W_FRAMEWORK: ["django", "flask", "fastapi", "celery", "sqlalchemy"],
        W_DOMAIN:    ["data analysis", "scripting", "automation", "etl",
                      "data pipeline", "jupyter", "notebook"],
        W_SECONDARY: ["pip", "poetry", "pandas", "numpy", "matplotlib",
                      "pytest", "asyncio", "pydantic"],
    },
    # 06 - Java Spring
    6: {
        W_PRIMARY:   ["java", "jvm"],
        W_FRAMEWORK: ["spring", "spring boot", "springboot", "hibernate",
                      "quarkus", "micronaut", "jakarta"],
        W_DOMAIN:    ["enterprise", "microservices", "middleware"],
        W_SECONDARY: ["maven", "gradle", "tomcat", "jpa", "jdbc", "junit"],
    },
    # 07 - React Frontend
    7: {
        W_PRIMARY:   ["react", "reactjs", "react.js"],
        W_FRAMEWORK: ["next.js", "nextjs", "gatsby", "remix", "redux",
                      "zustand", "tanstack", "react query", "react router"],
        W_DOMAIN:    ["frontend", "front-end", "spa", "single page",
                      "component", "ui library", "design system"],
        W_SECONDARY: ["typescript", "javascript", "jsx", "tsx", "vite",
                      "webpack", "tailwind", "css-in-js", "storybook"],
    },
    # 08 - Node.js Backend
    8: {
        W_PRIMARY:   ["node.js", "nodejs", "node", "express", "expressjs"],
        W_FRAMEWORK: ["nestjs", "nest.js", "fastify", "koa", "hapi",
                      "adonis", "feathers"],
        W_DOMAIN:    ["backend", "back-end", "server-side", "rest api",
                      "api server", "microservices", "middleware"],
        W_SECONDARY: ["npm", "yarn", "pnpm", "typescript", "javascript",
                      "mongodb", "postgresql", "prisma", "sequelize"],
    },
    # 09 - Rust Systems
    9: {
        W_PRIMARY:   ["rust", "cargo"],
        W_FRAMEWORK: ["tokio", "actix", "axum", "warp", "rocket"],
        W_DOMAIN:    ["systems programming", "memory safety", "concurrency",
                      "wasm", "webassembly", "cli tool"],
        W_SECONDARY: ["crates.io", "serde", "async-std"],
    },
    # 10 - Go Cloud Native
    10: {
        W_PRIMARY:   ["go", "golang"],
        W_FRAMEWORK: ["gin", "echo", "fiber", "chi", "gorilla"],
        W_DOMAIN:    ["cloud native", "cloud-native", "microservices",
                      "container", "service mesh", "grpc"],
        W_SECONDARY: ["goroutine", "channel", "protobuf", "cobra"],
    },
    # 11 - Swift iOS
    11: {
        W_PRIMARY:   ["swift", "swiftui"],
        W_FRAMEWORK: ["uikit", "combine", "core data", "arkit",
                      "healthkit", "cloudkit", "vapor"],
        W_DOMAIN:    ["ios", "iphone", "ipad", "apple", "app store",
                      "xcode", "macos"],
        W_SECONDARY: ["cocoapods", "spm", "swift package manager",
                      "testflight", "watchos"],
    },
    # 12 - Kotlin Android
    12: {
        W_PRIMARY:   ["kotlin", "android"],
        W_FRAMEWORK: ["jetpack compose", "compose", "ktor", "room",
                      "hilt", "dagger", "koin"],
        W_DOMAIN:    ["android app", "google play", "play store",
                      "material you", "adb"],
        W_SECONDARY: ["gradle", "coroutine", "flow", "viewmodel",
                      "livedata", "retrofit"],
    },
    # 13 - DevOps Automation
    13: {
        W_PRIMARY:   ["devops", "ci/cd", "cicd"],
        W_FRAMEWORK: ["jenkins", "github actions", "gitlab ci", "circleci",
                      "argo cd", "argocd", "tekton", "spinnaker"],
        W_DOMAIN:    ["continuous integration", "continuous delivery",
                      "continuous deployment", "pipeline", "automation",
                      "release management", "gitops"],
        W_SECONDARY: ["yaml", "webhook", "artifact", "build"],
    },
    # 14 - Infrastructure Cloud
    14: {
        W_PRIMARY:   ["terraform", "infrastructure as code", "iac",
                      "pulumi", "cloudformation"],
        W_FRAMEWORK: ["ansible", "chef", "puppet", "salt", "crossplane"],
        W_DOMAIN:    ["aws", "azure", "gcp", "google cloud", "cloud",
                      "infrastructure", "vpc", "networking", "load balancer"],
        W_SECONDARY: ["ec2", "s3", "lambda", "iam", "cdn", "dns",
                      "ssl", "tls"],
    },
    # 15 - Data Engineering
    15: {
        W_PRIMARY:   ["data engineering", "data warehouse", "data lake",
                      "etl", "elt"],
        W_FRAMEWORK: ["airflow", "dbt", "spark", "flink", "kafka",
                      "snowflake", "databricks", "beam"],
        W_DOMAIN:    ["data pipeline", "data ingestion", "batch processing",
                      "stream processing", "data modeling", "olap"],
        W_SECONDARY: ["parquet", "avro", "delta lake", "iceberg",
                      "redshift", "bigquery"],
    },
    # 16 - AI / ML
    16: {
        W_PRIMARY:   ["machine learning", "deep learning", "ai",
                      "artificial intelligence", "ml"],
        W_FRAMEWORK: ["tensorflow", "pytorch", "keras", "scikit-learn",
                      "sklearn", "hugging face", "huggingface",
                      "xgboost", "lightgbm"],
        W_DOMAIN:    ["model training", "neural network", "classification",
                      "regression", "clustering", "recommendation",
                      "feature engineering"],
        W_SECONDARY: ["gpu", "cuda", "tpu", "onnx", "mlflow",
                      "wandb", "experiment tracking"],
    },
    # 17 - Cybersecurity
    17: {
        W_PRIMARY:   ["cybersecurity", "security", "infosec",
                      "information security"],
        W_FRAMEWORK: ["owasp", "nist", "iso 27001", "soc2", "soc 2"],
        W_DOMAIN:    ["penetration testing", "pentest", "vulnerability",
                      "encryption", "authentication", "authorization",
                      "zero trust", "firewall", "ids", "ips", "siem"],
        W_SECONDARY: ["oauth", "jwt", "ssl", "tls", "mfa", "2fa",
                      "rbac", "audit"],
    },
    # 18 - Embedded IoT
    18: {
        W_PRIMARY:   ["embedded", "iot", "internet of things",
                      "microcontroller", "mcu"],
        W_FRAMEWORK: ["arduino", "esp32", "raspberry pi", "stm32",
                      "freertos", "zephyr", "platformio"],
        W_DOMAIN:    ["firmware", "sensor", "actuator", "mqtt",
                      "zigbee", "bluetooth", "ble", "lora"],
        W_SECONDARY: ["gpio", "i2c", "spi", "uart", "pcb", "rtos"],
    },
    # 19 - Game Dev
    19: {
        W_PRIMARY:   ["game development", "game dev", "gamedev", "game"],
        W_FRAMEWORK: ["unity", "unreal", "godot", "bevy", "phaser",
                      "monogame", "libgdx"],
        W_DOMAIN:    ["2d game", "3d game", "multiplayer", "game engine",
                      "physics engine", "sprite", "shader",
                      "level design", "game design"],
        W_SECONDARY: ["opengl", "vulkan", "directx", "webgl",
                      "hlsl", "glsl"],
    },
    # 20 - Blockchain Web3
    20: {
        W_PRIMARY:   ["blockchain", "web3", "smart contract",
                      "cryptocurrency", "crypto"],
        W_FRAMEWORK: ["solidity", "hardhat", "foundry", "truffle",
                      "ethers.js", "web3.js", "anchor", "cosmwasm"],
        W_DOMAIN:    ["defi", "nft", "dao", "dapp", "token",
                      "ethereum", "solana", "polygon", "consensus"],
        W_SECONDARY: ["metamask", "wallet", "ipfs", "chain", "layer 2",
                      "l2", "rollup"],
    },
    # 21 - Agentic AI
    21: {
        W_PRIMARY:   ["agentic ai", "ai agent", "autonomous agent",
                      "agent framework"],
        W_FRAMEWORK: ["langchain", "langgraph", "autogen", "crewai",
                      "crew ai", "semantic kernel", "haystack",
                      "llamaindex", "llama index"],
        W_DOMAIN:    ["rag", "retrieval augmented", "tool use",
                      "function calling", "chain of thought",
                      "multi-agent", "orchestration"],
        W_SECONDARY: ["openai", "anthropic", "claude", "gpt",
                      "embedding", "vector store", "pinecone",
                      "chromadb", "weaviate"],
    },
    # 22 - Elixir Phoenix
    22: {
        W_PRIMARY:   ["elixir", "erlang", "beam"],
        W_FRAMEWORK: ["phoenix", "liveview", "ecto", "nerves", "otp"],
        W_DOMAIN:    ["real-time", "fault tolerant", "distributed",
                      "concurrency"],
        W_SECONDARY: ["hex", "mix", "genserver", "supervisor"],
    },
    # 23 - Scala Spark
    23: {
        W_PRIMARY:   ["scala"],
        W_FRAMEWORK: ["spark", "apache spark", "akka", "play framework",
                      "zio", "cats"],
        W_DOMAIN:    ["big data", "distributed computing",
                      "stream processing", "batch"],
        W_SECONDARY: ["sbt", "jvm", "hadoop", "hive"],
    },
    # 24 - Ruby Rails
    24: {
        W_PRIMARY:   ["ruby", "rails", "ruby on rails"],
        W_FRAMEWORK: ["sinatra", "hanami", "rspec", "sidekiq",
                      "activerecord", "active record"],
        W_DOMAIN:    ["web app", "mvc", "rapid prototyping",
                      "convention over configuration"],
        W_SECONDARY: ["gem", "bundler", "heroku", "puma"],
    },
    # 25 - PHP Laravel
    25: {
        W_PRIMARY:   ["php", "laravel"],
        W_FRAMEWORK: ["symfony", "wordpress", "drupal", "magento",
                      "livewire", "inertia"],
        W_DOMAIN:    ["web development", "cms", "content management"],
        W_SECONDARY: ["composer", "blade", "eloquent", "artisan",
                      "apache", "nginx"],
    },
    # 26 - Vue Frontend
    26: {
        W_PRIMARY:   ["vue", "vuejs", "vue.js"],
        W_FRAMEWORK: ["nuxt", "nuxt.js", "vuetify", "pinia", "vuex",
                      "quasar", "vuepress"],
        W_DOMAIN:    ["frontend", "front-end", "spa",
                      "single page", "component"],
        W_SECONDARY: ["vite", "typescript", "javascript", "tailwind"],
    },
    # 27 - Angular Enterprise
    27: {
        W_PRIMARY:   ["angular"],
        W_FRAMEWORK: ["ngrx", "rxjs", "angular material", "nx",
                      "ionic"],
        W_DOMAIN:    ["enterprise frontend", "spa", "frontend",
                      "front-end"],
        W_SECONDARY: ["typescript", "zone.js", "jasmine", "karma"],
    },
    # 28 - SRE
    28: {
        W_PRIMARY:   ["sre", "site reliability"],
        W_FRAMEWORK: ["prometheus", "grafana", "datadog", "new relic",
                      "pagerduty", "opsgenie"],
        W_DOMAIN:    ["observability", "monitoring", "alerting",
                      "incident management", "slo", "sla", "sli",
                      "uptime", "reliability", "on-call", "toil"],
        W_SECONDARY: ["runbook", "postmortem", "chaos engineering",
                      "error budget"],
    },
    # 29 - Platform Engineering
    29: {
        W_PRIMARY:   ["platform engineering", "internal developer platform",
                      "idp"],
        W_FRAMEWORK: ["backstage", "crossplane", "kratix", "port"],
        W_DOMAIN:    ["developer experience", "self-service",
                      "golden path", "platform", "internal tooling"],
        W_SECONDARY: ["service catalog", "scaffolding", "template"],
    },
    # 30 - React Native
    30: {
        W_PRIMARY:   ["react native"],
        W_FRAMEWORK: ["expo", "react navigation", "reanimated",
                      "native wind"],
        W_DOMAIN:    ["mobile app", "cross-platform", "ios", "android"],
        W_SECONDARY: ["metro", "hermes", "javascript", "typescript"],
    },
    # 31 - Database Engineering
    31: {
        W_PRIMARY:   ["database", "db engineering", "dba"],
        W_FRAMEWORK: ["postgresql", "mysql", "mongodb", "cassandra",
                      "redis", "elasticsearch", "neo4j", "cockroachdb",
                      "dynamodb", "couchdb"],
        W_DOMAIN:    ["schema design", "migration", "indexing",
                      "replication", "sharding", "partitioning",
                      "backup", "query optimization"],
        W_SECONDARY: ["sql", "nosql", "acid", "transactions", "oltp"],
    },
    # 32 - API Design
    32: {
        W_PRIMARY:   ["api design", "api gateway", "api"],
        W_FRAMEWORK: ["swagger", "openapi", "postman", "insomnia",
                      "kong", "apigee"],
        W_DOMAIN:    ["rest", "graphql", "grpc", "websocket",
                      "api versioning", "rate limiting", "throttling"],
        W_SECONDARY: ["json", "protobuf", "schema", "endpoint",
                      "webhook"],
    },
    # 33 - Low-Code Automation
    33: {
        W_PRIMARY:   ["low-code", "lowcode", "no-code", "nocode"],
        W_FRAMEWORK: ["n8n", "zapier", "make", "power automate",
                      "retool", "appsmith", "budibase", "airtable"],
        W_DOMAIN:    ["workflow automation", "integration",
                      "business automation", "rpa"],
        W_SECONDARY: ["connector", "trigger", "action", "bot"],
    },
    # 34 - QA Automation
    34: {
        W_PRIMARY:   ["qa", "quality assurance", "test automation",
                      "testing"],
        W_FRAMEWORK: ["selenium", "cypress", "playwright", "jest",
                      "mocha", "pytest", "junit", "testng",
                      "appium", "detox", "k6"],
        W_DOMAIN:    ["unit test", "integration test", "e2e test",
                      "end-to-end", "regression", "smoke test",
                      "load testing", "performance testing", "tdd",
                      "bdd"],
        W_SECONDARY: ["coverage", "mock", "stub", "fixture",
                      "assertion"],
    },
    # 35 - Technical Writing
    35: {
        W_PRIMARY:   ["technical writing", "documentation", "docs"],
        W_FRAMEWORK: ["docusaurus", "mkdocs", "sphinx", "gitbook",
                      "readme", "confluence"],
        W_DOMAIN:    ["api docs", "user guide", "tutorial",
                      "knowledge base", "changelog", "runbook"],
        W_SECONDARY: ["markdown", "asciidoc", "diagram", "mermaid"],
    },
    # 36 - UX Design
    36: {
        W_PRIMARY:   ["ux", "user experience", "ui/ux", "ux design"],
        W_FRAMEWORK: ["figma", "sketch", "adobe xd", "invision",
                      "framer", "principle"],
        W_DOMAIN:    ["wireframe", "prototype", "user research",
                      "usability", "design system", "interaction design",
                      "information architecture"],
        W_SECONDARY: ["persona", "journey map", "a/b test",
                      "heuristic", "responsive"],
    },
    # 37 - Performance Engineering
    37: {
        W_PRIMARY:   ["performance engineering", "performance optimization",
                      "performance"],
        W_FRAMEWORK: ["jmeter", "gatling", "locust", "k6",
                      "lighthouse", "webpagetest"],
        W_DOMAIN:    ["latency", "throughput", "scalability",
                      "caching", "profiling", "benchmarking",
                      "load testing", "stress testing"],
        W_SECONDARY: ["p99", "p95", "bottleneck", "memory leak",
                      "cpu", "optimization"],
    },
    # 38 - Data Science
    38: {
        W_PRIMARY:   ["data science", "data scientist"],
        W_FRAMEWORK: ["pandas", "numpy", "scipy", "matplotlib",
                      "seaborn", "plotly", "tableau", "power bi",
                      "streamlit"],
        W_DOMAIN:    ["statistics", "visualization", "eda",
                      "exploratory data analysis", "hypothesis testing",
                      "a/b testing", "analytics", "forecasting"],
        W_SECONDARY: ["jupyter", "notebook", "r", "spss", "excel"],
    },
    # 39 - Computer Vision
    39: {
        W_PRIMARY:   ["computer vision", "image recognition",
                      "object detection"],
        W_FRAMEWORK: ["opencv", "yolo", "detectron", "mediapipe",
                      "mmdetection"],
        W_DOMAIN:    ["image processing", "video analysis",
                      "segmentation", "ocr", "face detection",
                      "pose estimation", "lidar", "point cloud"],
        W_SECONDARY: ["cnn", "resnet", "vit", "gan", "diffusion"],
    },
    # 40 - NLP / LLM
    40: {
        W_PRIMARY:   ["nlp", "natural language processing", "llm",
                      "large language model"],
        W_FRAMEWORK: ["spacy", "nltk", "transformers", "hugging face",
                      "huggingface", "bert", "gpt"],
        W_DOMAIN:    ["text classification", "sentiment analysis",
                      "named entity", "ner", "summarization",
                      "translation", "chatbot", "conversational ai",
                      "tokenization"],
        W_SECONDARY: ["embedding", "fine-tuning", "prompt",
                      "context window", "attention"],
    },
    # 41 - Robotics ROS
    41: {
        W_PRIMARY:   ["robotics", "ros", "ros2"],
        W_FRAMEWORK: ["gazebo", "moveit", "nav2", "rviz"],
        W_DOMAIN:    ["robot", "autonomous", "navigation", "slam",
                      "kinematics", "control system", "path planning"],
        W_SECONDARY: ["lidar", "imu", "servo", "actuator", "pid"],
    },
    # 42 - XR Spatial
    42: {
        W_PRIMARY:   ["xr", "vr", "ar", "mixed reality",
                      "augmented reality", "virtual reality",
                      "spatial computing"],
        W_FRAMEWORK: ["arkit", "arcore", "openxr", "webxr",
                      "vuforia", "meta quest"],
        W_DOMAIN:    ["3d", "immersive", "headset", "hololens",
                      "spatial", "hologram"],
        W_SECONDARY: ["unity", "unreal", "blender", "mesh",
                      "hand tracking"],
    },
    # 43 - Edge Computing
    43: {
        W_PRIMARY:   ["edge computing", "edge ai", "fog computing"],
        W_FRAMEWORK: ["k3s", "kubeedge", "aws greengrass",
                      "azure iot edge"],
        W_DOMAIN:    ["edge", "latency", "offline-first",
                      "on-premise", "on-prem", "gateway"],
        W_SECONDARY: ["5g", "mec", "cdn", "caching"],
    },
    # 44 - Quantum Computing
    44: {
        W_PRIMARY:   ["quantum computing", "quantum", "qubit"],
        W_FRAMEWORK: ["qiskit", "cirq", "pennylane", "braket",
                      "q#"],
        W_DOMAIN:    ["quantum algorithm", "quantum circuit",
                      "superposition", "entanglement",
                      "quantum error correction"],
        W_SECONDARY: ["quantum gate", "variational", "qaoa", "vqe"],
    },
    # 45 - Fintech
    45: {
        W_PRIMARY:   ["fintech", "financial technology"],
        W_INDUSTRY:  ["banking", "insurance", "insurtech", "payments",
                      "payment processing", "lending", "trading",
                      "investment", "wealth management", "neobank"],
        W_DOMAIN:    ["kyc", "aml", "pci dss", "pci", "ledger",
                      "reconciliation", "settlement", "clearing"],
        W_SECONDARY: ["stripe", "plaid", "swift", "ach", "sepa",
                      "open banking"],
    },
    # 46 - Healthtech
    46: {
        W_PRIMARY:   ["healthtech", "health tech", "digital health"],
        W_INDUSTRY:  ["healthcare", "medical", "clinical", "hospital",
                      "telemedicine", "telehealth", "pharma",
                      "pharmaceutical", "biotech"],
        W_DOMAIN:    ["hl7", "fhir", "hipaa", "ehr", "emr",
                      "patient", "diagnosis", "clinical trial"],
        W_SECONDARY: ["dicom", "icd", "snomed", "wearable",
                      "health data"],
    },
    # 47 - Edtech
    47: {
        W_PRIMARY:   ["edtech", "ed tech", "educational technology"],
        W_INDUSTRY:  ["education", "e-learning", "elearning",
                      "online learning", "lms", "mooc"],
        W_DOMAIN:    ["course", "curriculum", "assessment", "quiz",
                      "student", "teacher", "classroom", "tutoring",
                      "adaptive learning"],
        W_SECONDARY: ["scorm", "xapi", "gamification", "certificate"],
    },
    # 48 - Ecommerce
    48: {
        W_PRIMARY:   ["ecommerce", "e-commerce"],
        W_INDUSTRY:  ["retail", "marketplace", "online store",
                      "shopping", "commerce"],
        W_DOMAIN:    ["cart", "checkout", "inventory", "catalog",
                      "order management", "fulfillment", "shipping",
                      "product listing", "sku"],
        W_SECONDARY: ["shopify", "woocommerce", "stripe",
                      "payment gateway", "recommendation engine"],
    },
    # 49 - Realtime Systems
    49: {
        W_PRIMARY:   ["realtime", "real-time", "real time system"],
        W_FRAMEWORK: ["socket.io", "websocket", "ably", "pusher",
                      "signalr"],
        W_DOMAIN:    ["streaming", "pub/sub", "pubsub",
                      "event-driven", "event driven", "message queue",
                      "low latency", "bidirectional"],
        W_SECONDARY: ["kafka", "rabbitmq", "nats", "zeromq",
                      "redis pub/sub"],
    },
    # 50 - Accessibility
    50: {
        W_PRIMARY:   ["accessibility", "a11y", "wcag"],
        W_DOMAIN:    ["screen reader", "aria", "keyboard navigation",
                      "color contrast", "alt text", "assistive",
                      "inclusive design", "ada compliance"],
        W_SECONDARY: ["axe", "lighthouse", "voiceover", "talkback",
                      "jaws"],
    },
    # 51 - Open Source
    51: {
        W_PRIMARY:   ["open source", "open-source", "oss"],
        W_DOMAIN:    ["community", "contributor", "maintainer",
                      "license", "fork", "pull request",
                      "governance", "cla"],
        W_SECONDARY: ["github", "gitlab", "npm publish", "pypi",
                      "crates.io"],
    },
    # 52 - After Effects Motion
    52: {
        W_PRIMARY:   ["after effects", "motion graphics",
                      "motion design"],
        W_FRAMEWORK: ["lottie", "bodymovin", "duik", "ae script"],
        W_DOMAIN:    ["animation", "kinetic typography", "vfx",
                      "compositing", "keyframe"],
        W_SECONDARY: ["adobe", "render", "export", "gif"],
    },
    # 53 - Video Production
    53: {
        W_PRIMARY:   ["video production", "video editing",
                      "filmmaking"],
        W_FRAMEWORK: ["premiere", "davinci resolve", "ffmpeg",
                      "final cut", "avid"],
        W_DOMAIN:    ["editing", "color grading", "post-production",
                      "cinematography", "storyboard", "b-roll"],
        W_SECONDARY: ["codec", "h264", "h265", "prores",
                      "aspect ratio"],
    },
    # 54 - 3D VFX
    54: {
        W_PRIMARY:   ["3d vfx", "visual effects", "cgi"],
        W_FRAMEWORK: ["blender", "maya", "houdini", "cinema 4d",
                      "3ds max", "nuke"],
        W_DOMAIN:    ["3d modeling", "3d rendering", "texturing",
                      "rigging", "particle", "simulation",
                      "compositing"],
        W_SECONDARY: ["usd", "alembic", "fbx", "obj", "pbr"],
    },
    # 55 - Audio Engineering
    55: {
        W_PRIMARY:   ["audio engineering", "sound design",
                      "audio production"],
        W_FRAMEWORK: ["pro tools", "ableton", "logic pro",
                      "reaper", "audacity", "fmod", "wwise"],
        W_DOMAIN:    ["mixing", "mastering", "spatial audio",
                      "foley", "sound effect", "podcast",
                      "audio processing"],
        W_SECONDARY: ["wav", "mp3", "aac", "midi", "daw",
                      "equalizer", "compressor"],
    },
    # 56 - 2D Animation
    56: {
        W_PRIMARY:   ["2d animation", "cel animation",
                      "frame-by-frame"],
        W_FRAMEWORK: ["spine", "toon boom", "animate cc",
                      "opentoonz", "synfig", "rive"],
        W_DOMAIN:    ["character animation", "sprite animation",
                      "storyboarding", "lip sync",
                      "walk cycle"],
        W_SECONDARY: ["frame rate", "onion skin", "tweening",
                      "vector animation"],
    },
    # 57 - Creative AI Media
    57: {
        W_PRIMARY:   ["creative ai", "generative ai", "gen ai",
                      "ai art"],
        W_FRAMEWORK: ["stable diffusion", "midjourney", "dall-e",
                      "runway", "comfyui", "a1111",
                      "deforum", "suno"],
        W_DOMAIN:    ["image generation", "video generation",
                      "ai video", "text-to-image", "text-to-video",
                      "inpainting", "style transfer"],
        W_SECONDARY: ["lora", "controlnet", "checkpoint",
                      "diffusion model", "upscale"],
    },
    # 58 - Streaming Broadcast
    58: {
        W_PRIMARY:   ["streaming", "broadcast", "live streaming"],
        W_FRAMEWORK: ["obs", "vmix", "wirecast", "webrtc",
                      "hls", "dash", "srt"],
        W_DOMAIN:    ["live video", "transcoding", "adaptive bitrate",
                      "abr", "cdn", "low latency streaming"],
        W_SECONDARY: ["rtmp", "rtsp", "mpeg", "encoder",
                      "media server"],
    },
    # 59 - Media Pipeline
    59: {
        W_PRIMARY:   ["media pipeline", "media processing",
                      "video pipeline"],
        W_FRAMEWORK: ["ffmpeg", "gstreamer", "imagemagick",
                      "sharp", "pillow"],
        W_DOMAIN:    ["transcoding", "thumbnail", "watermark",
                      "media conversion", "asset management",
                      "dam", "media workflow"],
        W_SECONDARY: ["s3", "cloudfront", "minio", "object storage"],
    },
    # 60 - Social Media
    60: {
        W_PRIMARY:   ["social media", "social network",
                      "social platform"],
        W_DOMAIN:    ["feed", "timeline", "like", "comment",
                      "share", "follower", "notification",
                      "content moderation", "viral", "engagement"],
        W_SECONDARY: ["influencer", "hashtag", "story", "reel",
                      "algorithm"],
    },
    # 61 - MLOps
    61: {
        W_PRIMARY:   ["mlops", "ml ops", "model deployment",
                      "model serving"],
        W_FRAMEWORK: ["mlflow", "kubeflow", "sagemaker", "vertex ai",
                      "bentoml", "seldon", "triton"],
        W_DOMAIN:    ["model registry", "model monitoring",
                      "feature store", "a/b testing models",
                      "model versioning", "inference",
                      "model pipeline"],
        W_SECONDARY: ["docker", "kubernetes", "onnx", "tensorrt",
                      "batch inference"],
    },
    # 62 - Developer Relations
    62: {
        W_PRIMARY:   ["developer relations", "devrel",
                      "developer advocacy"],
        W_DOMAIN:    ["developer community", "sdk", "developer portal",
                      "api documentation", "hackathon", "conference",
                      "evangelism", "developer onboarding"],
        W_SECONDARY: ["blog", "tutorial", "demo", "sample code",
                      "workshop"],
    },
    # 63 - Compliance Governance
    63: {
        W_PRIMARY:   ["compliance", "governance", "regulatory"],
        W_DOMAIN:    ["gdpr", "sox", "hipaa", "pci", "iso",
                      "audit", "risk management", "data privacy",
                      "data protection", "policy"],
        W_SECONDARY: ["dpo", "consent", "retention", "encryption",
                      "access control"],
    },
    # 64 - Migration Modernization
    64: {
        W_PRIMARY:   ["migration", "modernization", "legacy",
                      "refactoring"],
        W_DOMAIN:    ["legacy system", "monolith to microservices",
                      "cloud migration", "database migration",
                      "replatforming", "lift and shift",
                      "strangler fig", "technical debt"],
        W_SECONDARY: ["cobol", "mainframe", "deprecated",
                      "backwards compatible", "cutover"],
    },
    # 65 - Prompt Engineering
    65: {
        W_PRIMARY:   ["prompt engineering", "prompt design"],
        W_FRAMEWORK: ["langchain", "dspy", "guidance", "promptflow"],
        W_DOMAIN:    ["prompt", "few-shot", "zero-shot",
                      "chain of thought", "cot", "system prompt",
                      "prompt template", "prompt optimization"],
        W_SECONDARY: ["llm", "gpt", "claude", "token",
                      "context window"],
    },
}

# Use W_INDUSTRY where defined (fintech, healthtech, etc.), otherwise it's
# not present and we skip it.  Some entries above use W_INDUSTRY directly in
# the raw dict -- we need a constant for that.
W_INDUSTRY = 8  # already defined above, repeated for clarity in raw dict

# ---------------------------------------------------------------------------
# Build the flat lookup:  keyword (lowercase) -> list of (team_num, weight)
# ---------------------------------------------------------------------------

_KEYWORD_MAP: Dict[str, List[Tuple[int, int]]] = {}

for _team_num, _weight_groups in _TEAM_KEYWORDS_RAW.items():
    for _weight, _keywords in _weight_groups.items():
        for _kw in _keywords:
            _kw_lower = _kw.lower()
            if _kw_lower not in _KEYWORD_MAP:
                _KEYWORD_MAP[_kw_lower] = []
            _KEYWORD_MAP[_kw_lower].append((_team_num, _weight))

# ---------------------------------------------------------------------------
# Strategy parser
# ---------------------------------------------------------------------------

def _extract_project_name(text: str) -> str:
    """Try to pull a project name from a strategy file."""
    # Look for # Project: Name  or  # Name  as first heading
    m = re.search(r"#\s+(?:Project\s*:\s*)?(.+)", text)
    if m:
        name = m.group(1).strip().rstrip("#").strip()
        if len(name) < 80:
            return name
    return "Untitled Strategy"


def _tokenize_for_matching(text: str) -> str:
    """Lowercase the text and normalise whitespace for matching."""
    text = text.lower()
    # Keep hyphens, slashes, dots, hashes -- they matter in tech names
    text = re.sub(r"[^a-z0-9\s\-/.#+]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def detect_keywords(text: str) -> List[Tuple[str, int, int]]:
    """
    Scan *text* for known keywords.

    Returns a list of (keyword, team_num, weight) tuples -- one entry per
    keyword-team combination found.  Duplicate keywords are counted only once.
    """
    normalised = _tokenize_for_matching(text)
    found: List[Tuple[str, int, int]] = []
    seen_kw: Set[str] = set()

    # Sort keywords longest-first so "react native" matches before "react"
    sorted_keywords = sorted(_KEYWORD_MAP.keys(), key=len, reverse=True)

    for kw in sorted_keywords:
        if kw in seen_kw:
            continue

        # Word-boundary-aware search (handles hyphens, dots, etc.)
        pattern = r"(?<![a-z0-9\-])" + re.escape(kw) + r"(?![a-z0-9\-])"
        if re.search(pattern, normalised):
            seen_kw.add(kw)
            for team_num, weight in _KEYWORD_MAP[kw]:
                found.append((kw, team_num, weight))

            # If we matched a multi-word keyword, mark sub-keywords as seen
            # to avoid double-counting (e.g. "react native" -> skip "react")
            parts = kw.split()
            if len(parts) > 1:
                for part in parts:
                    if part in _KEYWORD_MAP:
                        seen_kw.add(part)

    return found


# ---------------------------------------------------------------------------
# Scoring engine
# ---------------------------------------------------------------------------

def score_teams(matches: List[Tuple[str, int, int]]) -> List[Dict[str, Any]]:
    """
    Aggregate keyword matches into per-team scores.

    Returns a sorted list (highest score first) of dicts:
        { "team_num", "folder", "alias", "score", "matched_keywords" }
    """
    scores: Dict[int, int] = {}
    team_kws: Dict[int, List[str]] = {}

    for kw, team_num, weight in matches:
        scores[team_num] = scores.get(team_num, 0) + weight
        if team_num not in team_kws:
            team_kws[team_num] = []
        if kw not in team_kws[team_num]:
            team_kws[team_num].append(kw)

    results = []
    for team_num, score in scores.items():
        folder, alias = TEAMS[team_num]
        results.append({
            "team_num": team_num,
            "folder": folder,
            "alias": alias,
            "score": score,
            "matched_keywords": team_kws[team_num],
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results


# ---------------------------------------------------------------------------
# Multi-team suggestion logic
# ---------------------------------------------------------------------------

# Support teams that pair well with primary engineering teams
_SUPPORT_TEAMS: Set[int] = {
    13, 14, 17, 28, 29, 34, 35, 36, 37, 50, 51, 61, 62, 63, 64, 65,
}


def suggest_multi_team(
    ranked: List[Dict[str, Any]], top_n: int = 5
) -> Optional[Dict[str, Any]]:
    """
    If the top result is not itself a support team, find the highest-ranked
    support team to pair with it.
    """
    if not ranked:
        return None

    primary = ranked[0]
    if primary["team_num"] in _SUPPORT_TEAMS:
        return None  # Primary is itself a support team; skip suggestion

    for r in ranked[1:top_n + 3]:
        if r["team_num"] in _SUPPORT_TEAMS:
            return {
                "primary": primary,
                "support": r,
            }
    return None


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

def _keyword_summary(keywords: List[str], max_display: int = 5) -> str:
    """Format keywords for display, truncating if too many."""
    display = keywords[:max_display]
    s = ", ".join(display)
    if len(keywords) > max_display:
        s += f", +{len(keywords) - max_display} more"
    return s


def print_terminal_report(
    project_name: str,
    detected: List[str],
    ranked: List[Dict[str, Any]],
    top_n: int,
    multi: Optional[Dict[str, Any]],
) -> None:
    """Pretty-print the recommendation to the terminal with ANSI colours."""
    print()
    print(f"  {C.BG_BLUE}{C.WHITE}{C.BOLD} AMENTHYX TEAM RECOMMENDER {C.RESET}")
    print()

    # Strategy header
    print(f"  {C.BOLD}Strategy Analysis:{C.RESET} {C.CYAN}\"{project_name}\"{C.RESET}")
    if detected:
        kw_str = ", ".join(detected[:15])
        if len(detected) > 15:
            kw_str += f" {C.DIM}(+{len(detected) - 15} more){C.RESET}"
        print(f"  {C.BOLD}Detected:{C.RESET} {C.YELLOW}{kw_str}{C.RESET}")
    else:
        print(f"  {C.RED}No known keywords detected.{C.RESET}")
    print()

    if not ranked:
        print(f"  {C.RED}No matching teams found. "
              f"Try a more detailed strategy file.{C.RESET}")
        print()
        return

    # Ranked results
    print(f"  {C.BOLD}Recommended Teams:{C.RESET}")
    display = ranked[:top_n]
    # Determine column widths
    max_folder = max(len(r["folder"]) for r in display)
    max_alias = max(len(r["alias"]) for r in display)

    for i, r in enumerate(display, 1):
        num_str = f"#{i}"
        folder_padded = r["folder"].ljust(max_folder)
        alias_padded = f"({r['alias']})".ljust(max_alias + 2)
        kw_display = _keyword_summary(r["matched_keywords"])
        score_color = C.GREEN if i == 1 else (C.YELLOW if i == 2 else C.CYAN)
        print(
            f"    {C.BOLD}{num_str:>3}{C.RESET}  "
            f"{C.BLUE}{folder_padded}{C.RESET} "
            f"{C.DIM}{alias_padded}{C.RESET} "
            f"— Score: {score_color}{r['score']:>3}{C.RESET}  "
            f"{C.DIM}[{kw_display}]{C.RESET}"
        )
    print()

    # Multi-team suggestion
    if multi:
        p = multi["primary"]
        s = multi["support"]
        print(f"  {C.BOLD}Multi-Team Suggestion:{C.RESET}")
        print(
            f"    Primary: {C.GREEN}{p['folder']}{C.RESET} "
            f"| Support: {C.MAGENTA}{s['folder']}{C.RESET}"
        )
        print()


def build_json_report(
    project_name: str,
    detected: List[str],
    ranked: List[Dict[str, Any]],
    top_n: int,
    multi: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Build a JSON-serialisable report dict."""
    result: Dict[str, Any] = {
        "project_name": project_name,
        "detected_keywords": detected,
        "recommended_teams": [],
        "multi_team_suggestion": None,
    }

    for r in ranked[:top_n]:
        result["recommended_teams"].append({
            "rank": ranked.index(r) + 1,
            "team_num": r["team_num"],
            "folder": r["folder"],
            "alias": r["alias"],
            "score": r["score"],
            "matched_keywords": r["matched_keywords"],
        })

    if multi:
        result["multi_team_suggestion"] = {
            "primary": {
                "folder": multi["primary"]["folder"],
                "alias": multi["primary"]["alias"],
            },
            "support": {
                "folder": multi["support"]["folder"],
                "alias": multi["support"]["alias"],
            },
        }

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def recommend(strategy_path: str, top_n: int = 3) -> Tuple[
    str, List[str], List[Dict[str, Any]], Optional[Dict[str, Any]]
]:
    """
    Core recommendation function.  Returns:
        (project_name, unique_detected_keywords, ranked_teams, multi_team_suggestion)
    """
    if not os.path.isfile(strategy_path):
        raise FileNotFoundError(f"Strategy file not found: {strategy_path}")

    with open(strategy_path, "r", encoding="utf-8", errors="replace") as f:
        text = f.read()

    if not text.strip():
        raise ValueError("Strategy file is empty.")

    project_name = _extract_project_name(text)
    matches = detect_keywords(text)

    # Unique detected keywords (preserving first-seen order)
    seen: Set[str] = set()
    detected: List[str] = []
    for kw, _, _ in matches:
        if kw not in seen:
            seen.add(kw)
            detected.append(kw)

    ranked = score_teams(matches)
    multi = suggest_multi_team(ranked, top_n)

    return project_name, detected, ranked, multi


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="team_recommender",
        description="Amenthyx AI Teams -- Recommend the best team(s) for a strategy.",
        epilog="Example: python team_recommender.py strategy.md --top 5 --json",
    )
    parser.add_argument(
        "strategy",
        help="Path to the strategy.md file to analyse.",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=3,
        metavar="N",
        help="Number of teams to recommend (default: 3).",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Output results as JSON instead of formatted text.",
    )

    args = parser.parse_args()

    if args.top < 1:
        parser.error("--top must be at least 1.")
    if args.top > 65:
        args.top = 65

    try:
        project_name, detected, ranked, multi = recommend(
            args.strategy, top_n=args.top
        )
    except FileNotFoundError as e:
        print(f"{C.RED}Error: {e}{C.RESET}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"{C.RED}Error: {e}{C.RESET}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"{C.RED}Unexpected error: {e}{C.RESET}", file=sys.stderr)
        sys.exit(2)

    if args.json_output:
        report = build_json_report(
            project_name, detected, ranked, args.top, multi
        )
        print(json.dumps(report, indent=2))
    else:
        print_terminal_report(
            project_name, detected, ranked, args.top, multi
        )


if __name__ == "__main__":
    main()
