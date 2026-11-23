import {test,expect} from '@playwright/test';
import {lessons} from '../../src/data/english/curriculum.mjs';

test('course directory exposes real nested chapters and explained exercises',async({page})=>{
 await page.goto('/english/');
 await page.locator('.english-section-card').filter({hasText:'词汇与构词'}).locator('summary').filter({hasText:'构词系统'}).click();
 await page.getByRole('link',{name:'前缀系统：否定、方向、时间与程度',exact:true}).click();
 await expect(page).toHaveURL(/\/words\/morphology\/prefixes\//);
 await page.getByText('答案与解释',{exact:true}).click();
 await expect(page.locator('.sl-markdown-content details[open]')).toContainText('reconnect');
});

test('core wordbook searches meaning and chunks and handles empty topic intersections',async({page})=>{
 await page.goto('/english/wordbook/');
 await page.locator('[data-core-search]').fill('access to');
 await expect(page.locator('[data-core-entry]:visible')).toHaveCount(1);
 await expect(page.locator('[data-core-entry]:visible')).toContainText('have access to a file');
 await page.locator('[data-core-group]').selectOption('transport');
 await expect(page.locator('[data-core-empty]')).toBeVisible();
 await page.locator('[data-core-search]').fill('');
 await expect(page.locator('[data-core-entry]:visible').first()).toContainText('station');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('phoneme map includes the vowel and consonant teaching inventory',async({page})=>{
 await page.goto('/english/pronunciation/sounds/map/');
 await expect(page.locator('.phoneme-grid a')).toHaveCount(44);
 await expect(page.locator('.phoneme-chart')).toContainText('/θ/');
 await expect(page.locator('.phoneme-chart')).toContainText('think');
});

test('Mermaid meaning maps render as SVG, zoom accessibly, and follow the theme',async({page})=>{
 test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const [route,count] of [['words/morphology/prefixes',2],['words/morphology/suffixes',2],['words/morphology/roots',3],['words/usage/families',1],['words/usage/collocations',1],['words/roots/perception',4],['words/roots/movement',4],['words/roots/expression',4],['words/roots/knowledge',4],['words/roots/scale',4]] as const){
   await page.goto(`/english/${route}/`);
   const figures=page.locator('[data-meaning-map]');await expect(figures).toHaveCount(count);
   for(let i=0;i<count;i++){await figures.nth(i).scrollIntoViewIfNeeded();await expect(figures.nth(i).locator('.map-canvas svg')).toBeVisible({timeout:20000});}
 }
 const figure=page.locator('[data-meaning-map]').first();
 await figure.getByRole('button',{name:'放大查看'}).click();
 await expect(figure.locator('dialog')).toBeVisible();
 await expect(figure.locator('dialog svg')).toBeVisible();
 await page.keyboard.press('Escape');await expect(figure.locator('dialog')).not.toBeVisible();
 await page.getByRole('combobox',{name:'选择主题'}).selectOption('dark');
 await expect(figure).toHaveAttribute('data-rendered-theme','dark');
 expect(errors).toEqual([]);
});

test('lesson completion persists and updates course counts',async({page})=>{
 await page.goto('/english/grammar/basics/sentence/');
 await page.locator('[data-course-complete]').check();await page.reload();
 await expect(page.locator('[data-course-complete]')).toBeChecked();
 await expect(page.getByRole('navigation',{name:'课程章节导航'}).getByText('下一节')).toBeVisible();
 await page.goto('/english/');await expect(page.locator('[data-course-progress]')).toContainText(`1 / ${lessons.length}`);
});

test('checkpoint reports answered and unanswered items separately and resets explanations on edits',async({page})=>{
 await page.goto('/english/practice/checkpoint/');
 await page.getByRole('button',{name:'核对答案与解析'}).click();await expect(page.locator('[data-checkpoint-result]')).toContainText('先选择');
 await page.locator('input[name="check-sounds"][value="1"]').check();
 await page.locator('input[name="check-ending"][value="0"]').check();
 await page.getByRole('button',{name:'核对答案与解析'}).click();await expect(page.locator('[data-checkpoint-result]')).toContainText('已回答 2 / 12 题，其中 1 题答对');
 await expect(page.locator('[data-question="ending"] .question-explanation')).toContainText('/ɪd/');
 await page.locator('input[name="check-ending"][value="2"]').check();await expect(page.locator('[data-checkpoint-result]')).toContainText('重新核对');
 await page.getByRole('button',{name:'核对答案与解析'}).click();await expect(page.locator('[data-checkpoint-result]')).toContainText('其中 2 题答对');
});
