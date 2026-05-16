# 🔒 Zameen Minti Project Lock

This project is locked as a SOFTWARE / WEBSITE project.

## Current locked base
- Version: v13
- Based on: v12 Module Dashboard
- Main file: index.html
- Style file: style.css
- Logic file: app.js

## Design direction
Professional white + green dashboard UI inspired by the provided reference screenshot:
- Clean top header
- Top client login/account bar
- Module dashboard
- Right-side Land Unit Reference cards
- Highlighted result cards
- Theka result partitions:
  - Green: Acre/Killa rate
  - Blue: Kanal values
  - Orange: Marla values
  - Purple: Main total annual theka
  - Green soft: installments/payments

## Important instruction for future updates
Do not generate images for this project unless specifically asked for a mockup.
Continue by editing the ZIP/software files and returning the updated ZIP.

## Active modules
- Dashboard
- ਜ਼ਮੀਨ ਦੀ ਮਿਣਤੀ
- ਠੇਕਾ ਤੇ ਜ਼ਮੀਨ
- Client login/signup demo
- Private saved chat demo
- Contact/WhatsApp share
- Reference panel
- Print/PDF result-only print

## Future modules
- ਜ਼ਮੀਨ Rate / Sale
- Report / Record
- Admin Panel
- Premium/Subscription
- Real backend database
- Live private chat
- Real analytics


## v14 GUI Direction
User-approved reference GUI implemented:
- White header style with green brand
- App-style navigation pills
- Theka result card matching reference layout
- Icons added with emoji-style symbols
- Main total annual theka highlighted in purple
- Kanal = blue identity, Marla = orange identity, Acre/Killa = green identity
- Payments = green section


## v15 Step 1 Core Modules Added
- ਜ਼ਮੀਨ Rate / Sale Calculator
- Registry Estimate Calculator
- Saved Reports History
- Owner Admin Dashboard stats
- GPS / Map Measurement placeholder


## v17 Owner Password Hidden
Public UI no longer shows default owner password. Continue future security upgrades with real admin authentication.


## v18 Admin Inbox Chat
Added owner admin inbox UI with client list, unread badge, owner reply, mark read and chat export. Static/localStorage demo only; real multi-client online chat requires backend database such as Supabase/Firebase.


## v19 Admin Login + Inbox Sync
Added admin login box and chat sync button. Client messages are mirrored to admin inbox in localStorage. Important: true cross-client persistent chat still needs backend database.


## v24 based on working v19
Base reset to v19 because v19 was confirmed working. Re-added post-v19 security items only: hashed local admin password, change password, admin logout, and Cloud Login/Supabase roadmap module. Module navigation from v19 was preserved.


## v25 Mobile App View
Added responsive mobile-app style layout: compact header, horizontal scroll nav, single-column modules, mobile result cards, collapsible reference panel, bottom mobile navigation, and full-screen mobile modals. Desktop layout preserved.


## v26 Owner/Client UI Separation
Internal modules/buttons such as Admin Inbox, Owner Settings and Cloud Login/Supabase Setup are hidden from normal client view. Added Owner Mode button protected by owner password. Improved desktop nav button sizing and fixed Client Account text overlap.


## v27 Account Overlap Fix
Fixed desktop Client Account text overlap with Login/Signup button by making account area a two-column grid with proper spacing and ellipsis fallback.


## v28 Real Map Polygon
Added free real map polygon measurement using Leaflet + OpenStreetMap. User can click land corners, polygon draws automatically, and area converts to sq ft, marla, kanal, acre/killa, vishve. Google Maps can be added later with an API key, but OSM works free.


## v29 Map Search + Distance
Added place/area search using OpenStreetMap Nominatim, Area Mode vs Distance Mode, 2-point distance measurement in feet, meters, km, miles and karam. Users can search places like Google Maps style and then draw polygon or measure distance.


## v30 Live Map Suggestions
Added Google Maps-style live place suggestions while typing, recent searches, keyboard navigation, spelling/context support via Punjab India query, and selected place card. Search button now uses first suggestion.


## v31 Selected Place Top Bottom
Selected place card now shows both above the map and below the map search results, with Area Start button in both places.


## v32 Owner Password Eye
Replaced browser prompt owner password with custom hidden password modal and eye toggle. Added eye toggle to owner/admin password fields where available.


## v33 Map Layers Satellite
Added map layer modes: Street, Satellite, Hybrid, and Topo. Satellite uses free Esri World Imagery tiles with Leaflet/OpenStreetMap setup. Hybrid overlays labels on satellite. Added map scale control.


## v34 Supabase Ready
Added Supabase config, integration layer, SQL schema, profiles/messages/reports/land_records/visits tables, RLS policies, realtime message subscription, and cloud-ready auth/chat/report overrides. User must create Supabase project and paste URL/anon key.


## Zameen Minti Project v63
- Visible version strip added to site UI.
- Footer contact added.
- Contact Email: dhaliwalballi18@gmail.com
- Feedback / Suggestion 2026-27
- Reminder: every future ZIP and site update must include updated version number.


## v37 Header/Menu Fix
Removed top version strip, kept footer contact/version, updated dashboard badge from v13 to v37, centered title/subtitle, moved language/Owner Settings to top-right area, added top-left hamburger modules menu.


## v38 Multilingual Voice Assistant
Added multilingual voice assistant using browser SpeechRecognition. Supports Punjabi/Hindi/English language selection, voice command parsing for Theka, Measurement, and Sale modules.


## v39 Mobile first + email/overlap fix
Corrected contact email to dhaliwalballi18@gmail.com. Fixed header/account button overlap. Added stronger mobile-first app layout while preserving working features.


## v47 Clean From v39
Rebuilt from stable v39 button behavior. Removed v40-v46 modal-router style changes by using v39 as base. Added only clean voice auto-detect/auto-result features and actual Supabase config. Chat/Admin/Voice button bindings remain v39 stable.


## v49 Vishwe Sq Ft Added
Added unit reference: . Added global conversion helper zmConvertSqft so all future/result modules can calculate sq ft, marla, kanal, acre/killa, vishwe and bigha consistently.


## v54 Clean Actual Vishwe Fix
Patched actual app.js renderReference() and showResult() templates. Vishwe is now generated in reference list between Gaj and Marla, and in total area result after Marla. Also added to GPS, Theka/Sale total details.


## v55 Vishwe Top Sq Ft Reference
Added 1 ਵਿਸ਼ਵੇ = 453.75 sq ft inside top Sq Ft ਮੁੱਖ ਮਾਪ reference box, while keeping separate highlighted Vishwe box between Gaj and Marla.


## v60 Stable Owner Button Vishwe Setting
Rebuilt from stable v55 base to avoid v59 hang. Restored Owner Settings button and added lightweight Owner Settings-only 1 ਵਿਸ਼ਵੇ Sq Ft field. Removed heavy MutationObserver logic.


## v61 Owner Settings Vishwe Field
Added reliable dynamic field insertion inside Owner Settings modal after 1 Karam Feet: 1 Vishwe Sq Ft. Value saves in localStorage/zmSettings and updates Vishwe reference lines.


## v62 Vishwe Owner Field Layout Fix
Small layout-only fix. 1 Vishwe Sq Ft field is moved after 1 Karam Feet and styled same size as other Owner Settings fields. No module logic changed.


## v63 Actual Vishwe Field Size Fix
Small layout-only fix. Forced 1 Vishwe Sq Ft field to half-width like the other Owner Settings fields and moved it after 1 Karam Feet.
