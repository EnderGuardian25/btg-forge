# Spec delta — 003-health

> Delta against current truth in `.forge/specs/`. Only describe what CHANGES.

## ADDED Requirements
### R-1: Health endpoint
- **Given** the service is running
- **When** a client sends `GET /health`
- **Then** the response is HTTP `200` with JSON body `{"status":"ok"}`

## MODIFIED Requirements
<!-- none -->

## REMOVED Requirements
<!-- none -->
