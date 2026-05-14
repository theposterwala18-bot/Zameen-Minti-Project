# Future Real Online Version Plan

Static browser version cannot truly save all clients globally. For real Facebook/Instagram style chat and analytics:

## Backend
- Node.js + Express OR Python FastAPI
- PostgreSQL database
- WebSocket / Socket.IO for live chat
- JWT login
- Admin panel

## Tables
users:
- id
- name
- mobile
- email
- password_hash or otp_login
- created_at

messages:
- id
- user_id
- sender_type client/owner
- message
- is_read
- created_at

visits:
- id
- session_id
- user_id nullable
- ip_hash
- page
- created_at

online_sessions:
- session_id
- user_id nullable
- last_seen

## Admin Features
- View all clients
- Open any client chat history
- Reply to client
- See online users
- Daily / weekly / monthly / overall analytics
- Export client list
