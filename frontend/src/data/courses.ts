import type { Course, CourseModule } from "@/types";

/* ------------------------------------------------------------------ *
 * Compact builders. A section given as a plain string is a reading
 * section; a [title, questions] tuple is an interactive section.
 * ------------------------------------------------------------------ */

type QuestionSpec = [prompt: string, answer: string, hint: string];
type SectionSpec = string | [title: string, questions: QuestionSpec[]];
interface ModuleSpec {
  title: string;
  sections: SectionSpec[];
}
type CourseSpec = Omit<Course, "modules"> & { modules: ModuleSpec[] };

const m = (title: string, ...sections: SectionSpec[]): ModuleSpec => ({ title, sections });

function buildCourse(spec: CourseSpec): Course {
  const modules: CourseModule[] = spec.modules.map((mod, mi) => {
    const moduleId = `${spec.id}-m${mi + 1}`;
    return {
      id: moduleId,
      title: mod.title,
      sections: mod.sections.map((s, si) => {
        const sectionId = `${moduleId}-s${si + 1}`;
        const [title, questions] = typeof s === "string" ? [s, []] : s;
        return {
          id: sectionId,
          title,
          type: questions.length ? "interactive" : "reading",
          minutes: questions.length ? 30 : 15,
          questions: questions.map(([prompt, answer, hint], qi) => ({
            id: `${sectionId}-q${qi + 1}`,
            prompt,
            answer,
            hint,
            points: 10,
          })),
        };
      }),
    };
  });
  return { ...spec, modules };
}

/* ------------------------------------------------------------------ */

