# Security

Only official development interfaces are in scope. Keep Device Portal and remote debugging on a trusted local network; do not expose credentials or activation codes in logs. Review and redact artifacts before publication.

Run npm audit --audit-level=high and update the lockfile with reviewed dependency changes. The static site uses no account, telemetry, tracking or user-submitted HTML. Search renders text with DOM textContent. External new-tab source links use noopener noreferrer. CI runs with read-only repository permissions.

Do not post sensitive vulnerability details publicly. Until a public maintainer contact is configured, use the private channel through which the source was supplied. Do not claim a monitored security mailbox exists.
