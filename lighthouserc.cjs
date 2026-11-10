/** Local LHCI only: static dist, 3 runs, filesystem reports. No LHCI server. */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "dist",
      url: [
        "http://localhost/",
        "http://localhost/docs/",
        "http://localhost/experiments/",
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "quality/lighthouse",
    },
  },
};
