# Custom Domain Setup Guide

This guide explains how to connect the custom domain **myrepubicnetwork.web.id** (and **www.myrepubicnetwork.web.id**) to your Internet Computer (IC) frontend canister.

## Overview

Your application is deployed on the Internet Computer and can be accessed via:
- **Default IC URL**: `https://<canister-id>.icp0.io` or `https://<canister-id>.raw.icp0.io`
- **Custom Domain (www)**: `https://www.myrepubicnetwork.web.id` (after DNS configuration and registration)
- **Custom Domain (apex)**: `https://myrepubicnetwork.web.id` (after DNS configuration and registration)

## Prerequisites

Before starting, you need:
1. Your frontend canister ID (find it by running `dfx canister id frontend` or checking `canister_ids.json`)
2. Access to your DNS provider (Cloudflare, DomaiNesia, etc.)
3. Terminal access to run curl commands for domain registration

## Step 1: Add Domains to IC Allowlist

The IC gateway requires domains to be explicitly allowed in your canister's assets.

### 1.1 Verify ic-domains File

Ensure the file `frontend/public/.well-known/ic-domains` exists and contains:

