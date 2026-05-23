# CATETIN AI — PROJECT GUIDE

## Project Overview

Catetin AI is a modern AI-powered financial assistant platform for Indonesian UMKM (small businesses).
The application helps UMKM owners record transactions using natural language text or voice input.

Example:

* "jual nasi goreng 3 porsi 60 ribu"
* "beli gas 22 ribu"
* "bayar listrik 150 ribu"

The AI assistant converts these inputs into structured transaction data automatically and stores them into the database in real-time.

The main goal is to simplify financial tracking for non-technical UMKM owners who are unfamiliar with accounting applications.

---

# Core Concept

The AI assistant is the main interaction layer of the application.

This is NOT a traditional accounting dashboard.

Users should feel like they are chatting with a smart business assistant.

The dashboard automatically updates after every AI interaction.

---

# Main Features

## 1. AI Transaction Assistant

Users can:

* Type transaction prompts
* Use voice input
* Send casual Indonesian language
* Use slang or imperfect wording

Examples:

* "jual kopi 50rb"
* "beli telur dua puluh ribu"
* "jual ayam geprek 2 porsi 40 ribu"

The AI should intelligently extract:

* transaction type
* item name
* quantity
* amount
* category
* timestamp

---

## 2. Realtime Dashboard

Dashboard updates instantly after transactions are added.

Display:

* total income
* total expense
* total profit
* recent transactions
* weekly chart
* monthly summary

---

## 3. AI Insights

AI generates simple business insights automatically.

Examples:

* "Penjualan tertinggi terjadi hari Jumat."
* "Pengeluaran terbesar berasal dari bahan baku."
* "Produk paling laku minggu ini adalah kopi susu."

Insights should use simple Indonesian language.

---

## 4. Voice Input

Users can record voice instead of typing.

Voice input should feel fast and easy for mobile users.

---

# Design Direction

## Style

Modern SaaS dashboard.

Design inspiration:

* Linear
* Stripe
* Notion
* Vercel

UI must feel:

* clean
* modern
* premium
* minimal
* soft
* elegant

---

# Mobile First Design

IMPORTANT:

The application MUST be designed mobile-first.

Most UMKM users use smartphones instead of laptops.

Primary target widths:

* 390px
* 414px
* tablet responsive

Desktop is secondary.

---

# Layout Structure

## Mobile Layout

### Header

Contains:

* greeting
* profile avatar
* dark/light toggle

---

### Dashboard Cards

Show:

* pendapatan
* pengeluaran
* profit

Cards should have:

* rounded corners
* soft borders
* modern spacing

---

### Transaction Section

Display latest transactions in clean cards.

Avoid complex tables on mobile.

---

### Floating AI Assistant

A floating AI button should appear at the bottom-right corner.

When clicked:

* open expandable AI chat panel
* allow text input
* allow voice input

This assistant is the core feature of the product.

---

# Floating AI Assistant Rules

The AI assistant should feel:

* smart
* friendly
* fast
* conversational

Avoid robotic interaction.

Example interaction:

User:
"jual nasi goreng 3 porsi 60 ribu"

AI:
"✅ Transaksi berhasil dicatat"

The assistant should support:

* typo tolerance
* Indonesian slang
* casual conversation

---

# Dark Mode & Light Mode

The app MUST support both:

* dark mode
* light mode

Default theme:
Dark mode.

Dark mode should feel premium and modern.

Use:

* zinc/slate neutral colors
* smooth contrast
* minimal bright colors

---

# Color Palette

## Dark Mode

Background:

* zinc-950
* zinc-900

Card:

* zinc-900
* zinc-800

Text:

* white
* zinc-400

Accent:

* emerald
* blue
* violet

---

## Light Mode

Background:

* white
* zinc-100

Card:

* white
* zinc-50

Text:

* zinc-900
* zinc-600

---

# Tech Stack

Frontend:

* Next.js (App Router)
* Tailwind CSS v4
* shadcn/ui

Backend:

* Supabase

AI:

* Gemini API

Icons:

* lucide-react

Notification:

* sonner

---

# Realtime System

Flow:

User Input
↓
Gemini AI Parsing
↓
JSON Structured Data
↓
Supabase Database
↓
Realtime Dashboard Update

---

# AI Output Format

Example:

{
"type": "income",
"item": "nasi goreng",
"qty": 3,
"amount": 60000,
"category": "food"
}

---

# UX Rules

IMPORTANT:

* Avoid complicated accounting terms
* Avoid crowded UI
* Keep interaction simple
* Prioritize usability over feature overload
* Focus on speed and clarity

The app should feel usable even for non-technical users.

---

# Branding

Application Name:
Catetin AI

Tagline:
"Smart Finance Assistant for UMKM"

Brand personality:

* modern
* helpful
* intelligent
* simple
* approachable

---

# Future Features (Optional)

* WhatsApp integration
* Export PDF reports
* Multi-language support
* Stock management
* AI business recommendations
* Expense prediction
* Smart reminders

---

# Main Goal

Build a real-world AI-powered financial assistant that helps Indonesian UMKM owners manage their business finances easily using natural language interaction.
