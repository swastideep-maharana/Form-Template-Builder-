# Form Template Builder

## Overview

A React + TypeScript app for building and rendering customizable form templates. Features include:

- Template builder with sections and fields
- Real-time preview
- Drag-and-drop field arrangement
- LocalStorage persistence
- Dynamic form rendering and validation

## Tech Stack

- React + TypeScript
- (Planned) Tailwind CSS (see troubleshooting below)
- LocalStorage API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Tailwind CSS Troubleshooting

If you encounter issues with `npx tailwindcss init -p` not being recognized:

- Try installing globally: `npm install -g tailwindcss`
- Ensure your PATH includes npm global binaries
- Try running from a new terminal as Administrator
- If all else fails, use standard CSS modules until resolved

## Project Structure

- `src/components/TemplateBuilder.tsx` – Template builder UI
- `src/components/FormRenderer.tsx` – Dynamic form renderer
- `src/components/PreviewPane.tsx` – Real-time preview

## Assignment Features

- Up to 5 templates, each with sections and fields
- Field types: Label (H1/H2/H3), Text, Number, Boolean, Enum
- Basic validation
- Drag-and-drop within sections
- Save/load templates and form data from localStorage

## Demo Video

(Include your demo video link here)

## Collaborators

Add the following GitHub users as collaborators:

- Joybaruah
- aravind08
- HackX-IN
- Dhanush1357

---

**Fun Fact:** The fear of long words is called hippopotomonstrosesquipedaliophobia.
"# Form-Template-Builder-" 
