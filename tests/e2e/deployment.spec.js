import { test, expect } from '@playwright/test';

test('deployment verification', async ({ page }) => {
    const targetUrl = process.env.TARGET_URL || 'https://megumi-joy.github.io/megumi_massaje/';
    console.log(`Navigating to: ${targetUrl}`);

    await page.goto(targetUrl);

    // 1. Verify Title/Main Content loads
    await expect(page).toHaveTitle(/Megumi Massaje/i);
    await expect(page.locator('h1')).toContainText(/Relax & Rejuvenate|Relájate y Rejuvenece/i);

    // 2. Verify Database Connection (Treatments)
    // We look for a specific treatment category or item that comes from the Supabase DB
    // This assumes the DB is populated. If not, this might fail, but it's what we want to verify.
    const treatmentsSection = page.locator('text=Treatments').first();
    await treatmentsSection.scrollIntoViewIfNeeded();

    // Wait for dynamic content. 
    // We'll look for "Thai Traditional" or similar, which should be in the DB.
    // Using a relaxed locator to matches likely content.
    try {
        // Check if at least one service card is rendered
        await expect(page.locator('.service-card, .service-item, button:has-text("Book")').first()).toBeVisible({ timeout: 10000 });
        console.log('Service cards are visible - DB connection likely successful.');
    } catch (e) {
        console.error('Failed to find service cards. Database might be disconnected or empty.');
        throw e;
    }

    // 3. Verify Fohow Section exists (Static verification)
    await expect(page.locator('text=Fohow Bioenergy Therapy')).toBeVisible();
});
