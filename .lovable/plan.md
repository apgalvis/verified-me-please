

# Plan: "Mi Cuenta" with OTP Verification Flow

## Overview
Build the complete "Mi Cuenta" page and reusable OTP verification modal, matching the uploaded reference images from Propiedades.com. This is a front-end prototype with mock data (no backend).

## Color Palette (from references)
- Header gradient: teal/dark-green (`#0d6e6e` to `#1a3c34`)
- Primary accent: teal `#0d9488`
- Verified: green, Pending: amber, Not verified: red
- "Confirmar" CTA: teal/green, "Modificar": gray link

## Files to Create/Modify

### 1. `src/index.css` — Add teal-based brand colors
- Override `--primary` to teal hue
- Add custom CSS variable for the header gradient

### 2. `src/types/account.ts` — Types
- `VerificationStatus`: `'verified' | 'pending' | 'not_verified'`
- `ContactField`: `{ label, value, type: 'email'|'phone'|'whatsapp', status }`

### 3. `src/components/account/AccountHeader.tsx`
- Teal gradient banner with "Mi cuenta" title and subtitle
- Matches the dark gradient header in reference image 1

### 4. `src/components/account/UserAvatar.tsx`
- Circular avatar with initial letter, teal background
- "Editar" button below

### 5. `src/components/account/ContactFieldCard.tsx`
- Renders a single field row: label, value, status badge, and CTAs
- "Confirmar" (teal, when not verified) + "Modificar" (gray link)
- Status badges: colored dots with text

### 6. `src/components/account/OtpVerificationModal.tsx`
- Uses `Dialog` + existing `InputOTP` component
- Props: `type ('email'|'phone'|'whatsapp')`, `destination (string)`, `open`, `onClose`, `onVerified`
- Dynamic description: "Ingresa el código de 6 dígitos que enviamos a {destination}"
- 6-digit OTP input with auto-focus, paste support
- "Verificar código" button — disabled until 6 digits, shows loading state
- Countdown timer "Reenviar código en **59s**" → becomes clickable link
- "Regresar" link at top-left
- Error/success/expired states with appropriate messaging
- Mock verification: code "123456" succeeds, others fail

### 7. `src/components/account/OtpCountdown.tsx`
- Reusable 60s countdown hook + display
- Shows "Reenviar código en **Xs**" or clickable "Reenviar código"

### 8. `src/pages/MiCuenta.tsx`
- Composes all account components
- Mock user data with mixed verification statuses
- Manages OTP modal open/close state and field selection
- Two sections: "Información de usuario" and "Información de contacto"

### 9. `src/pages/Index.tsx` — Redirect to MiCuenta
- Replace placeholder with `<MiCuenta />`

### 10. `src/App.tsx` — Add route
- Add `/mi-cuenta` route

## Key Interactions
- Click "Confirmar" → opens OTP modal for that field
- Click "Modificar" on verified field → inline edit → triggers OTP on save
- OTP success → toast notification, modal closes, status updates to verified
- OTP error → shake animation, inline error message
- Countdown reaches 0 → "Reenviar código" becomes active

