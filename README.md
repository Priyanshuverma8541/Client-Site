# Maa Vindhwshani Jewellery

Independent static storefront and client admin backed by Savitri Livings' existing API and MongoDB. The Savitri repository remains the only backend. Store products, orders and enquiries are tagged by `tenantId`; the Maa admin session has its own cookie and account collection.

## Before launch

1. Deploy the updated `savitri-livings/backend` to the existing backend service. Keep its existing `MONGO_URI`, `JWT_SECRET` and Cloudinary credentials configured there. Do not copy backend secrets into this project.
2. In Savitri Livings Admin, open **Client Stores** and add a store with name `Maa Vindhwshani Jewellery` and slug `maa-vindhwshani-jewellery`.
3. Configure the domain where `frontend/` will be hosted in **Website domain**, and the domain where `admin/` will be hosted in **Admin domain**. Set status to **active**. Publish the storefront after its content and products are ready.
4. Use the Savitri admin's **Set setup code** control to create a one-time numeric code, then share it privately with the client. The client visits the deployed admin and chooses **First time? Use setup code**. The code is hashed server-side, expires after seven days and is consumed once. The client creates an email/password account; use a unique password of at least 12 characters.
5. Add Maa products through the client admin, or select legacy Savitri products in Savitri Admin > Client Stores > Catalogue to explicitly share them. Shared products are read-only in the Maa admin and orders reduce their shared stock.

## Static deployment

Deploy `frontend/` and `admin/` as separate Vercel projects, setting each project root to the corresponding folder. They are plain static sites; no build command or secrets are needed. Each includes a Vercel rewrite for `/api/*` to the existing Savitri backend. The browser therefore talks to a same-origin API path and the client admin keeps its session in a Secure, HttpOnly cookie. Keep these rewrites in place; do not change the admin to store session tokens in browser JavaScript.

Point the public storefront domain and admin domain to their respective static deployments. Save the final production hostnames (without paths) in Savitri Admin under Website domain and Admin domain. Add the same origins to the backend `CLIENT_URL` and `ADMIN_URL` environment values if those values are used by the current CORS configuration. Production client-admin sessions require HTTPS. For local preview, the configs use `http://localhost:8081`; the existing backend dev CORS list includes common Vite ports.

## Admin capabilities

- Products: images (Cloudinary when configured), price, verified material/finish, stock, variants, featured visibility and product status.
- Orders: customer delivery details and order status updates.
- Enquiries: contact information, consent context and enquiry status.
- Website: homepage copy, hero/logo images, theme colours, contact links, SEO metadata, announcement strip and collection/category imagery.
- Offers: featured items and compare-at pricing. Only enter accurate pricing and product claims.
- Analytics: tenant-specific product, order, enquiry and paid-revenue totals.

Savitri Admin can edit store identity/domains/theme, publish or suspend the site, choose shared Savitri products, enable modules, issue/revoke setup access, and manage client admin permissions. Suspend or revoke access to invalidate client sessions.

## Local preview

Serve `frontend/` and `admin/` through local static servers. Add the local origin to the tenant domain/admin domain or the existing backend CORS allowlist for development. The tenant must be active; the public storefront must also be published. The live production backend will not show this store until the Savitri admin creates it and publishes it.

## Data and launch notes

- Product and order writes use the shared Savitri MongoDB, Cloudinary uploader and existing models; the `tenantId` boundary keeps client data separate. Production product photography uploads require the existing Cloudinary credentials in the backend environment; without them the existing uploader falls back to local disk.
- The website records orders in Savitri's order collection, reserves available stock and opens WhatsApp with the order reference for human confirmation. WhatsApp handoff does not itself send a message or take payment.
- Configure the store's WhatsApp number, delivery charges, threshold, domain, policies, and real product photos/details before public launch. Add applicable legal business, delivery, return/refund and privacy information through the site content before accepting customers.
- Push notifications, automated WhatsApp sending, Razorpay checkout, account invitations beyond the initial setup admin, and variant-specific image galleries are not configured by this implementation. No browser push or message is sent without opt-in/integration setup.

## Verification

From the Savitri repository: `cd backend && npm run test:tenant-isolation` and `cd admin && npm run build`. The isolation tests verify that Savitri product reads remain on legacy records and Maa catalogue/admin product reads are tenant-scoped.
