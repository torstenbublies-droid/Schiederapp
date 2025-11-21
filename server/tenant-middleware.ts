import { Request } from "express";
import { db } from "./db";
import { tenants } from "../drizzle/schema-multi-tenant";
import { eq } from "drizzle-orm";

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  weatherLat: string | null;
  weatherLon: string | null;
  weatherCity: string | null;
  chatbotName: string;
  chatbotSystemPrompt: string | null;
  enabledFeatures: string | null;
  isActive: boolean;
}

/**
 * Extract tenant slug from request
 * Priority: 1. Subdomain, 2. Query Parameter, 3. Header
 */
export function extractTenantSlug(req: Request): string | null {
  // 1. Try subdomain (e.g., schieder.buerger-app.de)
  const host = req.get('host') || '';
  const subdomain = host.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost' && !subdomain.match(/^\d/)) {
    return subdomain;
  }

  // 2. Try query parameter (e.g., ?tenant=schieder)
  const queryTenant = req.query.tenant as string;
  if (queryTenant) {
    return queryTenant;
  }

  // 3. Try custom header (e.g., X-Tenant: schieder)
  const headerTenant = req.get('X-Tenant');
  if (headerTenant) {
    return headerTenant;
  }

  // Default: schieder (for backward compatibility)
  return 'schieder';
}

/**
 * Load tenant from database by slug
 */
export async function loadTenant(slug: string): Promise<TenantInfo | null> {
  try {
    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const tenant = result[0];

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      primaryColor: tenant.primaryColor || "#0066CC",
      secondaryColor: tenant.secondaryColor || "#00A86B",
      logoUrl: tenant.logoUrl,
      heroImageUrl: tenant.heroImageUrl,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
      contactAddress: tenant.contactAddress,
      weatherLat: tenant.weatherLat,
      weatherLon: tenant.weatherLon,
      weatherCity: tenant.weatherCity,
      chatbotName: tenant.chatbotName || "Chatbot",
      chatbotSystemPrompt: tenant.chatbotSystemPrompt,
      enabledFeatures: tenant.enabledFeatures,
      isActive: tenant.isActive,
    };
  } catch (error) {
    console.error('Error loading tenant:', error);
    return null;
  }
}

/**
 * Tenant middleware for Express
 * Attaches tenant info to req.tenant
 */
export async function tenantMiddleware(req: Request & { tenant?: TenantInfo }, res: any, next: any) {
  const slug = extractTenantSlug(req);
  
  if (!slug) {
    return res.status(400).json({ error: 'Tenant not specified' });
  }

  const tenant = await loadTenant(slug);

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  if (!tenant.isActive) {
    return res.status(403).json({ error: 'Tenant is not active' });
  }

  // Attach tenant to request
  req.tenant = tenant;
  next();
}