const specs: CourseSpec[] = [
  {
    id: "c-owasp",
    slug: "owasp-top-10-hands-on",
    title: "OWASP Top 10: Hands-On Exploitation",
    description:
      "Exploit and remediate the most critical web application risks — broken access control, injection, SSRF and more — against realistic targets.",
    category: "web-security",
    domain: "Offensive",
    level: "Intermediate",
    tier: 2,
    instructor: "Rohan Kapoor",
    durationHours: 14,
    rating: 4.9,
    students: 12840,
    tags: ["OWASP", "Burp Suite", "SSRF", "IDOR"],
    modules: [
      m(
        "Broken Access Control & IDOR",
        "Access control models",
        ["Finding IDOR vulnerabilities", [["Which HTTP status code typically indicates 'Forbidden'?", "403", "It sits between 401 and 404."]]],
        ["Privilege escalation via parameters", [["What is the common name for changing a request field like role=admin to escalate privileges?", "mass assignment", "Two words — frameworks bind request fields to objects automatically."]]],
      ),
      m(
        "Injection Attacks",
        "Injection fundamentals",
        ["Command injection", [["Which shell character runs a second command regardless of the first one's result?", ";", "A single punctuation character."]]],
        ["Server-side template injection", [["What does {{7*7}} render to on a vulnerable Jinja2 template?", "49", "Do the maths."]]],
      ),
      m("Cryptographic Failures", "Weak hashing & storage", "TLS misconfiguration"),
      m(
        "Server-Side Request Forgery",
        "SSRF fundamentals",
        ["SSRF via URL parsers", [["What IP address serves the cloud instance metadata service on AWS?", "169.254.169.254", "A link-local address starting with 169.254."]]],
        "Blind SSRF to internal metadata",
      ),
      m("Security Misconfiguration", "Default credentials & debug pages", "Hardening checklists"),
    ],
    assessment: {
      title: "Skills Assessment — Vulnerable Bookstore",
      description: "Chain an IDOR, an SSRF and an injection flaw to compromise a realistic e-commerce application, then write up remediation.",
    },
    cheatSheet: [
      { description: "Directory brute force", command: "ffuf -w wordlist.txt -u https://target/FUZZ" },
      { description: "Probe for SSTI", command: "{{7*7}}  ${7*7}  <%= 7*7 %>" },
      { description: "AWS metadata via SSRF", command: "http://169.254.169.254/latest/meta-data/iam/security-credentials/" },
      { description: "Command injection probe", command: "; id  |  && whoami  |  `id`" },
    ],
    progress: 82,
    lastAccessed: "2 hours ago",
  },
  {
    id: "c-sqli",
    slug: "sql-injection-deep-dive",
    title: "SQL Injection Deep Dive",
    description:
      "From classic UNION-based payloads to blind, time-based and second-order injection. Learn to detect, exploit and fix SQLi properly.",
    category: "web-security",
    domain: "Offensive",
    level: "Beginner",
    tier: 0,
    instructor: "Kabir Rao",
    durationHours: 6,
    rating: 4.8,
    students: 18320,
    tags: ["SQLi", "sqlmap", "Databases"],
    modules: [
      m("How SQL Injection Works", "Relational databases refresher", "Anatomy of an injection"),
      m(
        "UNION & Error-Based SQLi",
        ["Finding the column count", [["Which SQL clause is commonly incremented to discover the number of columns?", "ORDER BY", "Two words used for sorting."]]],
        ["Extracting data with UNION", [["Which MySQL schema lists every table on the server?", "information_schema", "A metadata schema present in every MySQL install."]]],
      ),
      m(
        "Blind & Time-Based SQLi",
        "Boolean-based inference",
        ["Time-based payloads", [["Which MySQL function pauses execution for N seconds?", "SLEEP", "Five letters."]]],
      ),
      m("Prevention", "Parameterised queries", "Least-privilege database accounts"),
    ],
    assessment: {
      title: "Skills Assessment — Employee Portal",
      description: "Use blind SQL injection to extract the administrator's password hash from a hardened login form.",
    },
    cheatSheet: [
      { description: "Detect column count", command: "' ORDER BY 3-- -" },
      { description: "UNION extraction", command: "' UNION SELECT 1,table_name,3 FROM information_schema.tables-- -" },
      { description: "Time-based check", command: "' AND SLEEP(5)-- -" },
      { description: "Automate with sqlmap", command: "sqlmap -u 'https://target/item?id=1' --batch --dbs" },
    ],
    progress: 100,
    lastAccessed: "1 week ago",
  },
  {
    id: "c-netfund",
    slug: "network-security-fundamentals",
    title: "Network Security Fundamentals",
    description: "TCP/IP, subnetting, firewalls and common network attacks. The foundation every security professional needs.",
    category: "network-security",
    domain: "General",
    level: "Beginner",
    tier: 0,
    instructor: "Priya Nair",
    durationHours: 8,
    rating: 4.7,
    students: 21450,
    tags: ["TCP/IP", "Firewalls", "Nmap"],
    modules: [
      m("OSI & TCP/IP Models", "The OSI model", ["TCP vs UDP", [["How many packets make up a TCP three-way handshake?", "3", "It's in the name."]]]),
      m(
        "Scanning with Nmap",
        "Host discovery",
        ["Port scanning techniques", [["Which Nmap flag performs a TCP SYN scan?", "-sS", "Dash, lowercase s, uppercase S."]]],
        "Service & version detection",
      ),
      m("Firewalls & Segmentation", "Stateful vs stateless firewalls", "Network segmentation design"),
      m("Common Network Attacks", "ARP spoofing", "DNS attacks"),
    ],
    assessment: {
      title: "Skills Assessment — Corporate Network Review",
      description: "Map a small corporate network, identify exposed services and recommend firewall rules.",
    },
    cheatSheet: [
      { description: "Ping sweep", command: "nmap -sn 10.10.10.0/24" },
      { description: "SYN scan top ports", command: "sudo nmap -sS --top-ports 1000 10.10.10.5" },
      { description: "Version + default scripts", command: "nmap -sV -sC -p 22,80,443 10.10.10.5" },
      { description: "Full TCP range", command: "nmap -p- --min-rate 2000 10.10.10.5" },
    ],
    progress: 100,
    lastAccessed: "3 weeks ago",
  },
  {
    id: "c-wireshark",
    slug: "packet-analysis-with-wireshark",
    title: "Packet Analysis with Wireshark",
    description:
      "Capture, filter and dissect network traffic to spot reconnaissance, credential leaks and malicious command-and-control beacons.",
    category: "network-security",
    domain: "Defensive",
    level: "Intermediate",
    tier: 1,
    instructor: "Priya Nair",
    durationHours: 7,
    rating: 4.8,
    students: 9630,
    tags: ["Wireshark", "PCAP", "Traffic Analysis"],
    modules: [
      m(
        "Capture & Display Filters",
        "Capturing traffic",
        ["Display filters", [["Write a display filter that shows only HTTP traffic.", "http", "Just the protocol name."]]],
      ),
      m(
        "Protocol Dissection",
        ["Following TCP streams", [["What is the default keyboard shortcut to follow a TCP stream in Wireshark?", "ctrl+alt+shift+t", "Four keys, ending in T."]]],
        "DNS & HTTP analysis",
      ),
      m("Hunting Malicious Traffic", "Spotting port scans", "Detecting C2 beacons"),
    ],
    assessment: {
      title: "Skills Assessment — Incident PCAP",
      description: "Analyse a packet capture from a compromised workstation and reconstruct the attacker's actions.",
    },
    cheatSheet: [
      { description: "Only HTTP requests", command: "http.request" },
      { description: "Traffic to/from a host", command: "ip.addr == 10.0.0.5" },
      { description: "SYN packets (scans)", command: "tcp.flags.syn == 1 && tcp.flags.ack == 0" },
      { description: "DNS queries for a domain", command: 'dns.qry.name contains "example"' },
    ],
    progress: 45,
    lastAccessed: "Yesterday",
  },
  {
    id: "c-aws",
    slug: "aws-cloud-security-essentials",
    title: "AWS Cloud Security Essentials",
    description: "Secure IAM, S3, VPCs and logging in AWS. Find and fix the misconfigurations attackers abuse most often.",
    category: "cloud-security",
    domain: "Defensive",
    level: "Intermediate",
    tier: 2,
    instructor: "Daniel Brooks",
    durationHours: 10,
    rating: 4.8,
    students: 11210,
    tags: ["AWS", "IAM", "S3", "CloudTrail"],
    modules: [
      m(
        "Shared Responsibility & IAM",
        "The shared responsibility model",
        ["IAM policy evaluation logic", [["In IAM, which wins: an explicit Allow or an explicit Deny?", "deny", "AWS always errs on the side of caution."]]],
      ),
      m("S3 Bucket Security", "Bucket policies & ACLs", ["Finding public buckets", [["Which AWS CLI flag makes an unauthenticated request?", "--no-sign-request", "Starts with --no-."]]]),
      m("VPC & Network Controls", "Security groups vs NACLs", "VPC flow logs"),
      m("Logging & Detection", "CloudTrail", "GuardDuty findings"),
    ],
    assessment: {
      title: "Skills Assessment — Misconfigured Startup",
      description: "Audit an AWS account, find the path from a public bucket to admin, and fix every finding.",
    },
    cheatSheet: [
      { description: "Who am I?", command: "aws sts get-caller-identity" },
      { description: "List bucket anonymously", command: "aws s3 ls s3://bucket-name --no-sign-request" },
      { description: "Attached user policies", command: "aws iam list-attached-user-policies --user-name alice" },
      { description: "Recent CloudTrail events", command: "aws cloudtrail lookup-events --max-results 20" },
    ],
    progress: 28,
    lastAccessed: "3 days ago",
  },
  {
    id: "c-k8s",
    slug: "kubernetes-security-hardening",
    title: "Kubernetes Security Hardening",
    description: "Lock down clusters with RBAC, network policies, pod security standards and supply-chain controls.",
    category: "cloud-security",
    domain: "Defensive",
    level: "Advanced",
    tier: 3,
    instructor: "Daniel Brooks",
    durationHours: 12,
    rating: 4.7,
    students: 5480,
    tags: ["Kubernetes", "RBAC", "Containers"],
    modules: [
      m("Cluster Attack Surface", "Kubernetes architecture", "Common cluster attacks"),
      m("RBAC & Service Accounts", ["Roles and bindings", [["Which kubectl command checks whether you can perform an action?", "kubectl auth can-i", "Three words after kubectl."]]], "Service account tokens"),
      m("Network Policies", "Default-deny policies", "Namespace isolation"),
      m("Pod Security", "Pod Security Standards", "Image scanning"),
    ],
    assessment: {
      title: "Skills Assessment — Harden the Cluster",
      description: "Take an over-privileged cluster and bring it in line with the restricted Pod Security Standard.",
    },
    cheatSheet: [
      { description: "Check permissions", command: "kubectl auth can-i --list" },
      { description: "List service accounts", command: "kubectl get sa -A" },
      { description: "Privileged pods", command: "kubectl get pods -A -o jsonpath='{..securityContext.privileged}'" },
    ],
    isNew: true,
  },
  {
    id: "c-ad",
    slug: "active-directory-attacks",
    title: "Active Directory Attacks",
    description:
      "Enumerate and compromise Windows domains: Kerberoasting, AS-REP roasting, pass-the-hash and ACL abuse — plus how defenders detect them.",
    category: "red-team",
    domain: "Offensive",
    level: "Advanced",
    tier: 3,
    instructor: "Kabir Rao",
    durationHours: 16,
    rating: 4.9,
    students: 8760,
    tags: ["Active Directory", "Kerberos", "BloodHound"],
    modules: [
      m(
        "AD Enumeration",
        "Active Directory primer",
        ["Enumerating with BloodHound", [["Which graph database does BloodHound use?", "neo4j", "Starts with 'neo'."]]],
        "LDAP enumeration",
      ),
      m(
        "Kerberos Attacks",
        "How Kerberos works",
        ["Kerberoasting service accounts", [["Which hashcat mode cracks Kerberos 5 TGS-REP (etype 23) hashes?", "13100", "A five-digit number starting with 131."]]],
        ["AS-REP roasting", [["Which account setting makes a user vulnerable to AS-REP roasting?", "do not require kerberos preauthentication", "The setting disables pre-authentication."]]],
      ),
      m("Lateral Movement", "Pass-the-hash", "Remote execution techniques"),
      m("Domain Dominance", "DCSync", "Golden tickets"),
    ],
    assessment: {
      title: "Skills Assessment — Inlanefreight Domain",
      description: "Start from a low-privileged user and reach Domain Admin, documenting every step and detection opportunity.",
    },
    cheatSheet: [
      { description: "Collect BloodHound data", command: "bloodhound-python -d corp.local -u user -p pass -c All" },
      { description: "Kerberoast", command: "GetUserSPNs.py corp.local/user:pass -request" },
      { description: "AS-REP roast", command: "GetNPUsers.py corp.local/ -usersfile users.txt -no-pass" },
      { description: "Crack TGS hashes", command: "hashcat -m 13100 hashes.txt rockyou.txt" },
    ],
    progress: 64,
    lastAccessed: "5 hours ago",
  },
  {
    id: "c-mitre",
    slug: "adversary-emulation-mitre-attack",
    title: "Adversary Emulation with MITRE ATT&CK",
    description: "Plan and run threat-informed red team engagements mapped to MITRE ATT&CK techniques.",
    category: "red-team",
    domain: "Offensive",
    level: "Advanced",
    tier: 4,
    instructor: "Elena Petrova",
    durationHours: 11,
    rating: 4.8,
    students: 4310,
    tags: ["MITRE ATT&CK", "Red Teaming", "TTPs"],
    modules: [
      m("Threat Intel to TTPs", ["Reading ATT&CK", [["What is the ATT&CK technique ID for Phishing?", "T1566", "Starts with T15."]]], "Building a threat profile"),
      m("Engagement Planning", "Rules of engagement", "Success criteria"),
      m("Emulating an APT", "Initial access", "Persistence & exfiltration"),
      m("Reporting & Purple Teaming", "Writing the report", "Running a purple team exercise"),
    ],
    assessment: {
      title: "Skills Assessment — Emulation Plan",
      description: "Produce a full emulation plan for a named threat group and execute it against a lab environment.",
    },
    cheatSheet: [],
  },
  {
    id: "c-soc",
    slug: "soc-analyst-level-1",
    title: "SOC Analyst Level 1",
    description: "Triage alerts, investigate incidents and work a SIEM like a Tier-1 analyst in a modern Security Operations Center.",
    category: "blue-team",
    domain: "Defensive",
    level: "Beginner",
    tier: 0,
    instructor: "Marcus Lee",
    durationHours: 9,
    rating: 4.8,
    students: 15870,
    tags: ["SIEM", "Alert Triage", "Incident Response"],
    modules: [
      m("Inside the SOC", "SOC roles & tiers", "The incident lifecycle"),
      m("SIEM Fundamentals", ["Searching logs", [["Which Windows Event ID records a successful logon?", "4624", "Four digits starting with 46."]]], "Building dashboards"),
      m("Alert Triage Workflow", "True vs false positives", "Escalation"),
      m("Phishing Analysis", ["Email header analysis", [["Which email header shows the path a message took between servers?", "received", "It appears once per hop."]]], "Sandboxing attachments"),
    ],
    assessment: {
      title: "Skills Assessment — Night Shift",
      description: "Work a queue of 20 alerts, triage each correctly and escalate the real incident.",
    },
    cheatSheet: [
      { description: "Successful logons (Splunk)", command: "index=wineventlog EventCode=4624" },
      { description: "Failed logons by source", command: "index=wineventlog EventCode=4625 | stats count by src_ip" },
      { description: "New services installed", command: "index=wineventlog EventCode=7045" },
    ],
    progress: 100,
    lastAccessed: "2 weeks ago",
  },
  {
    id: "c-sigma",
    slug: "detection-engineering-with-sigma",
    title: "Detection Engineering with Sigma",
    description: "Write, test and tune portable detection rules with Sigma, and convert them for Splunk, Elastic and Sentinel.",
    category: "blue-team",
    domain: "Defensive",
    level: "Intermediate",
    tier: 2,
    instructor: "Marcus Lee",
    durationHours: 8,
    rating: 4.7,
    students: 6020,
    tags: ["Sigma", "Detection", "Splunk", "Elastic"],
    modules: [
      m("Detection Engineering Lifecycle", "From threat to detection", "Measuring coverage"),
      m("Writing Sigma Rules", ["Rule structure", [["Which top-level Sigma field defines the data source?", "logsource", "One word combining log and source."]]], "Conditions & modifiers"),
      m("Testing & Tuning", "Testing with sample data", "Reducing false positives"),
    ],
    assessment: {
      title: "Skills Assessment — Detection Pack",
      description: "Write five Sigma rules that detect a provided attack chain without firing on benign baseline data.",
    },
    cheatSheet: [
      { description: "Convert rule to Splunk", command: "sigma convert -t splunk -p sysmon rule.yml" },
      { description: "Validate rules", command: "sigma check rules/" },
    ],
    isNew: true,
  },
  {
    id: "c-winforensics",
    slug: "windows-forensics-incident-response",
    title: "Windows Forensics & Incident Response",
    description: "Collect and analyse Windows artefacts — registry, event logs, prefetch, LNK files — to reconstruct attacker activity.",
    category: "digital-forensics",
    domain: "Defensive",
    level: "Intermediate",
    tier: 2,
    instructor: "Elena Petrova",
    durationHours: 12,
    rating: 4.8,
    students: 7340,
    tags: ["DFIR", "Registry", "Event Logs"],
    modules: [
      m("Evidence Acquisition", "Order of volatility", "Building a forensic image"),
      m("Registry Analysis", ["Registry hives", [["Which registry hive stores per-user settings?", "NTUSER.DAT", "A .DAT file in each user's profile."]]], "Persistence keys"),
      m("Event Log Analysis", "Key Windows event IDs", "PowerShell logging"),
      m("Timeline Reconstruction", "Super-timelines", "Reporting findings"),
    ],
    assessment: {
      title: "Skills Assessment — Ransomware Patient Zero",
      description: "Identify how ransomware entered a workstation and build a minute-by-minute timeline.",
    },
    cheatSheet: [
      { description: "Parse event logs", command: "EvtxECmd.exe -d C:\\Windows\\System32\\winevt\\Logs --csv out" },
      { description: "Prefetch analysis", command: "PECmd.exe -d C:\\Windows\\Prefetch --csv out" },
      { description: "Registry run keys", command: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" },
    ],
    progress: 12,
    lastAccessed: "4 days ago",
  },
  {
    id: "c-volatility",
    slug: "memory-forensics-with-volatility",
    title: "Memory Forensics with Volatility",
    description:
      "Hunt malware and attacker tradecraft in RAM captures using Volatility 3 — processes, injections, network sockets and more.",
    category: "digital-forensics",
    domain: "Defensive",
    level: "Advanced",
    tier: 3,
    instructor: "Elena Petrova",
    durationHours: 9,
    rating: 4.9,
    students: 3980,
    tags: ["Volatility", "Memory", "Malware"],
    modules: [
      m("Memory Acquisition", "Why memory matters", "Acquisition tools"),
      m("Process Analysis", ["Listing processes", [["Which Volatility 3 plugin shows processes as a parent/child tree?", "windows.pstree", "windows.<something>tree"]]], "DLLs & handles"),
      m("Detecting Code Injection", "Injection techniques", "Using malfind"),
      m("Rootkits & Persistence", "Hidden processes", "Kernel callbacks"),
    ],
    assessment: {
      title: "Skills Assessment — Infected Memory Image",
      description: "Find the injected process, extract the payload and identify its C2 server from a memory dump.",
    },
    cheatSheet: [
      { description: "Process tree", command: "vol -f mem.raw windows.pstree" },
      { description: "Find injected code", command: "vol -f mem.raw windows.malfind" },
      { description: "Network connections", command: "vol -f mem.raw windows.netscan" },
    ],
    isNew: true,
  },
];

export const courses: Course[] = specs.map(buildCourse);

export function getCourseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id);
}
