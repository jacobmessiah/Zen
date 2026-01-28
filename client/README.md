## Note on GIF Integration

- **Tenor API**: Discontinued by Google as of June 30, 2026
- **GIPHY API**: Currently using free tier (100 requests/hour)
- For production use, would implement:
  - Redis caching layer
  - Production API key with higher limits
  - Pre-fetching of popular search terms