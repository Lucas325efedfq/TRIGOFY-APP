const { test, expect } = require('@playwright/test');

test('deve carregar a página de login corretamente', async ({ page }) => {
  await page.goto('/');
  
  // Verifica se o título ou algum elemento de login está presente
  // Baseado no teste_visual.md, esperamos um botão "ENTRAR" e logo "TRIGOFY"
  await expect(page.locator('text=ENTRAR')).toBeVisible();
  await expect(page.locator('text=TRIGOFY')).toBeVisible();
});

test('deve mostrar erro ao tentar logar com campos vazios', async ({ page }) => {
  await page.goto('/');
  await page.click('text=ENTRAR');
  
  // Aqui você verificaria se aparece algum alerta ou mensagem de erro
  // Como não sabemos a implementação exata, este é um placeholder
});
